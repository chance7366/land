import { runNewsFeedCollection } from "../src/lib/news-feed-service";

async function main() {
  console.log("[news-feed] collecting…");
  const result = await runNewsFeedCollection();
  console.log("[news-feed] done", JSON.stringify(result, null, 2));
  if (!result.ok) {
    console.error("[news-feed] partial or source failures", result.failedSources);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[news-feed] failed", err);
  process.exit(1);
});
