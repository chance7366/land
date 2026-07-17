export type AuctionDocType =
  | "saleSpec"
  | "appraisal"
  | "status"
  | "registryBuilding"
  | "registryLand"
  | "buildingLedger";

export type AuctionAttachment = {
  type: AuctionDocType;
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
];

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
        out.push({
          type: item.type as AuctionDocType,
          url: item.url,
          name: typeof item.name === "string" ? item.name : item.url.split("/").pop() || "file",
        });
      }
    }
    return out.slice(0, 12);
  } catch {
    return [];
  }
}

export function stringifyAuctionAttachments(list: AuctionAttachment[]): string {
  return JSON.stringify(list.slice(0, 12));
}
