import { matchDongLabel, matchHoLabel } from "./ledger-kind";
import {
  allItems,
  formatYm,
  formatYmd,
  normalizeParcelCodes,
  toNumber,
} from "./parcel";
import type {
  BuildingLedgerFields,
  BuildingLookupResult,
  ExposAreaRow,
  FloorOutlineRow,
  JijiguRow,
  LedgerLookupError,
  ParcelCodes,
} from "./types";

const HUB_BASE = "https://apis.data.go.kr/1613000/BldRgstHubService";
const TITLE_PATH = "getBrTitleInfo";
const RECAP_PATH = "getBrRecapTitleInfo";
const EXPOS_PATH = "getBrExposInfo";
const EXPOS_AREA_PATH = "getBrExposPubuseAreaInfo";
const BASIS_PATH = "getBrBasisOulnInfo";
const HSPRC_PATH = "getBrHsprcInfo";
const FLR_PATH = "getBrFlrOulnInfo";
const JIJIGU_PATH = "getBrJijiguInfo";

type BrRow = Record<string, unknown>;

function strField(raw: unknown): string | undefined {
  if (raw == null || raw === "") return undefined;
  // JSON 대용량 숫자가 scientific로 파싱된 경우 원형 보존 불가 → 문자열화
  if (typeof raw === "number" && Number.isFinite(raw) && Math.abs(raw) >= 1e15) {
    return raw.toLocaleString("fullwide", { useGrouping: false });
  }
  const s = String(raw).trim();
  return s || undefined;
}

function pickExtras(item: BrRow, used: Set<string>): Record<string, string | number> | undefined {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(item)) {
    if (used.has(k) || v == null || v === "") continue;
    if (typeof v === "object") continue;
    const n = toNumber(v);
    if (n != null && String(v).replace(/[,\s]/g, "") === String(n)) out[k] = n;
    else {
      const s = strField(v);
      if (s) out[k] = s;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

function sumParking(item: BrRow): {
  total?: number;
  indoor?: number;
  outdoor?: number;
} {
  const tot = toNumber(item.totPkngCnt);
  const indoor =
    (toNumber(item.indrAutoUtcnt) ?? 0) + (toNumber(item.indrMechUtcnt) ?? 0);
  const outdoor =
    (toNumber(item.oudrAutoUtcnt) ?? 0) + (toNumber(item.oudrMechUtcnt) ?? 0);
  const sum = indoor + outdoor;
  return {
    total: tot != null && tot > 0 ? tot : sum > 0 ? sum : undefined,
    indoor: indoor > 0 ? indoor : undefined,
    outdoor: outdoor > 0 ? outdoor : undefined,
  };
}

const CORE_KEYS = new Set([
  "bldNm",
  "dongNm",
  "hoNm",
  "flrNo",
  "flrNoNm",
  "flrGbCd",
  "flrGbCdNm",
  "mainPurpsCdNm",
  "etcPurps",
  "totArea",
  "archArea",
  "platArea",
  "heit",
  "grndFlrCnt",
  "ugrndFlrCnt",
  "useAprDay",
  "pmsDay",
  "stcnsDay",
  "strctCdNm",
  "etcStrct",
  "hhldCnt",
  "fmlyCnt",
  "hoCnt",
  "totPkngCnt",
  "indrAutoUtcnt",
  "oudrAutoUtcnt",
  "indrMechUtcnt",
  "oudrMechUtcnt",
  "bcRat",
  "vlRat",
  "vlRatEstmTotArea",
  "mainBldCnt",
  "atchBldCnt",
  "atchBldArea",
  "rideUseElvtCnt",
  "emgenUseElvtCnt",
  "rserthqkDsgnApplyYn",
  "rserthqkAblty",
  "engrGrade",
  "gnBldGrade",
  "platPlc",
  "newPlatPlc",
  "mgmBldrgstPk",
  "regstrKindCdNm",
  "regstrGbCdNm",
  "mainAtchGbCdNm",
  "houPrice",
  "stdDay",
  "exposPubuseGbCd",
  "exposPubuseGbCdNm",
  "area",
  "mainPurpsCd",
  "crtnDay",
  "jijiguGbCdNm",
  "jijiguCdNm",
  "etcJijigu",
  "reprYn",
]);

export function mapBrItem(
  item: BrRow,
  mode: "title" | "recap" | "expos" | "basis" | "hsprc" = "title",
): BuildingLedgerFields {
  const parking = sumParking(item);
  const elev =
    (toNumber(item.rideUseElvtCnt) ?? 0) + (toNumber(item.emgenUseElvtCnt) ?? 0);
  const base: BuildingLedgerFields = {
    buildingName: strField(item.bldNm),
    dongNm: strField(item.dongNm),
    hoNm: strField(item.hoNm),
    floor: toNumber(item.flrNo) ?? undefined,
    floorNm: strField(item.flrNoNm),
    flrGbNm: strField(item.flrGbCdNm),
    totalFloorArea: toNumber(item.totArea),
    archArea: toNumber(item.archArea),
    landShareArea: toNumber(item.platArea),
    height: toNumber(item.heit),
    totalFloors: toNumber(item.grndFlrCnt),
    undergroundFloors: toNumber(item.ugrndFlrCnt),
    buildingUse: strField(item.mainPurpsCdNm),
    etcPurps: strField(item.etcPurps),
    useApprovalDate: formatYmd(item.useAprDay),
    approvalDate: formatYm(item.useAprDay) || formatYm(item.pmsDay),
    permitDate: formatYmd(item.pmsDay),
    startConstructDate: formatYmd(item.stcnsDay),
    totalParking: parking.total,
    indoorParking: parking.indoor,
    outdoorParking: parking.outdoor,
    structureType: strField(item.strctCdNm),
    etcStrct: strField(item.etcStrct),
    bcRat: toNumber(item.bcRat),
    vlRat: toNumber(item.vlRat),
    vlRatEstmTotArea: toNumber(item.vlRatEstmTotArea),
    hhldCnt: toNumber(item.hhldCnt),
    fmlyCnt: toNumber(item.fmlyCnt),
    hoCnt: toNumber(item.hoCnt),
    mainBldCnt: toNumber(item.mainBldCnt),
    atchBldCnt: toNumber(item.atchBldCnt),
    atchBldArea: toNumber(item.atchBldArea),
    elevatorCnt: elev > 0 ? elev : toNumber(item.rideUseElvtCnt) ?? undefined,
    emergElevatorCnt: toNumber(item.emgenUseElvtCnt) ?? undefined,
    seismicDesign:
      item.rserthqkDsgnApplyYn != null && String(item.rserthqkDsgnApplyYn) !== ""
        ? `${item.rserthqkDsgnApplyYn}${item.rserthqkAblty ? ` · ${item.rserthqkAblty}` : ""}`
        : undefined,
    energyGrade: strField(item.engrGrade),
    ecoBldGrade: strField(item.gnBldGrade),
    housePrice: toNumber(item.houPrice),
    housePriceStdDay: formatYmd(item.stdDay),
    platPlc: strField(item.platPlc),
    roadAddress: strField(item.newPlatPlc),
    regstrGbCdNm: strField(item.regstrGbCdNm),
    mainAtchGbCdNm: strField(item.mainAtchGbCdNm),
    mgmBldrgstPk: strField(item.mgmBldrgstPk),
    regstrKindCdNm: strField(item.regstrKindCdNm),
    crtnDay: formatYmd(item.crtnDay),
    extras: pickExtras(item, CORE_KEYS),
  };

  // 일반 표제부만 연면적→전용 후보
  if (mode === "title") {
    base.exclusiveArea = toNumber(item.totArea);
  }

  return base;
}

export function getPublicDataServiceKey(): string | undefined {
  const key =
    process.env.PUBLIC_DATA_SERVICE_KEY ||
    process.env.PUBLIC_DATA_API_KEY ||
    process.env.MOLIT_SERVICE_KEY ||
    process.env.DATA_GO_KR_SERVICE_KEY;
  return key?.trim() || undefined;
}

async function fetchHubJson(
  path: string,
  codes: ParcelCodes,
  extra?: Record<string, string>,
): Promise<{ json: unknown } | LedgerLookupError> {
  const key = getPublicDataServiceKey();
  if (!key) {
    return {
      ok: false,
      code: "MISSING_KEY",
      error:
        "공공데이터포털 인증키가 없습니다. .env.local 에 PUBLIC_DATA_SERVICE_KEY 를 설정하세요.",
    };
  }

  const params = new URLSearchParams({
    sigunguCd: codes.sigunguCd,
    bjdongCd: codes.bjdongCd,
    platGbCd: codes.platGbCd,
    bun: codes.bun,
    ji: codes.ji,
    numOfRows: "100",
    pageNo: "1",
    _type: "json",
    ...extra,
  });

  const url = `${HUB_BASE}/${path}?serviceKey=${key}&${params.toString()}`;
  let lastParseError: LedgerLookupError | null = null;
  let json: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      try {
        // 15자리 이상 정수는 Number 정밀도 손실 → 문자열로 보존 (mgmBldrgstPk 등)
        const safe = text.replace(
          /([:\[,]\s*)(-?\d{15,})(\s*[,\]}])/g,
          '$1"$2"$3',
        );
        json = JSON.parse(safe);
        lastParseError = null;
        break;
      } catch {
        lastParseError = {
          ok: false,
          code: "PARSE",
          error:
            text.trim().startsWith("Error") || res.status >= 500
              ? `건축물대장 서버 일시 오류(HTTP ${res.status}). 잠시 후 다시 시도하세요.`
              : "건축물대장 API 응답이 JSON이 아닙니다. 서비스키·활용신청(건축HUB 건축물대장)을 확인하세요.",
        };
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
          continue;
        }
      }
    } catch (err) {
      lastParseError = {
        ok: false,
        code: "UPSTREAM",
        error: err instanceof Error ? err.message : "건축물대장 API 호출 실패",
      };
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }
    }
  }

  if (lastParseError || json == null) {
    return (
      lastParseError ?? {
        ok: false,
        code: "UPSTREAM",
        error: "건축물대장 API 호출 실패",
      }
    );
  }

  const response = (
    json as {
      response?: { header?: { resultCode?: string; resultMsg?: string }; body?: unknown };
    }
  )?.response;
  const resultCode = response?.header?.resultCode;
  if (resultCode && resultCode !== "00" && resultCode !== "0") {
    if (
      String(response?.header?.resultMsg || "").includes("NODATA") ||
      resultCode === "03"
    ) {
      return { ok: false, code: "NOT_FOUND", error: "해당 지번 대장 데이터 없음" };
    }
    return {
      ok: false,
      code: "UPSTREAM",
      error: response?.header?.resultMsg || `건축물대장 오류 코드 ${resultCode}`,
    };
  }

  return { json };
}

function bodyFromHub(json: unknown): unknown {
  return (json as { response?: { body?: unknown } })?.response?.body;
}

function isHubError(
  result: { json: unknown } | LedgerLookupError,
): result is LedgerLookupError {
  return "ok" in result && result.ok === false;
}

export type BrHubListResult = { ok: true; items: BrRow[]; raw: unknown };

async function fetchBrList(
  path: string,
  codes: ParcelCodes,
  pageNo = "1",
  extra?: Record<string, string>,
): Promise<BrHubListResult | LedgerLookupError> {
  const result = await fetchHubJson(path, codes, {
    pageNo,
    numOfRows: "100",
    ...extra,
  });
  if (isHubError(result)) return result;
  return { ok: true, items: allItems<BrRow>(bodyFromHub(result.json)), raw: result.json };
}

/** 여러 페이지 수집 (전유부·전유공용면적 호 매칭용) */
async function fetchBrListPaged(
  path: string,
  codes: ParcelCodes,
  maxPages = 25,
  extra?: Record<string, string>,
): Promise<BrHubListResult | LedgerLookupError> {
  const all: BrRow[] = [];
  let lastRaw: unknown;
  for (let page = 1; page <= maxPages; page++) {
    const result = await fetchBrList(path, codes, String(page), extra);
    if (!result.ok) {
      if (page === 1) return result;
      break;
    }
    lastRaw = result.raw;
    if (result.items.length === 0) break;
    all.push(...result.items);
    if (result.items.length < 100) break;
  }
  return { ok: true, items: all, raw: lastRaw };
}

export async function fetchBrTitleItems(codes: ParcelCodes) {
  return fetchBrList(TITLE_PATH, codes);
}

export async function fetchBrRecapItems(codes: ParcelCodes) {
  return fetchBrList(RECAP_PATH, codes);
}

export async function fetchBrExposItems(codes: ParcelCodes, paged = true) {
  return paged
    ? fetchBrListPaged(EXPOS_PATH, codes, 20)
    : fetchBrList(EXPOS_PATH, codes);
}

export async function fetchBrExposAreaItems(codes: ParcelCodes, paged = true) {
  return paged
    ? fetchBrListPaged(EXPOS_AREA_PATH, codes, 20)
    : fetchBrList(EXPOS_AREA_PATH, codes);
}

export async function fetchBrHsprcItems(codes: ParcelCodes) {
  return fetchBrListPaged(HSPRC_PATH, codes, 8);
}

/**
 * 대형 단지용: 페이지를 순회하며 동·호 전유부를 찾는다.
 * (HUB dongNm/hoNm 쿼리는 신뢰할 수 없어 클라이언트 스캔)
 */
export type BrExposUnitResult =
  | (BrHubListResult & {
      matched: BrRow[];
      dongCandidates: BrRow[];
      /** 1-based page where match was found */
      matchedPage?: number;
    })
  | LedgerLookupError;

function hubTotalCount(raw: unknown): number | undefined {
  const n = Number(
    (raw as { response?: { body?: { totalCount?: string | number } } })?.response
      ?.body?.totalCount,
  );
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export async function fetchBrExposUnit(
  codes: ParcelCodes,
  dong?: string,
  ho?: string,
  maxPages = 40,
): Promise<BrExposUnitResult> {
  const all: BrRow[] = [];
  const matched: BrRow[] = [];
  const dongCandidates: BrRow[] = [];
  let lastRaw: unknown;
  let matchedPage: number | undefined;
  for (let page = 1; page <= maxPages; page++) {
    const result = await fetchBrList(EXPOS_PATH, codes, String(page));
    if (!result.ok) {
      if (page === 1) return result;
      break;
    }
    lastRaw = result.raw;
    if (!result.items.length) break;
    all.push(...result.items);
    for (const item of result.items) {
      const dOk = !dong || matchDongLabel(strField(item.dongNm), dong);
      if (!dOk) continue;
      dongCandidates.push(item);
      if (!ho || matchHoLabel(strField(item.hoNm), ho)) {
        matched.push(item);
        if (matchedPage == null) matchedPage = page;
      }
    }
    if (ho && matched.length) break;
    if (result.items.length < 100) break;
  }
  return {
    ok: true,
    items: all,
    raw: lastRaw,
    matched,
    dongCandidates,
    matchedPage,
  };
}

/** 확정 동·호에 대한 전유공용면적 — 힌트 페이지 근처부터 병렬 스캔 */
export async function fetchBrExposAreaForUnit(
  codes: ParcelCodes,
  dong: string,
  ho: string,
  mgmBldrgstPk?: string,
  hintPage = 1,
): Promise<BrHubListResult | LedgerLookupError> {
  // 1) 관리PK 필터 시도 — 매칭될 때만 채택
  if (mgmBldrgstPk) {
    const byPk = await fetchBrListPaged(EXPOS_AREA_PATH, codes, 3, {
      mgmBldrgstPk,
    });
    if (byPk.ok && byPk.items.length) {
      const filtered = byPk.items.filter(
        (item) =>
          matchDongLabel(strField(item.dongNm), dong) &&
          matchHoLabel(strField(item.hoNm), ho),
      );
      if (filtered.length) {
        return { ok: true, items: filtered, raw: byPk.raw };
      }
    }
  }

  const first = await fetchBrList(EXPOS_AREA_PATH, codes, "1");
  if (!first.ok) return first;
  const total = hubTotalCount(first.raw) ?? first.items.length;
  const totalPages = Math.min(120, Math.max(1, Math.ceil(total / 100)));

  const isHit = (item: BrRow) =>
    matchDongLabel(strField(item.dongNm), dong) &&
    matchHoLabel(strField(item.hoNm), ho);

  const rows: BrRow[] = [];
  let lastRaw: unknown = first.raw;
  for (const item of first.items) {
    if (isHit(item)) rows.push(item);
  }
  if (rows.length && totalPages === 1) {
    return { ok: true, items: rows, raw: lastRaw };
  }

  // 전유부 페이지 × 대략 면적행 배수(5~7) 근처부터 탐색
  const center = Math.min(
    totalPages,
    Math.max(1, Math.round((hintPage || 1) * 5.5)),
  );
  const order: number[] = [];
  const seen = new Set<number>();
  const push = (p: number) => {
    if (p < 1 || p > totalPages || seen.has(p) || p === 1) return;
    seen.add(p);
    order.push(p);
  };
  push(center);
  for (let d = 1; d < totalPages; d++) {
    push(center - d);
    push(center + d);
  }

  const CONCURRENCY = 8;
  let found = rows.length > 0;
  let emptyBatchesAfter = 0;
  for (let i = 0; i < order.length; i += CONCURRENCY) {
    const batch = order.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((p) => fetchBrList(EXPOS_AREA_PATH, codes, String(p))),
    );
    let batchHits = 0;
    for (const result of results) {
      if (!result.ok) continue;
      lastRaw = result.raw;
      for (const item of result.items) {
        if (isHit(item)) {
          rows.push(item);
          batchHits++;
        }
      }
    }
    if (batchHits > 0) {
      found = true;
      emptyBatchesAfter = 0;
    } else if (found) {
      emptyBatchesAfter++;
      // 연속 빈 배치면 해당 호 블록을 지난 것으로 보고 종료
      if (emptyBatchesAfter >= 2) break;
    }
    if (rows.length >= 20) break;
  }

  return { ok: true, items: rows, raw: lastRaw };
}

export async function fetchBrHsprcForUnit(
  codes: ParcelCodes,
  dong: string,
  ho: string,
  mgmBldrgstPk?: string,
  maxPages = 40,
): Promise<BrHubListResult | LedgerLookupError> {
  if (mgmBldrgstPk) {
    const byPk = await fetchBrListPaged(HSPRC_PATH, codes, 3, { mgmBldrgstPk });
    if (byPk.ok && byPk.items.length) {
      const filtered = byPk.items.filter(
        (item) =>
          matchDongLabel(strField(item.dongNm), dong) &&
          matchHoLabel(strField(item.hoNm), ho),
      );
      if (filtered.length) {
        return { ok: true, items: filtered, raw: byPk.raw };
      }
    }
  }

  const rows: BrRow[] = [];
  let lastRaw: unknown;
  for (let page = 1; page <= maxPages; page++) {
    const result = await fetchBrList(HSPRC_PATH, codes, String(page));
    if (!result.ok) {
      if (page === 1) return result;
      break;
    }
    lastRaw = result.raw;
    if (!result.items.length) break;
    for (const item of result.items) {
      if (
        matchDongLabel(strField(item.dongNm), dong) &&
        matchHoLabel(strField(item.hoNm), ho)
      ) {
        rows.push(item);
      }
    }
    if (rows.length) break;
    if (result.items.length < 100) break;
  }
  return { ok: true, items: rows, raw: lastRaw };
}

export async function fetchBrBasisItems(codes: ParcelCodes) {
  return fetchBrList(BASIS_PATH, codes);
}

export async function fetchBrFlrItems(codes: ParcelCodes, paged = true) {
  return paged ? fetchBrListPaged(FLR_PATH, codes, 5) : fetchBrList(FLR_PATH, codes);
}

export async function fetchBrJijiguItems(codes: ParcelCodes) {
  return fetchBrList(JIJIGU_PATH, codes);
}

export function mapFloorRows(rows: BrRow[], dong?: string): FloorOutlineRow[] {
  const out: FloorOutlineRow[] = [];
  for (const row of rows) {
    if (dong && !matchDongLabel(strField(row.dongNm), dong)) continue;
    out.push({
      dongNm: strField(row.dongNm),
      flrGbNm: strField(row.flrGbCdNm),
      floorNm: strField(row.flrNoNm),
      floor: toNumber(row.flrNo) ?? undefined,
      mainPurps: strField(row.mainPurpsCdNm),
      etcPurps: strField(row.etcPurps),
      structureType: strField(row.strctCdNm),
      area: toNumber(row.area) ?? undefined,
      mainAtchGb: strField(row.mainAtchGbCdNm),
    });
  }
  return out;
}

export function mapJijiguRows(rows: BrRow[]): JijiguRow[] {
  return rows.map((row) => ({
    gbNm: strField(row.jijiguGbCdNm),
    cdNm: strField(row.jijiguCdNm),
    etcNm: strField(row.etcJijigu),
    reprYn: strField(row.reprYn),
  }));
}

/** 전유공용면적 행에서 동·호별 전유/공용 합산 + 상세 + 전유부 보강 필드 */
export function aggregateExposAreas(
  rows: BrRow[],
  dong?: string,
  ho?: string,
): {
  exclusiveArea?: number;
  commonArea?: number;
  supplyArea?: number;
  exposAreaRows: ExposAreaRow[];
  /** 전유 행에서 추출한 용도·구조·층 */
  enrich?: Pick<
    BuildingLedgerFields,
    | "buildingUse"
    | "etcPurps"
    | "structureType"
    | "etcStrct"
    | "floor"
    | "floorNm"
    | "flrGbNm"
    | "mainAtchGbCdNm"
  >;
} {
  let exclusive = 0;
  let common = 0;
  let matched = false;
  const exposAreaRows: ExposAreaRow[] = [];
  let enrich: ReturnType<typeof aggregateExposAreas>["enrich"];

  for (const row of rows) {
    if (dong && !matchDongLabel(strField(row.dongNm), dong)) continue;
    if (ho && !matchHoLabel(strField(row.hoNm), ho)) continue;
    matched = true;
    const area = toNumber(row.area) ?? 0;
    const gbNm = strField(row.exposPubuseGbCdNm);
    const gb = `${gbNm ?? ""}${strField(row.exposPubuseGbCd) ?? ""}`;
    const isCommon = /공용/.test(gb) || gb === "2";
    if (isCommon) common += area;
    else exclusive += area;

    const mapped: ExposAreaRow = {
      dongNm: strField(row.dongNm),
      hoNm: strField(row.hoNm),
      flrGbNm: strField(row.flrGbCdNm),
      floorNm: strField(row.flrNoNm),
      floor: toNumber(row.flrNo) ?? undefined,
      exposPubuseGb: gbNm || strField(row.exposPubuseGbCd),
      mainAtchGb: strField(row.mainAtchGbCdNm),
      mainPurps: strField(row.mainPurpsCdNm),
      etcPurps: strField(row.etcPurps),
      structureType: strField(row.strctCdNm),
      etcStrct: strField(row.etcStrct),
      area: area || undefined,
    };
    exposAreaRows.push(mapped);

    // 전유(주) 행으로 호 스펙 보강
    if (!isCommon && !enrich) {
      enrich = {
        buildingUse: mapped.mainPurps,
        etcPurps: mapped.etcPurps,
        structureType: mapped.structureType,
        etcStrct: mapped.etcStrct,
        floor: mapped.floor,
        floorNm: mapped.floorNm,
        flrGbNm: mapped.flrGbNm,
        mainAtchGbCdNm: mapped.mainAtchGb,
      };
    }
  }
  if (!matched) return { exposAreaRows: [] };
  const supply = exclusive + common;
  return {
    exclusiveArea: exclusive > 0 ? exclusive : undefined,
    commonArea: common > 0 ? common : undefined,
    supplyArea: supply > 0 ? supply : undefined,
    exposAreaRows,
    enrich,
  };
}

/** @deprecated orchestrator 사용 권장 */
export async function fetchBuildingLedger(
  input: Partial<ParcelCodes> & { addressHint?: string },
): Promise<BuildingLookupResult | LedgerLookupError> {
  const codes = normalizeParcelCodes(input);
  if (!codes) {
    return {
      ok: false,
      code: "BAD_REQUEST",
      error:
        "시군구코드(5)·법정동코드(5)·본번이 필요합니다. PNU 19자리를 입력해도 됩니다.",
    };
  }

  const result = await fetchBrTitleItems(codes);
  if (!result.ok) return result;
  const list = result.items;
  if (list.length === 0) {
    return {
      ok: false,
      code: "NOT_FOUND",
      error: "해당 지번의 건축물대장(표제부)을 찾지 못했습니다. 코드를 확인하거나 수기 입력하세요.",
    };
  }

  const mapped = list.map((item) => mapBrItem(item, "title"));
  const place =
    strField(list[0].newPlatPlc) || strField(list[0].platPlc) || input.addressHint || "";

  return {
    ok: true,
    source: "public-data",
    fields: mapped[0],
    items: mapped,
    rawSummary: place
      ? `${place} · ${list.length}건 (공공데이터 건축물대장 표제부)`
      : `건축물대장 표제부 ${list.length}건`,
  };
}
