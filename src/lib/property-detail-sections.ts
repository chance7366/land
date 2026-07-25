import type { Property } from "@prisma/client";
import {
  categoryLabel,
  formatAreaPyeong,
  parseSpecs,
  propertyTypeLabel,
} from "@/lib/format";
import { formatManwonWithUnit, propertyCardDealBadgeLabel } from "@/lib/property-card-display";
import {
  CATEGORY_GROUP_LABELS,
  getCategoryGroup,
} from "@/lib/property-naver/categories";
import {
  getFieldsForStep,
  uniqueFields,
} from "@/lib/property-naver/field-spec";
import type { FieldSpec } from "@/lib/property-naver/types";

export type PropertyKvRow = { label: string; value: string };

/** 히어로에 이미 노출 · 내부용 · 주소는 §2에서 합침 */
const SKIP_FIELDS = new Set([
  "title",
  "featureSummary",
  "description",
  "sido",
  "sigungu",
  "eupmyeondong",
  "ri",
  "jibunMain",
  "jibunSub",
  "buildingName",
  "unitDong",
  "unitHo",
  "naverComplexId",
  "naverDongId",
  "keyMoneyHidden",
  "ownerName",
  "ownerRelation",
  "ownerPhone",
  "clientName",
  "floor", // totalFloors와 합침
  "rooms", // bathrooms와 합침
  "totalFloors",
  "bathrooms",
]);

const MONEY_FIELDS = new Set([
  "price",
  "deposit",
  "monthlyRent",
  "keyMoney",
  "maintenanceFee",
]);

const AREA_FIELDS = new Set([
  "supplyArea",
  "exclusiveArea",
  "landShareArea",
  "contractArea",
  "landArea",
]);

function push(items: PropertyKvRow[], label: string, value: string | null | undefined) {
  if (!value?.trim()) return;
  items.push({ label, value: value.trim() });
}

function fmtBool(v: unknown): string | null {
  if (typeof v !== "boolean") return null;
  return v ? "예" : "아니오";
}

function fmtList(v: unknown): string | null {
  if (Array.isArray(v) && v.length) return v.join(", ");
  if (typeof v === "string" && v.trim()) return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return null;
}

function cleanLabel(label: string): string {
  return label
    .replace(/\s*\(㎡\)\s*/g, "")
    .replace(/\s*\(만원\)\s*/g, "")
    .replace(/\s*\/분양가\s*/g, "")
    .trim();
}

function formatFieldValue(
  property: Property,
  specs: Record<string, unknown>,
  field: FieldSpec,
): string | null {
  const raw =
    field.storage === "specs"
      ? specs[field.field_name]
      : (property as unknown as Record<string, unknown>)[field.field_name];

  if (raw == null || raw === "") return null;
  if (Array.isArray(raw) && raw.length === 0) return null;

  if (field.field_name === "keyMoney") {
    if (property.keyMoneyHidden) return "비공개";
    if (typeof raw === "number") return formatManwonWithUnit(raw);
  }

  if (MONEY_FIELDS.has(field.field_name) && typeof raw === "number") {
    if (raw <= 0 && field.field_name !== "deposit") return null;
    return formatManwonWithUnit(raw);
  }

  if (AREA_FIELDS.has(field.field_name) && typeof raw === "number" && raw > 0) {
    return `${raw}㎡ (${formatAreaPyeong(raw)})`;
  }

  if (field.data_type === "Boolean") return fmtBool(raw);
  if (field.data_type === "MultiSelect" || Array.isArray(raw)) return fmtList(raw);
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  if (typeof raw === "string") return raw.trim() || null;
  return fmtList(raw);
}

function statusLabel(status: Property["status"], featured: boolean): string {
  const base =
    status === "ACTIVE" ? "노출" : status === "SOLD" ? "거래완료" : status === "HIDDEN" ? "숨김" : status;
  return featured ? `${base} · Featured` : base;
}

function addressLine(property: Property): string {
  const jibun = [property.jibunMain, property.jibunSub].filter(Boolean).join("-");
  const base = [property.sido, property.sigungu, property.eupmyeondong, property.ri]
    .filter(Boolean)
    .join(" ");
  return [base || property.address, jibun].filter(Boolean).join(" ");
}

function buildingLine(property: Property): string {
  return [
    property.buildingName,
    [property.unitDong, property.unitHo].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(" · ");
}

function buildFromFields(
  property: Property,
  specs: Record<string, unknown>,
  step: 1 | 2 | 3,
  extraSkip: Set<string> = new Set(),
): PropertyKvRow[] {
  const group = getCategoryGroup(property.category);
  const fields = uniqueFields(getFieldsForStep(group, step)).filter(
    (f) => !SKIP_FIELDS.has(f.field_name) && !extraSkip.has(f.field_name),
  );

  const items: PropertyKvRow[] = [];
  for (const field of fields) {
    const value = formatFieldValue(property, specs, field);
    push(items, cleanLabel(field.label), value);
  }
  return items;
}

/** §1 기본정보 · 거래조건 */
export function buildBasicDealSection(property: Property): PropertyKvRow[] {
  const group = getCategoryGroup(property.category);
  const items: PropertyKvRow[] = [];
  const specs = parseSpecs(property.specs);

  push(
    items,
    "카테고리",
    `${CATEGORY_GROUP_LABELS[group]} · ${categoryLabel(property.category)}`,
  );
  push(items, "거래 유형", propertyCardDealBadgeLabel(property) || propertyTypeLabel(property.type));

  // 거래금액 — 유형별
  if (property.type === "SALE" || property.type === "PRE_SALE") {
    if (property.price > 0) {
      push(
        items,
        property.type === "PRE_SALE" ? "분양가" : "매매가",
        formatManwonWithUnit(property.price),
      );
    }
  } else {
    if (property.deposit != null && property.deposit >= 0) {
      push(items, property.isJeonse || property.dealSubType === "JEONSE" ? "전세가" : "보증금", formatManwonWithUnit(property.deposit));
    }
    if (property.monthlyRent != null && property.monthlyRent > 0) {
      push(items, "월세", formatManwonWithUnit(property.monthlyRent));
    }
  }

  // step1 필드 중 가격·주소·제목 제외분
  const step1Extra = buildFromFields(
    property,
    specs,
    1,
    new Set(["price", "deposit", "monthlyRent", "keyMoney", "vatIncluded"]),
  );
  items.push(...step1Extra);

  if (group === "RETAIL_OFFICE") {
    if (property.keyMoneyHidden) push(items, "권리금", "비공개");
    else if (property.keyMoney != null) push(items, "권리금", formatManwonWithUnit(property.keyMoney));
    if (property.vatIncluded != null) push(items, "VAT", property.vatIncluded ? "포함" : "별도");
    if (property.businessType) push(items, "업종", property.businessType);
  }

  push(items, "노출 상태", statusLabel(property.status, property.featured));
  push(
    items,
    "등록일",
    property.publishedAt
      ? new Date(property.publishedAt).toISOString().slice(0, 10)
      : null,
  );
  push(items, "관리번호", property.manageCode);

  // 중복 라벨 제거 (먼저 넣은 것 유지)
  const seen = new Set<string>();
  return items.filter((row) => {
    if (seen.has(row.label)) return false;
    seen.add(row.label);
    return true;
  });
}

/** §2 매물 상세 · 면적 */
export function buildDetailAreaSection(property: Property): PropertyKvRow[] {
  const specs = parseSpecs(property.specs);
  const items: PropertyKvRow[] = [];

  push(items, "소재지", addressLine(property));
  push(items, "건물/단지", buildingLine(property));

  // 층 · 방/욕실 합침
  if (property.floor != null) {
    push(
      items,
      "해당층/총층",
      property.totalFloors != null
        ? `${property.floor} / ${property.totalFloors}층`
        : `${property.floor}층`,
    );
  }
  if (property.rooms != null) {
    push(
      items,
      "방/욕실",
      `방 ${property.rooms}${property.bathrooms != null ? ` · 욕실 ${property.bathrooms}` : ""}`,
    );
  }

  if (property.builtYear) push(items, "건축년도", `${property.builtYear}년`);
  if (property.parking) push(items, "주차", property.parking);

  items.push(...buildFromFields(property, specs, 2));

  // 중복 제거
  const seen = new Set<string>();
  return items.filter((row) => {
    if (seen.has(row.label)) return false;
    seen.add(row.label);
    return true;
  });
}

/** §3 시설 · 옵션 */
export function buildFacilitySection(property: Property): PropertyKvRow[] {
  const specs = parseSpecs(property.specs);
  const items = buildFromFields(property, specs, 3);

  // 난방 합침 표시가 이미 개별 필드면 유지. optionItems 등 추가
  const optionItems = fmtList(specs.optionItems);
  if (optionItems && !items.some((i) => i.label.includes("옵션"))) {
    push(items, "기타 옵션", optionItems);
  }

  const heating = [specs.heatingType, specs.heatingFuel].filter(Boolean).join(" · ");
  if (heating && !items.some((i) => i.label.includes("난방"))) {
    push(items, "난방", heating);
  }

  return items;
}

export function buildPropertyDetailSections(property: Property) {
  return {
    basic: buildBasicDealSection(property),
    detail: buildDetailAreaSection(property),
    facilities: buildFacilitySection(property),
  };
}
