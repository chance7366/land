import { normalizeParcelCodes, parsePnu, toNumber } from "./parcel";
import type {
  LandLedgerFields,
  LandLookupResult,
  LedgerLookupError,
  ParcelCodes,
} from "./types";

const LAND_CHAR_URL = "https://api.vworld.kr/ned/data/getLandCharacteristics";
const ADDRESS_URL = "https://api.vworld.kr/req/address";

type LandCharItem = Record<string, unknown>;

export function getVworldApiKey(): string | undefined {
  const key = process.env.VWORLD_API_KEY || process.env.VWORLD_KEY;
  return key?.trim() || undefined;
}

function str(raw: unknown): string | undefined {
  if (raw == null || raw === "") return undefined;
  const s = String(raw).trim();
  return s || undefined;
}

function mapLandItem(item: LandCharItem, stdrYear?: string): LandLedgerFields {
  const known = new Set([
    "pnu",
    "lndcgrCode",
    "lndcgrCodeNm",
    "lndpclAr",
    "prposArea1",
    "prposArea1Nm",
    "prposArea2",
    "prposArea2Nm",
    "ladUseSittnNm",
    "tpgrphHgCodeNm",
    "tpgrphFrmCodeNm",
    "roadSideCodeNm",
    "pblntfPclnd",
    "ldCodeNm",
    "addr",
  ]);
  const extras: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(item)) {
    if (known.has(k) || v == null || v === "" || typeof v === "object") continue;
    const n = toNumber(v);
    extras[k] = n != null && String(v).replace(/[,\s]/g, "") === String(n) ? n : String(v);
  }

  return {
    pnu: str(item.pnu),
    exclusiveArea: toNumber(item.lndpclAr),
    landCategory: str(item.lndcgrCodeNm),
    landCategoryCode: str(item.lndcgrCode),
    zoning: str(item.prposArea1Nm) || str(item.prposArea2Nm),
    zoning2: str(item.prposArea2Nm),
    landUseStatus: str(item.ladUseSittnNm),
    terrain: str(item.tpgrphHgCodeNm),
    landShape: str(item.tpgrphFrmCodeNm),
    roadAccess: str(item.roadSideCodeNm),
    officialLandPrice: toNumber(item.pblntfPclnd),
    priceStdYear: stdrYear,
    platPlc: str(item.addr) || str(item.ldCodeNm),
    extras: Object.keys(extras).length ? extras : undefined,
  };
}

/** 지번 주소 → PNU (브이월드 주소 API) */
export async function resolvePnuFromAddress(
  address: string,
): Promise<{ pnu: string; refined?: string } | LedgerLookupError> {
  const key = getVworldApiKey();
  if (!key) {
    return {
      ok: false,
      code: "MISSING_KEY",
      error: "브이월드 인증키가 없습니다. .env.local 에 VWORLD_API_KEY 를 설정하세요.",
    };
  }

  const q = address.trim();
  if (!q) {
    return { ok: false, code: "BAD_REQUEST", error: "주소 문자열이 비어 있습니다." };
  }

  const params = new URLSearchParams({
    service: "address",
    request: "getcoord",
    version: "2.0",
    crs: "epsg:4326",
    address: q,
    refine: "true",
    simple: "false",
    format: "json",
    type: "parcel",
    key,
  });

  try {
    const res = await fetch(`${ADDRESS_URL}?${params.toString()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const json = (await res.json()) as {
      response?: {
        status?: string;
        result?: { point?: unknown; zipcode?: string; text?: string };
        refined?: { text?: string };
        record?: { parcel?: string };
      };
    };

    const status = json.response?.status;
    if (status !== "OK") {
      return {
        ok: false,
        code: "NOT_FOUND",
        error: "브이월드에서 해당 지번 주소를 찾지 못했습니다. PNU를 직접 입력하세요.",
      };
    }

    const raw = JSON.stringify(json.response ?? {});
    const pnuMatch = raw.match(/\b(\d{19})\b/);
    if (!pnuMatch) {
      return {
        ok: false,
        code: "NOT_FOUND",
        error:
          "주소는 찾았으나 PNU를 추출하지 못했습니다. 시군구·법정동 코드와 본번을 수기 입력하세요.",
      };
    }

    return {
      pnu: pnuMatch[1],
      refined: json.response?.refined?.text || json.response?.result?.text,
    };
  } catch (err) {
    return {
      ok: false,
      code: "UPSTREAM",
      error: err instanceof Error ? err.message : "브이월드 주소 조회 실패",
    };
  }
}

export async function fetchLandLedger(input: {
  pnu?: string;
  address?: string;
  codes?: Partial<ParcelCodes>;
  stdrYear?: string;
}): Promise<LandLookupResult | LedgerLookupError> {
  const key = getVworldApiKey();
  if (!key) {
    return {
      ok: false,
      code: "MISSING_KEY",
      error: "브이월드 인증키가 없습니다. .env.local 에 VWORLD_API_KEY 를 설정하세요.",
    };
  }

  let pnu = String(input.pnu || "").replace(/\D/g, "");
  if (pnu.length !== 19 && input.codes) {
    const codes = normalizeParcelCodes(input.codes);
    if (codes?.pnu) pnu = codes.pnu;
  }
  if (pnu.length !== 19 && input.address) {
    const resolved = await resolvePnuFromAddress(input.address);
    if ("ok" in resolved && resolved.ok === false) return resolved;
    if ("pnu" in resolved) pnu = resolved.pnu;
  }

  if (pnu.length !== 19) {
    return {
      ok: false,
      code: "BAD_REQUEST",
      error: "PNU 19자리 또는 조회 가능한 지번 주소가 필요합니다.",
    };
  }

  const year = input.stdrYear || String(new Date().getFullYear());
  const years = [year, String(Number(year) - 1), String(Number(year) - 2)];

  let lastError: LedgerLookupError | null = null;

  for (const stdrYear of years) {
    const params = new URLSearchParams({
      pnu,
      format: "json",
      numOfRows: "10",
      pageNo: "1",
      key,
      stdrYear,
    });

    try {
      const res = await fetch(`${LAND_CHAR_URL}?${params.toString()}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const json = (await res.json()) as {
        landCharacteristicss?: {
          field?: LandCharItem | LandCharItem[];
        };
      };

      const field = json.landCharacteristicss?.field;
      const list = Array.isArray(field) ? field : field ? [field] : [];
      if (list.length === 0) {
        lastError = {
          ok: false,
          code: "NOT_FOUND",
          error: `${stdrYear}년 토지특성 데이터 없음`,
        };
        continue;
      }

      const fields = mapLandItem(list[0], stdrYear);
      const codes = parsePnu(pnu);

      return {
        ok: true,
        source: "vworld",
        fields: { ...fields, pnu },
        rawSummary: codes
          ? `PNU ${pnu} · ${stdrYear}년 토지특성 (브이월드)`
          : `토지특성 ${stdrYear}년`,
      };
    } catch (err) {
      lastError = {
        ok: false,
        code: "UPSTREAM",
        error: err instanceof Error ? err.message : "토지특성 API 호출 실패",
      };
    }
  }

  return (
    lastError ?? {
      ok: false,
      code: "NOT_FOUND",
      error: "토지특성 정보를 찾지 못했습니다. 수기 입력으로 진행하세요.",
    }
  );
}
