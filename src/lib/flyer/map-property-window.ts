import { formatPrice, parseImages } from "@/lib/format";
import type { PropertyFlyerSource } from "@/lib/flyer/map-property";
import type {
  WindowFlyerSpec,
  WindowFlyerTemplate,
  WindowFlyerViewModel,
} from "@/lib/flyer/window-types";

function str(v: unknown): string {
  if (v == null || v === "") return "";
  return String(v);
}

function resolveKind(p: PropertyFlyerSource): "SALE" | "LEASE" {
  const t = String(p.type || "").toUpperCase();
  const sub = String(p.dealSubType || "").toUpperCase();
  if (t === "RENT" || t === "SHORT_TERM" || sub === "JEONSE" || sub === "MONTHLY") {
    return "LEASE";
  }
  return "SALE";
}

function resolveAddress(p: PropertyFlyerSource): string {
  if (p.address?.trim()) return p.address.trim();
  return [p.sigungu, p.eupmyeondong, p.buildingName].filter(Boolean).join(" · ");
}

function shortLocation(p: PropertyFlyerSource): string {
  const parts = [p.sigungu, p.eupmyeondong || p.buildingName].filter(Boolean);
  if (parts.length) return parts.join(" · ");
  const full = resolveAddress(p);
  return full.length > 28 ? `${full.slice(0, 26)}…` : full || "소재지 미기재";
}

function priceHuge(p: PropertyFlyerSource, kind: "SALE" | "LEASE"): { huge: string; note?: string } {
  if (kind === "LEASE") {
    if (p.isJeonse || String(p.dealSubType).toUpperCase() === "JEONSE") {
      return {
        huge: p.deposit != null && Number(p.deposit) > 0 ? formatPrice(Number(p.deposit)) : "전세가 미기재",
        note: "전세",
      };
    }
    const d = p.deposit != null ? formatPrice(Number(p.deposit)) : "-";
    const m = p.monthlyRent != null ? formatPrice(Number(p.monthlyRent)) : "-";
    return { huge: `${d} / ${m}`, note: "보증 / 월세" };
  }
  if (p.price != null && Number(p.price) > 0) {
    return { huge: formatPrice(Number(p.price)), note: "매매가" };
  }
  return { huge: "가격 미기재" };
}

function buildSpecs(p: PropertyFlyerSource): WindowFlyerSpec[] {
  const specs: WindowFlyerSpec[] = [];
  if (p.exclusiveArea != null) {
    specs.push({ icon: "area", label: `전용 ${p.exclusiveArea}㎡` });
  }
  if (p.floor != null) {
    specs.push({
      icon: "floor",
      label: p.totalFloors != null ? `${p.floor}/${p.totalFloors}층` : `${p.floor}층`,
    });
  }
  if (p.rooms != null) specs.push({ icon: "bed", label: `방 ${p.rooms}` });
  if (p.bathrooms != null) specs.push({ icon: "bath", label: `욕실 ${p.bathrooms}` });
  if (p.parking || p.totalParking) {
    specs.push({ icon: "car", label: str(p.parking) || `주차 ${p.totalParking}` });
  }
  while (specs.length < 2) {
    specs.push({ icon: "area", label: "상담 문의" });
  }
  return specs.slice(0, 4);
}

function buildHighlights(p: PropertyFlyerSource): string[] {
  const out: string[] = [];
  if (p.direction) out.push(String(p.direction));
  if (p.rooms != null || p.bathrooms != null) {
    out.push(`방 ${p.rooms ?? "-"} · 욕실 ${p.bathrooms ?? "-"}`);
  }
  if (p.exclusiveArea != null) out.push(`전용 ${p.exclusiveArea}㎡`);
  if (p.parking || p.totalParking) out.push(str(p.parking) || `주차 ${p.totalParking}`);
  const feat = str(p.featureSummary);
  if (feat && out.length < 4) out.push(feat.slice(0, 22));
  while (out.length < 2) out.push("현장 안내");
  return out.slice(0, 4);
}

function buildFeatures(p: PropertyFlyerSource, highlights: string[]): string[] {
  const feat = str(p.featureSummary);
  if (feat) {
    const parts = feat
      .split(/[·,|/]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 2);
    if (parts.length >= 2) return parts.map((s) => s.slice(0, 24));
    if (parts.length === 1) return [parts[0].slice(0, 28), highlights[0] || "상담 환영"];
  }
  return highlights.slice(0, 2);
}

function defaultTemplate(kind: "SALE" | "LEASE"): WindowFlyerTemplate {
  return kind === "LEASE" ? "B" : "A";
}

export function mapPropertyToWindowFlyer(
  p: PropertyFlyerSource,
  template?: WindowFlyerTemplate,
): WindowFlyerViewModel {
  const kind = resolveKind(p);
  const images = Array.isArray(p.images)
    ? p.images.filter(Boolean).slice(0, 3)
    : parseImages(typeof p.images === "string" ? p.images : "[]").slice(0, 3);
  const { huge, note } = priceHuge(p, kind);
  const badge =
    kind === "LEASE"
      ? p.isJeonse || String(p.dealSubType).toUpperCase() === "JEONSE"
        ? "전세"
        : "월세"
      : "매매";
  const highlights = buildHighlights(p);
  const specs = buildSpecs(p);
  const title = str(p.title) || "매물";
  const loc = shortLocation(p);

  const headline = kind === "LEASE" ? "JUST LISTED" : "OPEN HOUSE";
  const tagline =
    str(p.featureSummary).slice(0, 32) ||
    (kind === "LEASE" ? "즉시입주 · 상담환영" : "모던 스타일 · 상담환영");

  const areaLabel =
    p.exclusiveArea != null
      ? `전용 ${p.exclusiveArea}㎡`
      : specs[0]?.label || "면적 문의";

  return {
    kind,
    template: template ?? defaultTemplate(kind),
    badge,
    headline,
    tagline,
    title,
    priceHuge: huge,
    priceNote: note,
    locationLine: loc,
    addressLine: resolveAddress(p) || loc,
    highlights,
    features: buildFeatures(p, highlights),
    specs,
    priceRows: [
      {
        tab: badge,
        area: areaLabel,
        price: huge,
        note: str(p.buildingName) || undefined,
      },
    ],
    images,
    publicPath: `/properties/${p.id}`,
  };
}
