/**
 * 당일(KST) 부동산소식 기사 — 네이버·r114·rtech
 */

import {
  dateKeyInSeoul,
  seoulDateKey,
  type DigestNewsItem,
} from "@/lib/news-digest-email";
import { prisma } from "@/lib/prisma";
import { DEFAULT_NEWS_SOURCES } from "@/lib/subscription";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { listNewsFeedFromSupabase } from "@/lib/supabase/repos/news-feed";

export type TodayNewsArticle = DigestNewsItem;

const TODAY_SOURCES = [...DEFAULT_NEWS_SOURCES] as string[];

/** 당일(KST) naver · r114 · rtech 기사 */
export async function loadTodayArticles(
  dateKey: string = seoulDateKey(),
): Promise<TodayNewsArticle[]> {
  if (isSupabaseEnabled()) {
    const rows = await listNewsFeedFromSupabase({ source: "all", group: "estate" });
    return rows
      .filter((r) => TODAY_SOURCES.includes(r.source))
      .filter((r) => dateKeyInSeoul(r.pubDate) === dateKey)
      .map((r) => ({
        id: r.id,
        source: r.source,
        sourceName: r.sourceName,
        title: r.title,
        summary: r.summary,
        press: r.press,
        originUrl: r.originUrl,
        pubDate: r.pubDate,
      }));
  }

  const dayStart = new Date(`${dateKey}T00:00:00+09:00`);
  const dayEnd = new Date(`${dateKey}T23:59:59.999+09:00`);
  const rows = await prisma.newsFeedItem.findMany({
    where: {
      source: { in: TODAY_SOURCES },
      pubDate: { gte: dayStart, lte: dayEnd },
    },
    orderBy: { pubDate: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    source: r.source,
    sourceName: r.sourceName,
    title: r.title,
    summary: r.summary,
    press: r.press,
    originUrl: r.originUrl,
    pubDate: r.pubDate,
  }));
}
