/**
 * CLI: 실거래가 갭 수집 (예: npm run collect:rtms -- --lawd=44800 --start=2026-01 --end=2026-03)
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { runGapSync, type RtmsDealType, type RtmsPropertyType } from "../src/lib/public-data/rtms";

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

function arg(name: string, fallback = "") {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

async function main() {
  loadEnvLocal();
  const lawdCds = arg("lawd", "44800").split(",").filter(Boolean);
  const startYm = arg("start", "2026-01");
  const endYm = arg("end", "2026-03");
  const propertyTypes = arg("types", "APT").split(",") as RtmsPropertyType[];
  const dealTypes = arg("deals", "SALE").split(",") as RtmsDealType[];
  const gapOnly = arg("gap", "true") !== "false";

  const result = await runGapSync({
    lawdCds,
    propertyTypes,
    dealTypes,
    startYm,
    endYm,
    gapOnly,
    regionLabel: lawdCds.join(","),
  });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
