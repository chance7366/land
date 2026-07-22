import * as cheerio from "cheerio";
import {
  NEWS_FEED_COLLECT_FROM,
  NEWS_FEED_MAX_LIST_PAGES,
  NEWS_FEED_NAVER_MAX_ITEMS,
  NEWS_FEED_RTECH_MAX_PAGES,
  NEWS_FEED_SOURCES,
  R114_WIKI_COLLECT_CATEGORIES,
  getNewsFeedSourceMeta,
  isNewsFeedPubDateCollectable,
  type CollectedNewsItem,
  type NewsFeedSourceId,
} from "@/lib/news-feed";
import { MOCK_RTECH_NEWS, RTECH_PRESS } from "@/lib/mockup/rtech-news-sample";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const HONGSEONG_GOSI_LIST =
  "https://www.hongseong.go.kr/prog/saeolGosi/kor/sub03_0204/GOSI_ALL/list.do";

function formatYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** 한줄 요약. "1. " "2. " 번호 목록의 마침표에서는 끊지 않음 */
function toOneLineSummary(text: string, max = 160): string {
  const body = text.replace(/\s+/g, " ").trim();
  if (!body) return "";
  const first =
    body.split(/(?<=(?<!\d)[.。])\s+/)[0]?.trim() || body;
  return first.slice(0, max);
}

/** 홍성군청: 공통 세션 안내 위젯 문자열 오탐 없이, 실제 상세 제목이 만료일 때만 true */
function isHongseongSessionExpiredPage($: cheerio.CheerioAPI): boolean {
  const tit = $(".bbs--view--tit, .bbs--view--header h2")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim();
  if (/세션\s*만료/i.test(tit)) return true;
  // 게시 본문 영역이 없고 안내 제목만 있는 경우
  if (!tit && !$(".bbs--view--cont, .bbs--view--content").length) {
    const h4 = $("h4").first().text().replace(/\s+/g, " ").trim();
    if (/세션\s*만료/i.test(h4)) return true;
  }
  return false;
}

/** 국토부 TMOSH·일부 지자체 세션 쿠키를 따라가며 HTML 수집 */
async function fetchHtml(url: string): Promise<string | null> {
  let cookie = "";
  let finalUrl = url;
  try {
    for (let hop = 0; hop < 8; hop += 1) {
      const res = await fetch(finalUrl, {
        headers: {
          "User-Agent": UA,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
          ...(cookie ? { Cookie: cookie } : {}),
        },
        signal: AbortSignal.timeout(25000),
        redirect: "manual",
      });

      const setCookies = res.headers.getSetCookie?.() ?? [];
      if (setCookies.length > 0) {
        const map = new Map<string, string>();
        for (const part of cookie.split("; ").filter(Boolean)) {
          const i = part.indexOf("=");
          if (i > 0) map.set(part.slice(0, i), part);
        }
        for (const raw of setCookies) {
          const part = raw.split(";")[0]?.trim();
          if (!part) continue;
          const i = part.indexOf("=");
          if (i > 0) map.set(part.slice(0, i), part);
        }
        cookie = [...map.values()].join("; ");
      }

      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) {
          console.warn("[news-feed] redirect without location", finalUrl);
          return null;
        }
        finalUrl = new URL(loc, finalUrl).toString();
        continue;
      }

      if (!res.ok) {
        console.warn("[news-feed] HTTP", res.status, finalUrl);
        return null;
      }
      return await res.text();
    }
    console.warn("[news-feed] too many redirects", url);
    return null;
  } catch (err) {
    console.warn(
      "[news-feed] fetch failed",
      url,
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

function absUrl(base: string, href: string | undefined): string | null {
  if (!href) return null;
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function parseLooseDate(text: string): Date | null {
  const m = text.match(/(\d{4})[.\-/년]\s*(\d{1,2})[.\-/월]\s*(\d{1,2})/);
  if (m) {
    return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  }
  return null;
}

function uniqueByUrl(items: CollectedNewsItem[]): CollectedNewsItem[] {
  const seen = new Set<string>();
  const out: CollectedNewsItem[] = [];
  for (const item of items) {
    if (!item.title.trim() || !item.originUrl) continue;
    if (seen.has(item.originUrl)) continue;
    seen.add(item.originUrl);
    out.push(item);
  }
  return out;
}

function filterCollectable(items: CollectedNewsItem[]): CollectedNewsItem[] {
  return items.filter((i) => isNewsFeedPubDateCollectable(i.pubDate, i.source));
}

function withCollectRanks(items: CollectedNewsItem[]): CollectedNewsItem[] {
  return items.map((item, i) => ({ ...item, rank: i + 1 }));
}


/** 네이버 부동산 헤드라인 — airsList.naver API (SSR 목록은 비어 있음) */
type NaverAirsRow = {
  pressCorporationId?: string;
  pressCorporationName?: string;
  articleId?: string;
  title?: string;
  summaryContent?: string;
  linkUrl?: string;
  thumbnail?: string;
  publishDateTime?: string;
};

type NaverAirsResponse = {
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalElements?: number;
  list?: NaverAirsRow[];
};

function formatYmdKst(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

async function collectNaver(): Promise<CollectedNewsItem[]> {
  const meta = getNewsFeedSourceMeta("naver");
  const items: CollectedNewsItem[] = [];
  const baseDate = formatYmdKst();
  let totalPages = 1;

  for (let page = 1; page <= 30; page += 1) {
    let data: NaverAirsResponse | null = null;
    try {
      const res = await fetch(
        `https://land.naver.com/news/airsList.naver?baseDate=${encodeURIComponent(baseDate)}&page=${page}&size=20`,
        {
          headers: {
            "User-Agent": UA,
            Accept: "application/json, text/javascript, */*; q=0.01",
            "X-Requested-With": "XMLHttpRequest",
            Referer: meta.listUrl,
            "Accept-Language": "ko-KR,ko;q=0.9",
          },
          signal: AbortSignal.timeout(20000),
        },
      );
      if (!res.ok) {
        if (page === 1) throw new Error(`naver airsList HTTP ${res.status}`);
        break;
      }
      data = (await res.json()) as NaverAirsResponse;
    } catch (err) {
      if (page === 1) {
        throw err instanceof Error ? err : new Error("naver airsList fetch failed");
      }
      console.warn("[news-feed] naver page failed", page, err);
      break;
    }

    const list = data?.list ?? [];
    if (page === 1) {
      totalPages = Math.max(1, Number(data?.totalPages) || 1);
      if (list.length === 0) throw new Error("naver airsList empty");
    }
    if (list.length === 0) break;

    for (const row of list) {
      const oid = (row.pressCorporationId ?? "").trim();
      const aid = (row.articleId ?? "").trim();
      const title = (row.title ?? "").replace(/\s+/g, " ").trim();
      if (!title || !oid || !aid) continue;

      const originUrl = `https://n.news.naver.com/article/${oid}/${aid}`;
      const pubDate = row.publishDateTime ? new Date(row.publishDateTime) : null;
      if (!pubDate || Number.isNaN(pubDate.getTime())) continue;
      if (!isNewsFeedPubDateCollectable(pubDate, "naver")) continue;

      const summary = (row.summaryContent ?? "").replace(/\s+/g, " ").trim().slice(0, 220);
      const thumb = (row.thumbnail ?? "").trim();
      const imageUrl = thumb
        ? thumb.includes("?")
          ? thumb
          : `${thumb}?type=nf142_103`
        : null;

      items.push({
        source: "naver",
        sourceName: meta.label,
        title,
        summary,
        press: (row.pressCorporationName ?? "").trim().slice(0, 40),
        originUrl,
        imageUrl,
        pubDate,
      });
    }

    if (page >= totalPages) break;
  }

  return withCollectRanks(
    filterCollectable(uniqueByUrl(items)).slice(0, NEWS_FEED_NAVER_MAX_ITEMS),
  );
}

/** 국토교통부 보도자료 — 2026-01-01 이후 목록 페이지네이션 → dtl.jsp 상세 */
async function collectMolit(): Promise<CollectedNewsItem[]> {
  const meta = getNewsFeedSourceMeta("molit");
  const fromYmd = formatYmd(NEWS_FEED_COLLECT_FROM);
  const items: CollectedNewsItem[] = [];
  let stop = false;

  for (let page = 1; page <= NEWS_FEED_MAX_LIST_PAGES && !stop; page += 1) {
    const listUrl = `${meta.listUrl}${meta.listUrl.includes("?") ? "&" : "?"}search_regdate_s=${fromYmd}&lcmspage=${page}`;
    const html = await fetchHtml(listUrl);
    if (!html) {
      if (page === 1) throw new Error("molit list fetch failed");
      break;
    }
    const $ = cheerio.load(html);
    const rows = $("#cont-body table tbody tr");
    const list =
      rows.length > 0
        ? rows
        : $("#cont-body table tr").filter((_, el) => $(el).find("td").length > 0);

    if (list.length === 0) break;

    let pageHadCollectable = false;
    const pageOldest: { v: Date | null } = { v: null };

    list.each((_, el) => {
      const a = $(el).find("a[href*='dtl.jsp'], a[href*='DTL.jsp'], a").first();
      const title = a.text().replace(/\s+/g, " ").trim().replace(/\s*새글\s*$/, "").trim();
      const href = a.attr("href");
      if (!title || title.length < 4 || !href) return;
      if (!/dtl\.jsp/i.test(href) && !/[?&]id=\d+/i.test(href)) return;
      const originUrl = absUrl(listUrl, href);
      if (!originUrl || !/dtl\.jsp/i.test(originUrl)) return;

      const cells = $(el)
        .find("td")
        .map((__, td) => $(td).text().replace(/\s+/g, " ").trim())
        .get();
      const dateCell = cells.find((c) => /\d{4}-\d{2}-\d{2}/.test(c)) ?? $(el).text();
      const pubDate = parseLooseDate(dateCell);
      if (!pubDate) return;
      if (!pageOldest.v || pubDate.getTime() < pageOldest.v.getTime()) pageOldest.v = pubDate;
      if (!isNewsFeedPubDateCollectable(pubDate)) return;
      pageHadCollectable = true;

      items.push({
        source: "molit",
        sourceName: meta.label,
        title,
        summary: "",
        press: meta.label,
        originUrl,
        imageUrl: null,
        rank: items.length + 1,
        pubDate,
      });
    });

    if (!pageHadCollectable && pageOldest.v && pageOldest.v.getTime() < NEWS_FEED_COLLECT_FROM.getTime()) {
      stop = true;
    }
    if (list.length < 5) stop = true;
  }

  const unique = uniqueByUrl(items);
  // 상세 요약 보강 (국토부 규모는 보통 100건 내외)
  const toEnrich = unique.slice(0, 120);

  for (const item of toEnrich) {
    const detailHtml = await fetchHtml(item.originUrl);
    if (!detailHtml) continue;
    const $$ = cheerio.load(detailHtml);
    const h4 = $$("#cont-body > div.bd_view > h4, .bd_view h4").first().text().replace(/\s+/g, " ").trim();
    if (h4) item.title = h4;
    const dept =
      $$("#cont-body > div.bd_view > ul.bd_view_ul_info > li:nth-child(1) span, .bd_view_ul_info > li:first-child span")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim() ||
      $$(".bd_view_ul_info > li")
        .first()
        .find("span")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim();
    if (dept) item.press = dept;
    const bullets = $$("#cont-body > div.bd_view > ul.bd_view_ul_lst li, .bd_view_ul_lst li")
      .map((_, li) => $$(li).text().replace(/\s+/g, " ").trim())
      .get()
      .filter(Boolean);
    if (bullets.length) {
      item.summary = toOneLineSummary(bullets.slice(0, 3).join(" "), 220);
      continue;
    }
    // 주택통계 등 불릿 없는 보도자료: 본문 영역 폴백
    const viewCont = $$(".view_cont, #cont-body .view_cont, .bd_view .view_cont")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    if (viewCont.length >= 8) {
      item.summary = toOneLineSummary(viewCont, 220);
      continue;
    }
    const cleaned = $$(".bd_view").clone();
    cleaned.find("script, style, .bd_view_ul_info, .share_box, .page_share01, noscript").remove();
    const fallback = cleaned.text().replace(/\s+/g, " ").trim();
    // 제목(h4) 중복 제거
    const withoutTitle = h4 && fallback.startsWith(h4) ? fallback.slice(h4.length).trim() : fallback;
    if (withoutTitle.length >= 8) {
      item.summary = toOneLineSummary(withoutTitle, 220);
    }
  }

  return withCollectRanks(filterCollectable(unique));
}

/** 충남도청 최근소식 — 2026-01-01 이후, 공지 행 제외 */
async function collectChungnam(): Promise<CollectedNewsItem[]> {
  const meta = getNewsFeedSourceMeta("chungnam");
  const items: CollectedNewsItem[] = [];
  let stop = false;

  for (let page = 1; page <= NEWS_FEED_MAX_LIST_PAGES && !stop; page += 1) {
    const listUrl = `${meta.listUrl}${meta.listUrl.includes("?") ? "&" : "?"}pageIndex=${page}`;
    const html = await fetchHtml(listUrl);
    if (!html) {
      if (page === 1) throw new Error("chungnam list fetch failed");
      break;
    }
    const $ = cheerio.load(html);
    const rows = $("#content .txt-board table tbody tr, .txt-board table tbody tr");
    if (rows.length === 0) break;

    let pageHadCollectable = false;
    const pageOldest: { v: Date | null } = { v: null };

    rows.each((_, el) => {
      const tds = $(el)
        .find("td")
        .map((__, td) => $(td).text().replace(/\s+/g, " ").trim())
        .get();
      const num = tds[0] ?? "";
      if (!num || num.includes("공지")) return;

      const a = $(el).find('a[href*="view.do"], a').first();
      const title = a.text().replace(/\s+/g, " ").trim();
      const href = a.attr("href");
      if (!title || !href || !/view\.do/i.test(href)) return;
      const originUrl = absUrl(listUrl, href);
      if (!originUrl) return;

      const dept = tds[3] || tds[2] || meta.label;
      const dateCell = tds.find((c) => /\d{4}-\d{2}-\d{2}/.test(c)) ?? "";
      const pubDate = parseLooseDate(dateCell);
      if (!pubDate) return;
      if (!pageOldest.v || pubDate.getTime() < pageOldest.v.getTime()) pageOldest.v = pubDate;
      if (!isNewsFeedPubDateCollectable(pubDate)) return;
      pageHadCollectable = true;

      items.push({
        source: "chungnam",
        sourceName: meta.label,
        title,
        summary: "",
        press: dept,
        originUrl,
        imageUrl: null,
        rank: items.length + 1,
        pubDate,
      });
    });

    if (!pageHadCollectable && pageOldest.v && pageOldest.v.getTime() < NEWS_FEED_COLLECT_FROM.getTime()) {
      stop = true;
    }
    if (rows.length < 5) stop = true;
  }

  const unique = uniqueByUrl(items);
  // 상세 #dbdata 본문으로 한줄 요약 보강 (최근분 우선)
  const toEnrich = unique.slice(0, 150);

  for (const item of toEnrich) {
    const detailHtml = await fetchHtml(item.originUrl);
    if (!detailHtml) continue;
    const $$ = cheerio.load(detailHtml);
    const h =
      $$(".board-view .subject, .board-view h3, .bbs_view h3, .view_title")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim() || item.title;
    if (h && h.length > 4) item.title = h;

    // 본문: #dbdata > p:nth-child(1) 우선
    let body = $$("#dbdata > p")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    if (!body || body.length < 8) {
      body = $$("#dbdata > p > span")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim();
    }
    if (!body || body.length < 8) {
      body = $$("#dbdata").text().replace(/\s+/g, " ").trim();
    }
    if (body) item.summary = toOneLineSummary(body);
  }

  return withCollectRanks(filterCollectable(unique));
}

async function collectHongseongNoticeBoard(): Promise<CollectedNewsItem[]> {
  const meta = getNewsFeedSourceMeta("hongseong");
  const items: CollectedNewsItem[] = [];
  let stop = false;

  for (let page = 1; page <= NEWS_FEED_MAX_LIST_PAGES && !stop; page += 1) {
    const listUrl = `${meta.listUrl}${meta.listUrl.includes("?") ? "&" : "?"}pageIndex=${page}`;
    const html = await fetchHtml(listUrl);
    if (!html) {
      if (page === 1) throw new Error("hongseong notice list fetch failed");
      break;
    }
    const $ = cheerio.load(html);
    const rows = $("table tbody tr, .bbs_list tr, .board_list tr").filter(
      (_, el) => $(el).find("td").length > 0,
    );
    if (rows.length === 0) break;

    let pageHadCollectable = false;
    const pageOldest: { v: Date | null } = { v: null };

    rows.each((_, el) => {
      const firstTd = $(el).find("td").first().text().replace(/\s+/g, " ").trim();
      if (firstTd === "공지" || firstTd.includes("공지")) return;

      const onclick =
        $(el).find("[onclick*='fn_search_detail']").attr("onclick") ||
        $(el).find("a[onclick*='fn_search_detail']").attr("onclick") ||
        "";
      const nttMatch = onclick.match(/fn_search_detail\(['"]([^'"]+)['"]\)/);
      const a = $(el).find("a[href*='view.do'], a[href*='nttId'], a").first();
      const title = (
        a.text() ||
        $(el).find("td").eq(1).text() ||
        ""
      )
        .replace(/\s+/g, " ")
        .trim();
      if (!title || title.length < 4) return;

      let originUrl: string | null = null;
      if (nttMatch?.[1]) {
        originUrl = `https://www.hongseong.go.kr/bbs/BBSMSTR_000000000841/view.do?nttId=${encodeURIComponent(nttMatch[1])}`;
      } else {
        const href = a.attr("href");
        originUrl = absUrl(listUrl, href);
      }
      if (!originUrl || !/view\.do|nttId/i.test(originUrl)) return;

      const tds = $(el)
        .find("td")
        .map((__, td) => $(td).text().replace(/\s+/g, " ").trim())
        .get();
      const dept = tds.find((c) => /과$|담당관$|팀$/.test(c)) || tds[2] || meta.label;
      const dateCell = tds.find((c) => /\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}/.test(c)) ?? "";
      const pubDate = parseLooseDate(dateCell);
      if (!pubDate) return;
      if (!pageOldest.v || pubDate.getTime() < pageOldest.v.getTime()) pageOldest.v = pubDate;
      if (!isNewsFeedPubDateCollectable(pubDate, "hongseong")) return;
      pageHadCollectable = true;

      items.push({
        source: "hongseong",
        sourceName: meta.label,
        title,
        summary: "",
        press: dept,
        originUrl,
        imageUrl: null,
        rank: items.length + 1,
        pubDate,
      });
    });

    if (!pageHadCollectable && pageOldest.v && pageOldest.v.getTime() < NEWS_FEED_COLLECT_FROM.getTime()) {
      stop = true;
    }
    if (rows.length < 5) stop = true;
  }

  return items;
}

async function collectHongseongGosiBoard(): Promise<CollectedNewsItem[]> {
  const meta = getNewsFeedSourceMeta("hongseong");
  const items: CollectedNewsItem[] = [];
  let stop = false;

  for (let page = 1; page <= NEWS_FEED_MAX_LIST_PAGES && !stop; page += 1) {
    const listUrl = `${HONGSEONG_GOSI_LIST}${HONGSEONG_GOSI_LIST.includes("?") ? "&" : "?"}pageIndex=${page}`;
    const html = await fetchHtml(listUrl);
    if (!html) {
      if (page === 1) throw new Error("hongseong gosi list fetch failed");
      break;
    }
    const $ = cheerio.load(html);
    const rows = $("table tbody tr, .bbs_list tr, .board_list tr").filter(
      (_, el) => $(el).find("td").length > 0,
    );
    if (rows.length === 0) break;

    let pageHadCollectable = false;
    const pageOldest: { v: Date | null } = { v: null };

    rows.each((_, el) => {
      const a = $(el).find("a[href*='view.do'], a[href*='notAncmtMgtNo'], a").first();
      const title = a.text().replace(/\s+/g, " ").trim();
      const href = a.attr("href");
      if (!title || title.length < 4 || !href) return;
      const originUrl = absUrl(listUrl, href);
      if (!originUrl || !/view\.do|notAncmtMgtNo/i.test(originUrl)) return;

      const tds = $(el)
        .find("td")
        .map((__, td) => $(td).text().replace(/\s+/g, " ").trim())
        .get();
      const dept = tds.find((c) => /과$|담당관$|팀$/.test(c)) || tds[tds.length - 2] || meta.label;
      const dateCell = tds.find((c) => /\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}/.test(c)) ?? "";
      const pubDate = parseLooseDate(dateCell);
      if (!pubDate) return;
      if (!pageOldest.v || pubDate.getTime() < pageOldest.v.getTime()) pageOldest.v = pubDate;
      if (!isNewsFeedPubDateCollectable(pubDate)) return;
      pageHadCollectable = true;

      items.push({
        source: "hongseong",
        sourceName: meta.label,
        title,
        summary: "",
        press: dept,
        originUrl,
        imageUrl: null,
        rank: items.length + 1,
        pubDate,
      });
    });

    if (!pageHadCollectable && pageOldest.v && pageOldest.v.getTime() < NEWS_FEED_COLLECT_FROM.getTime()) {
      stop = true;
    }
    if (rows.length < 5) stop = true;
  }

  return items;
}

/** 홍성군청 — 공지사항 + 공고/고시, 2026-01-01 이후 */
async function collectHongseong(): Promise<CollectedNewsItem[]> {
  const meta = getNewsFeedSourceMeta("hongseong");
  const settled = await Promise.allSettled([
    collectHongseongNoticeBoard(),
    collectHongseongGosiBoard(),
  ]);
  const notice = settled[0].status === "fulfilled" ? settled[0].value : [];
  const gosi = settled[1].status === "fulfilled" ? settled[1].value : [];
  if (settled[0].status === "rejected" && settled[1].status === "rejected") {
    const a = settled[0].reason instanceof Error ? settled[0].reason.message : "notice failed";
    const b = settled[1].reason instanceof Error ? settled[1].reason.message : "gosi failed";
    throw new Error(`hongseong: ${a}; ${b}`);
  }
  if (settled[0].status === "rejected") {
    console.warn("[news-feed] hongseong notice failed", settled[0].reason);
  }
  if (settled[1].status === "rejected") {
    console.warn("[news-feed] hongseong gosi failed", settled[1].reason);
  }
  const unique = uniqueByUrl([...notice, ...gosi]);
  // 상세 `.bbs--view--cont` 본문 보강 (최근분 우선; 공통 세션 위젯 오탐으로 스킵하지 않음)
  const toEnrich = unique.slice(0, 150);

  for (const item of toEnrich) {
    const detailHtml = await fetchHtml(item.originUrl);
    if (!detailHtml) continue;

    const $$ = cheerio.load(detailHtml);
    if (isHongseongSessionExpiredPage($$)) continue;

    const h = $$(".bbs--view--tit, .bbs--view--header h2, #txt h2")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .replace(/\s*새글\s*/g, " ")
      .trim();
    if (h && h.length > 4 && !/세션\s*만료/i.test(h)) item.title = h;

    const deptFromDetail =
      $$(".bbs--view--header .writer, .bbs--view--opt, .writer, .dept")
        .filter((_, el) => /과$|담당관$|팀$/.test($$(el).text().replace(/\s+/g, " ").trim()))
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim();
    if (deptFromDetail && deptFromDetail.length < 40) item.press = deptFromDetail;

    let body = $$("#txt .bbs--view--cont p, .bbs--view--cont p, .bbs--view--content p")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    if (!body || body.length < 8) {
      body = $$("#txt .bbs--view--cont, .bbs--view--cont, .bbs--view--content, .bbs--detail--cont")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim();
    }
    if (body && !/세션\s*만료/i.test(body)) {
      item.summary = toOneLineSummary(body);
    }
  }

  // press가 비어 있으면 출처명
  for (const item of unique) {
    if (!item.press) item.press = meta.label;
  }

  return withCollectRanks(filterCollectable(unique));
}

/** 부동산테크 부동산뉴스 — getNewsList.do 페이지네이션, 출처 한경 집코노미 */
type RtechNewsApiRow = {
  TITLE?: string;
  LINK?: string;
  PUBDATE?: string;
  RN?: number;
};

type RtechNewsApiResponse = {
  dataList?: RtechNewsApiRow[];
};

async function collectRtech(): Promise<CollectedNewsItem[]> {
  const meta = getNewsFeedSourceMeta("rtech");
  const items: CollectedNewsItem[] = [];
  let stop = false;

  for (let page = 1; page <= NEWS_FEED_RTECH_MAX_PAGES && !stop; page += 1) {
    let data: RtechNewsApiResponse | null = null;
    try {
      const res = await fetch("https://rtech.or.kr/board/getNewsList.do", {
        method: "POST",
        headers: {
          "User-Agent": UA,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json, text/javascript, */*; q=0.01",
          Referer: meta.listUrl,
          "Accept-Language": "ko-KR,ko;q=0.9",
        },
        body: `pageIndex=${page}`,
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) {
        if (page === 1) throw new Error(`rtech HTTP ${res.status}`);
        break;
      }
      const json: unknown = await res.json();
      if (!json || typeof json !== "object" || !Array.isArray((json as RtechNewsApiResponse).dataList)) {
        if (page === 1) throw new Error("rtech invalid JSON shape");
        break;
      }
      data = json as RtechNewsApiResponse;
    } catch (err) {
      if (page === 1) {
        throw err instanceof Error ? err : new Error("rtech fetch failed");
      }
      console.warn("[news-feed] rtech page failed", page, err);
      break;
    }

    const list = data?.dataList ?? [];
    if (list.length === 0) break;

    let pageHadCollectable = false;
    const pageOldest: { v: Date | null } = { v: null };

    for (const row of list) {
      const title = (row.TITLE ?? "").replace(/\s+/g, " ").trim();
      const originUrl = (row.LINK ?? "").trim();
      if (!title || !originUrl || !/^https?:\/\//i.test(originUrl)) continue;

      const pubDate = parseLooseDate(row.PUBDATE ?? "");
      if (!pubDate) continue;
      if (!pageOldest.v || pubDate.getTime() < pageOldest.v.getTime()) pageOldest.v = pubDate;
      if (!isNewsFeedPubDateCollectable(pubDate, "rtech")) continue;
      pageHadCollectable = true;

      items.push({
        source: "rtech",
        sourceName: meta.label,
        title,
        summary: "",
        press: RTECH_PRESS,
        originUrl,
        imageUrl: null,
        rank: items.length + 1,
        pubDate,
      });
    }

    if (
      !pageHadCollectable &&
      pageOldest.v &&
      pageOldest.v.getTime() < NEWS_FEED_COLLECT_FROM.getTime()
    ) {
      stop = true;
    }
  }

  const unique = uniqueByUrl(items);
  // 외부 기사(한경 등) meta description으로 최근분 요약 보강
  const toEnrich = unique.slice(0, 80);
  for (const item of toEnrich) {
    const detailHtml = await fetchHtml(item.originUrl);
    if (!detailHtml) continue;
    const $$ = cheerio.load(detailHtml);
    const desc =
      $$('meta[property="og:description"]').attr("content")?.replace(/\s+/g, " ").trim() ||
      $$('meta[name="description"]').attr("content")?.replace(/\s+/g, " ").trim() ||
      "";
    // 제목 반복·사이트명만 있는 메타는 제외
    if (!desc || desc.length < 12) continue;
    if (desc === item.title) continue;
    const cleaned = desc
      .replace(/\s*[|｜]\s*한국경제.*$/i, "")
      .replace(/\s*,\s*한경닷컴.*$/i, "")
      .trim();
    if (cleaned.length >= 12 && cleaned !== item.title) {
      item.summary = toOneLineSummary(cleaned, 200);
    }
  }

  return withCollectRanks(filterCollectable(unique));
}

/** 부동산114 위키 — 카테고리별 목록 파싱 (제목·요약·날짜·기사 UUID URL) */
async function collectR114(): Promise<CollectedNewsItem[]> {
  const meta = getNewsFeedSourceMeta("r114");
  const items: CollectedNewsItem[] = [];
  let fetchedOk = 0;

  for (const cat of R114_WIKI_COLLECT_CATEGORIES) {
    const html = await fetchHtml(cat.listUrl);
    if (!html) {
      console.warn("[news-feed] r114 category fetch failed", cat.id);
      continue;
    }
    fetchedOk += 1;
    const $ = cheerio.load(html);
    $("main ul li article a, ul li article a.block, ul li article a").each((_, el) => {
      const href = $(el).attr("href") ?? "";
      const originUrl = absUrl(cat.listUrl, href);
      if (!originUrl || !new RegExp(`/trends/wiki/${cat.id}/[^/?#]+`, "i").test(originUrl)) {
        return;
      }

      const title =
        $(el).find("h4, h3, .heading05B").first().text().replace(/\s+/g, " ").trim() ||
        ($(el).attr("title") ?? "").replace(/\s+/g, " ").trim();
      if (!title || title.length < 4) return;

      const summary =
        $(el).find("p").first().text().replace(/\s+/g, " ").trim().slice(0, 220) || "";

      const dateText = $(el).text();
      const pubDate = parseLooseDate(dateText);
      if (!pubDate) return;
      if (!isNewsFeedPubDateCollectable(pubDate, "r114")) return;

      items.push({
        source: "r114",
        sourceName: meta.label,
        title,
        summary,
        press: cat.label,
        originUrl,
        imageUrl: null,
        pubDate,
      });
    });
  }

  if (fetchedOk === 0) throw new Error("r114 all categories fetch failed");
  return withCollectRanks(filterCollectable(uniqueByUrl(items)));
}

const ADAPTERS: Record<NewsFeedSourceId, () => Promise<CollectedNewsItem[]>> = {
  naver: collectNaver,
  molit: collectMolit,
  chungnam: collectChungnam,
  hongseong: collectHongseong,
  yesan: async () => [], // 수집 URL 추후 반영 — 홍성군청과 동일 구성 예정
  rtech: collectRtech,
  r114: collectR114,
};

/** 크롤 실패·빈 결과 시 시드용 폴백 — 제목과 originUrl이 동일 기사로 일치 */
/** 시드/개발용 샘플만. 프로덕션 수집·ensure 경로에서 DB에 넣지 말 것. */
export function fallbackNewsFeedItems(): CollectedNewsItem[] {
  const naverMeta = getNewsFeedSourceMeta("naver");
  const naverSamples: CollectedNewsItem[] = [
    {
      source: "naver",
      sourceName: naverMeta.label,
      title: "분양가 치솟는데 대출은 ‘바늘귀’…무주택자 내집마련 멀어지나요",
      summary:
        "최근 부동산 시장에 무슨 일이? 최근 3기 신도시인 경기 고양창릉지구에 공급되는 이…",
      press: "한겨레",
      originUrl: "https://n.news.naver.com/article/028/0002814156",
      imageUrl:
        "https://imgnews.pstatic.net/image/028/2026/07/15/0002814156_001_20260715073608655.jpg?type=w800",
      rank: 1,
      pubDate: new Date(),
    },
    {
      source: "naver",
      sourceName: naverMeta.label,
      title: "“현금 14억 있어야 된다”…청약통장 26만명 이탈, 집 사는 공식 무너졌다",
      summary:
        "서울 84㎡ 분양가 18억원대 속출…수요자 감당 한계. 대출 규제에 자금 4억원대 묶여…",
      press: "세계일보",
      originUrl: "https://n.news.naver.com/mnews/article/022/0004121844",
      imageUrl:
        "https://imgnews.pstatic.net/image/022/2026/04/19/20260419500499_20260419052211307.jpg?type=w800",
      rank: 2,
      pubDate: new Date(Date.now() - 86400000),
    },
    {
      source: "naver",
      sourceName: naverMeta.label,
      title: "분양가 高高행진에 대출 규제까지…청약통장 ‘무용론’ 부상하나",
      summary:
        "분양가 상승과 대출 규제가 맞물리며 청약통장 실효성에 대한 의문이 커지고 있다…",
      press: "데일리안",
      originUrl: "https://n.news.naver.com/article/119/0003072965",
      imageUrl:
        "https://imgnews.pstatic.net/image/119/2026/03/25/0003072965_001_20260325060114927.jpg?type=w800",
      rank: 3,
      pubDate: new Date(Date.now() - 2 * 86400000),
    },
    {
      source: "naver",
      sourceName: naverMeta.label,
      title: "18억, 16억 분양가에 허탈…청약통장 깨는 사람들",
      summary: "청약통장 5개월간 26만명 이탈…높은 분양가, 바늘구멍 당첨확률에 이탈 가속…",
      press: "SBS",
      originUrl: "https://n.news.naver.com/mnews/article/374/0000506653",
      imageUrl:
        "https://imgnews.pstatic.net/image/374/2026/04/26/0000506653_001_20260426092017348.jpg?type=w800",
      rank: 4,
      pubDate: new Date(Date.now() - 3 * 86400000),
    },
    {
      source: "naver",
      sourceName: naverMeta.label,
      title: "“수백대 1 바늘구멍에 쥐꼬리 이자, 그 돈으로 주식하는게”…청약통장 해지 봇물",
      summary: "분양가 급등·대출규제 겹치며 주택 청약 매력 급속도로 약화. 두 달 새 가입자 10만명 줄어…",
      press: "매일경제",
      originUrl: "https://n.news.naver.com/article/009/0005664422",
      imageUrl:
        "https://imgnews.pstatic.net/image/009/2026/04/11/0005664422_001_20260411110710593.png?type=w800",
      rank: 5,
      pubDate: new Date(Date.now() - 4 * 86400000),
    },
    {
      source: "naver",
      sourceName: naverMeta.label,
      title: "어렵게 당첨되고도 계약포기 속출…‘중도금 무이자’ 분양단지에 몰리는 이유",
      summary:
        "고분양가와 대출 규제 속에 금융 지원책을 제공하는 단지에 실수요 관심이 집중되고…",
      press: "매일경제",
      originUrl: "https://n.news.naver.com/article/009/0005659394",
      imageUrl:
        "https://imgnews.pstatic.net/image/009/2026/04/01/0005659394_001_20260401134906948.png?type=w800",
      rank: 6,
      pubDate: new Date(Date.now() - 5 * 86400000),
    },
  ];

  const molitMeta = getNewsFeedSourceMeta("molit");
  const molitSamples: CollectedNewsItem[] = [
    {
      source: "molit",
      sourceName: molitMeta.label,
      title: "분양가상한제 기본형건축비 비정기 고시",
      summary:
        "3월 1일 정기 고시 이후의 고강도 철근 가격 변동(약 18.6% 상승) 반영 기본형건축비 0.77% 상승(222만 원/㎡→223만 7천 원/㎡)",
      press: "주택정책과",
      originUrl: "https://www.molit.go.kr/USR/NEWS/m_71/dtl.jsp?lcmspage=1&id=95092223",
      imageUrl: null,
      rank: 1,
      pubDate: new Date(),
    },
    {
      source: "molit",
      sourceName: molitMeta.label,
      title: "[장관동정] 김윤덕 장관, 한국토지주택공사 신임 사장에 임명장 전수",
      summary: "‘주택 공급에 전사적 역량 집중’, ‘국가 균형 성장에 LH 핵심 역할’ 강조",
      press: "토지정책과",
      originUrl: "https://www.molit.go.kr/USR/NEWS/m_71/dtl.jsp?lcmspage=1&id=95092225",
      imageUrl: null,
      rank: 2,
      pubDate: new Date(Date.now() - 86400000),
    },
    {
      source: "molit",
      sourceName: molitMeta.label,
      title: "부동산정책, 국민의 목소리를 듣습니다.",
      summary:
        "7월 14일부터 16일까지 공급·금융·세제 분야별 토론회 개최 7월 14일부터 온라인 의견수렴 창구 운영, 누구나 의견 제출 가능",
      press: "부동산제도기획과",
      originUrl: "https://www.molit.go.kr/USR/NEWS/m_71/dtl.jsp?lcmspage=1&id=95092224",
      imageUrl: null,
      rank: 3,
      pubDate: new Date(Date.now() - 86400000),
    },
    {
      source: "molit",
      sourceName: molitMeta.label,
      title: "전세 계약 전 ‘위험신호’ 민간플랫폼서도 한눈에…, 정부-민간, 연계구축 첫걸음",
      summary: "안심전세앱 9월 서비스 개편 후 2027년 민간 외부 연계 확대 본격 추진",
      press: "주택임대차기획팀",
      originUrl: "https://www.molit.go.kr/USR/NEWS/m_71/dtl.jsp?lcmspage=1&id=95092221",
      imageUrl: null,
      rank: 4,
      pubDate: new Date(Date.now() - 86400000),
    },
    {
      source: "molit",
      sourceName: molitMeta.label,
      title: "민간임대주택 관리비 투명성 제고 「민간임대주택법 하위법령」 개정안 입법예고",
      summary:
        "임대차계약 신고 대상에 관리비 및 사용료 추가, 표준임대차계약서 개정 100호 이상 임대단지 임대료 증액비율 조례 제정권 시·도 부여",
      press: "민간임대정책과",
      originUrl: "https://www.molit.go.kr/USR/NEWS/m_71/dtl.jsp?lcmspage=1&id=95092216",
      imageUrl: null,
      rank: 5,
      pubDate: new Date(Date.now() - 2 * 86400000),
    },
    {
      source: "molit",
      sourceName: molitMeta.label,
      title: "[장관동정] 김윤덕 장관, “좋은 집 더 빠르게 공급하도록 모듈러 기술 키울 것”",
      summary: "10일 오전 군산 모듈러 제작 공장 찾아 업계 소통, 주택 공급 기반 강화",
      press: "주택건설운영과",
      originUrl: "https://www.molit.go.kr/USR/NEWS/m_71/dtl.jsp?lcmspage=1&id=95092211",
      imageUrl: null,
      rank: 6,
      pubDate: new Date(Date.now() - 5 * 86400000),
    },
  ];

  const chungnamMeta = getNewsFeedSourceMeta("chungnam");
  const chungnamSamples: CollectedNewsItem[] = [
    {
      source: "chungnam",
      sourceName: chungnamMeta.label,
      title: "충남 해수욕장 방사능 검사 결과 보고서(2026년 7월 2주)",
      summary: "충남 해수욕장 방사능 측정 결과지를 붙임과 같이 게재합니다.",
      press: "해양정책과",
      originUrl:
        "https://www.chungnam.go.kr/cnportal/bbs/B0000400/view.do?nttId=2180268&menuNo=5100288&pageUnit=10&pageIndex=1",
      imageUrl: null,
      rank: 1,
      pubDate: new Date(Date.now() - 86400000),
    },
    {
      source: "chungnam",
      sourceName: chungnamMeta.label,
      title: "세종 「세종 우미 린 센터파크」 장애인 기관추천 특별공급 변경알림(신청일정)",
      summary: "세종 「세종 우미 린 센터파크」 장애인 기관추천 특별공급 신청일정이 변경되어 안내합니다.",
      press: "장애인복지과",
      originUrl:
        "https://www.chungnam.go.kr/cnportal/bbs/B0000134/view.do?nttId=2180210&menuNo=5100288&pageUnit=10&pageIndex=1",
      imageUrl: null,
      rank: 2,
      pubDate: new Date(Date.now() - 2 * 86400000),
    },
    {
      source: "chungnam",
      sourceName: chungnamMeta.label,
      title: "2026년 돼지 반출입 제한 조치 조정 알림('26.7.2.~)",
      summary:
        "1. 가축전염병 예방법 제4조(가축방역심의회), 동물방역위생과-9576(2026.3.19.)호와 관련됩니다.",
      press: "동물방역위생과",
      originUrl:
        "https://www.chungnam.go.kr/cnportal/bbs/B0000239/view.do?nttId=2180122&menuNo=5100288&pageUnit=10&pageIndex=1",
      imageUrl: null,
      rank: 3,
      pubDate: new Date(Date.now() - 5 * 86400000),
    },
    {
      source: "chungnam",
      sourceName: chungnamMeta.label,
      title: "한눈에 보는 건설산업 불법행위 예방가이드",
      summary: "건설산업 불법행위 예방을 위한 안내 자료를 붙임과 같이 게재합니다.",
      press: "건설정책과",
      originUrl:
        "https://www.chungnam.go.kr/cnportal/bbs/B0000134/view.do?nttId=2180056&menuNo=5100288&pageUnit=10&pageIndex=1",
      imageUrl: null,
      rank: 4,
      pubDate: new Date(Date.now() - 6 * 86400000),
    },
    {
      source: "chungnam",
      sourceName: chungnamMeta.label,
      title: "2026년 상반기 확정배출량명세(수질) 제출 안내",
      summary: "2026년 상반기 확정배출량명세(수질) 제출 안내를 첨부와 같이 알려 드립니다.",
      press: "환경관리과",
      originUrl:
        "https://www.chungnam.go.kr/cnportal/bbs/B0000243/view.do?nttId=2179932&menuNo=5100288&pageUnit=10&pageIndex=1",
      imageUrl: null,
      rank: 5,
      pubDate: new Date(Date.now() - 8 * 86400000),
    },
    {
      source: "chungnam",
      sourceName: chungnamMeta.label,
      title: "2026년 상반기 확정배출량명세(대기) 제출 안내",
      summary: "2026년 상반기 확정배출량명세(대기) 제출 안내를 첨부와 같이 알려드립니다.",
      press: "환경관리과",
      originUrl:
        "https://www.chungnam.go.kr/cnportal/bbs/B0000243/view.do?nttId=2179931&menuNo=5100288&pageUnit=10&pageIndex=1",
      imageUrl: null,
      rank: 6,
      pubDate: new Date(Date.now() - 8 * 86400000),
    },
  ];

  const rows: Array<{ source: NewsFeedSourceId; title: string; daysAgo: number }> = [
    { source: "r114", title: "부동산114 전국 아파트 시세·리포트", daysAgo: 1 },
    { source: "r114", title: "부동산114 지역 시세 동향", daysAgo: 5 },
  ];

  const rtechMeta = getNewsFeedSourceMeta("rtech");
  const rtechSamples: CollectedNewsItem[] = MOCK_RTECH_NEWS.map((row) => ({
    source: "rtech" as const,
    sourceName: rtechMeta.label,
    title: row.title,
    summary: "",
    press: row.press,
    originUrl: row.originUrl,
    imageUrl: null,
    rank: row.rank,
    pubDate: new Date(`${row.pubDate}T00:00:00.000Z`),
  }));

  const hongseongMeta = getNewsFeedSourceMeta("hongseong");
  const hongseongSamples: CollectedNewsItem[] = [
    {
      source: "hongseong",
      sourceName: hongseongMeta.label,
      title: "구조안전 위험시설물 주민공지",
      summary:
        "삽교천(국가)에 위치한 제2종시설물 정밀안전점검 결과에 따라 위험등급인 배수통문에 대하여 구조안전 위험시설물임을 공지하오니 해당시설물에 대한 접근을 자제하여 주시기 바랍니다.",
      press: "건설과",
      originUrl:
        "https://www.hongseong.go.kr/bbs/BBSMSTR_000000000841/view.do?nttId=B000000281709Nw1wP9",
      imageUrl: null,
      rank: 1,
      pubDate: new Date(),
    },
    {
      source: "hongseong",
      sourceName: hongseongMeta.label,
      title: "2026년 다목적 농업장비(운반기) 지원사업 추가 신청 알림",
      summary:
        "농작업 효율성 향상을 위한 다목적 농업장비(운반기) 지원사업 신청을 다음과 같이 알려드리니, 사업참여 희망 농업인께서는 주소지 읍면 행정복지센터 산업팀에 신청하여 주시기 바랍니다.",
      press: "농업정책과",
      originUrl:
        "https://www.hongseong.go.kr/bbs/BBSMSTR_000000000841/view.do?nttId=B000000281701Wp1aC2",
      imageUrl: null,
      rank: 2,
      pubDate: new Date(),
    },
    {
      source: "hongseong",
      sourceName: hongseongMeta.label,
      title: "결성면 교항리 취약지역 생활여건 개조사업 시행계획 변경(2차) 승인 고시",
      summary:
        "농어촌정비법 제61조에 따라「결성면 교항리 취약지역 생활여건 개조사업」시행계획 변경(2차)을 다음과 같이 고시합니다.",
      press: "농업정책과",
      originUrl:
        "https://www.hongseong.go.kr/prog/saeolGosi/kor/sub03_0204/GOSI_ALL/view.do?notAncmtMgtNo=44977",
      imageUrl: null,
      rank: 3,
      pubDate: new Date(),
    },
    {
      source: "hongseong",
      sourceName: hongseongMeta.label,
      title: "광천읍 원도심 빈집 재개발사업 폐공동주택 철거공사에 따른 자재 반출 공고(2차)",
      summary:
        "홍성군에서 추진하는 「광천읍 원도심 빈집 재개발사업」과 관련하여 철거 예정인 폐공동주택 내부 및 사업부지 내 장기간 적치되어 있는 자재 및 동산 등에 대하여 다음과 같이 자진 반출 공고(2차)합니다.",
      press: "혁신전략담당관",
      originUrl:
        "https://www.hongseong.go.kr/prog/saeolGosi/kor/sub03_0204/GOSI_ALL/view.do?notAncmtMgtNo=45035",
      imageUrl: null,
      rank: 4,
      pubDate: new Date(),
    },
  ];

  const others = rows.map((row, i) => {
    const meta = getNewsFeedSourceMeta(row.source);
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - row.daysAgo);
    return {
      source: row.source,
      sourceName: meta.label,
      title: row.title,
      originUrl: `${meta.listUrl}${meta.listUrl.includes("?") ? "&" : "?"}chanceRef=${row.source}-${i}`,
      imageUrl: null,
      rank: null,
      summary: "",
      press: "",
      pubDate: d,
    };
  });

  return [
    ...naverSamples,
    ...molitSamples,
    ...chungnamSamples,
    ...hongseongSamples,
    ...rtechSamples,
    ...others,
  ];
}

export async function collectSelectedSources(
  keys: NewsFeedSourceId[],
): Promise<{
  items: CollectedNewsItem[];
  perSource: Record<string, { ok: boolean; count: number; error?: string }>;
}> {
  const perSource: Record<string, { ok: boolean; count: number; error?: string }> = {};
  const all: CollectedNewsItem[] = [];

  for (const key of keys) {
    const started = Date.now();
    console.log(`[news-feed] source start: ${key}`);
    try {
      const items = await ADAPTERS[key]();
      perSource[key] = { ok: true, count: items.length };
      all.push(...items);
      console.log(
        `[news-feed] source ok: ${key} count=${items.length} ${Date.now() - started}ms`,
      );
    } catch (err) {
      perSource[key] = {
        ok: false,
        count: 0,
        error: err instanceof Error ? err.message : "collect failed",
      };
      console.error(
        `[news-feed] source fail: ${key} ${Date.now() - started}ms`,
        err,
      );
    }
  }

  return { items: all, perSource };
}

export async function collectAllSources(): Promise<{
  items: CollectedNewsItem[];
  perSource: Record<NewsFeedSourceId, { ok: boolean; count: number; error?: string }>;
}> {
  const { items, perSource } = await collectSelectedSources(
    NEWS_FEED_SOURCES.map((s) => s.key),
  );
  const typed = perSource as Record<
    NewsFeedSourceId,
    { ok: boolean; count: number; error?: string }
  >;

  // 수집 실패·0건이어도 목업 폴백을 넣지 않음 — 마지막 정상 DB 유지
  return { items: uniqueByUrl(items), perSource: typed };
}
