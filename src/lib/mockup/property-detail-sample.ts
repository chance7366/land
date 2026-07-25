/** 사용자 매물 상세 재구성 목업 샘플 (관리자 등록 §1~3) */

export type PropertyDetailMockup = {
  id: string;
  title: string;
  featureSummary: string;
  description: string;
  category: string;
  categoryGroup: string;
  dealType: string;
  dealSubType?: string;
  status: string;
  featured: boolean;
  publishedAt: string;
  priceLabel: string;
  priceSub?: string;
  address: string;
  buildingName: string;
  unitDong?: string;
  unitHo?: string;
  region: string;
  images: string[];
  tags: string[];
  /** §1 기본정보 · 거래조건 */
  basic: { label: string; value: string }[];
  /** §2 매물 상세 · 면적 */
  detail: { label: string; value: string }[];
  /** §3 시설 · 옵션 */
  facilities: { label: string; value: string }[];
};

export const PROPERTY_DETAIL_SAMPLES: PropertyDetailMockup[] = [
  {
    id: "pl1",
    title: "내포신도시 호반베르디움 84A",
    featureSummary: "남향 · 고층 · 학군·편의시설 인접",
    description:
      "내포신도시 중심 생활권 아파트입니다. 남향 고층으로 채광이 좋으며, 단지 내 커뮤니티와 인근 초등학교·대형마트 접근이 편리합니다.\n\n내부 상태는 입주 청소 완료 상태이며, 즉시 입주 가능합니다.",
    category: "아파트",
    categoryGroup: "주거",
    dealType: "매매",
    status: "노출",
    featured: true,
    publishedAt: "2026-07-18",
    priceLabel: "매매가 3억 2,500만",
    address: "충남 홍성군 홍북읍 신경리 1680",
    buildingName: "호반베르디움",
    unitDong: "101동",
    unitHo: "1502호",
    region: "내포신도시",
    images: [],
    tags: ["즉시입주", "남향", "학군"],
    basic: [
      { label: "카테고리", value: "주거 · 아파트" },
      { label: "거래 유형", value: "매매" },
      { label: "매매가", value: "3억 2,500만원" },
      { label: "융자", value: "가능 (상담)" },
      { label: "입주", value: "즉시입주" },
      { label: "노출 상태", value: "노출 · Featured" },
      { label: "등록일", value: "2026-07-18" },
      { label: "관리번호", value: "매물_00000012" },
    ],
    detail: [
      { label: "소재지", value: "충남 홍성군 홍북읍 신경리 1680" },
      { label: "건물/단지", value: "호반베르디움 · 101동 1502호" },
      { label: "공급면적", value: "110.45㎡ (33.4평)" },
      { label: "전용면적", value: "84.92㎡ (25.7평)" },
      { label: "해당층/총층", value: "15 / 25층" },
      { label: "방/욕실", value: "방 3 · 욕실 2" },
      { label: "향", value: "남향" },
      { label: "건축년도", value: "2019년" },
      { label: "주차", value: "세대당 1.2대" },
    ],
    facilities: [
      { label: "난방", value: "개별난방 · 도시가스" },
      { label: "냉방", value: "벽걸이 에어컨" },
      { label: "생활", value: "엘리베이터 · 현관보안" },
      { label: "주방", value: "빌트인 가스레인지 · 식기세척기" },
      { label: "기타 옵션", value: "붙박이장 · 시스템에어컨(거실)" },
      { label: "입주 조건", value: "잔금 후 즉시" },
    ],
  },
  {
    id: "pl2",
    title: "광천 중심상가 1층 점포",
    featureSummary: "대로변 · 유동인구 · 권리금 협의",
    description: "광천읍 중심 상권 1층 점포입니다. 대로변으로 노출이 좋으며, 업종에 따라 권리금 협의가 가능합니다.",
    category: "상가",
    categoryGroup: "상가·사무실",
    dealType: "임대",
    dealSubType: "월세",
    status: "노출",
    featured: true,
    publishedAt: "2026-07-12",
    priceLabel: "보증 3,000만",
    priceSub: "월 120만 · VAT별도",
    address: "충남 홍성군 광천읍 광천리 245-3",
    buildingName: "광천중심상가",
    region: "광천읍",
    images: [],
    tags: ["1층", "대로변"],
    basic: [
      { label: "카테고리", value: "상가·사무실 · 상가" },
      { label: "거래 유형", value: "임대 · 월세" },
      { label: "보증금", value: "3,000만원" },
      { label: "월세", value: "120만원" },
      { label: "VAT", value: "별도" },
      { label: "권리금", value: "협의" },
      { label: "업종", value: "일반음식점 가능" },
      { label: "등록일", value: "2026-07-12" },
    ],
    detail: [
      { label: "소재지", value: "충남 홍성군 광천읍 광천리 245-3" },
      { label: "건물", value: "광천중심상가 1층" },
      { label: "계약면적", value: "52.0㎡" },
      { label: "전용면적", value: "45.2㎡ (13.7평)" },
      { label: "해당층", value: "1층" },
      { label: "주차", value: "인근 공영주차장" },
    ],
    facilities: [
      { label: "전기/수도", value: "개별 계량" },
      { label: "화장실", value: "내부 있음" },
      { label: "간판", value: "전면 간판 가능(협의)" },
      { label: "기타", value: "셔터 · 기본 조명" },
    ],
  },
];

export function getPropertyDetailSample(id?: string | null): PropertyDetailMockup {
  return PROPERTY_DETAIL_SAMPLES.find((p) => p.id === id) ?? PROPERTY_DETAIL_SAMPLES[0]!;
}
