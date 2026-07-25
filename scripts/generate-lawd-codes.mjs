import fs from "fs";
import path from "path";

function formatSigungu(name) {
  return String(name || "")
    .replace(/(.+시)(.+구)$/u, "$1 $2")
    .trim();
}

function formatSido(name) {
  const map = {
    강원도: "강원특별자치도",
    전라북도: "전북특별자치도",
  };
  return map[name] || name;
}

const url =
  "https://gist.githubusercontent.com/cokia/9dcde3540ef7a93e7134f084ee46bedb/raw/bcd.json";
const data = await (await fetch(url)).json();
const map = new Map();
for (const row of data) {
  const full = String(row.bcd).padStart(10, "0");
  if (full.slice(2) === "00000000") continue;
  const code = full.slice(0, 5);
  if (!map.has(code)) {
    map.set(code, {
      lawd_cd: code,
      sido: formatSido(row.sido),
      sigungu: formatSigungu(row.sgg),
    });
  }
}

const rows = [...map.values()].sort((a, b) =>
  a.lawd_cd.localeCompare(b.lawd_cd),
);
const outPath = path.join("src/lib/public-data/rtms", "lawd-codes-data.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), "utf8");
console.log("wrote", rows.length, "→", outPath);

const bySido = {};
for (const r of rows) bySido[r.sido] = (bySido[r.sido] || 0) + 1;
console.log(
  Object.entries(bySido)
    .map(([k, v]) => `${k}:${v}`)
    .join(" | "),
);
const cn = rows.filter((r) => r.sido === "충청남도");
console.log(
  "충남",
  cn.length,
  cn.map((r) => r.sigungu).join(", "),
);
