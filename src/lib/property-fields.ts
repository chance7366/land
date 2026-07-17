import type { Property, PropertyCategory, PropertyType } from "@prisma/client";
import { PROPERTY_CATEGORIES_NAVER } from "@/lib/property-naver/categories";
import { DEAL_TYPE_OPTIONS } from "@/lib/property-naver/deal-options";

export const PROPERTY_CATEGORIES: { value: PropertyCategory; label: string }[] =
  PROPERTY_CATEGORIES_NAVER.map(({ value, label }) => ({ value, label }));

export const PROPERTY_DEAL_TYPES: { value: PropertyType; label: string }[] = DEAL_TYPE_OPTIONS.map(
  (d) => ({ value: d.value as PropertyType, label: d.label }),
);

export const PROPERTY_REGIONS = ["내포신도시", "홍성", "기타"] as const;

export const PROPERTY_TAGS = ["급매", "즉시입주", "역세권", "대로변", "분양권"] as const;

export type PropertyFormField = {
  key: keyof Property;
  label: string;
  type: "text" | "number" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
};

/** @deprecated Prefer property-naver field specs. Kept for list filters / title suggest. */
export function getSpecFieldsForCategory(category: PropertyCategory): PropertyFormField[] {
  void category;
  return [];
}

export function suggestPropertyTitle(input: {
  category: PropertyCategory;
  type: PropertyType;
  buildingName?: string | null;
  exclusiveArea?: number | null;
}): string {
  const categoryLabel = PROPERTY_CATEGORIES.find((c) => c.value === input.category)?.label ?? "";
  const dealLabel = PROPERTY_DEAL_TYPES.find((d) => d.value === input.type)?.label ?? "";
  const area = input.exclusiveArea ? ` ${input.exclusiveArea}㎡` : "";
  const building = input.buildingName ? `${input.buildingName} ` : "";
  return `${building}${categoryLabel}${area} ${dealLabel}`.trim();
}

export type PropertyListFilters = {
  /** @deprecated single — prefer categories */
  category?: PropertyCategory;
  categories?: PropertyCategory[];
  /** @deprecated single — prefer deals */
  type?: PropertyType;
  deals?: ("SALE" | "JEONSE" | "MONTHLY" | "SHORT_TERM")[];
  /** @deprecated marketing region — prefer sigungu regions */
  region?: string;
  regions?: string[];
  sort?: "latest" | "price_asc" | "price_desc";
};

const FILTER_DEAL_VALUES = ["SALE", "JEONSE", "MONTHLY", "SHORT_TERM"] as const;

function parseCsv(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function parsePropertyListFilters(searchParams: URLSearchParams): PropertyListFilters {
  const categoryCsv = parseCsv(searchParams.get("category"));
  const dealCsv = parseCsv(searchParams.get("deal"));
  const regionCsv = parseCsv(searchParams.get("region"));
  const sort = (searchParams.get("sort") as PropertyListFilters["sort"]) ?? "latest";

  const categories = categoryCsv.filter((c): c is PropertyCategory =>
    PROPERTY_CATEGORIES.some((item) => item.value === c),
  );

  const deals = dealCsv.filter((d): d is (typeof FILTER_DEAL_VALUES)[number] =>
    (FILTER_DEAL_VALUES as readonly string[]).includes(d),
  );

  // Legacy single deal as PropertyType
  const legacyType =
    deals.length === 0 && searchParams.get("deal")
      ? (PROPERTY_DEAL_TYPES.find((d) => d.value === searchParams.get("deal"))?.value as
          | PropertyType
          | undefined)
      : undefined;

  return {
    categories: categories.length ? categories : undefined,
    category: categories.length === 1 ? categories[0] : undefined,
    deals: deals.length ? deals : undefined,
    type: legacyType,
    regions: regionCsv.length ? regionCsv : undefined,
    region: regionCsv.length === 1 ? regionCsv[0] : undefined,
    sort: sort === "price_asc" || sort === "price_desc" ? sort : "latest",
  };
}
