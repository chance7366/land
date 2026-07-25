/**
 * lawd_codes 전국 시군구(250) upsert
 * 예: npx tsx scripts/seed-lawd-codes.ts
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { LAWD_CODES_STATIC } from "../src/lib/public-data/rtms/lawd-codes";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Supabase URL/SERVICE_ROLE_KEY 필요");

  const sb = createClient(url, key, { auth: { persistSession: false } });
  const chunk = 100;
  let n = 0;
  for (let i = 0; i < LAWD_CODES_STATIC.length; i += chunk) {
    const part = LAWD_CODES_STATIC.slice(i, i + chunk);
    const { error, count } = await sb.from("lawd_codes").upsert(part, {
      onConflict: "lawd_cd",
      count: "exact",
    });
    if (error) throw new Error(error.message);
    n += count ?? part.length;
  }

  const { count } = await sb
    .from("lawd_codes")
    .select("*", { count: "exact", head: true });
  console.log(
    JSON.stringify({
      upserted: n,
      total: count,
      sampleChungnam: LAWD_CODES_STATIC.filter((r) => r.sido === "충청남도")
        .map((r) => r.sigungu)
        .join(", "),
    }),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
