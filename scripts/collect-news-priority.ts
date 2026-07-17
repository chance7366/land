import { PrismaClient } from "@prisma/client";
import { collectSelectedSources } from "../src/lib/news-feed-collect";
import {
  pruneExpiredNewsFeedItems,
  upsertNewsFeedItems,
} from "../src/lib/news-feed-service";

async function main() {
  console.log("[priority] prune…");
  console.log("[priority] pruned", await pruneExpiredNewsFeedItems());

  console.log("[priority] collect naver/molit/chungnam/hongseong…");
  const { items, perSource } = await collectSelectedSources([
    "naver",
    "molit",
    "chungnam",
    "hongseong",
  ]);
  console.log("[priority] perSource", perSource);

  const failed = Object.entries(perSource).filter(([, v]) => !v.ok);
  if (failed.length === Object.keys(perSource).length) {
    console.error("[priority] all sources failed", perSource);
    process.exit(1);
  }

  try {
    const result = await upsertNewsFeedItems(items);
    console.log("[priority] upsert", result);
    if (result.failed.length) {
      console.warn("[priority] upsert failures", result.failed.slice(0, 10));
    }
  } catch (err) {
    console.error("[priority] upsert crashed", err);
    process.exit(1);
  }

  const p = new PrismaClient();
  for (const source of ["naver", "molit", "chungnam", "hongseong"] as const) {
    const count = await p.newsFeedItem.count({ where: { source } });
    const oldest = await p.newsFeedItem.findFirst({
      where: { source },
      orderBy: { pubDate: "asc" },
      select: { pubDate: true },
    });
    const newest = await p.newsFeedItem.findFirst({
      where: { source },
      orderBy: { pubDate: "desc" },
      select: { pubDate: true },
    });
    console.log(source, {
      count,
      oldest: oldest?.pubDate?.toISOString().slice(0, 10) ?? null,
      newest: newest?.pubDate?.toISOString().slice(0, 10) ?? null,
    });
  }
  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
