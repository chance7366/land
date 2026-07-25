/** 관리자 매물관리 목록 재구성 목업용 샘플 */

export type AdminPropertyListSample = {
  id: string;
  manageCode: string;
  title: string;
  category: string;
  type: "SALE" | "RENT" | "JEONSE";
  typeLabel: string;
  priceLabel: string;
  priceSub?: string;
  address: string;
  region: string;
  areaLabel: string;
  status: string;
  featured: boolean;
  publishedAt: string;
  imageUrl: string | null;
};

export const ADMIN_PROPERTY_LIST_SAMPLES: AdminPropertyListSample[] = [
  {
    id: "p1",
    manageCode: "매물_00000012",
    title: "내포신도시 호반베르디움 84A",
    category: "아파트",
    type: "SALE",
    typeLabel: "매매",
    priceLabel: "3억 2,500만",
    address: "충남 홍성군 홍북읍 신경리 1680",
    region: "내포신도시",
    areaLabel: "전용 84.92㎡ (25.7평)",
    status: "공개",
    featured: true,
    publishedAt: "2026-07-18",
    imageUrl: null,
  },
  {
    id: "p2",
    manageCode: "매물_00000011",
    title: "광천 중심상가 1층 점포",
    category: "상가",
    type: "RENT",
    typeLabel: "월세",
    priceLabel: "보증 3,000만",
    priceSub: "월 120만",
    address: "충남 홍성군 광천읍 광천리 245-3",
    region: "광천읍",
    areaLabel: "전용 45.2㎡ (13.7평)",
    status: "공개",
    featured: false,
    publishedAt: "2026-07-12",
    imageUrl: null,
  },
  {
    id: "p3",
    manageCode: "매물_00000010",
    title: "홍성읍 다가구 전세",
    category: "다가구",
    type: "JEONSE",
    typeLabel: "전세",
    priceLabel: "전세 1억 8,000만",
    address: "충남 홍성군 홍성읍 오관리 112",
    region: "홍성읍",
    areaLabel: "전용 62.1㎡ (18.8평)",
    status: "계약중",
    featured: false,
    publishedAt: "2026-07-05",
    imageUrl: null,
  },
  {
    id: "p4",
    manageCode: "매물_00000009",
    title: "내포 지식산업센터 사무실",
    category: "사무실",
    type: "RENT",
    typeLabel: "월세",
    priceLabel: "보증 2,000만",
    priceSub: "월 85만 · VAT별도",
    address: "충남 홍성군 홍북읍 신경리 890",
    region: "내포신도시",
    areaLabel: "전용 33.0㎡ (10.0평)",
    status: "공개",
    featured: true,
    publishedAt: "2026-06-28",
    imageUrl: null,
  },
  {
    id: "p5",
    manageCode: "매물_00000008",
    title: "갈산면 전원주택 토지겸",
    category: "토지",
    type: "SALE",
    typeLabel: "매매",
    priceLabel: "2억 1,000만",
    address: "충남 홍성군 갈산면 상촌리 77-1",
    region: "갈산면",
    areaLabel: "토지 412㎡ (124.6평)",
    status: "비공개",
    featured: false,
    publishedAt: "2026-06-20",
    imageUrl: null,
  },
  {
    id: "p6",
    manageCode: "매물_00000007",
    title: "예산 신례원 빌라 3층",
    category: "빌라",
    type: "SALE",
    typeLabel: "매매",
    priceLabel: "1억 4,800만",
    address: "충남 예산군 예산읍 신례원리 45",
    region: "예산읍",
    areaLabel: "전용 59.8㎡ (18.1평)",
    status: "공개",
    featured: false,
    publishedAt: "2026-06-14",
    imageUrl: null,
  },
];
