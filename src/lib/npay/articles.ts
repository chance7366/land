import { NpayClient } from "./client";
import {
  ALL_NPAY_ESTATE_CODES,
  ALL_NPAY_TRADE_CODES,
  type NpayEstateType,
  type NpayTradeType,
} from "./codes";
import { mapNpayArticle } from "./map-article";
import { resolveNpayRegion } from "./regions";
import type { NpayArticleRow, NpayRegion } from "./types";

const PAGE_SIZE = 30;
const PRECISION = 14;

function articleFilterPayload(
  region: NpayRegion,
  tradeTypes: NpayTradeType[],
  estateTypes: NpayEstateType[],
  lastInfo: unknown[] | null,
) {
  const filter = {
    tradeTypes,
    realEstateTypes: estateTypes,
    roomCount: [] as string[],
    bathRoomCount: [] as string[],
    optionTypes: [] as string[],
    oneRoomShapeTypes: [] as string[],
    moveInTypes: [] as string[],
    filtersExclusiveSpace: false,
    floorTypes: [] as string[],
    directionTypes: [] as string[],
    hasArticlePhoto: false,
    isAuthorizedByOwner: false,
    parkingTypes: [] as string[],
    entranceTypes: [] as string[],
    hasArticle: false,
    legalDivisionNumbers: [region.legalDivisionNumber],
    legalDivisionType: "EUP",
  };
  const payload: Record<string, unknown> = {
    filter,
    boundingBox: region.boundingBox,
    precision: PRECISION,
    userChannelType: "PC",
  };
  if (lastInfo !== null) {
    payload.articlePagingRequest = {
      size: PAGE_SIZE,
      articleSortType: "RANKING_DESC",
      lastInfo,
    };
  }
  return payload;
}

export type CollectArticlesResult = {
  ok: boolean;
  regionLabel: string;
  legalDivisionNumber: string;
  totalCount: number;
  pages: number;
  rows: NpayArticleRow[];
  truncated: boolean;
  error?: string;
};

export async function collectNpayArticles(opts: {
  city: string;
  division: string;
  sector: string;
  tradeTypes?: NpayTradeType[];
  estateTypes?: NpayEstateType[];
  includeDuplicates?: boolean;
  /** 기본 80페이지 ≈ 2400건 */
  maxPages?: number;
}): Promise<CollectArticlesResult> {
  const region = resolveNpayRegion(opts.city, opts.division, opts.sector);
  const tradeTypes = opts.tradeTypes?.length
    ? opts.tradeTypes
    : ALL_NPAY_TRADE_CODES;
  const estateTypes = opts.estateTypes?.length
    ? opts.estateTypes
    : ALL_NPAY_ESTATE_CODES;
  const maxPages = opts.maxPages ?? 80;
  const includeDuplicates = !!opts.includeDuplicates;

  const client = new NpayClient();
  let totalCount = 0;
  let pages = 0;
  const rows: NpayArticleRow[] = [];
  const seen = new Set<string>();

  try {
    const countData = await client.post(
      "/article/boundedArticlesCount",
      articleFilterPayload(region, tradeTypes, estateTypes, null),
    );
    const countResult = countData.result as { totalCount?: number } | undefined;
    totalCount = Number(countResult?.totalCount ?? 0);

    let lastInfo: unknown[] = [];
    let truncated = false;

    while (pages < maxPages) {
      const pageData = await client.post(
        "/article/boundedArticles",
        articleFilterPayload(region, tradeTypes, estateTypes, lastInfo),
      );
      const result = pageData.result as {
        list?: unknown[];
        lastInfo?: unknown[];
        hasNextPage?: boolean;
      };
      const list = Array.isArray(result?.list) ? result.list : [];
      if (list.length === 0) break;

      for (const item of list) {
        if (!item || typeof item !== "object") continue;
        const rec = item as Record<string, unknown>;
        const rep = rec.representativeArticleInfo;
        if (rep && typeof rep === "object") {
          const mapped = mapNpayArticle(
            rep as Record<string, unknown>,
            region,
            false,
          );
          if (mapped && !seen.has(mapped.articleNumber)) {
            seen.add(mapped.articleNumber);
            rows.push(mapped);
          }
        }
        if (includeDuplicates) {
          const dupInfo = rec.duplicatedArticleInfo;
          if (dupInfo && typeof dupInfo === "object") {
            const dupList = (dupInfo as { articleInfoList?: unknown[] })
              .articleInfoList;
            if (Array.isArray(dupList)) {
              for (const dup of dupList) {
                if (!dup || typeof dup !== "object") continue;
                const mapped = mapNpayArticle(
                  dup as Record<string, unknown>,
                  region,
                  true,
                );
                if (mapped && !seen.has(mapped.articleNumber)) {
                  seen.add(mapped.articleNumber);
                  rows.push(mapped);
                }
              }
            }
          }
        }
      }

      pages += 1;
      lastInfo = Array.isArray(result.lastInfo) ? result.lastInfo : [];
      if (!result.hasNextPage) break;
      if (pages >= maxPages && result.hasNextPage) {
        truncated = true;
        break;
      }
    }

    return {
      ok: true,
      regionLabel: region.label,
      legalDivisionNumber: region.legalDivisionNumber,
      totalCount,
      pages,
      rows,
      truncated,
    };
  } catch (e) {
    return {
      ok: false,
      regionLabel: region.label,
      legalDivisionNumber: region.legalDivisionNumber,
      totalCount,
      pages,
      rows,
      truncated: false,
      error: e instanceof Error ? e.message : "매물 수집 실패",
    };
  }
}
