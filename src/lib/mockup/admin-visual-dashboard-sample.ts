/** 관리자 시각 대시보드 목업용 샘플 데이터 (프로덕션 미연동) */

export const ACCENT = {
  blue: "#4dabff",
  blueRgb: "77, 171, 255",
  gold: "#d4af37",
  goldRgb: "212, 175, 55",
  violet: "#d450ff",
  violetRgb: "212, 80, 255",
  green: "#34d399",
  greenRgb: "52, 211, 153",
  orange: "#f97316",
} as const;

export const SAMPLE_ACTION = {
  legalPending: 7,
  legalOver24h: 3,
  consultPending: 5,
  consultTodayTomorrow: [
    { time: "오늘 14:00", name: "김○○", category: "경매 권리분석" },
    { time: "오늘 16:30", name: "이○○", category: "매매 중개" },
    { time: "내일 10:00", name: "박○○", category: "전세" },
    { time: "내일 11:30", name: "최○○", category: "입찰대행" },
  ],
  subscriberPending: 12,
};

export const SAMPLE_INVENTORY = {
  propertyTotal: 42,
  auctionTotal: 18,
  propertyMonth: 9,
  auctionMonth: 4,
  propertyTarget: 30,
  auctionTarget: 10,
};

export const SAMPLE_TOP_PROPERTIES = [
  { name: "센트럴자이 84㎡", views: 428, dwellMin: 3.8 },
  { name: "반도유보라 마크에디션", views: 356, dwellMin: 2.9 },
  { name: "홍성자이", views: 291, dwellMin: 2.4 },
  { name: "모아미래도메가시티2차", views: 218, dwellMin: 1.9 },
  { name: "내포 택지 200평", views: 187, dwellMin: 2.1 },
];

/** 30초 이상 체류 기준 진성 관심 TOP5 */
export const SAMPLE_DWELL_TOP = [
  { name: "센트럴자이 84㎡", dwellSec: 186, sessions: 42 },
  { name: "홍북읍 신경리 아파트(경매)", dwellSec: 154, sessions: 38 },
  { name: "반도유보라 마크에디션", dwellSec: 128, sessions: 31 },
  { name: "금마면 화양리 단독(경매)", dwellSec: 112, sessions: 27 },
  { name: "내포 택지 200평", dwellSec: 98, sessions: 22 },
];

export const SAMPLE_CUSTOMER_ACTIONS = {
  share: 47,
  copyLink: 83,
  print: 19,
};

export const SAMPLE_TOP_AUCTIONS = [
  { name: "홍북읍 신경리 아파트", clicks: 312, alertMatches: 18 },
  { name: "금마면 화양리 단독", clicks: 248, alertMatches: 11 },
  { name: "결성면 교항리 전답", clicks: 196, alertMatches: 9 },
  { name: "갈산면 갈오리 임야", clicks: 154, alertMatches: 6 },
  { name: "신경리 상가·오피스텔", clicks: 121, alertMatches: 8 },
];

export const SAMPLE_MENU_SHARE = [
  { name: "홈", value: 34, fill: ACCENT.orange },
  { name: "부동산중개", value: 26, fill: ACCENT.blue },
  { name: "경매공매", value: 22, fill: ACCENT.gold },
  { name: "찬스상담소", value: 11, fill: ACCENT.green },
  { name: "기타", value: 7, fill: "#94a3b8" },
];

export const SAMPLE_FUNNEL = [
  { stage: "총 방문자", value: 8420, fill: ACCENT.blue },
  { stage: "매물·경매 클릭", value: 2180, fill: ACCENT.violet },
  { stage: "상담·알림 전환", value: 186, fill: ACCENT.green },
];

export const SAMPLE_MONTHLY = [
  { month: "2월", consults: 12, visitors: 2100, stories: 0 },
  { month: "3월", consults: 18, visitors: 2480, stories: 1 },
  { month: "4월", consults: 15, visitors: 2310, stories: 0 },
  { month: "5월", consults: 22, visitors: 2890, stories: 2 },
  { month: "6월", consults: 19, visitors: 2650, stories: 0 },
  { month: "7월", consults: 28, visitors: 3120, stories: 1 },
];

export const SAMPLE_STORY_MARKERS = [
  { month: "3월", label: "스토리+1" },
  { month: "5월", label: "스토리+2" },
  { month: "7월", label: "스토리+1" },
];

/** 검색 수요 vs 등록 공급 — 확보 타겟 */
export const SAMPLE_SUPPLY_GAP = [
  { region: "내포신도시", searches: 420, supply: 8, gap: 52 },
  { region: "홍성읍", searches: 310, supply: 14, gap: 28 },
  { region: "예산읍", searches: 268, supply: 3, gap: 61 },
  { region: "광천읍", searches: 190, supply: 2, gap: 48 },
  { region: "갈산면", searches: 145, supply: 1, gap: 44 },
];

export const SAMPLE_SEARCH_KEYWORDS = [
  { keyword: "아파트", count: 520 },
  { keyword: "내포", count: 410 },
  { keyword: "토지", count: 280 },
  { keyword: "경매", count: 265 },
  { keyword: "전세", count: 198 },
];

/** 채널별 방문·상담 전환 */
export const SAMPLE_ATTRIBUTION = [
  { channel: "유튜브", visits: 1240, converts: 48, rate: 3.9 },
  { channel: "네이버 블로그", visits: 980, converts: 52, rate: 5.3 },
  { channel: "직접·검색", visits: 2860, converts: 71, rate: 2.5 },
  { channel: "기타 SNS", visits: 420, converts: 12, rate: 2.9 },
];

/** 고의도 체류 추이 (영역 차트) */
export const SAMPLE_DWELL_TREND = [
  { day: "월", deepViews: 42, clicks: 118 },
  { day: "화", deepViews: 51, clicks: 132 },
  { day: "수", deepViews: 38, clicks: 105 },
  { day: "목", deepViews: 67, clicks: 156 },
  { day: "금", deepViews: 74, clicks: 171 },
  { day: "토", deepViews: 88, clicks: 198 },
  { day: "일", deepViews: 61, clicks: 144 },
];

/** 평균 답변 소요 (시간) — 타코미터용 */
export const SAMPLE_RESPONSE_HOURS = {
  legalAvgHours: 11.2,
  consultAvgHours: 6.4,
  targetHours: 24,
};
