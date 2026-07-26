/** Npay / fin.land.naver.com 거래·매물유형 코드 */

export type NpayTradeType = "A1" | "B1" | "B2" | "B3";

export type NpayEstateType =
  | "A01"
  | "A04"
  | "A02"
  | "C02"
  | "B01"
  | "B02"
  | "C01"
  | "C03"
  | "C04"
  | "D05"
  | "F01"
  | "D02"
  | "E03"
  | "D01"
  | "D03"
  | "E02"
  | "E04";

export const NPAY_TRADE_LABEL: Record<NpayTradeType, string> = {
  A1: "매매",
  B1: "전세",
  B2: "월세",
  B3: "단기임대",
};

export const NPAY_ESTATE_OPTIONS: { code: NpayEstateType; label: string }[] = [
  { code: "A01", label: "아파트" },
  { code: "A04", label: "재건축" },
  { code: "A02", label: "오피스텔" },
  { code: "C02", label: "빌라" },
  { code: "B01", label: "아파트분양권" },
  { code: "B02", label: "오피스텔분양권" },
  { code: "C01", label: "원룸" },
  { code: "C03", label: "단독/다가구" },
  { code: "C04", label: "전원주택" },
  { code: "D05", label: "상가주택" },
  { code: "F01", label: "재개발" },
  { code: "D02", label: "상가" },
  { code: "E03", label: "토지" },
  { code: "D01", label: "사무실" },
  { code: "D03", label: "건물" },
  { code: "E02", label: "공장/창고" },
  { code: "E04", label: "지식산업센터" },
];

export const NPAY_ESTATE_LABEL: Record<NpayEstateType, string> =
  Object.fromEntries(
    NPAY_ESTATE_OPTIONS.map((o) => [o.code, o.label]),
  ) as Record<NpayEstateType, string>;

export const ALL_NPAY_ESTATE_CODES = NPAY_ESTATE_OPTIONS.map((o) => o.code);
export const ALL_NPAY_TRADE_CODES = Object.keys(
  NPAY_TRADE_LABEL,
) as NpayTradeType[];

const DIRECTION_LABELS: Record<string, string> = {
  SS: "남향",
  SN: "남북향",
  NN: "북향",
  EE: "동향",
  WW: "서향",
  WS: "남서향",
  ES: "남동향",
  WN: "북서향",
  EN: "북동향",
};

export function tradeTypeLabel(code: string): string {
  return NPAY_TRADE_LABEL[code as NpayTradeType] ?? code;
}

export function estateTypeLabel(code: string): string {
  return NPAY_ESTATE_LABEL[code as NpayEstateType] ?? code;
}

export function directionLabel(code: string): string {
  if (!code) return "";
  return DIRECTION_LABELS[code] ?? code;
}

export function isNpayTradeType(v: unknown): v is NpayTradeType {
  return typeof v === "string" && v in NPAY_TRADE_LABEL;
}

export function isNpayEstateType(v: unknown): v is NpayEstateType {
  return typeof v === "string" && v in NPAY_ESTATE_LABEL;
}
