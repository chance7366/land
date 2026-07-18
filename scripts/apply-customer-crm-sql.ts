/**
 * customer_cards DDL 적용 시도. 실패 시 SQL Editor 안내.
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

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Supabase 키가 없습니다.");

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const probe = await sb.from("customer_cards").select("id").limit(1);
  if (!probe.error) {
    console.log("customer_cards 이미 존재합니다.");
    return;
  }

  console.error("※ Supabase SQL Editor에서 아래 파일을 Run 하세요:");
  console.error("  supabase/migrations/004_customer_crm.sql");
  console.error("현재 오류:", probe.error.message);
  process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
