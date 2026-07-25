import type { NormalizedRtmsRow, RtmsDealType, RtmsPropertyType } from "./types";

function pick(row: Record<string, string>, keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

function parseManWon(raw: string): number {
  if (!raw) return 0;
  const n = Number(String(raw).replace(/,/g, "").trim());
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 10_000);
}

function parseNum(raw: string): number | null {
  if (!raw) return null;
  const n = Number(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

function buildDealDate(row: Record<string, string>, dealYmd: number): string {
  const y = pick(row, ["dealYear", "년"]) || String(Math.floor(dealYmd / 100));
  const m = pick(row, ["dealMonth", "월"]) || String(dealYmd % 100).padStart(2, "0");
  const d = pick(row, ["dealDay", "일"]) || "01";
  const mm = m.padStart(2, "0");
  const dd = d.padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function isFactoryUse(use: string): boolean {
  return /공장|창고|운송|제조/i.test(use);
}

export function normalizeRtmsItem(
  row: Record<string, string>,
  propertyType: RtmsPropertyType,
  dealType: RtmsDealType,
  lawdCd: string,
  dealYmd: number,
): NormalizedRtmsRow | null {
  const buildingUse = pick(row, ["buildingUse", "건물용도", "buildingUseName"]);
  if (propertyType === "FACTORY" && buildingUse && !isFactoryUse(buildingUse)) {
    return null;
  }
  if (propertyType === "COMMERCIAL" && buildingUse && isFactoryUse(buildingUse)) {
    return null;
  }

  const buildingName = pick(row, [
    "aptNm",
    "아파트",
    "offiNm",
    "단지명",
    "mhouseNm",
    "연립다세대",
    "houseType",
    "주택유형",
    "buildingName",
    "건물명",
  ]);

  const jibun = pick(row, ["jibun", "지번"]);
  const umdNm = pick(row, ["umdNm", "법정동", "umd"]);
  const roadName = pick(row, ["roadNm", "도로명"]);
  const floor = pick(row, ["floor", "층", "임대층"]);
  const exclArea =
    parseNum(
      pick(row, [
        "excluUseAr",
        "전용면적",
        "총면적",
        "area",
        "계약면적",
        "buildingArea",
        "건물면적",
        "dealArea",
        "거래면적",
        "임대면적",
      ]),
    ) ?? null;
  const landArea =
    parseNum(
      pick(row, ["plotAr", "plottageAr", "대지권면적", "대지면적", "landArea", "토지면적"]),
    ) ?? null;
  const buildYear = parseNum(pick(row, ["buildYear", "건축년도"]));

  let dealAmount = 0;
  let depositAmount = 0;
  let monthlyRent = 0;
  if (dealType === "RENT") {
    depositAmount = parseManWon(pick(row, ["deposit", "보증금액", "보증금"]));
    monthlyRent = parseManWon(pick(row, ["monthlyRent", "월세금액", "월세"]));
  } else {
    dealAmount = parseManWon(pick(row, ["dealAmount", "거래금액"]));
  }

  const cancelFlag = pick(row, ["cdealType", "해제여부"]);
  const cancelled = cancelFlag === "O" || cancelFlag === "Y" || cancelFlag === "취소";
  const cancelRaw = pick(row, ["cdealDay", "해제사유발생일"]);
  const dealingGbn = pick(row, ["dealingGbn", "거래유형", "reqGbn"]);

  const amountForPps = dealType === "RENT" ? depositAmount + monthlyRent * 100 : dealAmount;
  const pricePerSqm =
    exclArea && exclArea > 0 && amountForPps > 0
      ? Math.round(amountForPps / exclArea)
      : null;

  return {
    propertyType,
    transactionType: dealType,
    lawdCd,
    dealYmd,
    dealDate: buildDealDate(row, dealYmd),
    buildingName: buildingName || (propertyType === "LAND" ? "토지" : buildingName),
    jibun,
    roadName,
    umdNm,
    floor,
    exclArea,
    landArea,
    buildYear: buildYear != null ? Math.round(buildYear) : null,
    dealAmount,
    depositAmount,
    monthlyRent,
    pricePerSqm,
    cancelled,
    cancelDate: cancelRaw || null,
    dealingGbn,
    rawDetails: { ...row, buildingUse },
  };
}
