/** 사용자 부동산중개 목록 재구성 목업 샘플 */

export type PropertyListRedesignSample = {
  id: string;
  title: string;
  category: string;
  typeLabel: string;
  /** 정렬용 원 단위 (매매가 또는 보증금) */
  priceWon: number;
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

export const PROPERTY_LIST_REDESIGN_SAMPLES: PropertyListRedesignSample[] = [
  {
    id: "pl1",
    title: "내포신도시 호반베르디움 84A",
    category: "아파트",
    typeLabel: "매매",
    priceWon: 325_000_000,
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
    id: "pl2",
    title: "광천 중심상가 1층 점포",
    category: "상가",
    typeLabel: "월세",
    priceWon: 30_000_000,
    priceLabel: "보증 3,000만",
    priceSub: "월 120만",
    address: "충남 홍성군 광천읍 광천리 245-3",
    region: "광천읍",
    areaLabel: "전용 45.2㎡ (13.7평)",
    status: "공개",
    featured: true,
    publishedAt: "2026-07-12",
    imageUrl: null,
  },
  {
    id: "pl3",
    title: "홍성읍 다가구 전세",
    category: "다가구",
    typeLabel: "전세",
    priceWon: 180_000_000,
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
    id: "pl4",
    title: "내포 지식산업센터 사무실",
    category: "사무실",
    typeLabel: "월세",
    priceWon: 20_000_000,
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
    id: "pl5",
    title: "갈산면 전원주택 토지겸",
    category: "토지",
    typeLabel: "매매",
    priceWon: 210_000_000,
    priceLabel: "2억 1,000만",
    address: "충남 홍성군 갈산면 상촌리 77-1",
    region: "갈산면",
    areaLabel: "토지 412㎡ (124.6평)",
    status: "공개",
    featured: false,
    publishedAt: "2026-06-20",
    imageUrl: null,
  },
  {
    id: "pl6",
    title: "예산 신례원 빌라 3층",
    category: "빌라",
    typeLabel: "매매",
    priceWon: 148_000_000,
    priceLabel: "1억 4,800만",
    address: "충남 예산군 예산읍 신례원리 45",
    region: "예산읍",
    areaLabel: "전용 59.8㎡ (18.1평)",
    status: "공개",
    featured: false,
    publishedAt: "2026-06-14",
    imageUrl: null,
  },
  {
    id: "pl7",
    title: "내포 센트럴시티 오피스텔",
    category: "오피스텔",
    typeLabel: "매매",
    priceWon: 198_000_000,
    priceLabel: "1억 9,800만",
    address: "충남 홍성군 홍북읍 신경리 1555",
    region: "내포신도시",
    areaLabel: "전용 49.5㎡ (15.0평)",
    status: "공개",
    featured: true,
    publishedAt: "2026-07-20",
    imageUrl: null,
  },
  {
    id: "pl8",
    title: "홍북읍 원룸 단기임대",
    category: "원룸",
    typeLabel: "월세",
    priceWon: 5_000_000,
    priceLabel: "보증 500만",
    priceSub: "월 45만",
    address: "충남 홍성군 홍북읍 신경리 220",
    region: "내포신도시",
    areaLabel: "전용 23.1㎡ (7.0평)",
    status: "공개",
    featured: false,
    publishedAt: "2026-07-08",
    imageUrl: null,
  },
];
