/**
 * 대장 조회 스모크 — 샘플 주소로 AGGREGATE/GENERAL/LAND 결과 미리보기
 * Usage: npx tsx scripts/smoke-ledger-lookup.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { lookupLedgerBundle } from "../src/lib/public-data/ledger-orchestrator";
import type { LedgerKind } from "../src/lib/public-data/types";

const SAMPLES: Array<{
  label: string;
  ledgerKind: LedgerKind;
  address: string;
  dong?: string;
  ho?: string;
}> = [
  {
    label: "집합·아파트 (동·호)",
    ledgerKind: "AGGREGATE",
    address: "충청남도 홍성군 홍북읍 신경리 1361",
    dong: "101",
    ho: "1001",
  },
  {
    label: "일반건축물 (단독/다가구 추정)",
    ledgerKind: "GENERAL",
    address: "충청남도 홍성군 홍성읍 오관리 123",
  },
  {
    label: "토지만",
    ledgerKind: "LAND_ONLY",
    address: "충청남도 홍성군 홍북읍 신경리 1361",
  },
];

async function main() {
  for (const s of SAMPLES) {
    console.log("\n==========", s.label, "==========");
    console.log("input:", JSON.stringify(s, null, 2));
    const result = await lookupLedgerBundle({
      ledgerKind: s.ledgerKind,
      address: s.address,
      dong: s.dong,
      ho: s.ho,
    });
    if (!result.ok) {
      console.log("FAIL:", result.code, result.error);
      continue;
    }
    const b = result.bundle;
    console.log("OK summary:", b.rawSummary);
    console.log("warnings:", b.warnings);
    console.log("pnu:", b.pnu);
    console.log("codes:", b.codes);
    console.log("building:", b.building);
    console.log("land:", b.land);
    console.log("recap keys:", b.recap ? Object.keys(b.recap) : null);
    console.log("expos:", b.expos);
    console.log(
      "candidates:",
      b.candidates?.slice(0, 5).map((c) => c.label),
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
