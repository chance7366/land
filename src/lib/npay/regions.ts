import regionsJson from "./regions-kr.json";
import type { NpayBoundingBox, NpayRegion } from "./types";

type SectorEntry = { code: string; lat: number; lng: number };
type RegionsTree = Record<string, Record<string, Record<string, SectorEntry>>>;

const DATA = regionsJson as RegionsTree;

const SIDO_ORDER = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

function sortKo(a: string, b: string) {
  return a.localeCompare(b, "ko");
}

export function listNpaySidos(): string[] {
  const keys = Object.keys(DATA);
  return keys.sort((a, b) => {
    const ia = SIDO_ORDER.indexOf(a);
    const ib = SIDO_ORDER.indexOf(b);
    if (ia >= 0 && ib >= 0) return ia - ib;
    if (ia >= 0) return -1;
    if (ib >= 0) return 1;
    return sortKo(a, b);
  });
}

export function listNpaySigungu(sido: string): string[] {
  const divs = DATA[sido];
  if (!divs) return [];
  return Object.keys(divs).sort(sortKo);
}

export function listNpayEupmyeondong(sido: string, sigungu: string): string[] {
  const secs = DATA[sido]?.[sigungu];
  if (!secs) return [];
  return Object.keys(secs).sort(sortKo);
}

function bboxFromCenter(lng: number, lat: number): NpayBoundingBox {
  return {
    left: lng - 0.038,
    right: lng + 0.038,
    top: lat + 0.015,
    bottom: lat - 0.015,
  };
}

export function resolveNpayRegion(
  city: string,
  division: string,
  sector: string,
): NpayRegion {
  const entry = DATA[city]?.[division]?.[sector];
  if (!entry) {
    throw new Error(`지역을 찾을 수 없습니다: ${city} ${division} ${sector}`);
  }
  return {
    legalDivisionNumber: entry.code,
    city,
    division,
    sector,
    latitude: entry.lat,
    longitude: entry.lng,
    boundingBox: bboxFromCenter(entry.lng, entry.lat),
    label: `${city} ${division} ${sector}`,
  };
}

export const NPAY_DEFAULT_REGION = {
  city: "충청남도",
  division: "홍성군",
  sector: "홍북읍",
} as const;
