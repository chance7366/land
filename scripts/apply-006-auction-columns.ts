/**
 * Apply supabase/migrations/006_auction_case_detail.sql via DATABASE_URL (postgres).
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { Client } from "pg";

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
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL 없음");
  if (!/postgres/i.test(url)) {
    throw new Error("DATABASE_URL 이 Postgres(Supabase)가 아닙니다. .env.local 을 확인하세요.");
  }

  const sql = readFileSync(
    resolve("supabase/migrations/006_auction_case_detail.sql"),
    "utf8",
  );
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql);
    const cols = await client.query(
      `select column_name from information_schema.columns
       where table_schema='public' and table_name='auctions'
       order by ordinal_position`,
    );
    console.log(
      "OK columns:",
      cols.rows.map((r) => r.column_name).join(", "),
    );
    const has = cols.rows.some((r) => r.column_name === "case_detail_json");
    if (!has) throw new Error("case_detail_json 컬럼이 없습니다");
    console.log("case_detail_json: ready");
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
