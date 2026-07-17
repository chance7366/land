import type { Property, PropertyCategory, PropertyType } from "@prisma/client";

export function formatPrice(manwon: number): string {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rest = manwon % 10000;
    if (rest === 0) return `${eok}억`;
    return `${eok}억 ${rest.toLocaleString()}`;
  }
  return `${manwon.toLocaleString()}만`;
}

/** Format absolute won amount (경매 등). */
export function formatWon(won: number): string {
  return `${Math.round(won).toLocaleString("ko-KR")}원`;
}

/**
 * Auction money display: new records store 원, legacy seed used 만원.
 * Values under 1,000,000 are treated as 만원 and converted.
 */
export function formatAuctionMoney(amount: number): string {
  const won = amount > 0 && amount < 1_000_000 ? amount * 10_000 : amount;
  return formatWon(won);
}

export function formatPriceWon(manwon: number): string {
  return `₩${formatPrice(manwon)}`;
}

export function propertyTypeLabel(type: PropertyType | string): string {
  switch (type) {
    case "SALE":
      return "매매";
    case "RENT":
      return "임대";
    case "PRE_SALE":
      return "분양권";
    case "SHORT_TERM":
      return "단기임대";
    default:
      return type;
  }
}

export function propertyStatusLabel(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "노출";
    case "HIDDEN":
      return "숨김";
    case "SOLD":
      return "거래완료";
    default:
      return status;
  }
}

export function formatPropertyArea(property: {
  sigungu?: string | null;
  eupmyeondong?: string | null;
  region?: string | null;
}): string {
  const parts = [property.sigungu, property.eupmyeondong].filter(Boolean);
  if (parts.length > 0) return parts.join(" ");
  return property.region?.trim() || "-";
}

export function formatDateYmd(value: Date | string | null | undefined): string {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "-";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function categoryLabel(category: PropertyCategory | string): string {
  switch (category) {
    case "APARTMENT":
      return "아파트";
    case "OFFICETEL":
      return "오피스텔";
    case "RETAIL":
      return "상가";
    case "OFFICE":
      return "사무실";
    case "ROW_HOUSE":
      return "빌라/연립";
    case "MULTI_FAMILY":
      return "다세대";
    case "LAND":
      return "토지/임야";
    case "DETACHED":
      return "단독·다가구";
    case "ONE_ROOM":
      return "원룸·투룸";
    case "FACTORY":
      return "공장·지식산업센터";
    default:
      return category;
  }
}

export function formatPropertyPrice(property: Pick<Property, "type" | "price" | "deposit" | "monthlyRent" | "isJeonse">): string {
  if (property.type === "RENT" || property.type === "SHORT_TERM") {
    if (property.isJeonse && property.deposit) {
      return `전세 ${formatPrice(property.deposit)}`;
    }
    const deposit = property.deposit ? formatPrice(property.deposit) : "-";
    const monthly = property.monthlyRent ? formatPrice(property.monthlyRent) : "-";
    return `보증금 ${deposit} / 월 ${monthly}`;
  }
  if (property.type === "PRE_SALE") {
    return `분양가 ${formatPrice(property.price)}`;
  }
  return formatPrice(property.price);
}

export function formatPropertySummary(
  property: Pick<Property, "category" | "exclusiveArea" | "floor" | "totalFloors" | "direction" | "landCategory" | "zoning">,
): string {
  const parts: string[] = [];

  if (property.category === "LAND") {
    if (property.exclusiveArea) parts.push(`${property.exclusiveArea}㎡`);
    if (property.landCategory) parts.push(property.landCategory);
    if (property.zoning) parts.push(property.zoning);
    return parts.join(" · ") || "면적 정보 없음";
  }

  if (property.exclusiveArea) parts.push(`전용 ${property.exclusiveArea}㎡`);
  if (property.floor != null) {
    parts.push(property.totalFloors ? `${property.floor}/${property.totalFloors}층` : `${property.floor}층`);
  }
  if (property.direction) parts.push(property.direction);

  return parts.join(" · ") || "스펙 정보 없음";
}

export function parseImages(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string" && v.length > 0).slice(0, 8)
      : [];
  } catch {
    return [];
  }
}

export function parseTags(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseSpecs(json: string | null | undefined): Record<string, unknown> {
  try {
    const parsed = JSON.parse(json || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function formatAreaPyeong(sqm: number): string {
  return `${(sqm / 3.3058).toFixed(1)}평`;
}

export type SpecItem = { label: string; value: string };

const SPEC_LABELS: Record<string, string> = {
  directionBasis: "방향 기준",
  structureType: "내부 구조",
  maintenanceIncludes: "관리비 포함",
  maintenanceBilling: "관리비 부과",
  totalParking: "총 주차",
  parkingPerHousehold: "세대당 주차",
  entranceType: "현관구조",
  heatingType: "난방방식",
  heatingFuel: "난방연료",
  landShareArea: "대지지분",
  totalFloorArea: "연면적",
  buildingUse: "건축물 용도",
  approvalDate: "승인일자",
  hasVeranda: "베란다/발코니",
  hasElevator: "엘리베이터",
  optionItems: "옵션",
  parkingAvailable: "주차 가능",
  assignedParking: "지정주차",
  contractArea: "계약면적",
  locationTrait: "위치 특성",
  maintenanceNote: "관리비 내역",
  recommendedBusiness: "추천 업종",
  illegalBuilding: "위반건축물",
  powerCapacityKw: "전력(kW)",
  hvacType: "냉난방",
  toiletLocation: "화장실",
  freeParking: "무료주차",
  elevatorType: "엘리베이터",
  roadAccess: "도로접면",
  roadPaved: "도로포장",
  terrain: "지형",
  landShape: "지세",
  landUseStatus: "이용상황",
  isBasement: "지하층",
  isSemiBasement: "반지하",
  moveInExpectedDate: "입주예정일",
};

function formatSpecValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "예" : "아니오";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export function getCommonSpecItems(property: Property): SpecItem[] {
  const items: SpecItem[] = [];

  if (property.exclusiveArea) {
    items.push({ label: "전용면적", value: `${property.exclusiveArea}㎡ (${formatAreaPyeong(property.exclusiveArea)})` });
  }
  if (property.supplyArea) {
    items.push({ label: "공급면적", value: `${property.supplyArea}㎡ (${formatAreaPyeong(property.supplyArea)})` });
  }
  if (property.floor != null) {
    items.push({
      label: "층",
      value: property.totalFloors ? `${property.floor}/${property.totalFloors}층` : `${property.floor}층`,
    });
  }
  if (property.direction) items.push({ label: "방향", value: property.direction });
  if (property.builtYear) items.push({ label: "준공년도", value: `${property.builtYear}년` });
  if (property.parking) items.push({ label: "주차", value: property.parking });
  if (property.loanStatus) items.push({ label: "융자", value: property.loanStatus });
  if (property.moveInType) {
    items.push({
      label: "입주",
      value: property.moveInType === "지정일" && property.moveInDate
        ? property.moveInDate
        : property.moveInType,
    });
  }

  return items;
}

export function getCategorySpecItems(property: Property): SpecItem[] {
  const items: SpecItem[] = [];
  const specs = parseSpecs(property.specs);

  switch (property.category) {
    case "APARTMENT":
    case "OFFICETEL":
      if (property.buildingName) items.push({ label: "단지/건물명", value: property.buildingName });
      if (property.unitDong || property.unitHo) {
        items.push({ label: "동/호", value: [property.unitDong, property.unitHo].filter(Boolean).join(" ") });
      }
      if (property.rooms) items.push({ label: "방/욕실", value: `${property.rooms}룸 / ${property.bathrooms ?? "-"}욕` });
      if (property.maintenanceFee) items.push({ label: "관리비", value: `${property.maintenanceFee}만원` });
      break;
    case "RETAIL":
    case "OFFICE":
    case "FACTORY":
      if (property.buildingName) items.push({ label: "건물명", value: property.buildingName });
      if (property.keyMoney != null && !property.keyMoneyHidden) {
        items.push({ label: "권리금", value: formatPrice(property.keyMoney) });
      }
      if (property.keyMoneyHidden) items.push({ label: "권리금", value: "비공개" });
      if (property.businessType) items.push({ label: "업종", value: property.businessType });
      if (property.vatIncluded != null) {
        items.push({ label: "VAT", value: property.vatIncluded ? "포함" : "별도" });
      }
      break;
    case "ROW_HOUSE":
    case "MULTI_FAMILY":
    case "DETACHED":
    case "ONE_ROOM":
      if (property.rooms) items.push({ label: "방/욕실", value: `${property.rooms}룸 / ${property.bathrooms ?? "-"}욕` });
      break;
    case "LAND":
      if (property.landCategory) items.push({ label: "지목", value: property.landCategory });
      if (property.zoning) items.push({ label: "용도지역", value: property.zoning });
      break;
  }

  for (const [key, label] of Object.entries(SPEC_LABELS)) {
    const raw = specs[key];
    if (raw == null || raw === "" || (Array.isArray(raw) && raw.length === 0)) continue;
    if (typeof raw === "number") {
      items.push({
        label,
        value: key.toLowerCase().includes("area")
          ? `${raw}㎡ (${formatAreaPyeong(raw)})`
          : String(raw),
      });
    } else {
      items.push({ label, value: formatSpecValue(raw) });
    }
  }

  return items;
}
