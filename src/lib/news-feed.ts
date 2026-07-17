export const NEWS_FEED_PAGE_SIZE = 20;

/** 행정 출처(국토부·충남·홍성 등) 수집 시작일 */
export const NEWS_FEED_COLLECT_FROM = new Date(Date.UTC(2026, 0, 1));

/** 행정 출처 보관 기간(일) */
export const NEWS_FEED_RETENTION_DAYS = 365;

/** 네이버 부동산뉴스 수집·보관 기간(일) */
export const NEWS_FEED_NAVER_RETENTION_DAYS = 30;

/** 부동산114 위키 수집·보관 기간(일) — 네이버와 동일 */
export const NEWS_FEED_R114_RETENTION_DAYS = 30;

/** 네이버 헤드라인 1회 수집 상한 */
export const NEWS_FEED_NAVER_MAX_ITEMS = 40;

/** 목록 페이지네이션 안전 상한 */
export const NEWS_FEED_MAX_LIST_PAGES = 80;

/** 부동산테크 API(10건/페이지) — 2026-01-01까지 약 370p */
export const NEWS_FEED_RTECH_MAX_PAGES = 400;

export type NewsFeedSourceKey =
  | "all"
  | "naver"
  | "molit"
  | "chungnam"
  | "hongseong"
  | "yesan"
  | "rtech"
  | "r114";

export type NewsFeedSourceId = Exclude<NewsFeedSourceKey, "all">;

export type NewsFeedGroupId = "estate" | "region";

export const NEWS_FEED_GROUP_SOURCES: Record<NewsFeedGroupId, NewsFeedSourceId[]> = {
  estate: ["r114", "naver", "rtech", "molit"],
  region: ["chungnam", "hongseong", "yesan"],
};

export function isNewsFeedGroupId(value: string): value is NewsFeedGroupId {
  return value === "estate" || value === "region";
}

export function newsFeedGroupForSource(source: NewsFeedSourceId): NewsFeedGroupId {
  return NEWS_FEED_GROUP_SOURCES.region.includes(source) ? "region" : "estate";
}

export function getNewsFeedGroupLabel(group: NewsFeedGroupId) {
  return group === "estate" ? "부동산소식" : "지역소식";
}

export function newsFeedRetentionCutoff(now = new Date()): Date {
  return new Date(now.getTime() - NEWS_FEED_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

export function newsFeedNaverCutoff(now = new Date()): Date {
  return new Date(now.getTime() - NEWS_FEED_NAVER_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

export function newsFeedR114Cutoff(now = new Date()): Date {
  return new Date(now.getTime() - NEWS_FEED_R114_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

/** 행정 출처 화면·DB 유지 최소 게시일 = max(수집시작일, 지금−1년) */
export function newsFeedVisibleFrom(now = new Date()): Date {
  const retention = newsFeedRetentionCutoff(now);
  return retention.getTime() > NEWS_FEED_COLLECT_FROM.getTime()
    ? retention
    : NEWS_FEED_COLLECT_FROM;
}

/** 출처별 노출·보관 하한 */
export function newsFeedCutoffForSource(
  source: NewsFeedSourceId | "all",
  now = new Date(),
): Date {
  if (source === "naver") return newsFeedNaverCutoff(now);
  if (source === "r114") return newsFeedR114Cutoff(now);
  return newsFeedVisibleFrom(now);
}

/** Prisma where: 출처·그룹별 보관 기간 반영 */
export function newsFeedVisibleWhere(
  source: NewsFeedSourceKey = "all",
  now = new Date(),
  group?: NewsFeedGroupId,
) {
  const naverFrom = newsFeedNaverCutoff(now);
  const r114From = newsFeedR114Cutoff(now);
  const adminFrom = newsFeedVisibleFrom(now);

  if (source === "naver") {
    return { source: "naver" as const, pubDate: { gte: naverFrom } };
  }
  if (source === "r114") {
    return { source: "r114" as const, pubDate: { gte: r114From } };
  }
  if (source !== "all") {
    return { source, pubDate: { gte: adminFrom } };
  }

  const groupSources = group ? NEWS_FEED_GROUP_SOURCES[group] : null;
  if (groupSources) {
    return {
      OR: groupSources.map((s) => {
        if (s === "naver") return { source: "naver" as const, pubDate: { gte: naverFrom } };
        if (s === "r114") return { source: "r114" as const, pubDate: { gte: r114From } };
        return { source: s, pubDate: { gte: adminFrom } };
      }),
    };
  }

  return {
    OR: [
      { source: "naver" as const, pubDate: { gte: naverFrom } },
      { source: "r114" as const, pubDate: { gte: r114From } },
      {
        source: { notIn: ["naver", "r114"] },
        pubDate: { gte: adminFrom },
      },
    ],
  };
}

export function isNewsFeedPubDateCollectable(
  pubDate: Date,
  source?: NewsFeedSourceId,
): boolean {
  if (Number.isNaN(pubDate.getTime())) return false;
  if (source === "naver") {
    return pubDate.getTime() >= newsFeedNaverCutoff().getTime();
  }
  if (source === "r114") {
    return pubDate.getTime() >= newsFeedR114Cutoff().getTime();
  }
  return pubDate.getTime() >= NEWS_FEED_COLLECT_FROM.getTime();
}

export type NewsFeedSourceMeta = {
  key: NewsFeedSourceId;
  label: string;
  shortLabel: string;
  badgeClass: string;
  listUrl: string;
};

export const NEWS_FEED_SOURCES: NewsFeedSourceMeta[] = [
  {
    key: "naver",
    label: "네이버뉴스",
    shortLabel: "네이버",
    badgeClass: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
    listUrl: "https://land.naver.com/news/headline.naver",
  },
  {
    key: "molit",
    label: "국토교통부",
    shortLabel: "국토부",
    badgeClass: "border-sky-400/40 bg-sky-500/15 text-sky-300",
    listUrl:
      "https://www.molit.go.kr/USR/NEWS/m_71/lst.jsp?search_section=p_sec_2",
  },
  {
    key: "chungnam",
    label: "충남도청",
    shortLabel: "충남",
    badgeClass: "border-amber-400/40 bg-amber-500/15 text-amber-300",
    listUrl:
      "https://www.chungnam.go.kr/cnportal/bbs/B0000488/list.do?menuNo=5100288",
  },
  {
    key: "hongseong",
    label: "홍성군청",
    shortLabel: "홍성",
    badgeClass: "border-orange-400/40 bg-orange-500/15 text-orange-300",
    listUrl:
      "https://www.hongseong.go.kr/bbs/BBSMSTR_000000000841/list.do",
  },
  {
    key: "yesan",
    label: "예산군청",
    shortLabel: "예산",
    badgeClass: "border-lime-400/40 bg-lime-500/15 text-lime-300",
    listUrl: "https://www.yesan.go.kr/",
  },
  {
    key: "rtech",
    label: "부동산테크",
    shortLabel: "R-TECH",
    badgeClass: "border-violet-400/40 bg-violet-500/15 text-violet-300",
    listUrl: "https://rtech.or.kr/portal/info/landInfo.do",
  },
  {
    key: "r114",
    label: "부동산114",
    shortLabel: "R114",
    badgeClass: "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-300",
    listUrl: "https://r114.com/trends/wiki/",
  },
];

/** 부동산114 위키 카테고리 (전체 제외 — 수집은 카테고리별) */
export type R114WikiCategoryId =
  | "all"
  | "sale"
  | "rent"
  | "finance"
  | "subscription"
  | "tax"
  | "auction"
  | "policy"
  | "redevelopment"
  | "commercial"
  | "lifestyle";

export type R114WikiCategoryMeta = {
  id: R114WikiCategoryId;
  label: string;
  listUrl: string;
};

export const R114_WIKI_CATEGORIES: R114WikiCategoryMeta[] = [
  { id: "all", label: "전체", listUrl: "https://r114.com/trends/wiki/all" },
  { id: "sale", label: "매매", listUrl: "https://r114.com/trends/wiki/sale" },
  { id: "rent", label: "전월세", listUrl: "https://r114.com/trends/wiki/rent" },
  { id: "finance", label: "금융", listUrl: "https://r114.com/trends/wiki/finance" },
  {
    id: "subscription",
    label: "청약",
    listUrl: "https://r114.com/trends/wiki/subscription",
  },
  { id: "tax", label: "세금", listUrl: "https://r114.com/trends/wiki/tax" },
  { id: "auction", label: "경매", listUrl: "https://r114.com/trends/wiki/auction" },
  { id: "policy", label: "제도", listUrl: "https://r114.com/trends/wiki/policy" },
  {
    id: "redevelopment",
    label: "정비사업",
    listUrl: "https://r114.com/trends/wiki/redevelopment",
  },
  {
    id: "commercial",
    label: "상업용",
    listUrl: "https://r114.com/trends/wiki/commercial",
  },
  {
    id: "lifestyle",
    label: "생활정보",
    listUrl: "https://r114.com/trends/wiki/lifestyle",
  },
];

export const R114_WIKI_COLLECT_CATEGORIES = R114_WIKI_CATEGORIES.filter(
  (c) => c.id !== "all",
);

export function isR114WikiCategoryId(value: string): value is R114WikiCategoryId {
  return R114_WIKI_CATEGORIES.some((c) => c.id === value);
}

export function getR114WikiCategoryMeta(id: R114WikiCategoryId): R114WikiCategoryMeta {
  return R114_WIKI_CATEGORIES.find((c) => c.id === id) ?? R114_WIKI_CATEGORIES[0];
}

export type NewsFeedSidebarItem = {
  key: NewsFeedSourceKey;
  label: string;
};

export type NewsFeedSidebarGroup = {
  id: NewsFeedGroupId;
  label: string;
  items: NewsFeedSidebarItem[];
};

/** 사이드바 그룹 — 각 그룹의 ‘전체’는 해당 그룹 합계만 */
export const NEWS_FEED_SIDEBAR_GROUPS: NewsFeedSidebarGroup[] = [
  {
    id: "estate",
    label: "부동산소식",
    items: [
      { key: "all", label: "전체" },
      { key: "r114", label: "부동산114" },
      { key: "naver", label: "네이버뉴스" },
      { key: "rtech", label: "부동산테크" },
      { key: "molit", label: "국토교통부" },
    ],
  },
  {
    id: "region",
    label: "지역소식",
    items: [
      { key: "all", label: "전체" },
      { key: "chungnam", label: "충남도청" },
      { key: "hongseong", label: "홍성군청" },
      { key: "yesan", label: "예산군청" },
    ],
  },
];

export const NEWS_FEED_SIDEBAR: { key: NewsFeedSourceKey; label: string }[] = [
  { key: "all", label: "전체" },
  ...NEWS_FEED_SOURCES.map((s) => ({
    key: s.key as NewsFeedSourceKey,
    label: s.label,
  })),
];

const sourceMap = Object.fromEntries(NEWS_FEED_SOURCES.map((s) => [s.key, s])) as Record<
  NewsFeedSourceId,
  NewsFeedSourceMeta
>;

export function getNewsFeedSourceMeta(key: NewsFeedSourceId) {
  return sourceMap[key];
}

export function isNewsFeedSourceId(value: string): value is NewsFeedSourceId {
  return value in sourceMap;
}

export function formatNewsFeedDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/** 그룹 전체: 등록일 최신순, 동일 등록일은 랜덤 */
export function sortGroupAllByDateThenRandom<
  T extends { id: string; pubDate: string | Date },
>(items: T[], seed = Date.now()): T[] {
  const byDate = new Map<string, T[]>();
  for (const row of items) {
    const key = formatNewsFeedDate(row.pubDate) || "_";
    const list = byDate.get(key) ?? [];
    list.push(row);
    byDate.set(key, list);
  }

  const dates = [...byDate.keys()].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  let salt = seed >>> 0;
  const rand = () => {
    salt = (Math.imul(1664525, salt) + 1013904223) >>> 0;
    return salt / 0x100000000;
  };

  const out: T[] = [];
  for (const date of dates) {
    const bucket = [...(byDate.get(date) ?? [])];
    for (let i = bucket.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [bucket[i], bucket[j]] = [bucket[j], bucket[i]];
    }
    out.push(...bucket);
  }
  return out;
}

export type CollectedNewsItem = {
  source: NewsFeedSourceId;
  sourceName: string;
  title: string;
  originUrl: string;
  pubDate: Date;
  imageUrl?: string | null;
  rank?: number | null;
  summary?: string | null;
  press?: string | null;
};

export function parseNewsFeedKeywords(q: string | null | undefined): string[] {
  if (!q?.trim()) return [];
  return q
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function titleMatchesKeywords(title: string, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const t = title.toLowerCase();
  return keywords.some((k) => t.includes(k.toLowerCase()));
}
