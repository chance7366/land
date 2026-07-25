import { getPublicDataServiceKey } from "@/lib/public-data/building-ledger";
import { findEndpoint, rtmsUrl } from "./endpoints";
import { normalizeRtmsItem } from "./normalize";
import { parseResultCode, parseTotalCount, parseXmlItems } from "./parse-xml";
import type { NormalizedRtmsRow, RtmsDealType, RtmsPropertyType } from "./types";

const DELAY_MS = 400;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchRtmsMonth(args: {
  propertyType: RtmsPropertyType;
  dealType: RtmsDealType;
  lawdCd: string;
  dealYmd: number; // YYYYMM
}): Promise<{ rows: NormalizedRtmsRow[]; error?: string }> {
  const key = getPublicDataServiceKey();
  if (!key) {
    return { rows: [], error: "PUBLIC_DATA_SERVICE_KEY / MOLIT_SERVICE_KEY 가 없습니다." };
  }
  const ep = findEndpoint(args.propertyType, args.dealType);
  if (!ep) {
    return { rows: [], error: "지원하지 않는 유형 조합입니다." };
  }

  const all: NormalizedRtmsRow[] = [];
  let pageNo = 1;
  const numOfRows = 1000;
  let total = Infinity;

  while ((pageNo - 1) * numOfRows < total) {
    const qs = new URLSearchParams({
      LAWD_CD: args.lawdCd,
      DEAL_YMD: String(args.dealYmd),
      pageNo: String(pageNo),
      numOfRows: String(numOfRows),
    });
    const url = `${rtmsUrl(ep)}?serviceKey=${key}&${qs.toString()}`;
    let text = "";
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/xml, text/xml, */*" },
      });
      text = await res.text();
    } catch (e) {
      return {
        rows: all,
        error: e instanceof Error ? e.message : "RTMS 호출 실패",
      };
    }

    const { code, msg } = parseResultCode(text);
    // 공공데이터포털은 00 / 000 / 0 을 정상으로 사용
    const okCode = !code || code === "00" || code === "000" || code === "0";
    if (!okCode) {
      return { rows: all, error: `RTMS ${code}: ${msg || "오류"}` };
    }

    total = parseTotalCount(text) || 0;
    const items = parseXmlItems(text);
    for (const item of items) {
      const row = normalizeRtmsItem(
        item,
        args.propertyType,
        args.dealType,
        args.lawdCd,
        args.dealYmd,
      );
      if (row) all.push(row);
    }

    if (items.length === 0 || total === 0) break;
    pageNo += 1;
    if (pageNo > 50) break;
    await sleep(DELAY_MS);
  }

  return { rows: all };
}
