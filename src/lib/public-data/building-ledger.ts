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
  LedgerLookupError,
  ParcelCodes,
} from "./types";

const TITLE_URL =
  "https://apis.data.go.kr/1613000/BldRgstHubService/getBrTitleInfo";

type BrTitleItem = {
  bldNm?: string;
  mainPurpsCdNm?: string;
  totArea?: string | number;
  platArea?: string | number;
  grndFlrCnt?: string | number;
  ugrndFlrCnt?: string | number;
  useAprDay?: string;
  pmsDay?: string;
  strctCdNm?: string;
  hhldCnt?: string | number;
  indrAutoUtcnt?: string | number;
  oudrAutoUtcnt?: string | number;
  indrMechUtcnt?: string | number;
  oudrMechUtcnt?: string | number;
  newPlatPlc?: string;
  platPlc?: string;
};

function mapTitleItem(item: BrTitleItem): BuildingLedgerFields {
  const indoor =
    (toNumber(item.indrAutoUtcnt) ?? 0) + (toNumber(item.indrMechUtcnt) ?? 0);
  const outdoor =
    (toNumber(item.oudrAutoUtcnt) ?? 0) + (toNumber(item.oudrMechUtcnt) ?? 0);
  const parking = indoor + outdoor;

  const totArea = toNumber(item.totArea);
  const platArea = toNumber(item.platArea);
  const useDay = formatYmd(item.useAprDay);

  return {
    buildingName: item.bldNm?.trim() || undefined,
    totalFloorArea: totArea,
    exclusiveArea: totArea,
    landShareArea: platArea,
    totalFloors: toNumber(item.grndFlrCnt),
    buildingUse: item.mainPurpsCdNm?.trim() || undefined,
    useApprovalDate: useDay,
    approvalDate: formatYm(item.useAprDay) || formatYm(item.pmsDay),
    totalParking: parking > 0 ? parking : undefined,
    structureType: item.strctCdNm?.trim() || undefined,
  };
}

export function getPublicDataServiceKey(): string | undefined {
  const key =
    process.env.PUBLIC_DATA_SERVICE_KEY ||
    process.env.PUBLIC_DATA_API_KEY ||
    process.env.DATA_GO_KR_SERVICE_KEY;
  return key?.trim() || undefined;
}

export async function fetchBuildingLedger(
  input: Partial<ParcelCodes> & { addressHint?: string },
): Promise<BuildingLookupResult | LedgerLookupError> {
  const key = getPublicDataServiceKey();
  if (!key) {
    return {
      ok: false,
      code: "MISSING_KEY",
      error:
        "공공데이터포털 인증키가 없습니다. .env.local 에 PUBLIC_DATA_SERVICE_KEY 를 설정하세요.",
    };
  }

  const codes = normalizeParcelCodes(input);
  if (!codes) {
    return {
      ok: false,
      code: "BAD_REQUEST",
      error:
        "시군구코드(5)·법정동코드(5)·본번이 필요합니다. PNU 19자리를 입력해도 됩니다.",
    };
  }

  // serviceKey 는 포털에서 받은 Decoding 키를 그대로 붙입니다 (이중 인코딩 방지).
  const params = new URLSearchParams({
    sigunguCd: codes.sigunguCd,
    bjdongCd: codes.bjdongCd,
    platGbCd: codes.platGbCd,
    bun: codes.bun,
    ji: codes.ji,
    numOfRows: "20",
    pageNo: "1",
    _type: "json",
  });

  let json: unknown;
  try {
    const res = await fetch(`${TITLE_URL}?serviceKey=${key}&${params.toString()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const text = await res.text();
    try {
      json = JSON.parse(text);
    } catch {
      return {
        ok: false,
        code: "PARSE",
        error:
          "건축물대장 API 응답이 JSON이 아닙니다. 서비스키·활용신청(건축HUB 건축물대장)을 확인하세요.",
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        code: "UPSTREAM",
        error: `건축물대장 API HTTP ${res.status}`,
      };
    }
  } catch (err) {
    return {
      ok: false,
      code: "UPSTREAM",
      error: err instanceof Error ? err.message : "건축물대장 API 호출 실패",
    };
  }

  const response = (json as { response?: { header?: { resultCode?: string; resultMsg?: string }; body?: unknown } })
    ?.response;
  const resultCode = response?.header?.resultCode;
  if (resultCode && resultCode !== "00" && resultCode !== "0") {
    return {
      ok: false,
      code: "UPSTREAM",
      error: response?.header?.resultMsg || `건축물대장 오류 코드 ${resultCode}`,
    };
  }

  const list = allItems<BrTitleItem>(response?.body);
  if (list.length === 0) {
    return {
      ok: false,
      code: "NOT_FOUND",
      error: "해당 지번의 건축물대장(표제부)을 찾지 못했습니다. 코드를 확인하거나 수기 입력하세요.",
    };
  }

  const mapped = list.map(mapTitleItem);
  const primary = mapped[0];
  const place = list[0].newPlatPlc || list[0].platPlc || input.addressHint || "";

  return {
    ok: true,
    source: "public-data",
    fields: primary,
    items: mapped,
    rawSummary: place
      ? `${place} · ${list.length}건 (공공데이터 건축물대장 표제부)`
      : `건축물대장 표제부 ${list.length}건`,
  };
}
