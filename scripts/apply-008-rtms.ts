import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import pg from "pg";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) throw new Error(".env.local missing");
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
    process.env[k] = v;
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.DATABASE_URL?.trim();
  console.log(
    "DATABASE_URL prefix:",
    url ? url.slice(0, 20) : "(empty)",
    "len",
    url?.length ?? 0,
  );
  if (!url || url.startsWith("file:")) {
    throw new Error("Postgres DATABASE_URL required");
  }
  const sql = readFileSync(
    resolve("supabase/migrations/008_real_estate_transactions.sql"),
    "utf8",
  );
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql);
    const r = await client.query(
      `select to_regclass('public.real_estate_transactions') as tx,
              to_regclass('public.real_estate_sync_coverage') as cov,
              (select count(*)::int from lawd_codes) as lawd_n`,
    );
    console.log(JSON.stringify(r.rows[0]));
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
