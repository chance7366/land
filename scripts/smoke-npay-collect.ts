import {
  collectNpayArticles,
  collectNpayComplexes,
  listNpayEupmyeondong,
  listNpaySidos,
  resolveNpayRegion,
} from "../src/lib/npay";

async function main() {
  console.log("sidos", listNpaySidos().length);
  const r = resolveNpayRegion("충청남도", "홍성군", "홍북읍");
  console.log("region", r.legalDivisionNumber, r.label);
  console.log(
    "emd sample",
    listNpayEupmyeondong("서울특별시", "강서구").includes("방화동"),
  );

  console.log("--- articles (홍북읍 A01 A1, maxPages 1) ---");
  const a = await collectNpayArticles({
    city: "충청남도",
    division: "홍성군",
    sector: "홍북읍",
    tradeTypes: ["A1"],
    estateTypes: ["A01"],
    maxPages: 1,
  });
  console.log(
    JSON.stringify(
      {
        ok: a.ok,
        error: a.error,
        total: a.totalCount,
        pages: a.pages,
        rows: a.rows.length,
        sample: a.rows[0] && {
          n: a.rows[0].articleNumber,
          name: a.rows[0].complexName || a.rows[0].articleName,
          trade: a.rows[0].tradeTypeLabel,
          price: a.rows[0].dealPrice,
        },
      },
      null,
      2,
    ),
  );

  console.log("--- complexes (홍북읍 max 2) ---");
  const c = await collectNpayComplexes({
    city: "충청남도",
    division: "홍성군",
    sector: "홍북읍",
    maxComplexes: 2,
  });
  console.log(
    JSON.stringify(
      {
        ok: c.ok,
        error: c.error,
        complexes: c.complexCount,
        rows: c.rows.length,
        sample: c.rows[0] && {
          n: c.rows[0].complexNumber,
          name: c.rows[0].complexName,
          pyeong: c.rows[0].pyeongName,
        },
      },
      null,
      2,
    ),
  );

  if (!a.ok || !c.ok) process.exit(1);
  if (a.rows.length < 1) {
    console.error("매물 0건 — 실패로 간주");
    process.exit(1);
  }
  if (c.rows.length < 1) {
    console.error("단지 0건 — 실패로 간주");
    process.exit(1);
  }
  console.log("SMOKE OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
