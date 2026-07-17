import { chromium, type Browser, type Page } from "playwright";
import type {
  CourtAuctionFixture,
  FormGroup,
  ParcelRow,
  ScheduleRow,
} from "@/lib/mockup/auction-court-fixtures";

const SEARCH_URL =
  "https://www.courtauction.go.kr/pgj/index.on?w2xPath=/pgj/ui/pgj100/PGJ159M00.xml&pgjId=159M00";

export type LiveFetchInput = {
  court: string;
  caseYear: string;
  caseSerial: string;
  itemNo?: number | null;
};

export type LiveFetchResult =
  | { ok: true; items: CourtAuctionFixture[]; source: "live" }
  | { ok: false; error: string };

function parseWon(raw: string | null | undefined): number {
  if (!raw) return 0;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function toIsoDate(raw: string | null | undefined): string {
  if (!raw) return "";
  const m = raw.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (!m) return "";
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

function inferFormGroup(itemType: string): FormGroup {
  const t = itemType || "";
  if (/아파트|오피스텔|다세대|연립|근린시설|집합|구분건물/.test(t) && !/토지|전답|임야|대지/.test(t)) {
    return "UNIT";
  }
  if (/단독|다가구|근린주택|상가주택|건물/.test(t) && /토지|대지/.test(t)) return "HOUSE";
  if (/토지|전답|임야|대지|잡종지|공장용지|과수원/.test(t)) return "LAND";
  if (/단독|다가구|주택/.test(t)) return "HOUSE";
  return "LAND";
}

function regionFromAddress(address: string): string {
  const m = address.match(/((?:충청|전라|경상|강원)?[남북]?[도시]|서울|부산|대구|인천|광주|대전|울산|세종)[^\s]*\s*([^\s]+[시군구])/);
  if (m) return `${m[1]} ${m[2]}`.replace(/\s+/g, " ").trim();
  const parts = address.replace(/^충청남도\s*/, "충남 ").split(/\s+/);
  return parts.slice(0, 2).join(" ");
}

function pickAfterLabel(block: string, label: string): string | null {
  const re = new RegExp(`${label}\\s*\\n\\s*([^\\n]+)`);
  const m = block.match(re);
  return m?.[1]?.trim() || null;
}

type ParsedItem = {
  itemNo: number;
  itemType: string;
  appraisalPrice: number;
  minPrice: number;
  bidDeposit: number;
  saleDateLabel: string;
  recentResult: string;
  remarks: string;
  addresses: string[];
};

function parseItems(itemSection: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const blocks = itemSection.split(/물건번호\s*\n/).slice(1);
  for (const b of blocks) {
    const no = Number((b.match(/^\s*(\d+)/) || [])[1] || 0);
    if (!no) continue;
    const itemType = (b.match(/물건용도\s*\n\s*([^\n]+)/) || [])[1]?.trim() || "";
    const money = [...b.matchAll(/([\d,]+원)/g)].map((x) => x[1]);
    const saleDateLabel = (b.match(/기일정보\s*\n\s*([^\n]+)/) || [])[1]?.trim() || "";
    const recentResult = (b.match(/최근입찰결과\s*\n\s*([^\n]*)/) || [])[1]?.trim() || "";
    const remarksBlock = (b.match(/물건비고\s*\n([\s\S]*?)(?=\n목록\d|\n물건상태|\n기일정보|$)/) || [])[1];
    const remarks = (remarksBlock || "")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !/^목록/.test(l))
      .join("\n")
      .trim();
    const addresses = [...b.matchAll(/(?:충청|전라|경상|강원|제주)?[남북]?도?\s*[^\n]*(?:시|군|구)[^\n]*/g)]
      .map((x) => x[0].replace(/\t.*/, "").trim())
      .filter((v, i, a) => v.length > 6 && a.indexOf(v) === i);
    // also catch "충청남도 ..." style
    const more = [...b.matchAll(/충청남도[^\n\t]+/g)].map((x) => x[0].trim());
    for (const a of more) if (!addresses.includes(a)) addresses.push(a);

    items.push({
      itemNo: no,
      itemType,
      appraisalPrice: parseWon(money[0]),
      minPrice: parseWon(money[1]),
      bidDeposit: parseWon(money[2]),
      saleDateLabel,
      recentResult,
      remarks,
      addresses,
    });
  }
  return items;
}

function parseParcels(text: string): ParcelRow[] {
  const idx = text.indexOf("목록내역");
  if (idx < 0) return [];
  const end = text.indexOf("당사자내역", idx);
  const section = text.slice(idx, end > idx ? end : idx + 2500);
  const rows: ParcelRow[] = [];
  const re =
    /(\d+)\s+(충청남도[^\n\t]+|[가-힣]+[시도][^\n\t]+)\s+열람\s+(토지|건물|집합건물|집합|제시외)[^\n]*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section)) !== null) {
    rows.push({
      no: Number(m[1]),
      listKind: m[3],
      address: m[2].trim(),
      detail: "미종국",
    });
  }
  if (rows.length) return rows;
  // looser
  const loose = [...section.matchAll(/(\d+)\s+(충청남도[^\t\n]+)/g)];
  for (const x of loose) {
    rows.push({
      no: Number(x[1]),
      listKind: "토지",
      address: x[2].trim(),
      detail: "",
    });
  }
  return rows;
}

function parseSchedule(text: string, itemNo: number): ScheduleRow[] {
  const idx = text.indexOf("기일내역");
  if (idx < 0) return [];
  const section = text.slice(idx, idx + 4000);
  // Find block for this itemNo
  const itemIdx = section.search(new RegExp(`\\n${itemNo}\\s*\\n`));
  const chunk =
    itemIdx >= 0
      ? section.slice(itemIdx, itemIdx + 800)
      : section.slice(0, 1200);
  const rows: ScheduleRow[] = [];
  const re =
    /(\d{4}\.\d{2}\.\d{2})(?:\([^)]*\))?\s+(매각기일|매각결정기일|최초매각기일)\s+([^\t\n]+?)(?:\t([\d,]+원))?(?:\t([^\t\n]*))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(chunk)) !== null) {
    rows.push({
      date: m[1],
      kind: m[2],
      place: (m[3] || "경매법정").trim(),
      minPrice: m[4] ? parseWon(m[4]) : null,
      result: (m[5] || "").trim(),
    });
  }
  return rows;
}

function buildTitle(item: ParsedItem, parcels: ParcelRow[]): string {
  const addr = parcels[0]?.address || item.addresses.find((a) => /리|동|로|길/.test(a)) || "";
  const short = addr
    .replace(/^충청남도\s*/, "")
    .replace(/^대구광역시\s*/, "대구 ")
    .replace(/^서울특별시\s*/, "서울 ")
    .replace(/^부산광역시\s*/, "부산 ");
  const place = short.split(/\s+/).filter(Boolean).slice(0, 3).join(" ");
  if (place) return `${place} ${item.itemType || "경매물건"}`.trim();
  return item.itemType || "경매물건";
}

function toFixtures(args: {
  court: string;
  caseYear: string;
  caseSerial: string;
  caseNumber: string;
  auctionType: string;
  claimAmount: number;
  receivedAt: string;
  startedAt: string;
  dividendDeadline: string;
  items: ParsedItem[];
  parcels: ParcelRow[];
  fullText: string;
}): CourtAuctionFixture[] {
  const siblings = args.items.map((it) => ({
    itemNo: it.itemNo,
    label: `${it.itemNo} · ${it.itemType || "물건"}`,
    fixtureId: `live-${args.caseSerial}-${it.itemNo}`,
  }));

  return args.items.map((it) => {
    const formGroup = inferFormGroup(it.itemType);
    const itemParcels =
      args.parcels.length > 0
        ? args.parcels.filter((p) => {
            // if single item, all parcels; else match by address overlap
            if (args.items.length === 1) return true;
            return it.addresses.some((a) => p.address.includes(a.replace(/^충청남도\s*/, "").slice(-8)) || a.includes(p.address.slice(-8)));
          })
        : it.addresses.map((address, i) => ({
            no: i + 1,
            listKind: formGroup === "UNIT" ? "집합건물" : "토지",
            address,
            detail: "",
          }));
    const parcels = itemParcels.length ? itemParcels : it.addresses.map((address, i) => ({
      no: i + 1,
      listKind: "토지" as const,
      address,
      detail: "",
    }));
    const schedule = parseSchedule(args.fullText, it.itemNo);
    if (!schedule.length && it.saleDateLabel) {
      schedule.push({
        date: it.saleDateLabel.replace(/[^\d.]/g, "").slice(0, 10) || it.saleDateLabel,
        kind: "매각기일",
        place: "경매법정",
        minPrice: it.minPrice || null,
        result: it.recentResult.includes("유찰") ? "유찰" : "",
      });
    }

    return {
      id: `live-${args.caseSerial}-${it.itemNo}`,
      court: args.court,
      caseYear: args.caseYear,
      caseSerial: args.caseSerial,
      caseNumber: args.caseNumber,
      itemNo: it.itemNo,
      siblingItems: siblings.length > 1 ? siblings : undefined,
      formGroup,
      itemType: it.itemType,
      auctionType: args.auctionType || "부동산경매",
      title: buildTitle(it, parcels),
      region: regionFromAddress(parcels[0]?.address || it.addresses[0] || ""),
      parcels: parcels.slice(0, 6),
      appraisalPrice: it.appraisalPrice,
      minPrice: it.minPrice,
      bidDeposit: it.bidDeposit,
      claimAmount: args.claimAmount,
      bidMethod: "기일입찰",
      saleDate: toIsoDate(it.saleDateLabel),
      saleDateLabel: it.saleDateLabel,
      receivedAt: args.receivedAt,
      startedAt: args.startedAt,
      dividendDeadline: args.dividendDeadline,
      remarks: it.remarks,
      appraisalSummary: "",
      schedule,
      documents: [
        { type: "saleSpec", label: "매각물건명세서", name: "", status: "pending" },
        { type: "appraisal", label: "감정평가서", name: "", status: "pending" },
        { type: "status", label: "현황조사서", name: "", status: "pending" },
      ],
      possessionNote: "",
      leaseNote: "",
      assumeRightsNote: "",
    };
  });
}

async function dismissOverlays(page: Page) {
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(300);
  await page.keyboard.press("Escape").catch(() => {});
}

async function searchCase(page: Page, court: string, caseYear: string, caseSerial: string) {
  await page.goto(SEARCH_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForTimeout(3500);
  await dismissOverlays(page);

  await page.selectOption("#mf_wfm_mainFrame_sbx_auctnCsSrchCortOfc", { label: court });
  await page.selectOption("#mf_wfm_mainFrame_sbx_auctnCsSrchCsYear", caseYear);
  await page.fill("#mf_wfm_mainFrame_ibx_auctnCsSrchCsNo", caseSerial);
  await page.click("#mf_wfm_mainFrame_btn_auctnCsSrchBtn");
  await page.waitForTimeout(5000);
}

async function openScheduleTab(page: Page) {
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll("a, button, li, span"));
    const t = tabs.find((el) => (el.textContent || "").trim() === "기일내역");
    t?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await page.waitForTimeout(1500);
}

export async function fetchCourtAuctionLive(input: LiveFetchInput): Promise<LiveFetchResult> {
  const court = input.court.trim();
  const caseYear = input.caseYear.trim();
  const caseSerial = input.caseSerial.replace(/\D/g, "");
  if (!court || !caseYear || !caseSerial) {
    return { ok: false, error: "관할법원·연도·타경 숫자가 필요합니다." };
  }

  let browser: Browser | null = null;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--disable-dev-shm-usage", "--no-sandbox"],
    });
    const page = await browser.newPage();
    await searchCase(page, court, caseYear, caseSerial);

    let text = await page.locator("body").innerText();
    const caseNumber = `${caseYear}타경${caseSerial}`;
    if (!text.includes(caseNumber)) {
      return {
        ok: false,
        error: "법원경매 사이트에서 해당 사건을 찾지 못했습니다. 관할법원·연도·번호를 확인해 주세요.",
      };
    }

    await openScheduleTab(page);
    const scheduleText = await page.locator("body").innerText();
    // back to 사건내역 for item/parcel parse stability
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll("a, button, li, span"));
      const t = tabs.find((el) => (el.textContent || "").trim() === "사건내역");
      t?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await page.waitForTimeout(1200);
    text = await page.locator("body").innerText();
    const fullText = `${text}\n${scheduleText}`;

    const basicIdx = Math.max(0, text.indexOf("사건기본내역"));
    const basic = text.slice(basicIdx, basicIdx + 1800);
    const auctionType = pickAfterLabel(basic, "사건명") || "";
    const receivedAt = pickAfterLabel(basic, "접수일자") || "";
    const startedAt = pickAfterLabel(basic, "개시결정일자") || "";
    const claimAmount = parseWon(pickAfterLabel(basic, "청구금액"));

    const listIdx = text.indexOf("목록내역");
    const dividendSection = text.slice(
      text.indexOf("배당요구종기내역"),
      listIdx > 0 ? listIdx : text.indexOf("배당요구종기내역") + 800,
    );
    const dividendDeadline =
      (dividendSection.match(/(\d{4}\.\d{2}\.\d{2})/) || [])[1] || "";

    const itemStart = text.indexOf("물건내역");
    const itemEnd = listIdx > itemStart ? listIdx : itemStart + 6000;
    const itemSection = itemStart >= 0 ? text.slice(itemStart, itemEnd) : "";
    let items = parseItems(itemSection);
    if (!items.length) {
      const endResult = pickAfterLabel(basic, "종국결과") || "";
      return {
        ok: false,
        error: endResult
          ? `사건은 찾았으나 물건내역이 없습니다 (종국결과: ${endResult}). 수동 입력해 주세요.`
          : "사건은 찾았으나 물건내역을 읽지 못했습니다. 수동 입력해 주세요.",
      };
    }

    if (input.itemNo != null && input.itemNo > 0) {
      const filtered = items.filter((it) => it.itemNo === input.itemNo);
      if (!filtered.length) {
        return {
          ok: false,
          error: `물건번호 ${input.itemNo}을(를) 찾지 못했습니다. (등록 물건: ${items.map((i) => i.itemNo).join(", ")})`,
        };
      }
      items = filtered;
    }

    const parcels = parseParcels(text);
    const fixtures = toFixtures({
      court,
      caseYear,
      caseSerial,
      caseNumber,
      auctionType,
      claimAmount,
      receivedAt,
      startedAt,
      dividendDeadline,
      items,
      parcels,
      fullText,
    });

    return { ok: true, items: fixtures, source: "live" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/Executable doesn't exist|browserType\.launch/i.test(msg)) {
      return {
        ok: false,
        error: "Playwright Chromium이 설치되어 있지 않습니다. 서버에서 `npx playwright install chromium`을 실행해 주세요.",
      };
    }
    return { ok: false, error: `법원 조회 중 오류: ${msg}` };
  } finally {
    await browser?.close().catch(() => {});
  }
}
