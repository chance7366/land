import { formatAuctionMoney, formatDateYmd, parseImages } from "@/lib/format";
import type { AuctionFlyerSource } from "@/lib/flyer/map-auction";
import type { WindowFlyerTemplate, WindowFlyerViewModel } from "@/lib/flyer/window-types";

export function mapAuctionToWindowFlyer(
  a: AuctionFlyerSource,
  template?: WindowFlyerTemplate,
): WindowFlyerViewModel {
  const min = a.minPrice ?? a.recommendedPrice ?? null;
  const appraisal = a.appraisalPrice ?? null;
  const images = Array.isArray(a.images)
    ? a.images.filter(Boolean).slice(0, 3)
    : parseImages(typeof a.images === "string" ? a.images : "[]").slice(0, 3);

  const discountNum =
    appraisal && min && appraisal > 0
      ? Math.max(0, Math.round((1 - min / appraisal) * 100))
      : null;
  const discountPct = discountNum != null ? `${discountNum}%` : undefined;

  const location =
    [a.address, a.address2].filter(Boolean).join(" ") || a.title?.trim() || "경매물건";

  const bullets: string[] = [];
  const sale = formatDateYmd(a.saleDate);
  if (sale !== "-") bullets.push(`매각 ${sale.replace(/-/g, ".")}`);
  if (a.caseNumber) bullets.push(String(a.caseNumber));
  if (a.buildingArea != null) bullets.push(`건물 ${a.buildingArea}㎡`);
  else if (a.landArea != null) bullets.push(`토지 ${a.landArea}㎡`);
  bullets.push("입찰·권리 상담");
  while (bullets.length < 2) bullets.push("현장 확인");

  const courtLine = [a.court, a.caseNumber, a.itemNo != null ? `물건 ${a.itemNo}` : ""]
    .filter(Boolean)
    .join(" · ");

  const minLabel = min != null ? formatAuctionMoney(min) : "최저가 미기재";
  const appraisalLabel = appraisal != null ? formatAuctionMoney(appraisal) : undefined;

  return {
    kind: "AUCTION",
    template: template ?? "C",
    badge: "경매",
    headline: discountNum != null && discountNum >= 40 ? "반값 찬스" : "경매 물건",
    tagline: discountPct ? `감정 대비 ${discountPct} 할인` : "입찰 상담 환영",
    title: a.title?.trim() || location,
    priceHuge: minLabel,
    priceNote: "최저매각가격",
    locationLine: courtLine || location,
    addressLine: location,
    highlights: bullets.slice(0, 4),
    features: bullets.slice(0, 2),
    specs: [
      { icon: "area", label: a.buildingArea != null ? `건물 ${a.buildingArea}㎡` : "면적 문의" },
      { icon: "floor", label: sale !== "-" ? `매각 ${sale}` : "기일 문의" },
    ],
    priceRows: [
      {
        tab: "감정",
        area: "감정평가액",
        price: appraisalLabel || "-",
      },
      {
        tab: "최저",
        area: sale !== "-" ? `매각 ${sale}` : "최저매각가",
        price: minLabel,
        note: discountPct ? `할인 ${discountPct}` : undefined,
      },
    ],
    images,
    publicPath: `/auctions/${a.id}`,
    appraisalLabel,
    discountPct,
    saleDateShort: sale !== "-" ? `매각 ${sale}` : undefined,
    noticeNo: a.caseNumber ? String(a.caseNumber) : undefined,
  };
}
