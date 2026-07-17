export type NewsFeedSourceKey =
  | "all"
  | "naver"
  | "molit"
  | "chungnam"
  | "hongseong"
  | "rtech"
  | "r114";

export type NewsFeedSource = {
  key: Exclude<NewsFeedSourceKey, "all">;
  label: string;
  shortLabel: string;
  badgeClass: string;
};

export type NewsFeedSampleItem = {
  id: string;
  source: Exclude<NewsFeedSourceKey, "all">;
  sourceName: string;
  title: string;
  originUrl: string;
  pubDate: string; // YYYY-MM-DD
};

export const NEWS_FEED_SOURCES: NewsFeedSource[] = [
  {
    key: "naver",
    label: "네이버부동산뉴스",
    shortLabel: "네이버",
    badgeClass: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  },
  {
    key: "molit",
    label: "국토교통부",
    shortLabel: "국토부",
    badgeClass: "border-sky-400/40 bg-sky-500/15 text-sky-300",
  },
  {
    key: "chungnam",
    label: "충남도청",
    shortLabel: "충남",
    badgeClass: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  },
  {
    key: "hongseong",
    label: "홍성군청",
    shortLabel: "홍성",
    badgeClass: "border-orange-400/40 bg-orange-500/15 text-orange-300",
  },
  {
    key: "rtech",
    label: "부동산테크",
    shortLabel: "R-TECH",
    badgeClass: "border-violet-400/40 bg-violet-500/15 text-violet-300",
  },
  {
    key: "r114",
    label: "부동산114",
    shortLabel: "R114",
    badgeClass: "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-300",
  },
];

export const NEWS_FEED_SIDEBAR: { key: NewsFeedSourceKey; label: string; icon: string }[] = [
  { key: "all", label: "전체", icon: "dashboard" },
  { key: "naver", label: "네이버부동산뉴스", icon: "newspaper" },
  { key: "molit", label: "국토교통부", icon: "account_balance" },
  { key: "chungnam", label: "충남도청", icon: "location_city" },
  { key: "hongseong", label: "홍성군청", icon: "home_work" },
  { key: "rtech", label: "부동산테크", icon: "analytics" },
  { key: "r114", label: "부동산114", icon: "apartment" },
];

const sourceMeta = Object.fromEntries(NEWS_FEED_SOURCES.map((s) => [s.key, s])) as Record<
  Exclude<NewsFeedSourceKey, "all">,
  NewsFeedSource
>;

function item(
  source: Exclude<NewsFeedSourceKey, "all">,
  id: string,
  title: string,
  pubDate: string,
  path: string,
): NewsFeedSampleItem {
  return {
    id,
    source,
    sourceName: sourceMeta[source].label,
    title,
    originUrl: `https://example.com/news/${source}/${path}`,
    pubDate,
  };
}

/** 샘플 기사 — 출처별 최신순. 원문 URL은 데모용 example.com */
export const MOCK_NEWS_FEED_ITEMS: NewsFeedSampleItem[] = [
  item("naver", "nv-1", "내포신도시 아파트 매매가, 전분기 대비 소폭 상승", "2026-07-14", "naepo-price"),
  item("naver", "nv-2", "충남 서부권 전세 수요 회복… 입주 물량 소화 여부 주목", "2026-07-13", "chungnam-jeonse"),
  item("naver", "nv-3", "경매 낙찰가율 상승세, 수도권·지방 온도차 여전", "2026-07-12", "auction-rate"),
  item("naver", "nv-4", "토지거래허가구역 해제 논의… 실수요자 관심 집중", "2026-07-10", "land-permit"),
  item("naver", "nv-5", "중소형 오피스텔 수익률, 지역별 양극화 심화", "2026-07-08", "officetel"),

  item("molit", "mo-1", "[보도자료] 주택공급 확대 방안 및 인허가 절차 간소화 추진", "2026-07-14", "supply"),
  item("molit", "mo-2", "[보도자료] 전세사기 피해 예방을 위한 임차인 보호 강화", "2026-07-11", "jeonse-fraud"),
  item("molit", "mo-3", "[보도자료] 공공임대주택 입주자 모집 일정 안내", "2026-07-09", "public-rental"),
  item("molit", "mo-4", "[보도자료] 부동산 실거래가 공개 시스템 개편", "2026-07-05", "rtms"),
  item("molit", "mo-5", "[보도자료] 노후계획도시 정비 특별법 후속 조치", "2026-07-02", "old-city"),

  item("chungnam", "cn-1", "충남도, 내포신도시 광역교통망 확충 계획 발표", "2026-07-13", "transit"),
  item("chungnam", "cn-2", "서해안권 관광·주거 복합개발 기본구상 공개", "2026-07-10", "west-coast"),
  item("chungnam", "cn-3", "도내 빈집 정비 및 소규모 주택정비 지원 확대", "2026-07-07", "vacant"),
  item("chungnam", "cn-4", "충남형 청년 주거지원 바우처 2차 모집", "2026-07-03", "youth"),

  item("hongseong", "hs-1", "홍성군, 내포 생활권 도시계획 재정비 주민설명회", "2026-07-14", "plan"),
  item("hongseong", "hs-2", "군청 앞 공영주차장 확장 및 교통개선 공사 착수", "2026-07-11", "parking"),
  item("hongseong", "hs-3", "홍성읍 소규모 주택정비 사업지 추가 지정", "2026-07-06", "housing"),
  item("hongseong", "hs-4", "농촌공간 재구조화 시범사업 주민 공모", "2026-07-01", "rural"),

  item("rtech", "rt-1", "전국 아파트 실거래가 주간 동향 (7월 2주)", "2026-07-14", "weekly"),
  item("rtech", "rt-2", "경매 통계로 본 충남권 낙찰가율·유찰 현황", "2026-07-12", "auction-stats"),
  item("rtech", "rt-3", "토지·건물 공시가격 열람 시즌 체크포인트", "2026-07-08", "official-price"),
  item("rtech", "rt-4", "권리분석 기초: 말소기준권리와 인수주의", "2026-07-04", "rights"),

  item("r114", "r4-1", "7월 전국 아파트 매매·전세 시세 리포트", "2026-07-13", "july-report"),
  item("r114", "r4-2", "지방 중소도시 미분양 해소 속도, 권역별 차이", "2026-07-09", "unsold"),
  item("r114", "r4-3", "재건축·재개발 규제 완화 기대감… 투자심리 점검", "2026-07-05", "rebuild"),
  item("r114", "r4-4", "오피스·상가 공실률, 수도권 vs 지방 비교", "2026-07-02", "vacancy"),
].sort((a, b) => (a.pubDate < b.pubDate ? 1 : a.pubDate > b.pubDate ? -1 : 0));

export function getSourceMeta(key: Exclude<NewsFeedSourceKey, "all">) {
  return sourceMeta[key];
}

export const NEWS_FEED_PAGE_SIZE = 20;
