/**
 * 부동산 소식 1회 수집.
 * .env.local 의 DATA_PROVIDER=supabase 이면 Supabase에 저장합니다.
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

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
  const provider = process.env.DATA_PROVIDER?.trim() || "(unset)";
  console.log(`[news-feed] DATA_PROVIDER=${provider} collecting…`);
  const { runNewsFeedCollection } = await import("../src/lib/news-feed-service");
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
