/**
 * 1) news_feed_items 테이블 생성 시도
 * 2) 로컬 SQLite 뉴스 → Supabase 이관
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) throw new Error(".env.local 이 없습니다.");
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

async function tryRunSql(url: string, key: string, sql: string) {
  const endpoints = [
    `${url}/pg/query`,
    `${url}/database/query`,
  ];
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sql }),
      });
      const text = await res.text();
      if (res.ok) {
        console.log("SQL 적용 성공:", endpoint);
        return true;
      }
      console.warn("SQL 엔드포인트 실패:", endpoint, res.status, text.slice(0, 200));
    } catch (e) {
      console.warn("SQL 엔드포인트 오류:", endpoint, e);
    }
  }
  return false;
}

async function tableExists(sb: ReturnType<typeof createClient<any>>) {
  const { error } = await sb.from("news_feed_items").select("id").limit(1);
  if (!error) return true;
  if (error.message.includes("does not exist") || error.code === "42P01") return false;
  // 다른 오류면 테이블은 있을 수 있음
  console.warn("table check:", error.message);
  return !error.message.toLowerCase().includes("schema cache");
}

async function main() {
  loadEnvLocal();
  process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Supabase 키가 없습니다.");

  const sqlPath = resolve(process.cwd(), "supabase/migrations/002_news_feed.sql");
  const sql = readFileSync(sqlPath, "utf8");

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let exists = await tableExists(sb);
  if (!exists) {
    console.log("news_feed_items 없음 → SQL 적용 시도…");
    const applied = await tryRunSql(url, key, sql);
    // 스키마 캐시 갱신 대기
    await new Promise((r) => setTimeout(r, 1500));
    exists = await tableExists(sb);
    if (!exists && !applied) {
      console.error("\n※ SQL을 Supabase Dashboard에서 직접 실행해 주세요:");
      console.error("  SQL Editor → New query → supabase/migrations/002_news_feed.sql 전체 붙여넣기 → Run\n");
      process.exit(2);
    }
    if (!exists) {
      // Notifier reload schema
      await tryRunSql(url, key, "notify pgrst, 'reload schema';");
      await new Promise((r) => setTimeout(r, 2000));
      exists = await tableExists(sb);
    }
  }

  if (!exists) {
    console.error("테이블이 아직 없습니다. SQL Editor에서 002_news_feed.sql 을 Run 한 뒤 다시 실행하세요.");
    process.exit(2);
  }

  console.log("news_feed_items 테이블 확인 OK — 로컬 데이터 이관 시작");

  const prisma = new PrismaClient();
  try {
    const rows = await prisma.newsFeedItem.findMany();
    console.log("로컬 뉴스:", rows.length);

    const payload = rows.map((r) => ({
      id: r.id,
      source: r.source,
      source_name: r.sourceName,
      title: r.title,
      summary: r.summary ?? "",
      press: r.press ?? "",
      origin_url: r.originUrl,
      image_url: r.imageUrl,
      rank: r.rank,
      pub_date: r.pubDate.toISOString(),
      fetched_at: r.fetchedAt.toISOString(),
      created_at: r.createdAt.toISOString(),
      updated_at: r.updatedAt.toISOString(),
    }));

    const chunk = 80;
    let ok = 0;
    for (let i = 0; i < payload.length; i += chunk) {
      const part = payload.slice(i, i + chunk);
      const { error } = await sb.from("news_feed_items").upsert(part, {
        onConflict: "origin_url",
      });
      if (error) throw error;
      ok += part.length;
      console.log(`  upsert ${ok}/${payload.length}`);
    }
    console.log("뉴스 이관 완료:", ok);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
