/**
 * Smoke: legal/tax counsel context search (no Gemini stream).
 * Usage: npx tsx scripts/smoke-legal-tax-counsel.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import {
  getLawOpenApiOc,
  searchLegalCounselContext,
  searchTaxCounselContext,
} from "../src/lib/legal-counsel";

async function main() {
  const oc = getLawOpenApiOc();
  console.log("OC:", oc ? `set (len=${oc.length})` : "MISSING");

  console.log("\n=== legal ===");
  const legal = await searchLegalCounselContext(
    "근저당보다 전입이 빠른 임차인 대항력과 배당",
  );
  console.log("warnings:", legal.warnings);
  console.log(
    "counts:",
    legal.laws.length,
    legal.precedents.length,
    legal.interpretations.length,
  );
  console.log("context preview:", legal.contextText.slice(0, 280));

  console.log("\n=== tax ===");
  const tax = await searchTaxCounselContext("1가구 1주택 양도소득세 비과세 일시적 2주택");
  console.log("warnings:", tax.warnings);
  console.log(
    "counts:",
    tax.laws.length,
    tax.precedents.length,
    tax.interpretations.length,
  );
  console.log(
    "kinds:",
    tax.interpretations.map((s) => s.kind).join(", "),
  );
  console.log("context preview:", tax.contextText.slice(0, 400));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
