import type { PropertyCategory } from "@prisma/client";
import type { FilterDealValue, FilterSortValue } from "@/components/property/PropertyFilterDropdownBar";

/** 상가·업무·토지 = 세부 유형 전부 */
export const COMMERCIAL_LAND_CATEGORIES: PropertyCategory[] = [
  "RETAIL",
  "OFFICE",
  "FACTORY",
  "LAND",
];

export type CategoryChipKey =
  | "ALL"
  | "APARTMENT"
  | "OFFICETEL"
  | "ROW_HOUSE"
  | "MULTI_FAMILY"
  | "ONE_ROOM"
  | "DETACHED"
  | "COMMERCIAL_LAND";

export type CategoryChip = {
  key: CategoryChipKey;
  label: string;
  /** empty = 전체(필터 없음) */
  categories: PropertyCategory[];
};

export const CATEGORY_CHIPS: CategoryChip[] = [
  { key: "ALL", label: "전체", categories: [] },
  { key: "APARTMENT", label: "아파트", categories: ["APARTMENT"] },
  { key: "OFFICETEL", label: "오피스텔", categories: ["OFFICETEL"] },
  { key: "ROW_HOUSE", label: "빌라/연립", categories: ["ROW_HOUSE"] },
  { key: "MULTI_FAMILY", label: "다세대", categories: ["MULTI_FAMILY"] },
  { key: "ONE_ROOM", label: "원룸·투룸", categories: ["ONE_ROOM"] },
  { key: "DETACHED", label: "단독·다가구", categories: ["DETACHED"] },
  {
    key: "COMMERCIAL_LAND",
    label: "상가·업무·토지",
    categories: [...COMMERCIAL_LAND_CATEGORIES],
  },
];

export const DEAL_CHIPS: { value: FilterDealValue | "ALL"; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "SALE", label: "매매" },
  { value: "JEONSE", label: "전세" },
  { value: "MONTHLY", label: "월세" },
  { value: "SHORT_TERM", label: "단기임대" },
];

export const SORT_CHIPS: { value: FilterSortValue; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
];

export function isCommercialLandSelected(categories: PropertyCategory[]): boolean {
  return COMMERCIAL_LAND_CATEGORIES.every((c) => categories.includes(c));
}

export function isCategoryChipSelected(
  chip: CategoryChip,
  categories: PropertyCategory[],
): boolean {
  if (chip.key === "ALL") return categories.length === 0;
  if (chip.key === "COMMERCIAL_LAND") return isCommercialLandSelected(categories);
  return chip.categories.every((c) => categories.includes(c));
}

/** 매물유형 칩 토글 (복수 선택, 상가·업무·토지는 세부 전부) */
export function toggleCategoryChip(
  categories: PropertyCategory[],
  chip: CategoryChip,
): PropertyCategory[] {
  if (chip.key === "ALL") return [];

  if (chip.key === "COMMERCIAL_LAND") {
    if (isCommercialLandSelected(categories)) {
      return categories.filter((c) => !COMMERCIAL_LAND_CATEGORIES.includes(c));
    }
    const next = new Set(categories);
    for (const c of COMMERCIAL_LAND_CATEGORIES) next.add(c);
    return [...next];
  }

  const value = chip.categories[0];
  if (!value) return categories;
  if (categories.includes(value)) return categories.filter((c) => c !== value);
  return [...categories, value];
}

export function toggleDealChip(
  deals: FilterDealValue[],
  value: FilterDealValue | "ALL",
): FilterDealValue[] {
  if (value === "ALL") return [];
  return deals.includes(value) ? deals.filter((d) => d !== value) : [...deals, value];
}

export function toggleRegionChip(regions: string[], value: string | "ALL"): string[] {
  if (value === "ALL") return [];
  return regions.includes(value) ? regions.filter((r) => r !== value) : [...regions, value];
}
