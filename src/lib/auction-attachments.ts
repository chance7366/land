export type AuctionDocType =
  | "saleSpec"
  | "appraisal"
  | "status"
  | "registryBuilding"
  | "registryLand"
  | "buildingLedger"
  | "residentMoveIn"
  | "expectedDividend"
  | "yieldAnalysis";

/** 입찰가 산정·적정가치평가 자료 슬롯 */
export type BiddingValuationDocType =
  | "bidNpay"
  | "bidActualTrade"
  | "bidNaverPrice"
  | "bidKbPrice"
  | "bidWinningCase"
  | "bidCostData"
  | "bidOther1"
  | "bidOther2"
  /** @deprecated UI 제거 · 기존 첨부 파싱용 */
  | "bidOther3"
  /** @deprecated UI 제거 · 기존 첨부 파싱용 */
  | "bidOther4";

/** 입지분석 자료 슬롯 (관리자 폼 §9) */
export type LocationAnalysisDocType =
  | "locTransport"
  | "locEducation"
  | "locAmenities"
  | "locEnvironment"
  | "locFuture"
  | "locMap"
  | "locLandPlan"
  | "locOther";

export type AuctionAttachmentType =
  | AuctionDocType
  | BiddingValuationDocType
  | LocationAnalysisDocType;

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
  { type: "expectedDividend", label: "예상배당표", courtLinked: false },
  { type: "yieldAnalysis", label: "수익률분석", courtLinked: false },
];

export const BIDDING_VALUATION_SLOTS: {
  type: BiddingValuationDocType;
  label: string;
  placeholder: string;
}[] = [
  {
    type: "bidNpay",
    label: "Npay부동산",
    placeholder:
      "Npay_공시가격, Npay_단지정보, Npay_매물, Npay_실거래가를 첨부하거나 직접 입력, 붙여넣으세요",
  },
  {
    type: "bidActualTrade",
    label: "KB부동산",
    placeholder: "KB_실거래가, KB_시세를 첨부하거나 직접 입력, 붙여넣으세요",
  },
  {
    type: "bidNaverPrice",
    label: "아실정보지",
    placeholder: "아실_실거래가를 첨부하거나 직접 입력, 붙여넣으세요",
  },
  {
    type: "bidKbPrice",
    label: "국토부실거래가",
    placeholder:
      "경매정보지의 국토부실거래가_매매, 국토부실거래가_전월세를 첨부하거나 직접 입력, 붙여넣으세요",
  },
  {
    type: "bidWinningCase",
    label: "낙찰사례",
    placeholder: "낙찰사례를 첨부하거나 직접 입력, 붙여넣으세요",
  },
  {
    type: "bidCostData",
    label: "비용데이터",
    placeholder: "비용데이터를 첨부하거나 직접 입력, 붙여넣으세요",
  },
  {
    type: "bidOther1",
    label: "기타1",
    placeholder: "기타 자료를 첨부하거나 직접 입력, 붙여넣으세요",
  },
  {
    type: "bidOther2",
    label: "기타2",
    placeholder: "기타 자료를 첨부하거나 직접 입력, 붙여넣으세요",
  },
];

export const LOCATION_ANALYSIS_SLOTS: {
  type: LocationAnalysisDocType;
  label: string;
  placeholder: string;
}[] = [
  {
    type: "locTransport",
    label: "교통·접근성",
    placeholder:
      "지하철·버스·IC 거리/도보분, 업무지구 접근성 등을 첨부하거나 직접 입력, 붙여넣으세요",
  },
  {
    type: "locEducation",
    label: "학군·교육",
    placeholder: "초·중·고 거리, 학원가, 통학 동선 등을 첨부하거나 직접 입력, 붙여넣으세요",
  },
  {
    type: "locAmenities",
    label: "상권·편의",
    placeholder:
      "마트·백화점·병원·근린상권 등 생활 인프라를 첨부하거나 직접 입력, 붙여넣으세요",
  },
  {
    type: "locEnvironment",
    label: "환경·혐오시설",
    placeholder:
      "공원·녹지, 소음, 고압선·철도·유흥가·축사 등 혐오/비선호 시설을 첨부하거나 직접 입력하세요",
  },
  {
    type: "locFuture",
    label: "호재·개발계획",
    placeholder:
      "GTX·도로·재개발/재건축·신도시·산단 등 공적 계획·호재를 첨부하거나 직접 입력하세요",
  },
  {
    type: "locMap",
    label: "지도·지적·위성",
    placeholder: "네이버/카카오 지도, 지적도, 위성사진 캡처를 첨부하거나 메모하세요",
  },
  {
    type: "locLandPlan",
    label: "토지이용·공법",
    placeholder:
      "토지이음·용도지역, 농진구역·보전산지·그린벨트 등 공법 규제를 첨부하거나 직접 입력하세요",
  },
  {
    type: "locOther",
    label: "기타",
    placeholder: "입지 관련 기타 자료를 첨부하거나 직접 입력, 붙여넣으세요",
  },
];

/** 삭제된 슬롯 — 기존 첨부 JSON 호환 */
const LEGACY_BID_DOC_TYPES = ["bidOther3", "bidOther4"] as const;

const COURT_DOC_TYPES = new Set<string>(AUCTION_DOC_SLOTS.map((s) => s.type));
const BID_DOC_TYPES = new Set<string>([
  ...BIDDING_VALUATION_SLOTS.map((s) => s.type),
  ...LEGACY_BID_DOC_TYPES,
]);
const LOC_DOC_TYPES = new Set<string>(LOCATION_ANALYSIS_SLOTS.map((s) => s.type));

export function isAuctionDocType(type: string): type is AuctionDocType {
  return COURT_DOC_TYPES.has(type);
}

export function isBiddingValuationDocType(type: string): type is BiddingValuationDocType {
  return BID_DOC_TYPES.has(type);
}

export function isLocationAnalysisDocType(type: string): type is LocationAnalysisDocType {
  return LOC_DOC_TYPES.has(type);
}

/** 법원 서류 슬롯만 (리포트 Gemini 첨부용) */
export function courtDocAttachments(list: AuctionAttachment[]): AuctionAttachment[] {
  return list.filter((a) => isAuctionDocType(a.type));
}

/** 적정가치평가(구 입찰가산정) 슬롯 첨부 */
export function biddingValuationAttachments(list: AuctionAttachment[]): AuctionAttachment[] {
  return list.filter((a) => isBiddingValuationDocType(a.type));
}

/** 입지분석 슬롯 첨부 */
export function locationAnalysisAttachments(list: AuctionAttachment[]): AuctionAttachment[] {
  return list.filter((a) => isLocationAnalysisDocType(a.type));
}

export function labelForAttachmentType(type: string): string {
  return (
    AUCTION_DOC_SLOTS.find((s) => s.type === type)?.label ??
    BIDDING_VALUATION_SLOTS.find((s) => s.type === type)?.label ??
    LOCATION_ANALYSIS_SLOTS.find((s) => s.type === type)?.label ??
    (type === "bidOther3"
      ? "기타3"
      : type === "bidOther4"
        ? "기타4"
        : type)
  );
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
        if (
          !isAuctionDocType(type) &&
          !isBiddingValuationDocType(type) &&
          !isLocationAnalysisDocType(type)
        ) {
          continue;
        }
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
  // legacy keys 유지
  for (const k of LEGACY_BID_DOC_TYPES) {
    const t = notes[k]?.trim();
    if (t) cleaned[k] = t;
  }
  return JSON.stringify(cleaned);
}

export function hasBiddingValuationNotes(notes: BiddingValuationNotes): boolean {
  return (
    BIDDING_VALUATION_SLOTS.some((s) => Boolean(notes[s.type]?.trim())) ||
    LEGACY_BID_DOC_TYPES.some((k) => Boolean(notes[k]?.trim()))
  );
}

export type LocationAnalysisNotes = Partial<Record<LocationAnalysisDocType, string>>;

export function emptyLocationAnalysisNotes(): LocationAnalysisNotes {
  return {};
}

export function parseLocationAnalysisNotes(raw: string | null | undefined): LocationAnalysisNotes {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: LocationAnalysisNotes = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (!isLocationAnalysisDocType(k)) continue;
      if (typeof v === "string" && v.trim()) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function stringifyLocationAnalysisNotes(notes: LocationAnalysisNotes): string {
  const cleaned: LocationAnalysisNotes = {};
  for (const slot of LOCATION_ANALYSIS_SLOTS) {
    const t = notes[slot.type]?.trim();
    if (t) cleaned[slot.type] = t;
  }
  return JSON.stringify(cleaned);
}

export function hasLocationAnalysisNotes(notes: LocationAnalysisNotes): boolean {
  return LOCATION_ANALYSIS_SLOTS.some((s) => Boolean(notes[s.type]?.trim()));
}

/** rightsAnalysis 내 입지분석 텍스트 블록을 리포트용으로 펼침 */
export function formatLocationAnalysisNotesForPrompt(
  rightsAnalysis: string | null | undefined,
): string {
  if (!rightsAnalysis?.trim()) return "(입지분석 텍스트 슬롯 없음)";
  const m = /\[입지분석텍스트JSON\]\s*([\s\S]*?)(?=\n\s*\[|$)/.exec(rightsAnalysis);
  const notes = parseLocationAnalysisNotes(m?.[1]?.trim() ?? "");
  const lines: string[] = [];
  for (const slot of LOCATION_ANALYSIS_SLOTS) {
    const t = notes[slot.type]?.trim();
    if (!t) continue;
    lines.push(`### ${slot.label}`, t, "");
  }
  return lines.length ? lines.join("\n").trim() : "(입지분석 텍스트 슬롯 비어 있음)";
}
