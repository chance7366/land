import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
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

const rows = JSON.parse(
  readFileSync(
    resolve(root, "src/lib/public-data/rtms/lawd-codes-data.json"),
    "utf8",
  ),
);

loadEnvLocal();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) {
  console.error("Supabase URL/SERVICE_ROLE_KEY 필요");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });
const chunk = 100;
let n = 0;
for (let i = 0; i < rows.length; i += chunk) {
  const part = rows.slice(i, i + chunk);
  const { error, count } = await sb.from("lawd_codes").upsert(part, {
    onConflict: "lawd_cd",
    count: "exact",
  });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  n += count ?? part.length;
}

const { count } = await sb
  .from("lawd_codes")
  .select("*", { count: "exact", head: true });
console.log(
  JSON.stringify({
    upserted: n,
    total: count,
    chungnam: rows
      .filter((r) => r.sido === "충청남도")
      .map((r) => r.sigungu)
      .join(", "),
  }),
);
