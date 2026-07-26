/**
 * A4 전단지 미리보기용 샘플 — 관리자 목록 실데이터 스냅샷 (지침 승인 전 목업)
 * 매물: 내포 신축 오피스텔 36㎡ 매매
 * 경매: 2025타경15730 / 홍성지원
 */

export type FlyerKind = "SALE" | "LEASE" | "AUCTION";

export type FlyerSampleProperty = {
  kind: "SALE" | "LEASE";
  sourceId: string;
  sourceLabel: string;
  title: string;
  subtitle: string;
  dealLabel: string;
  priceLine: string;
  address: string;
  categoryLabel: string;
  exclusiveArea: string;
  supplyOrContractArea: string;
  floorLine: string;
  roomsBaths: string;
  direction: string;
  approvalDate: string;
  parking: string;
  moveIn: string;
  maintenance: string;
  illegalBuilding: string;
  insight: string;
  images: string[];
  publicPath: string;
};

export type FlyerSampleAuction = {
  kind: "AUCTION";
  sourceId: string;
  sourceLabel: string;
  title: string;
  subtitle: string;
  court: string;
  caseNumber: string;
  itemNo: string;
  address: string;
  usage: string;
  areaLine: string;
  appraisal: string;
  minPrice: string;
  discountLabel: string;
  bidDeposit: string;
  saleDate: string;
  rightsSummary: string;
  insight: string;
  images: string[];
  publicPath: string;
};

/** 관리자 매물목록 · 내포 신축 오피스텔 36㎡ 매매 */
export const FLYER_SAMPLE_PROPERTY: FlyerSampleProperty = {
  kind: "SALE",
  sourceId: "cmrfxeul3000gwlicvvc3nqxs",
  sourceLabel: "관리자 매물목록 샘플",
  title: "내포 신축 오피스텔 36㎡ 매매",
  subtitle: "2022년 준공 · 전용 36㎡ · 즉시 상담 가능",
  dealLabel: "매 매",
  priceLine: "1억 2,500만 원 (단일가)",
  address: "충청남도 홍성군 홍북읍 내포 더샵 오피스텔",
  categoryLabel: "업무시설 (오피스텔)",
  exclusiveArea: "36 m²",
  supplyOrContractArea: "공급 48 m²",
  floorLine: "총 19층 중 11층 (11/19층)",
  roomsBaths: "미기재",
  direction: "미기재",
  approvalDate: "2022년 준공 (사용승인일 미기재)",
  parking: "미기재",
  moveIn: "협의",
  maintenance: "미기재",
  illegalBuilding: "미기재 (등록 시 명시 필요)",
  insight:
    "내포신도시 업무·주거 수요가 모이는 오피스텔 매매 건입니다. 전용 36㎡·공급 48㎡로 실거주·투자 상담이 모두 가능하며, 현장 확인 후 조건을 안내합니다.",
  images: [],
  publicPath: "/properties/cmrfxeul3000gwlicvvc3nqxs",
};

/** 관리자 경매목록 · 2025타경15730 */
export const FLYER_SAMPLE_AUCTION: FlyerSampleAuction = {
  kind: "AUCTION",
  sourceId: "51ece7a2-db19-4832-a33b-6f548f9fe065",
  sourceLabel: "관리자 경매목록 샘플",
  title: "[법원경매] 홍성군 광천읍 신진리 571-2",
  subtitle: "지분매각 · 유찰 후 최저가 · 권리관계 사전 확인 권장",
  court: "대전지방법원 홍성지원",
  caseNumber: "2025타경15730",
  itemNo: "2번",
  address: "충청남도 홍성군 광천읍 신진리 571-2",
  usage: "경매물건 (지분매각)",
  areaLine: "면적 미기재 (공부 확인)",
  appraisal: "43,165,550 원",
  minPrice: "14,816,600 원",
  discountLabel: "감정가 대비 약 34%",
  bidDeposit: "1,481,660 원 (최저가의 10%)",
  saleDate: "2026년 06월 16일",
  rightsSummary: "지분매각 · 공유자우선매수 1회 · 조사서·현장 확인 필요",
  insight:
    "수회 유찰 후 최저가가 형성된 물건입니다. 입찰 전 점유·지분·현장 상태를 매수신청대리인과 함께 확인하시기 바랍니다.",
  images: [
    "https://jaxvruxtdfqyllvharsj.supabase.co/storage/v1/object/public/property-images/auctions/1784531197285-f0b6aee4.jpg",
    "https://jaxvruxtdfqyllvharsj.supabase.co/storage/v1/object/public/property-images/auctions/1784531197739-6a7eb826.jpg",
    "https://jaxvruxtdfqyllvharsj.supabase.co/storage/v1/object/public/property-images/auctions/1784531197871-7ba5574e.jpg",
    "https://jaxvruxtdfqyllvharsj.supabase.co/storage/v1/object/public/property-images/auctions/1784531197983-efb8fe1b.jpg",
  ],
  publicPath: "/auctions/51ece7a2-db19-4832-a33b-6f548f9fe065",
};

export const FLYER_PALETTE = {
  SALE: { primary: "#1E3A8A", accent: "#EA580C", soft: "#EFF6FF" },
  LEASE: { primary: "#065F46", accent: "#0D9488", soft: "#ECFDF5" },
  AUCTION: { primary: "#0F172A", accent: "#D97706", soft: "#FFFBEB" },
} as const;
