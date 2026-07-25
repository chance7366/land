import lawdCodesData from "./lawd-codes-data.json";

export type LawdCodeRow = {
  lawd_cd: string;
  sido: string;
  sigungu: string;
};

/** 정적 전국 시군구(5자리) — Supabase lawd_codes 시드와 동일 소스 */
export const LAWD_CODES_STATIC: LawdCodeRow[] = lawdCodesData as LawdCodeRow[];

export const SIDO_ORDER = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
] as const;

export function listSidos(rows: LawdCodeRow[]): string[] {
  const set = new Set(rows.map((r) => r.sido));
  const ordered = SIDO_ORDER.filter((s) => set.has(s));
  const rest = [...set].filter((s) => !SIDO_ORDER.includes(s as (typeof SIDO_ORDER)[number])).sort();
  return [...ordered, ...rest];
}

export function listSigunguForSido(
  rows: LawdCodeRow[],
  sido: string,
): LawdCodeRow[] {
  return rows
    .filter((r) => r.sido === sido)
    .sort((a, b) => a.sigungu.localeCompare(b.sigungu, "ko"));
}

export function resolveLawdCdsFromRows(
  rows: LawdCodeRow[],
  sido: string,
  sigunguCd: string,
): string[] {
  if (sigunguCd) return [sigunguCd];
  if (sido) return listSigunguForSido(rows, sido).map((r) => r.lawd_cd);
  return rows.map((r) => r.lawd_cd);
}
