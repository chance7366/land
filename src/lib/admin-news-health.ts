import {
  NEWS_FEED_SIDEBAR_GROUPS,
  NEWS_FEED_SOURCES,
  getNewsFeedSourceMeta,
  newsFeedGroupForSource,
  newsFeedVisibleWhere,
  type NewsFeedGroupId,
  type NewsFeedSourceId,
} from "@/lib/news-feed";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";

export type SourceHealthStatus = "ok" | "warn" | "fail";

export type AdminNewsHealthRow = {
  source: NewsFeedSourceId;
  label: string;
  shortLabel: string;
  group: NewsFeedGroupId;
  userPath: string;
  itemCount: number;
  /** ISO — null if never collected */
  lastFetchedAt: string | null;
  /** YYYY-MM-DD of newest article */
  latestPubDate: string | null;
  lastCollectFailed: boolean;
  lastError?: string;
};

const HOUR = 60 * 60 * 1000;

export function evaluateSourceHealth(row: AdminNewsHealthRow, now = Date.now()): SourceHealthStatus {
  if (row.lastCollectFailed) return "fail";
  if (!row.lastFetchedAt) return "fail";
  const ageMs = now - new Date(row.lastFetchedAt).getTime();
  const ageH = ageMs / HOUR;
  if (row.itemCount < 1) return "warn";
  if (ageH > 48) return "fail";
  if (ageH > 24) return "warn";
  return "ok";
}

export const HEALTH_STATUS_META: Record<
  SourceHealthStatus,
  { label: string; className: string; dot: string }
> = {
  ok: {
    label: "정상",
    className: "border-emerald-400/35 bg-emerald-500/10 text-emerald-200",
    dot: "bg-emerald-400",
  },
  warn: {
    label: "주의",
    className: "border-amber-400/35 bg-amber-500/10 text-amber-100",
    dot: "bg-amber-400",
  },
  fail: {
    label: "실패",
    className: "border-red-400/35 bg-red-500/10 text-red-200",
    dot: "bg-red-400",
  },
};

export function summarizeHealth(rows: AdminNewsHealthRow[]) {
  const counts = { ok: 0, warn: 0, fail: 0 };
  for (const row of rows) {
    counts[evaluateSourceHealth(row)] += 1;
  }
  return counts;
}

export function rowsByGroup(rows: AdminNewsHealthRow[], group: NewsFeedGroupId) {
  const order = NEWS_FEED_SIDEBAR_GROUPS.find((g) => g.id === group)
    ?.items.map((i) => i.key)
    .filter((k): k is NewsFeedSourceId => k !== "all");
  const map = new Map(rows.filter((r) => r.group === group).map((r) => [r.source, r]));
  if (!order) return rows.filter((r) => r.group === group);
  return order.map((k) => map.get(k)).filter(Boolean) as AdminNewsHealthRow[];
}

export function formatRelativeKo(iso: string | null, now = Date.now()): string {
  if (!iso) return "기록 없음";
  const diff = Math.max(0, now - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

function emptyRow(source: NewsFeedSourceId): AdminNewsHealthRow {
  const meta = getNewsFeedSourceMeta(source);
  return {
    source,
    label: meta.label,
    shortLabel: meta.shortLabel,
    group: newsFeedGroupForSource(source),
    userPath: `/news?source=${source}`,
    itemCount: 0,
    lastFetchedAt: null,
    latestPubDate: null,
    lastCollectFailed: false,
  };
}

/** DB 기준 출처별 수집 상태 (기사 본문 없음) */
export async function loadAdminNewsHealthRows(): Promise<AdminNewsHealthRow[]> {
  if (isSupabaseEnabled()) {
    const { loadAdminNewsHealthFromSupabase } = await import(
      "@/lib/supabase/repos/news-feed"
    );
    const bySource = await loadAdminNewsHealthFromSupabase();
    return NEWS_FEED_SOURCES.map((s) => {
      const base = emptyRow(s.key);
      const hit = bySource.get(s.key);
      if (!hit) return base;
      return {
        ...base,
        itemCount: hit.count,
        lastFetchedAt: hit.lastFetchedAt?.toISOString() ?? null,
        latestPubDate: hit.latestPubDate
          ? hit.latestPubDate.toISOString().slice(0, 10)
          : null,
      };
    });
  }

  const grouped = await prisma.newsFeedItem.groupBy({
    by: ["source"],
    where: newsFeedVisibleWhere("all"),
    _count: { _all: true },
    _max: { fetchedAt: true, pubDate: true },
  });

  const bySource = new Map(
    grouped.map((g) => [
      g.source,
      {
        count: g._count._all,
        lastFetchedAt: g._max.fetchedAt,
        latestPubDate: g._max.pubDate,
      },
    ]),
  );

  return NEWS_FEED_SOURCES.map((s) => {
    const base = emptyRow(s.key);
    const hit = bySource.get(s.key);
    if (!hit) return base;
    return {
      ...base,
      itemCount: hit.count,
      lastFetchedAt: hit.lastFetchedAt?.toISOString() ?? null,
      latestPubDate: hit.latestPubDate
        ? hit.latestPubDate.toISOString().slice(0, 10)
        : null,
    };
  });
}
