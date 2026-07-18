import { prisma } from "@/lib/prisma";
import type { CollectedNewsItem, NewsFeedSourceId } from "@/lib/news-feed";
import {
  NEWS_FEED_SOURCES,
  isNewsFeedPubDateCollectable,
  newsFeedCutoffForSource,
  newsFeedNaverCutoff,
  newsFeedR114Cutoff,
  newsFeedVisibleFrom,
} from "@/lib/news-feed";
import { collectAllSources, collectSelectedSources } from "@/lib/news-feed-collect";
import { isSupabaseEnabled } from "@/lib/supabase/config";

/** 출처별 보관기간 밖 행 삭제 — 네이버·r114 30일, 행정 출처 1년 */
export async function pruneExpiredNewsFeedItems() {
  if (isSupabaseEnabled()) {
    const { pruneExpiredNewsFeedItemsSupabase } = await import(
      "@/lib/supabase/repos/news-feed"
    );
    return pruneExpiredNewsFeedItemsSupabase();
  }

  const naverCutoff = newsFeedNaverCutoff();
  const r114Cutoff = newsFeedR114Cutoff();
  const adminCutoff = newsFeedVisibleFrom();

  const [naver, r114, admin] = await Promise.all([
    prisma.newsFeedItem.deleteMany({
      where: { source: "naver", pubDate: { lt: naverCutoff } },
    }),
    prisma.newsFeedItem.deleteMany({
      where: { source: "r114", pubDate: { lt: r114Cutoff } },
    }),
    prisma.newsFeedItem.deleteMany({
      where: {
        source: { notIn: ["naver", "r114"] },
        pubDate: { lt: adminCutoff },
      },
    }),
  ]);

  return naver.count + r114.count + admin.count;
}

/**
 * 알려진 불량 행만 제거. 폴백(목업) upsert 금지 — 빈 출처는 마지막 정상 데이터 유지.
 * 수집(cron/admin) 경로에서만 호출.
 */
export async function cleanupStaleNewsFeedItems() {
  if (isSupabaseEnabled()) {
    const { cleanupStaleNewsFeedItemsSupabase } = await import(
      "@/lib/supabase/repos/news-feed"
    );
    return cleanupStaleNewsFeedItemsSupabase();
  }

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

  // 구 샘플 URL·제목만 개별 삭제 (출처 전체 wipe 금지)
  const naverBad = await prisma.newsFeedItem.deleteMany({
    where: {
      source: "naver",
      OR: [
        { originUrl: { contains: "0014067001" } },
        { originUrl: { contains: "0003733706" } },
        { originUrl: { contains: "0006329006" } },
        { originUrl: { contains: "0004640745" } },
        { title: { contains: "내포신도시 아파트 매매가" } },
      ],
    },
  });
  removed.naverMismatch = naverBad.count;

  const thumbs = await prisma.newsFeedItem.updateMany({
    where: { source: "naver", imageUrl: { contains: "type=w860" } },
    data: { imageUrl: null },
  });
  removed.staleThumbs = thumbs.count;

  const molit = await prisma.newsFeedItem.deleteMany({
    where: {
      source: "molit",
      OR: [
        { originUrl: { contains: "chanceRef" } },
        { originUrl: { contains: "lst.jsp" } },
      ],
    },
  });
  removed.molitStub = molit.count;

  const chungnam = await prisma.newsFeedItem.deleteMany({
    where: {
      source: "chungnam",
      OR: [
        { originUrl: { contains: "chanceRef" } },
        { originUrl: { contains: "cnmedia" } },
      ],
    },
  });
  removed.chungnamStub = chungnam.count;

  const hongseongStub = await prisma.newsFeedItem.deleteMany({
    where: {
      source: "hongseong",
      originUrl: { contains: "chanceRef" },
    },
  });
  removed.hongseongStub = hongseongStub.count;

  const hongseongSession = await prisma.newsFeedItem.deleteMany({
    where: { source: "hongseong", title: { contains: "세션 만료" } },
  });
  removed.hongseongSession = hongseongSession.count;

  const rtech = await prisma.newsFeedItem.deleteMany({
    where: {
      source: "rtech",
      OR: [
        { originUrl: { contains: "chanceRef" } },
        { originUrl: { contains: "rtech.or.kr/main" } },
      ],
    },
  });
  removed.rtechStub = rtech.count;

  const r114 = await prisma.newsFeedItem.deleteMany({
    where: {
      source: "r114",
      OR: [
        { originUrl: { contains: "chanceRef" } },
        { NOT: { originUrl: { contains: "/trends/wiki/" } } },
      ],
    },
  });
  removed.r114Stub = r114.count;

  return removed;
}

/** @deprecated 읽기 경로 호출 금지. cleanupStaleNewsFeedItems 사용 */
export async function ensureNewsFeedConsistency() {
  await pruneExpiredNewsFeedItems();
  await cleanupStaleNewsFeedItems();
}

export async function upsertNewsFeedItems(items: CollectedNewsItem[]) {
  const filtered = items.filter((item) => {
    if (!isNewsFeedPubDateCollectable(item.pubDate, item.source)) return false;
    const cutoff = newsFeedCutoffForSource(item.source);
    return item.pubDate.getTime() >= cutoff.getTime();
  });

  if (isSupabaseEnabled()) {
    const { upsertNewsFeedItemsSupabase } = await import(
      "@/lib/supabase/repos/news-feed"
    );
    return upsertNewsFeedItemsSupabase(filtered);
  }

  let created = 0;
  let updated = 0;
  const failed: { originUrl: string; error: string }[] = [];

  for (const item of filtered) {
    try {
      const existing = await prisma.newsFeedItem.findUnique({
        where: { originUrl: item.originUrl },
        select: { id: true, summary: true, imageUrl: true, press: true },
      });

      const summary =
        (item.summary ?? "").trim() || existing?.summary || "";
      const imageUrl = item.imageUrl ?? existing?.imageUrl ?? null;
      const press = (item.press ?? "").trim() || existing?.press || "";

      await prisma.newsFeedItem.upsert({
        where: { originUrl: item.originUrl },
        create: {
          source: item.source,
          sourceName: item.sourceName,
          title: item.title,
          summary,
          press,
          originUrl: item.originUrl,
          imageUrl,
          rank: item.rank ?? null,
          pubDate: item.pubDate,
          fetchedAt: new Date(),
        },
        update: {
          title: item.title,
          summary,
          press,
          sourceName: item.sourceName,
          imageUrl,
          rank: item.rank ?? null,
          pubDate: item.pubDate,
          fetchedAt: new Date(),
        },
      });

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

export async function runNewsFeedCollection() {
  return runNewsFeedCollectionForSources(NEWS_FEED_SOURCES.map((s) => s.key));
}

/** 전체 또는 선택 출처만 수집 */
export async function runNewsFeedCollectionForSources(keys: NewsFeedSourceId[]) {
  const unique = [...new Set(keys)];
  const allKeys = NEWS_FEED_SOURCES.map((s) => s.key);
  const isFull = unique.length >= allKeys.length && allKeys.every((k) => unique.includes(k));

  const pruned = isFull ? await pruneExpiredNewsFeedItems() : 0;
  const cleaned = await cleanupStaleNewsFeedItems();
  const { items, perSource } = isFull
    ? await collectAllSources()
    : await collectSelectedSources(unique);
  const result = await upsertNewsFeedItems(items);

  const sourceEntries = Object.entries(perSource);
  const failedSources = sourceEntries.filter(([, v]) => !v.ok);
  const ok = failedSources.length === 0 && result.failed.length === 0;

  return {
    ...result,
    pruned,
    cleaned,
    perSource,
    ok,
    failedSources: failedSources.map(([k, v]) => ({ source: k, error: v.error })),
  };
}
