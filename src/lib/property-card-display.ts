import type { Property, PropertyCategory, PropertyType } from "@prisma/client";
import { parseSpecs } from "@/lib/format";

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}

/** Append 만원 for card price display */
export function formatManwonWithUnit(manwon: number): string {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rest = manwon % 10000;
    if (rest === 0) return `${eok}억`;
    return `${eok}억 ${rest.toLocaleString("ko-KR")}만원`;
  }
  return `${manwon.toLocaleString("ko-KR")}만원`;
}

/** 숫자(15px) / 한글·단위(14px) 분리용 */
export type PriceSegment = { text: string; role: "text" | "num" };

export function manwonToPriceSegments(manwon: number): PriceSegment[] {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rest = manwon % 10000;
    if (rest === 0) {
      return [
        { text: String(eok), role: "num" },
        { text: "억", role: "text" },
      ];
    }
    return [
      { text: String(eok), role: "num" },
      { text: "억 ", role: "text" },
      { text: rest.toLocaleString("ko-KR"), role: "num" },
      { text: "만원", role: "text" },
    ];
  }
  return [
    { text: manwon.toLocaleString("ko-KR"), role: "num" },
    { text: "만원", role: "text" },
  ];
}

export function propertyCardDealBadgeLabel(
  property: Pick<Property, "type" | "isJeonse" | "dealSubType">,
): string {
  if (property.type === "SALE") return "매매";
  if (property.type === "PRE_SALE") return "분양권";
  if (property.type === "SHORT_TERM") return "단기임대";
  if (property.type === "RENT") {
    if (property.dealSubType === "JEONSE" || property.isJeonse) return "전세";
    if (property.dealSubType === "MONTHLY") return "월세";
    return property.isJeonse ? "전세" : "월세";
  }
  return String(property.type);
}

/** Headline under image badges */
export function propertyCardTitle(
  property: Pick<
    Property,
    "category" | "buildingName" | "title" | "landCategory" | "zoning"
  >,
): string {
  if (property.category === "LAND") {
    const parts = [property.landCategory, property.zoning].filter(Boolean);
    return parts.length ? parts.join(" · ") : property.title;
  }
  return property.buildingName?.trim() || property.title;
}

function floorLine(floor: number | null | undefined, totalFloors: number | null | undefined): string | null {
  if (floor == null) return null;
  return totalFloors != null ? `${floor}/${totalFloors}층` : `${floor}층`;
}

/** Spec line by category group */
export function propertyCardSpecLine(
  property: Pick<
    Property,
    | "category"
    | "exclusiveArea"
    | "supplyArea"
    | "floor"
    | "totalFloors"
    | "direction"
    | "specs"
  >,
): string {
  const specs = parseSpecs(property.specs);
  const contractArea = num(specs.contractArea);
  const landArea = num(specs.landArea) ?? property.exclusiveArea;
  const parts: string[] = [];
  const floor = floorLine(property.floor, property.totalFloors);

  switch (property.category as PropertyCategory) {
    case "APARTMENT":
    case "OFFICETEL":
      if (property.supplyArea != null) parts.push(`공급 ${property.supplyArea}㎡`);
      if (property.exclusiveArea != null) parts.push(`전용 ${property.exclusiveArea}㎡`);
      if (floor) parts.push(floor);
      if (property.direction) parts.push(property.direction);
      break;
    case "ROW_HOUSE":
    case "MULTI_FAMILY":
    case "ONE_ROOM":
    case "DETACHED":
      if (property.exclusiveArea != null) parts.push(`전용 ${property.exclusiveArea}㎡`);
      if (floor) parts.push(floor);
      if (property.direction) parts.push(property.direction);
      break;
    case "RETAIL":
    case "OFFICE":
    case "FACTORY":
      if (contractArea != null) parts.push(`계약 ${contractArea}㎡`);
      if (property.exclusiveArea != null) parts.push(`전용 ${property.exclusiveArea}㎡`);
      if (floor) parts.push(floor);
      break;
    case "LAND":
      if (landArea != null) parts.push(`대지 ${landArea}㎡`);
      break;
    default:
      if (property.exclusiveArea != null) parts.push(`전용 ${property.exclusiveArea}㎡`);
      if (floor) parts.push(floor);
  }

  return parts.join(" · ");
}

/** Labeled price with 만원 */
export function propertyCardPriceLine(
  property: Pick<Property, "type" | "price" | "deposit" | "monthlyRent" | "isJeonse" | "dealSubType">,
): string {
  return propertyCardPriceSegments(property)
    .map((s) => s.text)
    .join("");
}

/** 마퀴 가격 행 — 한글/단위와 숫자 분리 */
export function propertyCardPriceSegments(
  property: Pick<Property, "type" | "price" | "deposit" | "monthlyRent" | "isJeonse" | "dealSubType">,
): PriceSegment[] {
  const type = property.type as PropertyType;
  const isJeonse =
    property.dealSubType === "JEONSE" || (type === "RENT" && property.isJeonse);
  const isMonthly =
    property.dealSubType === "MONTHLY" || (type === "RENT" && !property.isJeonse);

  if (type === "SALE" || type === "PRE_SALE") {
    const label = type === "PRE_SALE" ? "분양가 " : "매매가 ";
    return [{ text: label, role: "text" }, ...manwonToPriceSegments(property.price)];
  }

  if (type === "SHORT_TERM" || isMonthly) {
    const depositParts =
      property.deposit != null
        ? manwonToPriceSegments(property.deposit)
        : ([{ text: "-", role: "num" }] as PriceSegment[]);
    const monthlyParts =
      property.monthlyRent != null
        ? manwonToPriceSegments(property.monthlyRent)
        : ([{ text: "-", role: "num" }] as PriceSegment[]);
    return [
      { text: "보증금 ", role: "text" },
      ...depositParts,
      { text: " / 월세 ", role: "text" },
      ...monthlyParts,
    ];
  }

  if (isJeonse || type === "RENT") {
    const deposit =
      property.deposit != null ? property.deposit : property.price;
    return [{ text: "전세가 ", role: "text" }, ...manwonToPriceSegments(deposit)];
  }

  return manwonToPriceSegments(property.price);
}

/**
 * 경매 금액(원 또는 레거시 만원) → 만원 단위 정수
 */
export function auctionAmountToManwon(amount: number): number {
  const won = amount > 0 && amount < 1_000_000 ? amount * 10_000 : amount;
  return Math.round(won / 10_000);
}

/** 예: 감정가 2억 8,000만원 */
export function auctionMoneyPriceSegments(label: string, amount: number): PriceSegment[] {
  return [
    { text: `${label} `, role: "text" },
    ...manwonToPriceSegments(auctionAmountToManwon(amount)),
  ];
}

export function propertyCardAddressLine(
  property: Pick<Property, "sido" | "sigungu" | "eupmyeondong" | "ri" | "region">,
): string {
  const parts = [property.sido, property.sigungu, property.eupmyeondong, property.ri]
    .map((v) => v?.trim())
    .filter(Boolean) as string[];
  if (parts.length) return parts.join(" ");
  return property.region?.trim() || "";
}

export function propertyCardRegisteredDate(
  property: Pick<Property, "publishedAt" | "createdAt">,
): string {
  const d = property.publishedAt ?? property.createdAt;
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
