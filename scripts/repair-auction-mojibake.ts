/**
 * UTF-8 모지베이크로 깨진 경매 텍스트 필드를 DB에 복구 저장합니다.
 * 사용: npx tsx scripts/repair-auction-mojibake.ts [auctionId]
 */
import { readFileSync } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { looksLikeUtf8Mojibake, repairUtf8Mojibake } from "../src/lib/text-encoding";

function loadEnvLocal() {
  try {
    const raw = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
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
  } catch {
    /* ignore */
  }
}

const TEXT_COLS = [
  "title",
  "description",
  "rights_analysis",
  "case_detail_json",
  "memo",
  "address",
  "address2",
  "region",
  "court",
  "case_number",
  "manage_code",
  "item_type",
  "auction_type",
  "auction_target",
  "bid_method",
  "debtor_owner",
  "creditor",
] as const;

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Supabase env missing");

  const sb = createClient(url, key, { auth: { persistSession: false } });
  const onlyId = process.argv[2];
  let q = sb.from("auctions").select("*");
  if (onlyId) q = q.eq("id", onlyId);
  const { data, error } = await q;
  if (error) throw error;

  let fixed = 0;
  for (const row of data ?? []) {
    const patch: Record<string, string | null> = {};
    for (const col of TEXT_COLS) {
      const raw = row[col];
      if (typeof raw !== "string" || !raw) continue;
      if (!looksLikeUtf8Mojibake(raw)) continue;
      patch[col] = repairUtf8Mojibake(raw);
    }
    if (!Object.keys(patch).length) continue;

    const { error: upErr } = await sb.from("auctions").update(patch).eq("id", row.id);
    if (upErr) throw upErr;
    fixed += 1;
    console.log("repaired", row.id, row.case_number, Object.keys(patch).join(","));
    if (patch.description) console.log("  desc:", patch.description.slice(0, 80));
  }
  console.log("done, fixed=", fixed);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
