export const MOCK_COUNTS = { properties: 7, auctions: 3, news: 4 };

export const MOCK_PROPERTY = {
  title: "내포신도시 래미안 84㎡",
  badges: ["아파트", "매매", "즉시입주"],
  summary: "전용 84㎡ · 15/25층 · 남향",
  price: "4억 2,000",
};

export const MOCK_PROPERTY_LIST = [
  { title: "내포 상가 1층", price: "3억 5,000", badges: ["상가", "매매"] },
  { title: "내포 토지 330㎡", price: "2억 8,000", badges: ["토지", "매매"] },
];

export const MOCK_AUCTION = {
  caseNumber: "2024타경12345",
  title: "내포신도시 아파트 경매",
  description: "선순위 채권 없음 · 임차인 없음",
  dDay: 12,
};

export const MOCK_AUCTION_LIST = [
  { title: "내포 오피스텔 경매", dDay: 8, description: "보증금 3,000만 · 세입자 1명" },
];

export const MOCK_NEWS = {
  title: "내포신도시 3기 신규 분양 일정",
  date: "2026. 7. 1. 오후 2:00:00",
  summary: "내포신도시 3기 신규 분양 일정이 공개되었습니다.",
};

export const MOCK_NEWS_LIST = [{ title: "금리 인하와 부동산 시장 전망", summary: "기준금리 동결..." }];

export const MOCK_LEGAL = {
  category: "임대차",
  question: "전세 계약 만료 후 보증금 반환 거부",
  answer: "임대차보호법에 따라...",
  status: "ANSWERED" as const,
};

export const MOCK_LEGAL_LIST = [
  { question: "경매 낙찰 후 명도소송 절차", status: "PENDING" as const },
];
