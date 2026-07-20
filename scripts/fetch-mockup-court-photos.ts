/**
 * 목업용: 홍성지원 2026타경15044 물건사진(gen_pic) 추출 → public/mockup
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const SEARCH_URL =
  "https://www.courtauction.go.kr/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ159M00.xml&pgjId=159M00";

const CASE = {
  court: "홍성지원",
  caseYear: "2026",
  caseSerial: "15044",
};

function extFromBuf(buf: Buffer): string {
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf[0] === 0x47 && buf[1] === 0x49) return "gif";
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf[0] === 0x52 && buf[1] === 0x49) return "webp";
  return "bin";
}

async function main() {
  const outDir = path.join(
    process.cwd(),
    "public",
    "mockup",
    "auction-photos",
    `${CASE.caseYear}-${CASE.caseSerial}`,
  );
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(SEARCH_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForTimeout(3500);
  await page.selectOption("#mf_wfm_mainFrame_sbx_auctnCsSrchCortOfc", {
    label: CASE.court,
  });
  await page.selectOption("#mf_wfm_mainFrame_sbx_auctnCsSrchCsYear", CASE.caseYear);
  await page.fill("#mf_wfm_mainFrame_ibx_auctnCsSrchCsNo", CASE.caseSerial);
  await page.click("#mf_wfm_mainFrame_btn_auctnCsSrchBtn");
  await page.waitForTimeout(5000);

  const btn = page.locator('input[id*="btn_gdsDtlInq"]');
  if ((await btn.count()) === 0) throw new Error("물건상세조회 버튼 없음");
  await btn.first().click({ force: true });
  await page.waitForTimeout(4500);

  const photos = await page.evaluate(() => {
    const root = document.querySelector("#mf_wfm_mainFrame_gen_pic");
    if (!root) return [] as { alt: string; id: string; dataUrl: string }[];
    return Array.from(root.querySelectorAll("img[id*='img_reltPic']")).map((img) => ({
      alt: img.getAttribute("alt") || "",
      id: img.id,
      dataUrl: (img as HTMLImageElement).src || "",
    }));
  });

  const saved: {
    index: number;
    alt: string;
    id: string;
    file: string;
    bytes: number;
    url: string;
  }[] = [];

  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const m = p.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!m) continue;
    const buf = Buffer.from(m[2], "base64");
    const ext = extFromBuf(buf);
    const fileName = `${String(i + 1).padStart(2, "0")}-${(p.alt || `photo-${i + 1}`).replace(/[^\w가-힣._-]+/g, "_")}.${ext}`;
    fs.writeFileSync(path.join(outDir, fileName), buf);
    saved.push({
      index: i + 1,
      alt: p.alt || `사진 ${i + 1}`,
      id: p.id,
      file: fileName,
      bytes: buf.length,
      url: `/mockup/auction-photos/${CASE.caseYear}-${CASE.caseSerial}/${fileName}`,
    });
  }

  const meta = {
    court: CASE.court,
    caseYear: CASE.caseYear,
    caseSerial: CASE.caseSerial,
    caseNumber: `${CASE.caseYear}타경${CASE.caseSerial}`,
    sourceDom: "#mf_wfm_mainFrame_gen_pic img[id*='img_reltPic']",
    fetchedAt: new Date().toISOString(),
    totalFromCourt: photos.length,
    savedCount: saved.length,
    maxFormSlots: 8,
    note:
      "운영 폼 미적용 목업용. 저장 시 최대 8장까지 채우고, 초과분은 제외·안내하는 UX를 전제로 함.",
    photos: saved,
  };
  fs.writeFileSync(path.join(outDir, "meta.json"), JSON.stringify(meta, null, 2), "utf8");
  // also copy meta for import from src
  const srcMetaDir = path.join(process.cwd(), "src", "lib", "mockup");
  fs.mkdirSync(srcMetaDir, { recursive: true });
  fs.writeFileSync(
    path.join(srcMetaDir, "auction-photos-15044-sample.ts"),
    `/** 홍성지원 2026타경15044 · gen_pic 실수집 목업 데이터 (운영 미적용) */\n` +
      `export const AUCTION_PHOTOS_15044_SAMPLE = ${JSON.stringify(meta, null, 2)} as const;\n`,
    "utf8",
  );

  console.log(JSON.stringify(meta, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
