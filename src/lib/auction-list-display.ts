/** 경매 목록 표용 표시 헬퍼 */

import { scheduleFromRights } from "@/lib/auction-detail-sections";
import { formatAreaPyeong, formatAuctionMoney } from "@/lib/format";

export function auctionFailCount(rightsAnalysis: string | null | undefined): number {
  return scheduleFromRights(rightsAnalysis ?? "").filter((s) =>
    /유찰/.test(s.result || ""),
  ).length;
}

export function auctionAreaLabel(opts: {
  landArea?: number | null;
  buildingArea?: number | null;
}): string {
  const { landArea, buildingArea } = opts;
  if (buildingArea != null && buildingArea > 0 && !(landArea != null && landArea > 0)) {
    return `전유 ${buildingArea}㎡ (${formatAreaPyeong(buildingArea)})`;
  }
  if (landArea != null && landArea > 0 && buildingArea != null && buildingArea > 0) {
    return `토지 ${landArea}㎡ · 건물 ${buildingArea}㎡`;
  }
  if (landArea != null && landArea > 0) {
    return `토지 ${landArea}㎡ (${formatAreaPyeong(landArea)})`;
  }
  if (buildingArea != null && buildingArea > 0) {
    return `건물 ${buildingArea}㎡ (${formatAreaPyeong(buildingArea)})`;
  }
  return "—";
}

export function auctionMinPct(
  appraisalPrice: number,
  minPrice: number | null | undefined,
): number | null {
  const min = minPrice ?? 0;
  if (!(appraisalPrice > 0) || !(min > 0)) return null;
  return Math.round((min / appraisalPrice) * 1000) / 10;
}

export function auctionStatusDisplay(opts: {
  status: string;
  rightsAnalysis?: string | null;
  appraisalPrice: number;
  minPrice?: number | null;
}): { main: string; sub?: string } {
  const fails = auctionFailCount(opts.rightsAnalysis);
  const pct = auctionMinPct(opts.appraisalPrice, opts.minPrice);
  if (fails > 0) {
    return {
      main: `유찰 ${fails}회`,
      sub: pct != null ? `(${pct}%)` : undefined,
    };
  }
  switch (opts.status) {
    case "ONGOING":
      return { main: "진행중", sub: pct != null ? `(${pct}%)` : undefined };
    case "CLOSED":
      return { main: "종결" };
    case "FAILED":
      return { main: "유찰" };
    default:
      return { main: opts.status };
  }
}

export function formatAuctionPriceLine(amount: number | null | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return "—";
  return formatAuctionMoney(amount);
}
