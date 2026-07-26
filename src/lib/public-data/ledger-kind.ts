import type { LedgerKind } from "./types";

const AGGREGATE_HINT =
  /아파트|오피스텔|다세대|연립|도시형|집합|구분|APT|OFFICETEL|ROW_HOUSE|MULTI_FAMILY|ONE_ROOM/i;
const LAND_HINT = /토지|임야|전|답|대지|나대지|농지|LAND/i;
const GENERAL_HINT =
  /단독|다가구|상가주택|근생|공장|창고|DETACHED|FACTORY|RETAIL|OFFICE|COMMERCIAL/i;

/** 매물 PropertyCategory → LedgerKind */
export function ledgerKindFromPropertyCategory(category: string | undefined): LedgerKind {
  const c = String(category || "").toUpperCase();
  if (c === "LAND") return "LAND_ONLY";
  if (
    c === "APARTMENT" ||
    c === "OFFICETEL" ||
    c === "ROW_HOUSE" ||
    c === "MULTI_FAMILY" ||
    c === "ONE_ROOM"
  ) {
    return "AGGREGATE";
  }
  if (c === "DETACHED" || c === "FACTORY" || c === "RETAIL" || c === "OFFICE") {
    return "GENERAL";
  }
  return "GENERAL";
}

/** 경매 itemType / auctionTarget 텍스트 → LedgerKind */
export function ledgerKindFromAuctionHints(input: {
  itemType?: string;
  auctionTarget?: string;
  landArea?: number | null;
  buildingArea?: number | null;
}): LedgerKind {
  const t = `${input.itemType ?? ""} ${input.auctionTarget ?? ""}`;
  if (LAND_HINT.test(t) && !/건물|아파트|오피스텔|다세대/.test(t)) {
    if (!input.buildingArea) return "LAND_ONLY";
  }
  if (AGGREGATE_HINT.test(t)) return "AGGREGATE";
  if (GENERAL_HINT.test(t)) return "GENERAL";
  if (input.landArea && !input.buildingArea) return "LAND_ONLY";
  if (/아파트|오피스텔|다세대|집합/.test(t)) return "AGGREGATE";
  return "GENERAL";
}

export function normalizeDongHo(raw: string | undefined | null): string {
  return String(raw ?? "")
    .replace(/\s+/g, "")
    .replace(/동$/i, "")
    .replace(/호$/i, "")
    .toUpperCase();
}

export function matchDongLabel(apiDong: string | undefined, want: string): boolean {
  if (!want) return true;
  const a = normalizeDongHo(apiDong);
  const b = normalizeDongHo(want);
  if (!a || !b) return false;
  return a === b || a.includes(b) || b.includes(a);
}

export function matchHoLabel(apiHo: string | undefined, want: string): boolean {
  if (!want) return true;
  const a = normalizeDongHo(apiHo);
  const b = normalizeDongHo(want);
  if (!a || !b) return false;
  return a === b || a.replace(/^0+/, "") === b.replace(/^0+/, "");
}
