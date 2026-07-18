import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { NewsFeedClient } from "@/components/news/NewsFeedClient";
import { UserBottomNav } from "@/components/user/UserShell";
import {
  NEWS_FEED_GROUP_SOURCES,
  NEWS_FEED_PAGE_SIZE,
  NEWS_FEED_SIDEBAR_GROUPS,
  NEWS_FEED_SOURCES,
  formatNewsFeedDate,
  isNewsFeedGroupId,
  isNewsFeedSourceId,
  newsFeedGroupForSource,
  newsFeedVisibleWhere,
  sortGroupAllByDateThenRandom,
  titleMatchesKeywords,
  type NewsFeedGroupId,
  type NewsFeedSourceKey,
} from "@/lib/news-feed";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";

export const metadata: Metadata = {
  title: "부동산·지역소식 | 찬스부동산 경매중개",
  description: "네이버·국토부·충남도·홍성군·예산군·부동산테크·부동산114 소식 모음",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ source?: string; group?: string }>;

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const initialSource: NewsFeedSourceKey =
    sp.source && isNewsFeedSourceId(sp.source) ? sp.source : "all";

  let initialGroup: NewsFeedGroupId = "estate";
  if (sp.group && isNewsFeedGroupId(sp.group)) {
    initialGroup = sp.group;
  } else if (initialSource !== "all") {
    initialGroup = newsFeedGroupForSource(initialSource);
  }
  if (
    initialSource !== "all" &&
    !NEWS_FEED_GROUP_SOURCES[initialGroup].includes(initialSource)
  ) {
    initialGroup = newsFeedGroupForSource(initialSource);
  }

  const where = newsFeedVisibleWhere(initialSource, new Date(), initialGroup);
  const emptyBySource: Record<string, number> = {};
  for (const s of NEWS_FEED_SOURCES) emptyBySource[s.key] = 0;
  const emptyGroupCounts: Record<NewsFeedGroupId, Record<string, number>> = {
    estate: { all: 0 },
    region: { all: 0 },
  };
  for (const g of NEWS_FEED_SIDEBAR_GROUPS) {
    for (const item of g.items) {
      if (item.key === "all") continue;
      emptyGroupCounts[g.id][item.key] = 0;
    }
  }

  const initial = await withDbFallback(
    "news-page",
    async () => {
      if (isSupabaseEnabled()) {
        const { getNewsFeedListPayloadFromSupabase } = await import(
          "@/lib/supabase/repos/news-feed"
        );
        return getNewsFeedListPayloadFromSupabase({
          source: initialSource,
          group: initialGroup,
          page: 1,
          pageSize: NEWS_FEED_PAGE_SIZE,
          formatDate: formatNewsFeedDate,
          titleMatches: titleMatchesKeywords,
          sortGroupAll: sortGroupAllByDateThenRandom,
        });
      }

      const [allRows, grouped] = await Promise.all([
        prisma.newsFeedItem.findMany({
          where,
          orderBy:
            initialSource === "naver" ||
            initialSource === "molit" ||
            initialSource === "chungnam" ||
            initialSource === "hongseong" ||
            initialSource === "yesan" ||
            initialSource === "rtech" ||
            initialSource === "r114"
              ? [{ rank: "asc" }, { pubDate: "desc" }]
              : [{ pubDate: "desc" }],
        }),
        prisma.newsFeedItem.groupBy({
          by: ["source"],
          where: newsFeedVisibleWhere("all"),
          _count: { _all: true },
        }),
      ]);

      const ordered =
        initialSource === "all"
          ? sortGroupAllByDateThenRandom(allRows, Date.now())
          : allRows;
      const total = ordered.length;
      const rows = ordered.slice(0, NEWS_FEED_PAGE_SIZE);

      const bySource: Record<string, number> = { ...emptyBySource };
      for (const g of grouped) bySource[g.source] = g._count._all;

      const counts: Record<string, number> = { all: 0, ...bySource };
      for (const s of NEWS_FEED_SOURCES) counts.all += bySource[s.key] ?? 0;

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

      return {
        items: rows.map((row) => ({
          id: row.id,
          source: row.source,
          sourceName: row.sourceName,
          title: row.title,
          summary: row.summary,
          press: row.press,
          originUrl: row.originUrl,
          imageUrl: row.imageUrl,
          rank: row.rank,
          pubDate: formatNewsFeedDate(row.pubDate),
        })),
        total,
        page: 1,
        pageSize: NEWS_FEED_PAGE_SIZE,
        totalPages: Math.max(1, Math.ceil(total / NEWS_FEED_PAGE_SIZE)),
        counts,
        groupCounts,
        group: initialGroup,
      };
    },
    {
      items: [],
      total: 0,
      page: 1,
      pageSize: NEWS_FEED_PAGE_SIZE,
      totalPages: 1,
      counts: { all: 0, ...emptyBySource },
      groupCounts: emptyGroupCounts,
      group: initialGroup,
    },
  );

  return (
    <LandingShell>
      <AnalyticsPageView menuKey="news" />
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10">
          <NewsFeedClient
            initial={initial}
            initialSource={initialSource}
            initialGroup={initialGroup}
          />
        </div>
      </div>
      <LandingFooter />
      <UserBottomNav />
    </LandingShell>
  );
}
