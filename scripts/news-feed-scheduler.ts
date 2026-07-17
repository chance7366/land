/**
 * 하루 3회(08:00, 14:00, 20:00 KST) 부동산 소식 수집 스케줄러.
 * 실행: npm run collect:news:cron
 */
import cron from "node-cron";
import { runNewsFeedCollection } from "../src/lib/news-feed-service";

async function tick(label: string) {
  console.log(`[news-feed-cron] ${label} start`, new Date().toISOString());
  try {
    const result = await runNewsFeedCollection();
    if (!result.ok) {
      console.error(`[news-feed-cron] ${label} partial failure`, {
        failedSources: result.failedSources,
        failedUpserts: result.failed.length,
        perSource: result.perSource,
      });
      return;
    }
    console.log(`[news-feed-cron] ${label} ok`, {
      created: result.created,
      updated: result.updated,
      pruned: result.pruned,
      perSource: result.perSource,
    });
  } catch (err) {
    console.error(`[news-feed-cron] ${label} failed`, err);
  }
}

// KST = UTC+9 → cron in local machine timezone. On servers set TZ=Asia/Seoul.
cron.schedule("0 8,14,20 * * *", () => {
  void tick("scheduled");
});

console.log("[news-feed-cron] registered 0 8,14,20 * * * — waiting");
void tick("startup");
