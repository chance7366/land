import type { AdminNewsHealthRow } from "@/lib/admin-news-health";

export type {
  AdminNewsHealthRow,
  SourceHealthStatus,
} from "@/lib/admin-news-health";

export {
  HEALTH_STATUS_META,
  evaluateSourceHealth,
  formatRelativeKo,
  rowsByGroup,
  summarizeHealth,
} from "@/lib/admin-news-health";

const HOUR = 60 * 60 * 1000;

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * HOUR).toISOString();
}

function daysAgoDate(d: number): string {
  const t = new Date();
  t.setDate(t.getDate() - d);
  return t.toISOString().slice(0, 10);
}

/** 목업용 샘플 — 정상/주의/실패 혼합 */
export const ADMIN_NEWS_HEALTH_SAMPLE: AdminNewsHealthRow[] = [
  {
    source: "r114",
    label: "부동산114",
    shortLabel: "R114",
    group: "estate",
    userPath: "/news?source=r114",
    itemCount: 70,
    lastFetchedAt: hoursAgo(2),
    latestPubDate: daysAgoDate(0),
    lastCollectFailed: false,
  },
  {
    source: "naver",
    label: "네이버뉴스",
    shortLabel: "네이버",
    group: "estate",
    userPath: "/news?source=naver",
    itemCount: 40,
    lastFetchedAt: hoursAgo(2),
    latestPubDate: daysAgoDate(0),
    lastCollectFailed: false,
  },
  {
    source: "rtech",
    label: "부동산테크",
    shortLabel: "R-TECH",
    group: "estate",
    userPath: "/news?source=rtech",
    itemCount: 3783,
    lastFetchedAt: hoursAgo(2),
    latestPubDate: daysAgoDate(1),
    lastCollectFailed: false,
  },
  {
    source: "molit",
    label: "국토교통부",
    shortLabel: "국토부",
    group: "estate",
    userPath: "/news?source=molit",
    itemCount: 94,
    lastFetchedAt: hoursAgo(30),
    latestPubDate: daysAgoDate(2),
    lastCollectFailed: false,
  },
  {
    source: "chungnam",
    label: "충남도청",
    shortLabel: "충남",
    group: "region",
    userPath: "/news?source=chungnam",
    itemCount: 245,
    lastFetchedAt: hoursAgo(2),
    latestPubDate: daysAgoDate(0),
    lastCollectFailed: false,
  },
  {
    source: "hongseong",
    label: "홍성군청",
    shortLabel: "홍성",
    group: "region",
    userPath: "/news?source=hongseong",
    itemCount: 351,
    lastFetchedAt: hoursAgo(50),
    latestPubDate: daysAgoDate(3),
    lastCollectFailed: true,
    lastError: "세션 만료 · 목록 파싱 실패",
  },
  {
    source: "yesan",
    label: "예산군청",
    shortLabel: "예산",
    group: "region",
    userPath: "/news?source=yesan",
    itemCount: 0,
    lastFetchedAt: hoursAgo(2),
    latestPubDate: null,
    lastCollectFailed: false,
  },
];
