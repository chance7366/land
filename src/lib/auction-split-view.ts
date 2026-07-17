import type { Auction } from "@prisma/client";

export type SerializedAuction = Omit<
  Auction,
  "saleDate" | "publishedAt" | "createdAt" | "updatedAt"
> & {
  saleDate: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export function serializeAuction(a: Auction): SerializedAuction {
  return {
    ...a,
    saleDate: a.saleDate ? a.saleDate.toISOString() : null,
    publishedAt: a.publishedAt.toISOString(),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

/** rightsAnalysis 내 [태그] 블록 추출 */
export function extractRightsTag(text: string | null | undefined, tag: string): string | null {
  if (!text?.trim()) return null;
  const re = new RegExp(`\\[${tag}\\]\\s*([\\s\\S]*?)(?=\\n\\s*\\[|$)`);
  const m = re.exec(text);
  const v = m?.[1]?.trim();
  return v || null;
}

export type ParsedScheduleRow = {
  date: string;
  kind: string;
  minPriceLabel: string;
  result: string;
};

export function parseScheduleFromRights(text: string | null | undefined): ParsedScheduleRow[] {
  const block = extractRightsTag(text, "기일내역");
  if (!block) return [];
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s+/);
      const date = parts[0] ?? "";
      const kind = parts[1] ?? "";
      const rest = parts.slice(2);
      const priceIdx = rest.findIndex((p) => p.includes("원"));
      const minPriceLabel = priceIdx >= 0 ? rest[priceIdx] : "—";
      const result =
        priceIdx >= 0 ? rest.slice(priceIdx + 1).join(" ") : rest.join(" ");
      return { date, kind, minPriceLabel, result: result || "—" };
    });
}
