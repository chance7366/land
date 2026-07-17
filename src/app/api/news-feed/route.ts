import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  NEWS_FEED_GROUP_SOURCES,
  NEWS_FEED_PAGE_SIZE,
  NEWS_FEED_SOURCES,
  NEWS_FEED_SIDEBAR_GROUPS,
  formatNewsFeedDate,
  getR114WikiCategoryMeta,
  isNewsFeedGroupId,
  isNewsFeedSourceId,
  isR114WikiCategoryId,
  newsFeedGroupForSource,
  newsFeedVisibleWhere,
  parseNewsFeedKeywords,
  sortGroupAllByDateThenRandom,
  titleMatchesKeywords,
  type NewsFeedGroupId,
} from "@/lib/news-feed";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const sourceParam = searchParams.get("source") ?? "all";
    const groupParam = searchParams.get("group") ?? "";
    const categoryParam = searchParams.get("category") ?? "all";
    const keywords = parseNewsFeedKeywords(searchParams.get("q"));
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, Number(searchParams.get("pageSize") ?? String(NEWS_FEED_PAGE_SIZE)) || NEWS_FEED_PAGE_SIZE),
    );

    const sourceKey =
      sourceParam !== "all" && isNewsFeedSourceId(sourceParam) ? sourceParam : "all";

    let group: NewsFeedGroupId = "estate";
    if (isNewsFeedGroupId(groupParam)) {
      group = groupParam;
    } else if (sourceKey !== "all") {
      group = newsFeedGroupForSource(sourceKey);
    }

    if (
      sourceKey !== "all" &&
      !NEWS_FEED_GROUP_SOURCES[group].includes(sourceKey)
    ) {
      group = newsFeedGroupForSource(sourceKey);
    }

    const sourceFilter = newsFeedVisibleWhere(sourceKey, new Date(), group);

    const r114Category =
      sourceKey === "r114" &&
      categoryParam !== "all" &&
      isR114WikiCategoryId(categoryParam)
        ? categoryParam
        : null;

    const where =
      r114Category != null
        ? {
            AND: [
              sourceFilter,
              {
                OR: [
                  { originUrl: { contains: `/trends/wiki/${r114Category}/` } },
                  { press: getR114WikiCategoryMeta(r114Category).label },
                ],
              },
            ],
          }
        : sourceFilter;

    const richSources = new Set([
      "naver",
      "molit",
      "chungnam",
      "hongseong",
      "yesan",
      "rtech",
      "r114",
    ]);
    const orderBy =
      sourceKey !== "all" && richSources.has(sourceKey)
        ? ([{ rank: "asc" as const }, { pubDate: "desc" as const }] as const)
        : ([{ pubDate: "desc" as const }] as const);

    const [grouped, allMatching] = await Promise.all([
      prisma.newsFeedItem.groupBy({
        by: ["source"],
        where: newsFeedVisibleWhere("all"),
        _count: { _all: true },
      }),
      prisma.newsFeedItem.findMany({
        where,
        orderBy: [...orderBy],
      }),
    ]);

    const filtered = keywords.length
      ? allMatching.filter((row) =>
          titleMatchesKeywords(`${row.title} ${row.summary ?? ""}`, keywords),
        )
      : allMatching;

    // 그룹 전체: 등록일 최신순 + 동일일은 랜덤 (출처 순 고정 방지)
    const ordered =
      sourceKey === "all"
        ? sortGroupAllByDateThenRandom(filtered, Date.now())
        : filtered;

    const total = ordered.length;
    const rows = ordered.slice((page - 1) * pageSize, page * pageSize);

    const bySource: Record<string, number> = {};
    for (const s of NEWS_FEED_SOURCES) bySource[s.key] = 0;
    for (const g of grouped) {
      bySource[g.source] = g._count._all;
    }

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

    return NextResponse.json({
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
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize) || 1),
      counts,
      groupCounts,
      group,
      keywords,
      category: r114Category ?? "all",
    });
  } catch (err) {
    console.error("[api/news-feed]", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "뉴스 피드를 불러오지 못했습니다.",
        items: [],
        total: 0,
        page: 1,
        pageSize: NEWS_FEED_PAGE_SIZE,
        totalPages: 1,
        counts: { all: 0 },
        groupCounts: { estate: { all: 0 }, region: { all: 0 } },
        group: "estate",
        keywords: [],
        category: "all",
      },
      { status: 500 },
    );
  }
}
