import { PrismaClient } from "@prisma/client";
import { collectSelectedSources } from "../src/lib/news-feed-collect";
import {
  cleanupStaleNewsFeedItems,
  pruneExpiredNewsFeedItems,
  upsertNewsFeedItems,
} from "../src/lib/news-feed-service";

async function main() {
  console.log("[r114] prune…", await pruneExpiredNewsFeedItems());
  console.log("[r114] cleanup…", await cleanupStaleNewsFeedItems());

  const { items, perSource } = await collectSelectedSources(["r114"]);
  console.log("[r114] perSource", perSource);
  console.log("[r114] items", items.length);
  console.log(
    "[r114] sample",
    items.slice(0, 3).map((i) => ({
      title: i.title,
      press: i.press,
      url: i.originUrl,
      date: i.pubDate.toISOString().slice(0, 10),
    })),
  );

  if (!perSource.r114?.ok) {
    console.error("[r114] collect failed", perSource);
    process.exit(1);
  }

  const result = await upsertNewsFeedItems(items);
  console.log("[r114] upsert", result);

  const p = new PrismaClient();
  const count = await p.newsFeedItem.count({ where: { source: "r114" } });
  const byPress = await p.newsFeedItem.groupBy({
    by: ["press"],
    where: { source: "r114" },
    _count: { _all: true },
  });
  console.log("[r114] db count", count, byPress);
  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
