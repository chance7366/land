import type { PropertyCategory } from "@prisma/client";
import type { CategoryGroup } from "./types";

export const CATEGORY_GROUP_LABELS: Record<CategoryGroup, string> = {
  APT_OFFICE: "아파트/오피스텔",
  VILLA_HOUSE: "빌라/원룸/주택",
  RETAIL_OFFICE: "상가/사무실",
  LAND: "토지/임야",
};

export const CATEGORY_GROUP_OPTIONS: {
  group: CategoryGroup;
  categories: { value: PropertyCategory; label: string }[];
}[] = [
  {
    group: "APT_OFFICE",
    categories: [
      { value: "APARTMENT", label: "아파트" },
      { value: "OFFICETEL", label: "오피스텔" },
    ],
  },
  {
    group: "VILLA_HOUSE",
    categories: [
      { value: "ROW_HOUSE", label: "빌라/연립" },
      { value: "MULTI_FAMILY", label: "다세대" },
      { value: "ONE_ROOM", label: "원룸·투룸" },
      { value: "DETACHED", label: "단독·다가구" },
    ],
  },
  {
    group: "RETAIL_OFFICE",
    categories: [
      { value: "RETAIL", label: "상가" },
      { value: "OFFICE", label: "사무실" },
      { value: "FACTORY", label: "공장·지식산업센터" },
    ],
  },
  {
    group: "LAND",
    categories: [{ value: "LAND", label: "토지/임야" }],
  },
];

export const PROPERTY_CATEGORIES_NAVER: { value: PropertyCategory; label: string; group: CategoryGroup }[] =
  CATEGORY_GROUP_OPTIONS.flatMap((g) =>
    g.categories.map((c) => ({ ...c, group: g.group })),
  );

export function getCategoryGroup(category: PropertyCategory): CategoryGroup {
  const found = PROPERTY_CATEGORIES_NAVER.find((c) => c.value === category);
  return found?.group ?? "APT_OFFICE";
}

export function categoryLabelNaver(category: PropertyCategory | string): string {
  return PROPERTY_CATEGORIES_NAVER.find((c) => c.value === category)?.label ?? String(category);
}
