/**
 * 창문전단지 Type A/B/C 목업 데이터 — 운영 미연결
 * Footer는 OFFICE_PROFILE + fallback으로 항상 완전 채움
 */

export type WindowTemplate = "A" | "B" | "C";

export type WindowMockProperty = {
  badge: string;
  headline: string;
  tagline: string;
  emotionalLine: string;
  priceHuge: string;
  priceNote?: string;
  location: string;
  addressLine: string;
  keywords: string[];
  bullets: string[];
  features: string[];
  specs: { icon: "bed" | "bath" | "area" | "car" | "floor" | "garden"; label: string }[];
  priceRows?: { tab: string; area: string; price: string; note?: string }[];
  images: string[];
  publicPath: string;
};

export type WindowMockAuction = {
  badge: string;
  headline: string;
  emotionalLine: string;
  courtCase: string;
  noticeNo: string;
  appraisal: string;
  minPrice: string;
  discountPct: string;
  saleDateShort: string;
  keywords: string[];
  bullets: string[];
  images: string[];
  publicPath: string;
};

const VILLA =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=80";
const LIVING =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80";
const BED =
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80";
const KITCHEN =
  "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&q=80";
const MODERN_HOUSE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80";
const APT_EXT =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80";

/** Type A — OPEN HOUSE / 갤러리 */
export const WINDOW_MOCK_PROPERTY: WindowMockProperty = {
  badge: "매매",
  headline: "OPEN HOUSE",
  tagline: "모던 스타일, 햇살 좋은 집",
  emotionalLine: "House For Sale",
  priceHuge: "2억 8,500만",
  priceNote: "협의 가능",
  location: "충남 홍성 · 내포신도시",
  addressLine: "홍북읍 신경리 일원",
  keywords: ["남향", "신축급", "주차2"],
  bullets: ["올수리 완료", "단독 테라스", "즉시 입주", "실거주·투자"],
  features: ["방 3 · 거실 · 주방", "넓은 마당 · 주차"],
  specs: [
    { icon: "bed", label: "방 3" },
    { icon: "bath", label: "욕실 2" },
    { icon: "car", label: "주차 2" },
    { icon: "garden", label: "마당" },
    { icon: "area", label: "대 89㎡" },
    { icon: "floor", label: "지상 2층" },
  ],
  images: [LIVING, VILLA, BED],
  publicPath: "/properties/cmrfxeul3000gwlicvvc3nqxs",
};

/** Type B — JUST LISTED / 컬러블록 */
export const WINDOW_MOCK_LEASE: WindowMockProperty = {
  badge: "월세",
  headline: "JUST LISTED",
  tagline: "역세권 · 즉시입주",
  emotionalLine: "ONLY",
  priceHuge: "300 / 65만",
  priceNote: "보증 / 월세",
  location: "홍북읍 · 내포스테이",
  addressLine: "충남 홍성군 홍북읍 신경리",
  keywords: ["풀옵션", "단기", "역세"],
  bullets: ["풀옵션", "무료주차", "단기가능", "즉시입주", "남향", "엘리베이터"],
  features: ["원룸 · 욕실1", "풀옵션 · 주차"],
  specs: [
    { icon: "area", label: "전용 30㎡" },
    { icon: "bed", label: "원룸" },
    { icon: "bath", label: "욕실 1" },
    { icon: "car", label: "주차" },
  ],
  images: [MODERN_HOUSE, KITCHEN],
  publicPath: "/properties/cmrfxeul4000hwlicjmhs7lgm",
};

/** Type C — 단지 매매·전세 리스트 */
export const WINDOW_MOCK_COMPLEX: WindowMockProperty = {
  badge: "매매 · 전세",
  headline: "매매 · 전세",
  tagline: "역 도보 10분 / 마트 5분 / 학군 인접",
  emotionalLine: "내포 센트럴파크 APT 1~3단지",
  priceHuge: "1억 2,500만",
  location: "충남 홍성 · 내포신도시",
  addressLine: "홍북읍 신경리",
  keywords: ["역세권", "학군", "주차"],
  bullets: ["남향 선호", "올수리", "즉시입주"],
  features: [],
  specs: [
    { icon: "bed", label: "방 2~3" },
    { icon: "area", label: "25~34평" },
  ],
  priceRows: [
    { tab: "전세", area: "890㎡ | 270평 (농가)", price: "1억 3천만", note: "하나로마트 도보 4분" },
    { tab: "매매", area: "25평형 (방2·화2·베란다)", price: "8,500만", note: "내포공원 도보 8분" },
    { tab: "매매", area: "34평형 (방3·화2·확장)", price: "1억 2,500만", note: "역 도보 10분" },
  ],
  images: [KITCHEN, BED, APT_EXT],
  publicPath: "/properties/cmrfxeul3000gwlicvvc3nqxs",
};

export const WINDOW_MOCK_AUCTION: WindowMockAuction = {
  badge: "경매",
  headline: "반값 찬스",
  emotionalLine: "유찰 후 최저가",
  courtCase: "2025타경15730 · 홍성지원",
  noticeNo: "2025-15730",
  appraisal: "4,317만",
  minPrice: "1,482만",
  discountPct: "66%",
  saleDateShort: "매각 6/16",
  keywords: ["지분", "유찰", "상담"],
  bullets: ["지분매각", "유찰 후 최저", "입찰 상담", "현장 확인"],
  images: [
    "https://jaxvruxtdfqyllvharsj.supabase.co/storage/v1/object/public/property-images/auctions/1784531197285-f0b6aee4.jpg",
    "https://jaxvruxtdfqyllvharsj.supabase.co/storage/v1/object/public/property-images/auctions/1784531197739-6a7eb826.jpg",
    "https://jaxvruxtdfqyllvharsj.supabase.co/storage/v1/object/public/property-images/auctions/1784531197871-7ba5574e.jpg",
  ],
  publicPath: "/auctions/51ece7a2-db19-4832-a33b-6f548f9fe065",
};
