/**
 * page_events 테이블 생성 시도 (003_page_events.sql)
 * API DDL이 안 되면 Supabase SQL Editor에서 직접 Run 하세요.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

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
  const endpoints = [`${url}/pg/query`, `${url}/database/query`];
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

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Supabase 키가 없습니다.");

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const probe0 = await sb.from("page_events").select("id").limit(1);
  if (!probe0.error) {
    console.log("page_events 이미 존재합니다.");
    return;
  }

  const sql = readFileSync(
    resolve(process.cwd(), "supabase/migrations/003_page_events.sql"),
    "utf8",
  );
  console.log("page_events 없음 → SQL 적용 시도…");
  await tryRunSql(url, key, sql);
  await new Promise((r) => setTimeout(r, 1500));
  await tryRunSql(url, key, "notify pgrst, 'reload schema';");
  await new Promise((r) => setTimeout(r, 1500));

  const probe = await sb.from("page_events").select("id").limit(1);
  if (probe.error) {
    console.error("\n※ SQL을 Supabase Dashboard에서 직접 실행해 주세요:");
    console.error(
      "  SQL Editor → New query → supabase/migrations/003_page_events.sql 전체 붙여넣기 → Run\n",
    );
    console.error(probe.error.message);
    process.exit(2);
  }
  console.log("page_events 테이블 확인 OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
