import type { NewsFeedItem } from "@prisma/client";
import {
  NEWS_FEED_GROUP_SOURCES,
  NEWS_FEED_SIDEBAR_GROUPS,
  NEWS_FEED_SOURCES,
  newsFeedCutoffForSource,
  newsFeedNaverCutoff,
  newsFeedR114Cutoff,
  newsFeedVisibleFrom,
  type NewsFeedGroupId,
  type NewsFeedSourceId,
  type NewsFeedSourceKey,
} from "@/lib/news-feed";
import { createSupabaseDataClient } from "@/lib/supabase/data-client";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type NewsFeedRow = {
  id: string;
  source: string;
  sourceName: string;
  title: string;
  summary: string;
  press: string;
  originUrl: string;
  imageUrl: string | null;
  rank: number | null;
  pubDate: Date;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export function mapNewsFeedRow(row: Record<string, unknown>): NewsFeedRow {
  return {
    id: String(row.id),
    source: String(row.source ?? ""),
    sourceName: String(row.source_name ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    press: String(row.press ?? ""),
    originUrl: String(row.origin_url ?? ""),
    imageUrl: (row.image_url as string | null) ?? null,
    rank: row.rank == null ? null : Number(row.rank),
    pubDate: new Date(String(row.pub_date ?? Date.now())),
    fetchedAt: new Date(String(row.fetched_at ?? Date.now())),
    createdAt: new Date(String(row.created_at ?? Date.now())),
    updatedAt: new Date(String(row.updated_at ?? Date.now())),
  };
}

function passesVisibleFilter(
  row: NewsFeedRow,
  source: NewsFeedSourceKey,
  group: NewsFeedGroupId | undefined,
  now: Date,
): boolean {
  const naverFrom = newsFeedNaverCutoff(now).getTime();
  const r114From = newsFeedR114Cutoff(now).getTime();
  const adminFrom = newsFeedVisibleFrom(now).getTime();
  const t = row.pubDate.getTime();

  if (source === "naver") return row.source === "naver" && t >= naverFrom;
  if (source === "r114") return row.source === "r114" && t >= r114From;
  if (source !== "all") {
    return row.source === source && t >= adminFrom;
  }

  const allowed = group ? NEWS_FEED_GROUP_SOURCES[group] : null;
  if (allowed && !allowed.includes(row.source as NewsFeedSourceId)) return false;

  if (row.source === "naver") return t >= naverFrom;
  if (row.source === "r114") return t >= r114From;
  return t >= adminFrom;
}

/** 목록 조회 (필터는 클라이언트 측 보관기간 규칙 적용) */
export async function listNewsFeedFromSupabase(opts: {
  source?: NewsFeedSourceKey;
  group?: NewsFeedGroupId;
  now?: Date;
}): Promise<NewsFeedRow[]> {
  const sb = createSupabaseDataClient();
  const source = opts.source ?? "all";
  const now = opts.now ?? new Date();

  let q = sb.from("news_feed_items").select("*").order("pub_date", { ascending: false });

  if (source !== "all") {
    q = q.eq("source", source).gte("pub_date", newsFeedCutoffForSource(source, now).toISOString());
  } else if (opts.group) {
    q = q.in("source", NEWS_FEED_GROUP_SOURCES[opts.group]);
  }

  // 안전 상한 — 이후 JS에서 출처별 컷오프 재필터
  const { data, error } = await q.limit(5000);
  if (error) throw error;

  return (data ?? [])
    .map(mapNewsFeedRow)
    .filter((row) => passesVisibleFilter(row, source, opts.group, now));
}

export async function countNewsFeedBySourceFromSupabase(now = new Date()) {
  const rows = await listNewsFeedFromSupabase({ source: "all", now });
  const bySource: Record<string, number> = {};
  for (const s of NEWS_FEED_SOURCES) bySource[s.key] = 0;
  for (const row of rows) {
    bySource[row.source] = (bySource[row.source] ?? 0) + 1;
  }
  return bySource;
}

export async function getLandingNewsFromSupabase(now = new Date()) {
  const [estate, region] = await Promise.all([
    listNewsFeedFromSupabase({ source: "all", group: "estate", now }),
    listNewsFeedFromSupabase({ source: "all", group: "region", now }),
  ]);
  const estateTop = [...estate].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()).slice(0, 3);
  const regionTop = [...region].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()).slice(0, 2);
  return [...estateTop, ...regionTop] as unknown as NewsFeedItem[];
}

export async function loadAdminNewsHealthFromSupabase() {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("news_feed_items")
    .select("source, pub_date, fetched_at");
  if (error) throw error;

  const now = new Date();
  const rows = (data ?? []).map(mapNewsFeedRow).filter((r) =>
    passesVisibleFilter(r, "all", undefined, now),
  );

  const bySource = new Map<
    string,
    { count: number; lastFetchedAt: Date | null; latestPubDate: Date | null }
  >();
  for (const row of rows) {
    const cur = bySource.get(row.source) ?? {
      count: 0,
      lastFetchedAt: null,
      latestPubDate: null,
    };
    cur.count += 1;
    if (!cur.lastFetchedAt || row.fetchedAt > cur.lastFetchedAt) cur.lastFetchedAt = row.fetchedAt;
    if (!cur.latestPubDate || row.pubDate > cur.latestPubDate) cur.latestPubDate = row.pubDate;
    bySource.set(row.source, cur);
  }
  return bySource;
}

export async function upsertNewsFeedItemsSupabase(
  items: {
    source: string;
    sourceName: string;
    title: string;
    summary?: string | null;
    press?: string | null;
    originUrl: string;
    imageUrl?: string | null;
    rank?: number | null;
    pubDate: Date;
  }[],
) {
  const sb = createSupabaseAdminClient();
  let created = 0;
  let updated = 0;
  const failed: { originUrl: string; error: string }[] = [];

  for (const item of items) {
    try {
      const { data: existing } = await sb
        .from("news_feed_items")
        .select("id, summary, image_url, press")
        .eq("origin_url", item.originUrl)
        .maybeSingle();

      const summary = (item.summary ?? "").trim() || existing?.summary || "";
      const imageUrl = item.imageUrl ?? existing?.image_url ?? null;
      const press = (item.press ?? "").trim() || existing?.press || "";
      const row = {
        source: item.source,
        source_name: item.sourceName,
        title: item.title,
        summary,
        press,
        origin_url: item.originUrl,
        image_url: imageUrl,
        rank: item.rank ?? null,
        pub_date: item.pubDate.toISOString(),
        fetched_at: new Date().toISOString(),
      };

      const { error } = await sb.from("news_feed_items").upsert(row, {
        onConflict: "origin_url",
      });
      if (error) throw error;
      if (existing) updated += 1;
      else created += 1;
    } catch (err) {
      failed.push({
        originUrl: item.originUrl,
        error: err instanceof Error ? err.message : "upsert failed",
      });
    }
  }

  return { created, updated, total: items.length, failed };
}

export async function pruneExpiredNewsFeedItemsSupabase() {
  const sb = createSupabaseAdminClient();
  const naverCutoff = newsFeedNaverCutoff().toISOString();
  const r114Cutoff = newsFeedR114Cutoff().toISOString();
  const adminCutoff = newsFeedVisibleFrom().toISOString();

  const [naver, r114, admin] = await Promise.all([
    sb
      .from("news_feed_items")
      .delete({ count: "exact" })
      .eq("source", "naver")
      .lt("pub_date", naverCutoff),
    sb
      .from("news_feed_items")
      .delete({ count: "exact" })
      .eq("source", "r114")
      .lt("pub_date", r114Cutoff),
    sb
      .from("news_feed_items")
      .delete({ count: "exact" })
      .not("source", "in", "(naver,r114)")
      .lt("pub_date", adminCutoff),
  ]);

  if (naver.error) throw naver.error;
  if (r114.error) throw r114.error;
  if (admin.error) throw admin.error;

  return (naver.count ?? 0) + (r114.count ?? 0) + (admin.count ?? 0);
}

export async function cleanupStaleNewsFeedItemsSupabase() {
  const sb = createSupabaseAdminClient();
  const removed = {
    naverMismatch: 0,
    staleThumbs: 0,
    molitStub: 0,
    chungnamStub: 0,
    hongseongStub: 0,
    hongseongSession: 0,
    rtechStub: 0,
    r114Stub: 0,
  };

  async function deleteMatching(
    source: string,
    predicates: { column: "origin_url" | "title"; contains: string }[],
  ) {
    const { data, error } = await sb
      .from("news_feed_items")
      .select("id, origin_url, title")
      .eq("source", source)
      .limit(2000);
    if (error) throw error;
    const ids = (data ?? [])
      .filter((row) =>
        predicates.some((p) => String(row[p.column] ?? "").includes(p.contains)),
      )
      .map((row) => String(row.id));
    if (ids.length === 0) return 0;
    const { error: delErr, count } = await sb
      .from("news_feed_items")
      .delete({ count: "exact" })
      .in("id", ids);
    if (delErr) throw delErr;
    return count ?? ids.length;
  }

  removed.naverMismatch = await deleteMatching("naver", [
    { column: "origin_url", contains: "0014067001" },
    { column: "origin_url", contains: "0003733706" },
    { column: "origin_url", contains: "0006329006" },
    { column: "origin_url", contains: "0004640745" },
    { column: "title", contains: "내포신도시 아파트 매매가" },
  ]);

  {
    const { data, error } = await sb
      .from("news_feed_items")
      .select("id, image_url")
      .eq("source", "naver")
      .limit(2000);
    if (error) throw error;
    const ids = (data ?? [])
      .filter((row) => String(row.image_url ?? "").includes("type=w860"))
      .map((row) => String(row.id));
    if (ids.length) {
      const { error: upErr, count } = await sb
        .from("news_feed_items")
        .update({ image_url: null }, { count: "exact" })
        .in("id", ids);
      if (upErr) throw upErr;
      removed.staleThumbs = count ?? ids.length;
    }
  }

  removed.molitStub = await deleteMatching("molit", [
    { column: "origin_url", contains: "chanceRef" },
    { column: "origin_url", contains: "lst.jsp" },
  ]);
  removed.chungnamStub = await deleteMatching("chungnam", [
    { column: "origin_url", contains: "chanceRef" },
    { column: "origin_url", contains: "cnmedia" },
  ]);
  removed.hongseongStub = await deleteMatching("hongseong", [
    { column: "origin_url", contains: "chanceRef" },
  ]);
  removed.hongseongSession = await deleteMatching("hongseong", [
    { column: "title", contains: "세션 만료" },
  ]);
  removed.rtechStub = await deleteMatching("rtech", [
    { column: "origin_url", contains: "chanceRef" },
    { column: "origin_url", contains: "rtech.or.kr/main" },
  ]);
  {
    const { data, error } = await sb
      .from("news_feed_items")
      .select("id, origin_url")
      .eq("source", "r114")
      .limit(2000);
    if (error) throw error;
    const ids = (data ?? [])
      .filter((row) => {
        const url = String(row.origin_url ?? "");
        return url.includes("chanceRef") || !url.includes("/trends/wiki/");
      })
      .map((row) => String(row.id));
    if (ids.length) {
      const { error: delErr, count } = await sb
        .from("news_feed_items")
        .delete({ count: "exact" })
        .in("id", ids);
      if (delErr) throw delErr;
      removed.r114Stub = count ?? ids.length;
    }
  }

  return removed;
}

/** 페이지/API 공통 목록 응답 */
export async function getNewsFeedListPayloadFromSupabase(opts: {
  source: NewsFeedSourceKey;
  group: NewsFeedGroupId;
  page?: number;
  pageSize?: number;
  keywords?: string[];
  r114Category?: string | null;
  r114CategoryLabel?: string | null;
  formatDate: (d: Date) => string;
  titleMatches: (text: string, keywords: string[]) => boolean;
  sortGroupAll: <T extends { id: string; pubDate: Date }>(
    rows: T[],
    seed: number,
  ) => T[];
}) {
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 12;
  const keywords = opts.keywords ?? [];

  let rows = await listNewsFeedFromSupabase({
    source: opts.source,
    group: opts.group,
  });

  if (opts.r114Category) {
    const path = `/trends/wiki/${opts.r114Category}/`;
    const label = opts.r114CategoryLabel ?? "";
    rows = rows.filter(
      (row) =>
        row.originUrl.includes(path) || (label && row.press === label),
    );
  }

  if (keywords.length) {
    rows = rows.filter((row) =>
      opts.titleMatches(`${row.title} ${row.summary ?? ""}`, keywords),
    );
  }

  const richSources = new Set([
    "naver",
    "molit",
    "chungnam",
    "hongseong",
    "yesan",
    "rtech",
    "r114",
  ]);
  if (opts.source !== "all" && richSources.has(opts.source)) {
    rows = [...rows].sort((a, b) => {
      const ra = a.rank ?? 9999;
      const rb = b.rank ?? 9999;
      if (ra !== rb) return ra - rb;
      return b.pubDate.getTime() - a.pubDate.getTime();
    });
  }

  const ordered =
    opts.source === "all"
      ? opts.sortGroupAll(rows, Date.now())
      : rows;

  const total = ordered.length;
  const pageRows = ordered.slice((page - 1) * pageSize, page * pageSize);
  const bySource = await countNewsFeedBySourceFromSupabase();

  const groupCounts: Record<NewsFeedGroupId, Record<string, number>> = {
    estate: { all: 0 },
    region: { all: 0 },
  };
  for (const g of NEWS_FEED_SIDEBAR_GROUPS) {
    for (const item of g.items) {
      if (item.key === "all") continue;
      const n = bySource[item.key] ?? 0;
      groupCounts[g.id][item.key] = n;
      groupCounts[g.id].all += n;
    }
  }

  const counts: Record<string, number> = { all: 0, ...bySource };
  for (const s of NEWS_FEED_SOURCES) counts.all += bySource[s.key] ?? 0;

  return {
    items: pageRows.map((row) => ({
      id: row.id,
      source: row.source,
      sourceName: row.sourceName,
      title: row.title,
      summary: row.summary,
      press: row.press,
      originUrl: row.originUrl,
      imageUrl: row.imageUrl,
      rank: row.rank,
      pubDate: opts.formatDate(row.pubDate),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize) || 1),
    counts,
    groupCounts,
    group: opts.group,
  };
}

export async function migrateNewsFeedRowsToSupabase(
  rows: {
    id: string;
    source: string;
    sourceName: string;
    title: string;
    summary: string;
    press: string;
    originUrl: string;
    imageUrl: string | null;
    rank: number | null;
    pubDate: Date;
    fetchedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }[],
) {
  const sb = createSupabaseAdminClient();
  const payload = rows.map((r) => ({
    id: r.id,
    source: r.source,
    source_name: r.sourceName,
    title: r.title,
    summary: r.summary ?? "",
    press: r.press ?? "",
    origin_url: r.originUrl,
    image_url: r.imageUrl,
    rank: r.rank,
    pub_date: r.pubDate.toISOString(),
    fetched_at: r.fetchedAt.toISOString(),
    created_at: r.createdAt.toISOString(),
    updated_at: r.updatedAt.toISOString(),
  }));

  const chunk = 80;
  let ok = 0;
  for (let i = 0; i < payload.length; i += chunk) {
    const part = payload.slice(i, i + chunk);
    const { error } = await sb.from("news_feed_items").upsert(part, {
      onConflict: "origin_url",
    });
    if (error) throw error;
    ok += part.length;
  }
  return ok;
}
