import { NextResponse } from "next/server";
import {
  NEWS_FEED_SOURCES,
  isNewsFeedSourceId,
  type NewsFeedSourceId,
} from "@/lib/news-feed";
import { runNewsFeedCollectionForSources } from "@/lib/news-feed-service";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    let sources: NewsFeedSourceId[] | undefined;
    try {
      const body = (await req.json()) as { sources?: unknown };
      if (Array.isArray(body.sources)) {
        const parsed = body.sources.filter(
          (s): s is NewsFeedSourceId => typeof s === "string" && isNewsFeedSourceId(s),
        );
        if (parsed.length) sources = parsed;
      }
    } catch {
      // empty body = collect all
    }

    const keys = sources ?? NEWS_FEED_SOURCES.map((s) => s.key);
    const result = await runNewsFeedCollectionForSources(keys);
    return NextResponse.json(
      {
        ...result,
      },
      { status: result.ok ? 200 : 207 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "수집 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
