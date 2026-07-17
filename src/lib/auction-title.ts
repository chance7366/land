export function suggestAuctionTitle(input: {
  itemType?: string | null;
  landArea?: number | null;
  buildingArea?: number | null;
  appraisalPrice?: number | null;
  minPrice?: number | null;
  saleDate?: string | Date | null;
}): string {
  const parts: string[] = [];

  const itemType = input.itemType?.trim();
  if (itemType) parts.push(itemType);

  if (input.landArea != null && Number.isFinite(input.landArea) && input.landArea > 0) {
    parts.push(`토지 ${input.landArea.toLocaleString("ko-KR")}㎡`);
  }

  if (input.buildingArea != null && Number.isFinite(input.buildingArea) && input.buildingArea > 0) {
    parts.push(`건물 ${input.buildingArea.toLocaleString("ko-KR")}㎡`);
  }

  if (input.appraisalPrice != null && Number.isFinite(input.appraisalPrice) && input.appraisalPrice > 0) {
    parts.push(`감정가 ${Math.round(input.appraisalPrice).toLocaleString("ko-KR")}원`);
  }

  if (input.minPrice != null && Number.isFinite(input.minPrice) && input.minPrice > 0) {
    parts.push(`최저가 ${Math.round(input.minPrice).toLocaleString("ko-KR")}원`);
  }

  let saleDate = "";
  if (input.saleDate instanceof Date && !Number.isNaN(input.saleDate.getTime())) {
    saleDate = input.saleDate.toISOString().slice(0, 10);
  } else if (typeof input.saleDate === "string" && input.saleDate.trim()) {
    const raw = input.saleDate.trim();
    saleDate = /^\d{4}-\d{2}-\d{2}/.test(raw) ? raw.slice(0, 10) : raw;
  }
  if (saleDate) parts.push(`매각기일 ${saleDate}`);

  return parts.join(" · ");
}
