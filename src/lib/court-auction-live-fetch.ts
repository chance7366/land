import { chromium, type Browser, type Page } from "playwright";
import type {
  CourtAuctionFixture,
  FormGroup,
  ParcelRow,
  ScheduleRow,
  StatusLeaseRow,
  StatusReport,
} from "@/lib/mockup/auction-court-fixtures";
import {
  mergeDocsIntoCaseDetail,
  parseCaseDetailFromSrchJson,
  type CaseDetail,
} from "@/lib/auction-case-detail";
import {
  listDetailsToCaseListRows,
  parseListDetailsFromDomSnapshot,
  type AuctionListDetailRow,
} from "@/lib/auction-list-details";
import {
  extractCourtPhotosFromPage,
  persistCourtPhotos,
  type CourtPhotoPersistResult,
} from "@/lib/court-auction-photos";

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

/** 감정평가요항 항목코드 → 표시 라벨 (물건종류 공통, 표 종류코드만 다름) */
const APPRAISAL_ITEM_LABELS: Record<string, string> = {
  "00083001": "위치 및 주위환경",
  "00083003": "교통상황",
  "00083004": "도로상태",
  "00083005": "인접 도로상황",
  "00083006": "이용상태",
  "00083008": "토지의 형상 및 이용상태",
  "00083009": "토지의 형상 및 이용상태",
  "00083011": "토지이용계획 및 제한사항",
  "00083013": "공부와의 차이",
  "00083014": "기타",
  "00083015": "건물구조",
  "00083017": "설비내역",
  "00083018": "건물이용상태",
  "00083026": "임대관계 등",
};

type AppraisalPoint = {
  itmCd: string;
  ctt: string;
};

function cleanAppraisalText(raw: string): string {
  let t = raw
    .replace(/\r\n/g, "\n")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/""/g, '"')
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  // 사이트 푸터·네비가 섞인 경우 제거
  const foot = t.search(
    /\n(?:COPYRIGHT|물건상세검색|지도검색|사이트 이용안내|맨 위로가기|이용시간\s*\[)/i,
  );
  if (foot > 40) t = t.slice(0, foot).trim();
  return t;
}

function formatAppraisalSummary(points: AppraisalPoint[]): string {
  const parts: string[] = [];
  const seen = new Set<string>();
  for (const p of points) {
    const ctt = cleanAppraisalText(p.ctt || "");
    if (!ctt) continue;
    const key = `${p.itmCd}:${ctt}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const label = APPRAISAL_ITEM_LABELS[p.itmCd] || "감정요항";
    parts.push(`[${label}]\n${ctt}`);
  }
  return parts.join("\n\n").trim();
}

function extractAppraisalPointsFromJson(json: unknown): AppraisalPoint[] {
  const root = json as {
    data?: { dma_result?: { aeeWevlMnpntLst?: unknown } };
  };
  const lst = root?.data?.dma_result?.aeeWevlMnpntLst;
  if (!Array.isArray(lst)) return [];
  return lst
    .map((row) => {
      const r = row as Record<string, unknown>;
      return {
        itmCd: String(r.aeeWevlMnpntItmCd || ""),
        ctt: String(r.aeeWevlMnpntCtt || ""),
      };
    })
    .filter((p) => p.ctt.trim());
}

const PARTY_TYPE_LABEL: Record<string, string> = {
  "0001562": "임차인",
  "0001561": "채무자",
  "0001563": "소유자",
};

function stripHtml(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function parseStatusReportFromJson(
  json: unknown,
  fallbackCourt: string,
): StatusReport | null {
  const data = (json as { data?: Record<string, unknown> } | null)?.data;
  if (!data || typeof data !== "object") return null;
  const mng = data.dma_curstExmnMngInf as Record<string, unknown> | undefined;
  if (!mng) return null;

  const rletList = Array.isArray(data.dlt_ordTsRlet) ? data.dlt_ordTsRlet : [];
  const lesList = Array.isArray(data.dlt_ordTsLserLtn) ? data.dlt_ordTsLserLtn : [];
  const picList = Array.isArray(data.dlt_ordTsPicDvs) ? data.dlt_ordTsPicDvs : [];
  const rlet = (rletList[0] || {}) as Record<string, unknown>;

  const photoCount = picList.reduce((sum, row) => {
    const n = Number((row as Record<string, unknown>).cortAuctnDvsPicCnt || 0);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);

  const leases: StatusLeaseRow[] = lesList.map((row, i) => {
    const les = row as Record<string, unknown>;
    const code = String(les.auctnIntrpsDvsCd || "");
    return {
      no: i + 1,
      address: String(les.printSt || rlet.printSt || "").trim(),
      leaseCountLabel:
        rlet.lesCnt != null && rlet.lesCnt !== ""
          ? `${rlet.lesCnt}명`
          : lesList.length
            ? `${lesList.length}명`
            : "",
      occupant: String(les.intrpsNm || "").trim(),
      partyType: PARTY_TYPE_LABEL[code] || (code ? code : "임차인"),
      occupyPart: String(les.lesPartCtt || "").trim(),
      usage: String(les.lesUsgDts || "").trim() || "주거",
      occupyPeriod: String(les.gdsPossCtt || "").trim(),
      deposit: String(les.lesDposDts || "").trim(),
      rent: String(les.mmrntAmtDts || "").trim(),
      moveInDate: String(les.mvinDtlCtt || "").trim(),
      fixedDate: String(les.rgstryCrtcpCfmtnCtt || "").trim(),
      leaseEtc: stripHtml(String(mng.lesDts || les.lesDtsRmk || "")),
    };
  });

  const possessionEtc = stripHtml(String(rlet.gdsPossCtt || mng.lstPossRltnDts || ""));
  const possCode = String(rlet.auctnPossRltnCd || "");
  const possessionRelation =
    possCode === "02"
      ? "임차인(별지)점유"
      : possCode === "01"
        ? "채무자(소유자) 점유"
        : possessionEtc
          ? "조사서 확인"
          : "";

  return {
    available: true,
    court: fallbackCourt,
    ordRound: String(mng.ordTsCnt || "1"),
    caseLabel: String(mng.userCsNo || "").trim(),
    surveyedAt: String(mng.exmnDtDts || "").trim(),
    photoCount,
    photoLabel: photoCount > 0 ? `전경도 ${photoCount}건` : "",
    possessionAddress: String(rlet.printSt || leases[0]?.address || "").trim()
      ? `1. ${String(rlet.printSt || leases[0]?.address || "").trim()}`
      : "",
    possessionRelation,
    possessionEtc,
    leases,
  };
}

async function collectStatusReport(
  page: Page,
  court: string,
): Promise<StatusReport | null> {
  let captured: StatusReport | null = null;
  const onResponse = async (res: import("playwright").Response) => {
    if (!/selectCurstExmndc\.on/i.test(res.url())) return;
    try {
      const json = await res.json();
      const parsed = parseStatusReportFromJson(json, court);
      if (parsed) captured = parsed;
    } catch {
      /* ignore */
    }
  };
  page.on("response", onResponse);

  const btn = page.locator(
    "#mf_wfm_mainFrame_btn_curstExmndc, input[value='현황조사서']",
  );
  if ((await btn.count()) === 0) {
    page.off("response", onResponse);
    return null;
  }

  try {
    await btn.first().click({ force: true });
    for (let i = 0; i < 12 && !captured; i++) {
      await page.waitForTimeout(400);
    }
  } catch {
    /* button may be disabled / unavailable */
  } finally {
    page.off("response", onResponse);
  }

  // close popup if open
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(300);

  return captured;
}

/**
 * 법원 화면의 감정평가요항표 블록 전체 (글자 수 제한 없음).
 * wq_uuid_* 는 화면마다 바뀌므로 라벨/내용으로 찾는다.
 */
async function extractAppraisalSummaryFromDom(page: Page): Promise<string> {
  // page.evaluate 콜백은 브라우저로 직렬화되므로 중첩 함수/tsx __name 헬퍼를 쓰지 않는다.
  return page.evaluate(() => {
    const STOP =
      /\n(?:인근매각|매각물건명세|현황조사|물건사진|관련문서|씨:리얼|목록내역|당사자내역|기일내역|COPYRIGHT|물건상세검색|지도검색|사이트 이용안내|맨 위로가기|이용시간\s*\[)/i;
    const CONTENT =
      /위치 및|교통상황|이용상태|토지이용계획|건물구조|임대관계|도로상태|인접 도로/;

    const els = Array.from(document.querySelectorAll("[id]"));
    let best = "";
    let bestScore = 0;
    for (const el of els) {
      const id = (el as HTMLElement).id || "";
      if (/header|sideMenu|footer|login/i.test(id)) continue;
      const t = ((el as HTMLElement).innerText || "").trim();
      if (!/감정평가요항표/.test(t)) continue;
      if (!CONTENT.test(t)) continue;
      if (t.length < 80) continue;
      if (/사건내역[\s\S]*기일내역[\s\S]*물건내역/.test(t) && t.length > 12000) continue;
      const hasNumbered = /\d+\)\s*|위치 및|교통상황/.test(t);
      const score =
        Math.min(t.length, 8000) +
        (hasNumbered ? 8000 : 0) +
        (CONTENT.test(t) ? 3000 : 0) -
        (id.includes("mainFrame") && t.length > 15000 ? 5000 : 0);
      if (score > bestScore) {
        bestScore = score;
        best = t;
      }
    }

    let raw = best;
    if (!raw) {
      const body = document.body.innerText || "";
      const idx = body.search(/\d+\.\s*[^\n]*감정평가요항표|감정평가요항표/);
      if (idx < 0) return "";
      raw = body.slice(idx);
    }

    const start = raw.search(/\d+\.\s*[^\n]*감정평가요항표|감정평가요항표/);
    const slice = start >= 0 ? raw.slice(start) : raw;
    const stopAt = slice.search(STOP);
    return (stopAt > 40 ? slice.slice(0, stopAt) : slice).trim();
  });
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

const USG_LABEL: Record<string, string> = {
  "01": "아파트",
  "02": "다세대",
  "03": "연립",
  "07": "오피스텔",
  "08": "근린시설",
  "12": "토지",
  "13": "전답",
  "14": "임야",
  "15": "대지",
};

/** selectAuctnCsSrchRslt → dlt_dspslGdsDspslObjctLst (DOM 물건내역보다 안정적) */
function parseItemsFromSrchJson(json: unknown): ParsedItem[] {
  const list = (json as { data?: { dlt_dspslGdsDspslObjctLst?: unknown } } | null)
    ?.data?.dlt_dspslGdsDspslObjctLst;
  if (!Array.isArray(list) || !list.length) return [];

  // 동일 물건번호(dspslGdsSeq)에 목록(dspslObjctSeq)이 여러 줄로 올 수 있음 → 물건 단위로 합침
  const byItemNo = new Map<number, ParsedItem>();

  for (const row of list) {
    const r = row as Record<string, unknown>;
    const itemNo = Number(r.dspslGdsSeq || 0) || 1;
    const usg = String(r.auctnGdsUsgCd || "");
    const appraisalPrice = parseWon(String(r.aeeEvlAmt ?? ""));
    const minPrice =
      parseWon(String(r.dspslAmt ?? "")) ||
      parseWon(String(r.fstPbancLwsDspslPrc ?? ""));
    const rate = Number(r.prchDposRate || 10);
    const bidDeposit =
      minPrice > 0 && Number.isFinite(rate)
        ? Math.round((minPrice * rate) / 100)
        : 0;
    const addr =
      String(r.userSt || r.printSt || "").trim() ||
      [
        r.adongSdNm,
        r.adongSggNm,
        r.adongEmdNm,
        r.adongRiNm,
        r.rprsLtnoAddr,
        r.bldNm,
        r.bldDtlDts,
      ]
        .map((x) => String(x || "").trim())
        .filter(Boolean)
        .join(" ");
    const ymd = String(r.dspslDxdyYmd || "").replace(/\D/g, "");
    const saleDateLabel =
      ymd.length === 8
        ? `${ymd.slice(0, 4)}.${ymd.slice(4, 6)}.${ymd.slice(6, 8)}`
        : String(r.dspslDxdyYmd || "").trim();
    const remarks = String(r.dspslGdsRmk || "")
      .replace(/^\s*-?\s*/, "")
      .trim();

    const existing = byItemNo.get(itemNo);
    if (!existing) {
      byItemNo.set(itemNo, {
        itemNo,
        itemType: USG_LABEL[usg] || String(r.auctnGdsUsgNm || "").trim() || "",
        appraisalPrice,
        minPrice,
        bidDeposit,
        saleDateLabel,
        recentResult: "",
        remarks,
        addresses: addr ? [addr] : [],
      });
      continue;
    }
    if (addr && !existing.addresses.includes(addr)) {
      existing.addresses.push(addr);
    }
    if (!existing.remarks && remarks) existing.remarks = remarks;
    if (!existing.itemType && usg) {
      existing.itemType = USG_LABEL[usg] || String(r.auctnGdsUsgNm || "").trim() || "";
    }
    if (!existing.appraisalPrice && appraisalPrice) existing.appraisalPrice = appraisalPrice;
    if (!existing.minPrice && minPrice) {
      existing.minPrice = minPrice;
      existing.bidDeposit = bidDeposit;
    }
    if (!existing.saleDateLabel && saleDateLabel) existing.saleDateLabel = saleDateLabel;
  }

  return [...byItemNo.values()].sort((a, b) => a.itemNo - b.itemNo);
}

function parseItems(itemSection: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  // "물건번호\n\t1\t" / "물건번호\n1\n" / "물건번호 1" 모두 허용
  const blocks = itemSection.split(/물건번호\s*[\n\t]+/).slice(1);
  for (const b of blocks) {
    const no = Number((b.match(/^\s*(\d+)/) || [])[1] || 0);
    if (!no) continue;
    const itemType =
      (b.match(/물건용도\s*[\n\t]+\s*([^\n\t]+)/) || [])[1]?.trim() || "";
    const money = [...b.matchAll(/([\d,]+원)/g)].map((x) => x[1]);
    const saleDateLabel =
      (b.match(/기일정보\s*[\n\t]+\s*([^\n\t]+)/) || [])[1]?.trim() || "";
    const recentResult =
      (b.match(/최근입찰결과\s*[\n\t]+\s*([^\n]*)/) || [])[1]?.trim() || "";
    const remarksBlock = (b.match(
      /물건비고\s*[\n\t]+([\s\S]*?)(?=\n목록\d|\n물건상태|\n기일정보|$)/,
    ) || [])[1];
    const remarks = (remarksBlock || "")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !/^목록/.test(l))
      .join("\n")
      .trim();
    const addresses = [
      ...b.matchAll(/(?:충청|전라|경상|강원|제주)?[남북]?도?\s*[^\n]*(?:시|군|구)[^\n]*/g),
    ]
      .map((x) => x[0].replace(/\t.*/, "").trim())
      .filter((v, i, a) => v.length > 6 && a.indexOf(v) === i);
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

/** 기일내역 API: POST /pgj/pgj15A/selectCsDtlDxdyDts.on → dlt_dxdyDtsLst */
function parseScheduleFromDxdyJson(json: unknown, itemNo: number): ScheduleRow[] {
  const list = (json as { data?: { dlt_dxdyDtsLst?: unknown } } | null)?.data
    ?.dlt_dxdyDtsLst;
  if (!Array.isArray(list)) return [];
  const rows: ScheduleRow[] = [];
  for (const row of list) {
    const r = row as Record<string, unknown>;
    const seq = Number(r.dspslGdsSeq || 0);
    if (itemNo > 0 && seq > 0 && seq !== itemNo) continue;
    const time = String(r.dxdyTime || "").trim();
    const date = (time.match(/(\d{4}\.\d{2}\.\d{2})/) || [])[1] || "";
    const kind = String(r.auctnDxdyKndNm || "").trim();
    if (!date || !kind) continue;
    const minRaw = String(r.tsLwsDspslPrc || "").trim();
    rows.push({
      date,
      kind,
      place: String(r.dxdyPlcNm || "경매법정").trim() || "경매법정",
      minPrice: minRaw ? parseWon(minRaw) : null,
      result: String(r.dxdyRslt || "").trim(),
    });
  }
  return rows;
}

/** DOM 폴백 — 법원 기일표는 탭 구분 (기일 / 종류 / 장소 / 최저매각가격 / 결과) */
function parseSchedule(text: string, itemNo: number): ScheduleRow[] {
  const idx = text.indexOf("기일내역");
  if (idx < 0) return [];
  const section = text.slice(idx, idx + 12_000);
  const itemIdx = section.search(new RegExp(`\\n${itemNo}\\s*\\n`));
  const nextItem =
    itemIdx >= 0
      ? section.slice(itemIdx + 1).search(/\n\d+\s*\n\s*물건상세조회/)
      : -1;
  const chunk =
    itemIdx >= 0
      ? section.slice(
          itemIdx,
          nextItem > 0 ? itemIdx + 1 + nextItem : itemIdx + 6000,
        )
      : section.slice(0, 6000);

  const rows: ScheduleRow[] = [];
  // 2026.06.23(10:00)\t매각기일\t경매법정\t11,377,000원\t유찰
  const re =
    /(\d{4}\.\d{2}\.\d{2})(?:\([^)]*\))?\t+(매각기일|매각결정기일|최초매각기일)\t+([^\t\n]*)\t+([^\t\n]*)\t*([^\t\n]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(chunk)) !== null) {
    const minRaw = (m[4] || "").trim();
    rows.push({
      date: m[1],
      kind: m[2],
      place: (m[3] || "경매법정").trim() || "경매법정",
      minPrice: /[\d,]+원/.test(minRaw) ? parseWon(minRaw) : null,
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
  appraisalByItem?: Map<number, string>;
  scheduleByItem?: Map<number, ScheduleRow[]>;
  caseDetail?: CaseDetail | null;
  statusReport?: StatusReport | null;
  listDetails?: AuctionListDetailRow[];
  courtPhotos?: CourtPhotoPersistResult | null;
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
    const schedule = [
      ...(args.scheduleByItem?.get(it.itemNo) || parseSchedule(args.fullText, it.itemNo)),
    ];
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
      appraisalSummary: args.appraisalByItem?.get(it.itemNo) || "",
      schedule,
      documents: [
        { type: "saleSpec", label: "매각물건명세서", name: "", status: "pending" },
        { type: "appraisal", label: "감정평가서", name: "", status: "pending" },
        {
          type: "status",
          label: "현황조사서",
          name: "",
          status: args.statusReport?.available ? "attached" : "pending",
        },
      ],
      possessionNote: args.statusReport?.possessionRelation || "",
      leaseNote: args.statusReport?.leases?.[0]
        ? `임차인 ${args.statusReport.leases[0].occupant || ""} · 보증 ${args.statusReport.leases[0].deposit || "—"} / 월세 ${args.statusReport.leases[0].rent || "—"}`.trim()
        : "",
      assumeRightsNote: "",
      statusReport: args.statusReport || undefined,
      caseDetail: args.caseDetail
        ? {
            ...args.caseDetail,
            item: {
              ...args.caseDetail.item,
              itemNo: it.itemNo,
              itemType: it.itemType || args.caseDetail.item.itemType,
              appraisalPrice: it.appraisalPrice || args.caseDetail.item.appraisalPrice,
              minPrice: it.minPrice || args.caseDetail.item.minPrice,
              bidDeposit: it.bidDeposit || args.caseDetail.item.bidDeposit,
              remarks: it.remarks || args.caseDetail.item.remarks,
              saleDateLabel: it.saleDateLabel || args.caseDetail.item.saleDateLabel,
              recentResult: it.recentResult || args.caseDetail.item.recentResult,
            },
            lists:
              args.listDetails && args.listDetails.length > 0
                ? listDetailsToCaseListRows(args.listDetails)
                : args.caseDetail.lists.length > 0
                  ? args.caseDetail.lists
                  : parcels.map((p) => ({
                      no: p.no,
                      listKind: p.listKind,
                      address: p.address,
                      detail: p.detail,
                    })),
          }
        : undefined,
      listDetails: args.listDetails?.length ? args.listDetails : undefined,
      courtImages: args.courtPhotos?.urls?.length ? args.courtPhotos.urls : undefined,
      courtImageTotal: args.courtPhotos?.totalFromCourt ?? undefined,
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

async function openCaseTab(page: Page) {
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll("a, button, li, span"));
    const t = tabs.find((el) => (el.textContent || "").trim() === "사건내역");
    t?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await page.waitForTimeout(1200);
}

/** #mf_wfm_mainFrame_grp_lstDtsLimtMin — 목록 1건·다건 */
async function extractListDetails(page: Page): Promise<AuctionListDetailRow[]> {
  const snap = await page.evaluate(() => {
    const root = document.querySelector("#mf_wfm_mainFrame_grp_lstDtsLimtMin");
    const fallbackText = root
      ? (root as HTMLElement).innerText || ""
      : "";
    const table = root?.querySelector("table");
    const tableRows: { noText: string; kind: string; detail: string }[] = [];
    if (table) {
      for (const tr of Array.from(table.querySelectorAll("tr"))) {
        const tds = Array.from(tr.querySelectorAll("td"));
        if (tds.length < 3) continue;
        tableRows.push({
          noText: (tds[0].textContent || "").trim(),
          kind: (tds[1].textContent || "").trim(),
          detail: (tds[2] as HTMLElement).innerText || tds[2].textContent || "",
        });
      }
    }
    return { tableRows, fallbackText };
  });
  return parseListDetailsFromDomSnapshot(snap);
}

/**
 * 물건상세조회 — 감정평가요항(aeeWevlMnpntLst)이 사건검색만으로는 안 오는 종류(토지 등)에 필요.
 * gen_gdsDts_{index} 는 물건내역 순서(0-based).
 */
async function openItemDetail(page: Page, listIndex: number): Promise<boolean> {
  const sel = `#mf_wfm_mainFrame_gen_gdsDts_${listIndex}_btn_gdsDtlInq`;
  const primary = page.locator(sel);
  if ((await primary.count()) > 0) {
    await primary.first().click({ force: true });
    await page.waitForTimeout(4000);
    return true;
  }
  const alt = page.locator('input[id*="btn_gdsDtlInq"], input[value="물건상세조회"]');
  if ((await alt.count()) === 0) return false;
  await alt.first().click({ force: true });
  await page.waitForTimeout(4000);
  return true;
}

async function waitForAppraisalPoints(
  latestPoints: { current: AppraisalPoint[] | null },
  attempts = 8,
  gapMs = 400,
): Promise<AppraisalPoint[]> {
  for (let i = 0; i < attempts; i++) {
    if (latestPoints.current?.length) return latestPoints.current;
    await new Promise((r) => setTimeout(r, gapMs));
  }
  return latestPoints.current || [];
}

async function collectAppraisalSummary(
  page: Page,
  latestPoints: { current: AppraisalPoint[] | null },
  listIndex: number,
  reSearch?: () => Promise<void>,
): Promise<string> {
  // 법원 화면의 「감정평가요항표」 전체 텍스트를 우선 (wq_uuid 고정 id는 사용하지 않음)
  let hasBtn = (await page.locator('input[id*="btn_gdsDtlInq"]').count()) > 0;
  if (!hasBtn && reSearch) {
    await reSearch();
    hasBtn = (await page.locator('input[id*="btn_gdsDtlInq"]').count()) > 0;
  }

  if (hasBtn) {
    // 사건검색 단계의 불완전/다른 물건 요항을 쓰지 않도록 초기화
    latestPoints.current = null;
    const opened = await openItemDetail(page, listIndex);
    if (opened) {
      await waitForAppraisalPoints(latestPoints, 10, 400);
      const fromDom = cleanAppraisalText(await extractAppraisalSummaryFromDom(page));
      // 실제 요항 본문(항목 라벨)이 있을 때만 DOM 채택
      if (
        fromDom.length >= 80 &&
        /위치 및|교통상황|이용상태|토지이용계획|건물구조|임대관계|도로상태/.test(fromDom)
      ) {
        return fromDom;
      }
    }
  }

  // DOM에 없으면 API aeeWevlMnpntLst 전체 (글자 수 제한 없음 · "없음" 포함)
  const fromApi = formatAppraisalSummary(
    latestPoints.current?.length
      ? latestPoints.current
      : await waitForAppraisalPoints(latestPoints, 6, 400),
  );
  if (fromApi) return fromApi;

  return cleanAppraisalText(await extractAppraisalSummaryFromDom(page));
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

    const latestPoints: { current: AppraisalPoint[] | null } = { current: null };
    const latestDxdy: { current: unknown | null } = { current: null };
    const latestSrch: { current: unknown | null } = { current: null };
    const latestDocs: { current: unknown | null } = { current: null };
    page.on("response", async (res) => {
      const url = res.url();
      try {
        if (/selectAuctnCsSrchRslt\.on/i.test(url)) {
          const json = await res.json();
          // 물건 목록이 있는 응답을 우선 유지 (이후 탭 호출이 빈 목록으로 덮어쓰지 않도록)
          const gds = parseItemsFromSrchJson(json);
          if (gds.length || !latestSrch.current) latestSrch.current = json;
          const points = extractAppraisalPointsFromJson(json);
          if (points.length) latestPoints.current = points;
          return;
        }
        if (/selectCsDtlDxdyDts\.on/i.test(url)) {
          latestDxdy.current = await res.json();
          return;
        }
        if (/selectDlvrOfdocDtsDtl\.on/i.test(url)) {
          latestDocs.current = await res.json();
        }
      } catch {
        /* ignore non-JSON */
      }
    });

    await searchCase(page, court, caseYear, caseSerial);
    for (let i = 0; i < 16 && !latestSrch.current; i++) {
      await page.waitForTimeout(250);
    }

    let text = await page.locator("body").innerText();
    const caseNumber = `${caseYear}타경${caseSerial}`;
    if (!text.includes(caseNumber)) {
      return {
        ok: false,
        error: "법원경매 사이트에서 해당 사건을 찾지 못했습니다. 관할법원·연도·번호를 확인해 주세요.",
      };
    }

    // 문건/송달내역 탭
    await page.evaluate(() => {
      const el = document.querySelector(
        "#mf_wfm_mainFrame_tac_srchRsltDvs_tab_tabs3",
      ) as HTMLElement | null;
      if (el) {
        el.click();
        return;
      }
      const tabs = Array.from(document.querySelectorAll("a, button, li, span"));
      const t = tabs.find((n) => /문건\s*\/?\s*송달/.test((n.textContent || "").trim()));
      t?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    for (let i = 0; i < 12 && !latestDocs.current; i++) {
      await page.waitForTimeout(300);
    }

    await openScheduleTab(page);
    for (let i = 0; i < 12 && !latestDxdy.current; i++) {
      await page.waitForTimeout(300);
    }
    const scheduleText = await page.locator("body").innerText();
    // back to 사건내역 for item/parcel parse stability
    await openCaseTab(page);
    text = await page.locator("body").innerText();
    const fullText = `${text}\n${scheduleText}`;

    // 목록내역(상세)·사진은 물건상세조회 화면에서 수집
    let listDetails: AuctionListDetailRow[] = [];
    let courtPhotos: CourtPhotoPersistResult | null = null;

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

    // 물건내역: API(dlt_dspslGdsDspslObjctLst) 우선 — 탭 전환 후 DOM 파싱이 자주 실패함
    const itemStart = text.indexOf("물건내역");
    const itemEnd = listIdx > itemStart ? listIdx : itemStart + 6000;
    const itemSection = itemStart >= 0 ? text.slice(itemStart, itemEnd) : "";
    let allItems = latestSrch.current
      ? parseItemsFromSrchJson(latestSrch.current)
      : [];
    if (!allItems.length) {
      allItems = parseItems(itemSection);
    }
    // API·DOM 모두 비었을 때 검색 직후 본문으로 한 번 더
    if (!allItems.length) {
      const raw = await page.locator("body").innerText();
      const s = raw.indexOf("물건내역");
      const e = raw.indexOf("목록내역");
      if (s >= 0) {
        allItems = parseItems(raw.slice(s, e > s ? e : s + 6000));
      }
    }
    if (!allItems.length) {
      const endResult = pickAfterLabel(basic, "종국결과") || "";
      return {
        ok: false,
        error: endResult
          ? `사건은 찾았으나 물건내역이 없습니다 (종국결과: ${endResult}). 수동 입력해 주세요.`
          : "사건은 찾았으나 물건내역을 읽지 못했습니다. 수동 입력해 주세요.",
      };
    }

    let items = allItems;
    if (input.itemNo != null && input.itemNo > 0) {
      const filtered = allItems.filter((it) => it.itemNo === input.itemNo);
      if (!filtered.length) {
        return {
          ok: false,
          error: `물건번호 ${input.itemNo}을(를) 찾지 못했습니다. (등록 물건: ${allItems.map((i) => i.itemNo).join(", ")})`,
        };
      }
      items = filtered;
    }

    const parcels = parseParcels(text);

    // 기일내역: selectCsDtlDxdyDts (최저매각가격·기일결과) 우선, DOM 탭파싱 폴백
    const scheduleByItem = new Map<number, ScheduleRow[]>();
    for (const it of items) {
      const fromApi = latestDxdy.current
        ? parseScheduleFromDxdyJson(latestDxdy.current, it.itemNo)
        : [];
      const rows = fromApi.length ? fromApi : parseSchedule(fullText, it.itemNo);
      if (rows.length) scheduleByItem.set(it.itemNo, rows);
    }

    // 감정평가요약 + 목록내역(상세) — 물건상세조회 진입 필요
    const appraisalByItem = new Map<number, string>();
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const listIndex = Math.max(
        0,
        allItems.findIndex((x) => x.itemNo === it.itemNo),
      );

      if (i > 0) {
        latestPoints.current = null;
        await searchCase(page, court, caseYear, caseSerial);
      }

      if (!listDetails.length || !courtPhotos) {
        const opened = await openItemDetail(page, listIndex);
        if (opened) {
          if (!listDetails.length) {
            listDetails = await extractListDetails(page);
            if (!listDetails.length) {
              const body = await page.locator("body").innerText();
              const listStart = body.indexOf("목록내역");
              if (listStart >= 0) {
                const after = body.slice(listStart);
                const cut = after.search(
                  /\n(?:당사자내역|기일내역|목록구분이 집합건물|감정평가요항|COPYRIGHT)/,
                );
                listDetails = parseListDetailsFromDomSnapshot({
                  tableRows: [],
                  fallbackText: cut > 0 ? after.slice(0, cut) : after.slice(0, 8000),
                });
              }
            }
          }
          if (!courtPhotos) {
            const rawPhotos = await extractCourtPhotosFromPage(page);
            if (rawPhotos.length) {
              courtPhotos = await persistCourtPhotos(rawPhotos);
            } else {
              courtPhotos = { urls: [], totalFromCourt: 0, truncated: false };
            }
          }
        }
      }

      const summary = await collectAppraisalSummary(
        page,
        latestPoints,
        listIndex,
        () => searchCase(page, court, caseYear, caseSerial),
      );
      if (summary) appraisalByItem.set(it.itemNo, summary);
    }

    // 현황조사서 (사건 단위 — 없으면 null)
    await searchCase(page, court, caseYear, caseSerial);
    const statusReport = await collectStatusReport(page, court);

    // 사건상세(사건내역 + 문건/송달) — 검색 API + 문건탭 API
    let caseDetail: CaseDetail | null = latestSrch.current
      ? parseCaseDetailFromSrchJson(latestSrch.current, court, input.itemNo ?? null)
      : null;
    if (caseDetail && latestDocs.current) {
      caseDetail = mergeDocsIntoCaseDetail(caseDetail, latestDocs.current);
    } else if (!caseDetail && latestDocs.current) {
      // 검색 JSON이 비어도 문건만이라도
      caseDetail = mergeDocsIntoCaseDetail(
        parseCaseDetailFromSrchJson(
          { data: { dma_csBasInf: { userCsNo: caseNumber, cortSptNm: court } } },
          court,
          input.itemNo ?? null,
        ) || {
          available: true,
          court,
          basic: {
            caseNumber,
            caseName: auctionType,
            receivedAt,
            startedAt,
            dept: "",
            claimAmount,
            appealStay: "",
            finalResult: "",
            finalDate: "",
          },
          dividendDeadlines: dividendDeadline
            ? [{ listNo: 1, address: "", deadline: dividendDeadline }]
            : [],
          appeals: [],
          relatedCases: [],
          item: {
            itemNo: items[0]?.itemNo || 1,
            itemType: items[0]?.itemType || "",
            appraisalPrice: items[0]?.appraisalPrice || 0,
            minPrice: items[0]?.minPrice || 0,
            bidDeposit: items[0]?.bidDeposit || 0,
            remarks: items[0]?.remarks || "",
            status: "",
            saleDateLabel: items[0]?.saleDateLabel || "",
            recentResult: items[0]?.recentResult || "",
          },
          lists: [],
          parties: [],
          docProcess: [],
          services: [],
        },
        latestDocs.current,
      );
    }

    if (caseDetail && listDetails.length) {
      caseDetail = {
        ...caseDetail,
        lists: listDetailsToCaseListRows(listDetails),
      };
    }

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
      appraisalByItem,
      scheduleByItem,
      caseDetail,
      statusReport,
      listDetails,
      courtPhotos,
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
