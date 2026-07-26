import {
  categoryLabel,
  formatPrice,
  parseImages,
  propertyTypeLabel,
} from "@/lib/format";
import type { FlyerViewModel } from "@/lib/flyer/types";

export type PropertyFlyerSource = {
  id: string;
  title?: string | null;
  description?: string | null;
  featureSummary?: string | null;
  address?: string | null;
  category?: string | null;
  type?: string | null;
  dealSubType?: string | null;
  price?: number | null;
  deposit?: number | null;
  monthlyRent?: number | null;
  isJeonse?: boolean | null;
  exclusiveArea?: number | null;
  supplyArea?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  direction?: string | null;
  rooms?: number | null;
  bathrooms?: number | null;
  parking?: string | null;
  maintenanceFee?: number | null;
  images?: string | string[] | null;
  /** form / specs */
  useApprovalDate?: string | null;
  approvalDate?: string | null;
  illegalBuilding?: boolean | string | null;
  totalParking?: string | number | null;
  actualParking?: string | number | null;
  moveInDate?: string | null;
  sido?: string | null;
  sigungu?: string | null;
  eupmyeondong?: string | null;
  buildingName?: string | null;
};

function str(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v);
}

function orMissing(v: string, missing: string[], label: string): string {
  const t = v.trim();
  if (!t) {
    missing.push(label);
    return "미기재";
  }
  return t;
}

function resolveAddress(p: PropertyFlyerSource): string {
  if (p.address?.trim()) return p.address.trim();
  const parts = [p.sido, p.sigungu, p.eupmyeondong, p.buildingName].filter(Boolean);
  return parts.join(" ");
}

function resolveKind(p: PropertyFlyerSource): "SALE" | "LEASE" {
  const t = String(p.type || "").toUpperCase();
  const sub = String(p.dealSubType || "").toUpperCase();
  if (t === "RENT" || t === "SHORT_TERM" || sub === "JEONSE" || sub === "MONTHLY") {
    return "LEASE";
  }
  return "SALE";
}

function priceLine(p: PropertyFlyerSource, kind: "SALE" | "LEASE"): string {
  if (kind === "LEASE") {
    if (p.isJeonse || String(p.dealSubType).toUpperCase() === "JEONSE") {
      return p.deposit != null && Number(p.deposit) > 0
        ? `전세 ${formatPrice(Number(p.deposit))}`
        : "전세 (금액 미기재)";
    }
    const d = p.deposit != null ? formatPrice(Number(p.deposit)) : "-";
    const m = p.monthlyRent != null ? formatPrice(Number(p.monthlyRent)) : "-";
    return `보증금 ${d} / 월차임 ${m}`;
  }
  if (p.price != null && Number(p.price) > 0) {
    return `${formatPrice(Number(p.price))} (단일가)`;
  }
  return "매매가 미기재";
}

export function mapPropertyToFlyer(p: PropertyFlyerSource): FlyerViewModel {
  const missing: string[] = [];
  const kind = resolveKind(p);
  const images = Array.isArray(p.images)
    ? p.images.filter(Boolean).slice(0, 3)
    : parseImages(typeof p.images === "string" ? p.images : "[]").slice(0, 3);

  const floorLine =
    p.floor != null && p.totalFloors != null
      ? `총 ${p.totalFloors}층 중 ${p.floor}층 (${p.floor}/${p.totalFloors}층)`
      : p.floor != null
        ? `${p.floor}층`
        : "";

  const roomsBaths =
    p.rooms != null || p.bathrooms != null
      ? `방 ${p.rooms ?? "-"} / 욕실 ${p.bathrooms ?? "-"}`
      : "";

  const park =
    str(p.parking) ||
    (p.totalParking != null ? `총 ${p.totalParking}대` : "") ||
    (p.actualParking != null ? `현황 ${p.actualParking}대` : "");

  const approval = str(p.useApprovalDate || p.approvalDate);
  let illegal = "";
  if (typeof p.illegalBuilding === "boolean") {
    illegal = p.illegalBuilding ? "위반건축물" : "해당 없음";
  } else if (p.illegalBuilding != null && str(p.illegalBuilding) !== "") {
    illegal = str(p.illegalBuilding);
  }

  const maint =
    p.maintenanceFee != null && Number(p.maintenanceFee) > 0
      ? `월 ${formatPrice(Number(p.maintenanceFee))}`
      : "";

  const insight =
    str(p.featureSummary) ||
    str(p.description).slice(0, 160) ||
    "등록된 특장점·입지 설명이 없습니다. 상담 시 상세 안내해 드립니다.";

  const badge =
    kind === "LEASE"
      ? p.isJeonse || String(p.dealSubType).toUpperCase() === "JEONSE"
        ? "전 세"
        : "월 세"
      : "매 매";

  return {
    kind,
    badge,
    title: str(p.title) || "매물 전단지",
    subtitle: [
      p.category ? categoryLabel(p.category) : "",
      p.type ? propertyTypeLabel(p.type) : "",
      p.exclusiveArea != null ? `전용 ${p.exclusiveArea}㎡` : "",
    ]
      .filter(Boolean)
      .join(" · "),
    priceLine: priceLine(p, kind),
    publicPath: `/properties/${p.id}`,
    images,
    specs: [
      ["소재지", orMissing(resolveAddress(p), missing, "소재지")],
      ["종류", orMissing(p.category ? categoryLabel(p.category) : "", missing, "종류")],
      [
        "전용면적",
        orMissing(p.exclusiveArea != null ? `${p.exclusiveArea} m²` : "", missing, "전용면적"),
      ],
      [
        kind === "LEASE" ? "계약면적" : "공급면적",
        orMissing(p.supplyArea != null ? `${p.supplyArea} m²` : "", missing, "공급/계약면적"),
      ],
      ["층수", orMissing(floorLine, missing, "층수")],
      ["방/욕실", orMissing(roomsBaths, missing, "방/욕실")],
      ["방향", orMissing(str(p.direction), missing, "방향")],
      ["사용승인", orMissing(approval, missing, "사용승인일")],
      ["주차", orMissing(park, missing, "주차")],
      ["입주", orMissing(str(p.moveInDate) || "협의", missing, "입주")],
      ["관리비", orMissing(maint, missing, "관리비")],
      ["위반건축물", orMissing(illegal, missing, "위반건축물")],
    ],
    insightTitle: "특장점 · 입지",
    insight,
    missingLabels: missing,
  };
}

/** 폼 state → flyer 소스 */
export function propertyFormToFlyerSource(
  id: string,
  form: Record<string, unknown>,
): PropertyFlyerSource {
  return {
    id,
    title: str(form.title),
    description: str(form.description),
    featureSummary: str(form.featureSummary),
    address: str(form.address),
    category: str(form.category),
    type: str(form.type || form.dealType),
    dealSubType: str(form.dealSubType),
    price: form.price === "" || form.price == null ? null : Number(form.price),
    deposit: form.deposit === "" || form.deposit == null ? null : Number(form.deposit),
    monthlyRent:
      form.monthlyRent === "" || form.monthlyRent == null ? null : Number(form.monthlyRent),
    isJeonse: Boolean(form.isJeonse),
    exclusiveArea:
      form.exclusiveArea === "" || form.exclusiveArea == null
        ? null
        : Number(form.exclusiveArea),
    supplyArea:
      form.supplyArea === "" || form.supplyArea == null ? null : Number(form.supplyArea),
    floor: form.floor === "" || form.floor == null ? null : Number(form.floor),
    totalFloors:
      form.totalFloors === "" || form.totalFloors == null ? null : Number(form.totalFloors),
    direction: str(form.direction),
    rooms: form.rooms === "" || form.rooms == null ? null : Number(form.rooms),
    bathrooms: form.bathrooms === "" || form.bathrooms == null ? null : Number(form.bathrooms),
    parking: str(form.parking),
    maintenanceFee:
      form.maintenanceFee === "" || form.maintenanceFee == null
        ? null
        : Number(form.maintenanceFee),
    images: Array.isArray(form.images) ? (form.images as string[]) : str(form.images),
    useApprovalDate: str(form.useApprovalDate),
    approvalDate: str(form.approvalDate),
    illegalBuilding:
      typeof form.illegalBuilding === "boolean"
        ? form.illegalBuilding
        : form.illegalBuilding == null
          ? null
          : str(form.illegalBuilding),
    totalParking: form.totalParking as string | number | null,
    actualParking: form.actualParking as string | number | null,
    moveInDate: str(form.moveInDate),
    sido: str(form.sido),
    sigungu: str(form.sigungu),
    eupmyeondong: str(form.eupmyeondong),
    buildingName: str(form.buildingName),
  };
}
