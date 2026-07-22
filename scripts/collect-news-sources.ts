/**
 * 선택 출처만 수집. 예: npx tsx scripts/collect-news-sources.ts naver molit chungnam hongseong
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import type { NewsFeedSourceId } from "../src/lib/news-feed";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

async function main() {
  loadEnv();
  const keys = process.argv.slice(2).filter(Boolean) as NewsFeedSourceId[];
  if (!keys.length) {
    console.error("Usage: tsx scripts/collect-news-sources.ts <source> [source...]");
    process.exit(2);
  }
  console.log(
    `[news-feed] DATA_PROVIDER=${process.env.DATA_PROVIDER?.trim() || "(unset)"} sources=${keys.join(",")}`,
  );
  const { runNewsFeedCollectionForSources } = await import("../src/lib/news-feed-service");
  const result = await runNewsFeedCollectionForSources(keys);
  console.log("[news-feed] done", JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
