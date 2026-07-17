/** 찾아오시는 길 정적 정보 */

export const LOCATION_INFO = {
  name: "찬스부동산 경매중개",
  nameFull: "찬스부동산 경매중개 (공인중개사사무소)",
  address: "충청남도 홍성군 홍북읍 신경리 1369 (내포신도시)",
  addressShort: "충남 홍성군 홍북읍 신경리 1369",
  phoneMain: "041-633-0000",
  phoneDirect: "010-4284-7366",
  hours: "평일/토요일 09:00 ~ 19:00",
  hoursNote: "일요일 및 공휴일은 사전 예약 상담 가능",
  parking: "건물 내 지하주차장 무료 주차 가능",
  intro: "내포신도시 중심에서 고객님의 소중한 자산과 경매 투자를 안내해 드립니다.",
  lat: 36.6623,
  lng: 126.6755,
} as const;

export const LOCATION_IMAGES = {
  office: "/location/office-exterior.png",
  map: "/location/map-preview.png",
  parking: "/location/parking.png",
} as const;

export function kakaoMapDirectionsUrl(address: string) {
  return `https://map.kakao.com/link/search/${encodeURIComponent(address)}`;
}

export function naverMapDirectionsUrl(address: string) {
  return `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;
}

export const LOCATION_DRIVE_TIPS = [
  {
    title: "서해안고속도로",
    body: "홍성 IC 진출 → 내포신도시 방향 (약 15분 소요)",
  },
  {
    title: "당진–대전(당진–영덕)고속도로",
    body: "예산수덕사 IC 진출 → 내포신도시 방면 진입",
  },
  {
    title: "주차",
    body: "건물 지하주차장에 편하게 주차 가능합니다.",
  },
] as const;

export const LOCATION_TRANSIT_TIPS = [
  {
    title: "기차/전철 (홍성역)",
    body: "홍성역 출구 → 내포신도시 방면 시내버스 탑승 (약 15~20분) 또는 택시 이용 시 약 10분",
  },
  {
    title: "시외/고속버스 (홍성버스터미널)",
    body: "터미널 맞은편 버스정류장 → 내포신도시 행 버스 이용",
  },
] as const;
