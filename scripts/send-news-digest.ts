/**
 * 부동산소식 일일 메일 발송.
 * 예: npx tsx scripts/send-news-digest.ts
 *     npx tsx scripts/send-news-digest.ts --force
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
  const force = process.argv.includes("--force");
  console.log(
    `[news-digest] DATA_PROVIDER=${process.env.DATA_PROVIDER?.trim() || "(unset)"} force=${force}`,
  );
  const { sendDailyNewsDigest } = await import("../src/lib/news-digest-notify");
  const result = await sendDailyNewsDigest({ force });
  console.log("[news-digest] done", JSON.stringify(result, null, 2));
  if (result.failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error("[news-digest] fatal", err);
  process.exit(1);
});
