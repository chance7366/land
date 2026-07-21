export type AuctionDocType =
  | "saleSpec"
  | "appraisal"
  | "status"
  | "registryBuilding"
  | "registryLand"
  | "buildingLedger"
  | "residentMoveIn";

/** 입찰가 산정 자료 슬롯 */
export type BiddingValuationDocType =
  | "bidNpay"
  | "bidActualTrade"
  | "bidNaverPrice"
  | "bidKbPrice"
  | "bidWinningCase"
  | "bidCostData"
  | "bidOther1"
  | "bidOther2"
  | "bidOther3"
  | "bidOther4";

export type AuctionAttachmentType = AuctionDocType | BiddingValuationDocType;

export type AuctionAttachment = {
  type: AuctionAttachmentType;
  url: string;
  name: string;
};

export const AUCTION_DOC_SLOTS: {
  type: AuctionDocType;
  label: string;
  courtLinked: boolean;
}[] = [
  { type: "saleSpec", label: "매각물건명세서", courtLinked: true },
  { type: "appraisal", label: "감정평가서", courtLinked: true },
  { type: "status", label: "현황조사서", courtLinked: true },
  { type: "registryBuilding", label: "등기부(건물)", courtLinked: false },
  { type: "registryLand", label: "등기부(토지)", courtLinked: false },
  { type: "buildingLedger", label: "건축물대장", courtLinked: false },
  { type: "residentMoveIn", label: "전입세대열람", courtLinked: false },
];

export const BIDDING_VALUATION_SLOTS: {
  type: BiddingValuationDocType;
  label: string;
}[] = [
  { type: "bidNpay", label: "Npay매물가격" },
  { type: "bidActualTrade", label: "실거래가격" },
  { type: "bidNaverPrice", label: "네이버부동산시세" },
  { type: "bidKbPrice", label: "KB부동산시세" },
  { type: "bidWinningCase", label: "낙찰사례" },
  { type: "bidCostData", label: "비용데이터" },
  { type: "bidOther1", label: "기타1" },
  { type: "bidOther2", label: "기타2" },
  { type: "bidOther3", label: "기타3" },
  { type: "bidOther4", label: "기타4" },
];

const COURT_DOC_TYPES = new Set<string>(AUCTION_DOC_SLOTS.map((s) => s.type));
const BID_DOC_TYPES = new Set<string>(BIDDING_VALUATION_SLOTS.map((s) => s.type));

export function isAuctionDocType(type: string): type is AuctionDocType {
  return COURT_DOC_TYPES.has(type);
}

export function isBiddingValuationDocType(type: string): type is BiddingValuationDocType {
  return BID_DOC_TYPES.has(type);
}

/** 법원 서류 슬롯만 (리포트 Gemini 첨부용) */
export function courtDocAttachments(list: AuctionAttachment[]): AuctionAttachment[] {
  return list.filter((a) => isAuctionDocType(a.type));
}

/** 슬롯당 최대 첨부 수 · 전체 상한 */
export const MAX_ATTACHMENTS_PER_SLOT = 20;
export const MAX_ATTACHMENTS_TOTAL = 120;

export function parseAuctionAttachments(json: string | null | undefined): AuctionAttachment[] {
  try {
    const parsed = JSON.parse(json || "[]");
    if (!Array.isArray(parsed)) return [];
    const out: AuctionAttachment[] = [];
    for (const item of parsed) {
      if (typeof item === "string" && item) {
        out.push({ type: "saleSpec", url: item, name: item.split("/").pop() || item });
        continue;
      }
      if (
        item &&
        typeof item === "object" &&
        typeof item.url === "string" &&
        typeof item.type === "string"
      ) {
        const type = item.type as AuctionAttachmentType;
        if (!isAuctionDocType(type) && !isBiddingValuationDocType(type)) continue;
        out.push({
          type,
          url: item.url,
          name: typeof item.name === "string" ? item.name : item.url.split("/").pop() || "file",
        });
      }
    }
    return out.slice(0, MAX_ATTACHMENTS_TOTAL);
  } catch {
    return [];
  }
}

export function stringifyAuctionAttachments(list: AuctionAttachment[]): string {
  return JSON.stringify(list.slice(0, MAX_ATTACHMENTS_TOTAL));
}

export function filesForSlot(
  list: AuctionAttachment[],
  type: AuctionAttachmentType,
): AuctionAttachment[] {
  return list.filter((a) => a.type === type);
}

/** 슬롯별 텍스트 메모 (붙여넣기·직접 입력) */
export type BiddingValuationNotes = Partial<Record<BiddingValuationDocType, string>>;

export function emptyBiddingValuationNotes(): BiddingValuationNotes {
  return {};
}

export function parseBiddingValuationNotes(raw: string | null | undefined): BiddingValuationNotes {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: BiddingValuationNotes = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (!isBiddingValuationDocType(k)) continue;
      if (typeof v === "string" && v.trim()) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function stringifyBiddingValuationNotes(notes: BiddingValuationNotes): string {
  const cleaned: BiddingValuationNotes = {};
  for (const slot of BIDDING_VALUATION_SLOTS) {
    const t = notes[slot.type]?.trim();
    if (t) cleaned[slot.type] = t;
  }
  return JSON.stringify(cleaned);
}

export function hasBiddingValuationNotes(notes: BiddingValuationNotes): boolean {
  return BIDDING_VALUATION_SLOTS.some((s) => Boolean(notes[s.type]?.trim()));
}
