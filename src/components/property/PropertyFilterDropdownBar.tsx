"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { PropertyCategory } from "@prisma/client";
import { CATEGORY_GROUP_OPTIONS } from "@/lib/property-naver/categories";

export type FilterDealValue = "SALE" | "JEONSE" | "MONTHLY" | "SHORT_TERM";

export const FILTER_DEAL_OPTIONS: { value: FilterDealValue; label: string }[] = [
  { value: "SALE", label: "매매" },
  { value: "JEONSE", label: "전세" },
  { value: "MONTHLY", label: "월세" },
  { value: "SHORT_TERM", label: "단기임대" },
];

export type FilterSortValue = "latest" | "price_asc" | "price_desc";

/** 이미지처럼 2단: 주거 계열 / 상가·업무·토지 */
export const FILTER_CATEGORY_SECTIONS = [
  {
    title: "매물유형",
    items: [
      ...CATEGORY_GROUP_OPTIONS.find((g) => g.group === "APT_OFFICE")!.categories,
      ...CATEGORY_GROUP_OPTIONS.find((g) => g.group === "VILLA_HOUSE")!.categories,
    ],
  },
  {
    title: "상가·업무·토지",
    items: [
      ...CATEGORY_GROUP_OPTIONS.find((g) => g.group === "RETAIL_OFFICE")!.categories,
      ...CATEGORY_GROUP_OPTIONS.find((g) => g.group === "LAND")!.categories,
    ],
  },
] as const;

export const ALL_FILTER_CATEGORIES: PropertyCategory[] = FILTER_CATEGORY_SECTIONS.flatMap((s) =>
  s.items.map((i) => i.value),
);

type PanelKey = "category" | "deal" | "region" | null;

export type PropertyFilterSelection = {
  categories: PropertyCategory[];
  deals: FilterDealValue[];
  regions: string[];
  sort: FilterSortValue;
};

type PropertyFilterDropdownBarProps = {
  regions: string[];
  categories?: PropertyCategory[];
  deals?: FilterDealValue[];
  selectedRegions?: string[];
  sort?: FilterSortValue;
  onChange?: (next: PropertyFilterSelection) => void;
  /** Fires when open panel changes — null means closed (trigger toggle, outside, Esc) */
  onOpenChange?: (panel: PanelKey) => void;
  /** landing = hero/glass tone for list redesign sample */
  variant?: "default" | "landing";
};

function summarize(labels: string[], fallback: string) {
  if (labels.length === 0) return fallback;
  if (labels.length <= 2) return labels.join(", ");
  return `${labels.slice(0, 2).join(", ")} 외 ${labels.length - 2}`;
}

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function PropertyFilterDropdownBar({
  regions,
  categories: controlledCategories,
  deals: controlledDeals,
  selectedRegions: controlledRegions,
  sort: controlledSort = "latest",
  onChange,
  onOpenChange,
  variant = "default",
}: PropertyFilterDropdownBarProps) {
  const landing = variant === "landing";
  const rootRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const [open, setOpen] = useState<PanelKey>(null);
  const [categories, setCategories] = useState<PropertyCategory[]>(controlledCategories ?? []);
  const [deals, setDeals] = useState<FilterDealValue[]>(controlledDeals ?? []);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(controlledRegions ?? []);
  const [sort, setSort] = useState<FilterSortValue>(controlledSort);

  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  function setOpenPanel(next: PanelKey) {
    setOpen(next);
    onOpenChangeRef.current?.(next);
  }

  useEffect(() => {
    if (controlledCategories) setCategories(controlledCategories);
  }, [controlledCategories]);
  useEffect(() => {
    if (controlledDeals) setDeals(controlledDeals);
  }, [controlledDeals]);
  useEffect(() => {
    if (controlledRegions) setSelectedRegions(controlledRegions);
  }, [controlledRegions]);
  useEffect(() => {
    setSort(controlledSort);
  }, [controlledSort]);

  function emit(partial: Partial<PropertyFilterSelection>) {
    const next: PropertyFilterSelection = {
      categories: partial.categories ?? categories,
      deals: partial.deals ?? deals,
      regions: partial.regions ?? selectedRegions,
      sort: partial.sort ?? sort,
    };
    onChange?.(next);
  }

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(null);
        onOpenChangeRef.current?.(null);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(null);
        onOpenChangeRef.current?.(null);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const categoryLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const section of FILTER_CATEGORY_SECTIONS) {
      for (const item of section.items) map.set(item.value, item.label);
    }
    return map;
  }, []);

  const categorySummary = summarize(
    categories.map((c) => categoryLabelMap.get(c) ?? c),
    "매물유형",
  );
  const dealSummary = summarize(
    deals.map((d) => FILTER_DEAL_OPTIONS.find((o) => o.value === d)?.label ?? d),
    "거래유형",
  );
  const regionSummary = summarize(selectedRegions, "지역선택");

  const allCategoriesSelected =
    ALL_FILTER_CATEGORIES.length > 0 &&
    ALL_FILTER_CATEGORIES.every((c) => categories.includes(c));
  const allDealsSelected =
    FILTER_DEAL_OPTIONS.length > 0 &&
    FILTER_DEAL_OPTIONS.every((d) => deals.includes(d.value));
  const allRegionsSelected =
    regions.length > 0 && regions.every((r) => selectedRegions.includes(r));

  return (
    <div
      ref={rootRef}
      className={
        landing
          ? "relative z-20 rounded-2xl border border-white/10 bg-[rgba(15,18,28,0.92)] p-3 shadow-[0_0_0_1px_rgba(77,171,255,0.12),0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-sm md:p-4"
          : "relative z-20"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <FilterTrigger
          id={`${baseId}-category`}
          open={open === "category"}
          active={categories.length > 0}
          label={categorySummary}
          landing={landing}
          onClick={() => setOpenPanel(open === "category" ? null : "category")}
        />
        <FilterTrigger
          id={`${baseId}-deal`}
          open={open === "deal"}
          active={deals.length > 0}
          label={dealSummary}
          landing={landing}
          onClick={() => setOpenPanel(open === "deal" ? null : "deal")}
        />
        <FilterTrigger
          id={`${baseId}-region`}
          open={open === "region"}
          active={selectedRegions.length > 0}
          label={regionSummary}
          landing={landing}
          onClick={() => setOpenPanel(open === "region" ? null : "region")}
        />
        <select
          value={sort}
          onChange={(e) => {
            const next = e.target.value as FilterSortValue;
            setSort(next);
            emit({ sort: next });
          }}
          className={
            landing
              ? "ml-auto rounded-full border border-white/12 bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white focus:border-[#4dabff] focus:outline-none"
              : "ml-auto rounded-full border border-landing-border bg-landing-elevated px-4 py-2 text-sm font-medium text-landing-text focus:border-blue-400 focus:outline-none"
          }
        >
          <option value="latest">최신순</option>
          <option value="price_asc">가격 낮은순</option>
          <option value="price_desc">가격 높은순</option>
        </select>
      </div>

      {open === "category" && (
        <FilterPanel labelledBy={`${baseId}-category`} landing={landing}>
          <div className="flex items-center justify-between gap-3">
            <p className={`text-base font-bold ${landing ? "text-white" : "text-landing-text"}`}>
              매물유형
            </p>
            <SelectAllButton
              allSelected={allCategoriesSelected}
              landing={landing}
              onClick={() => {
                const next = allCategoriesSelected ? [] : [...ALL_FILTER_CATEGORIES];
                setCategories(next);
                emit({ categories: next });
              }}
            />
          </div>
          {FILTER_CATEGORY_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <p className={`text-sm font-semibold ${landing ? "text-[#a3a3a3]" : "text-landing-muted"}`}>
                {section.title}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {section.items.map((item) => (
                  <SelectChip
                    key={item.value}
                    label={item.label}
                    selected={categories.includes(item.value)}
                    landing={landing}
                    onClick={() => {
                      const next = toggleValue(categories, item.value);
                      setCategories(next);
                      emit({ categories: next });
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </FilterPanel>
      )}

      {open === "deal" && (
        <FilterPanel labelledBy={`${baseId}-deal`} landing={landing}>
          <div className="flex items-center justify-between gap-3">
            <p className={`text-base font-bold ${landing ? "text-white" : "text-landing-text"}`}>
              거래유형
            </p>
            <SelectAllButton
              allSelected={allDealsSelected}
              landing={landing}
              onClick={() => {
                const next = allDealsSelected
                  ? []
                  : FILTER_DEAL_OPTIONS.map((d) => d.value);
                setDeals(next);
                emit({ deals: next });
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTER_DEAL_OPTIONS.map((item) => (
              <SelectChip
                key={item.value}
                label={item.label}
                selected={deals.includes(item.value)}
                landing={landing}
                onClick={() => {
                  const next = toggleValue(deals, item.value);
                  setDeals(next);
                  emit({ deals: next });
                }}
              />
            ))}
          </div>
        </FilterPanel>
      )}

      {open === "region" && (
        <FilterPanel labelledBy={`${baseId}-region`} landing={landing}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className={`text-base font-bold ${landing ? "text-white" : "text-landing-text"}`}>
                지역선택
              </p>
              <p className={`mt-1 text-xs ${landing ? "text-[#737373]" : "text-landing-muted"}`}>
                매물 등록 시군구 단위
              </p>
            </div>
            {regions.length > 0 && (
              <SelectAllButton
                allSelected={allRegionsSelected}
                landing={landing}
                onClick={() => {
                  const next = allRegionsSelected ? [] : [...regions];
                  setSelectedRegions(next);
                  emit({ regions: next });
                }}
              />
            )}
          </div>
          {regions.length === 0 ? (
            <p className={`text-sm ${landing ? "text-[#a3a3a3]" : "text-landing-muted"}`}>
              등록된 시군구가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {regions.map((region) => (
                <SelectChip
                  key={region}
                  label={region}
                  selected={selectedRegions.includes(region)}
                  landing={landing}
                  onClick={() => {
                    const next = toggleValue(selectedRegions, region);
                    setSelectedRegions(next);
                    emit({ regions: next });
                  }}
                />
              ))}
            </div>
          )}
        </FilterPanel>
      )}
    </div>
  );
}

function SelectAllButton({
  allSelected,
  onClick,
  landing,
}: {
  allSelected: boolean;
  onClick: () => void;
  landing?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        landing
          ? "shrink-0 rounded-full border border-[#4dabff]/35 px-3 py-1 text-xs font-bold text-[#4dabff] transition-colors hover:bg-[rgba(77,171,255,0.12)]"
          : "shrink-0 rounded-full border border-landing-border px-3 py-1 text-xs font-bold text-blue-300 transition-colors hover:border-blue-400/50 hover:bg-cta-from/10"
      }
    >
      {allSelected ? "선택해제" : "전체선택"}
    </button>
  );
}

function FilterTrigger({
  id,
  label,
  open,
  active,
  onClick,
  landing,
}: {
  id: string;
  label: string;
  open: boolean;
  active: boolean;
  onClick: () => void;
  landing?: boolean;
}) {
  const on = open || active;
  return (
    <button
      id={id}
      type="button"
      aria-expanded={open}
      aria-haspopup="dialog"
      onClick={onClick}
      className={
        landing
          ? `inline-flex max-w-full items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-[box-shadow,border-color,background-color,color] ${
              on
                ? "border-[#4dabff]/55 bg-[rgba(77,171,255,0.12)] text-[#4dabff] shadow-[0_0_0_1px_rgba(77,171,255,0.35),0_0_20px_rgba(77,171,255,0.25)]"
                : "border-white/12 bg-[#1f1f1f] text-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.35)] hover:border-[#4dabff]/35"
            }`
          : `inline-flex max-w-full items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
              on
                ? "border-blue-400/60 bg-cta-from/15 text-blue-300"
                : "border-landing-border bg-landing-elevated text-landing-text hover:border-white/25"
            }`
      }
    >
      <span className="truncate">{label}</span>
      <span className="material-symbols-outlined text-base opacity-80">
        {open ? "expand_less" : "expand_more"}
      </span>
    </button>
  );
}

function FilterPanel({
  children,
  labelledBy,
  landing,
}: {
  children: React.ReactNode;
  labelledBy: string;
  landing?: boolean;
}) {
  return (
    <div
      role="dialog"
      aria-labelledby={labelledBy}
      className={
        landing
          ? "absolute left-0 right-0 top-full z-30 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-[rgba(15,18,28,0.96)] p-4 shadow-[0_0_0_1px_rgba(77,171,255,0.15),0_20px_48px_rgba(0,0,0,0.55)] backdrop-blur-md sm:right-auto sm:min-w-[340px] sm:max-w-[420px]"
          : "absolute left-0 right-0 top-full z-30 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-landing-border bg-landing-surface p-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] sm:right-auto sm:min-w-[340px] sm:max-w-[420px]"
      }
    >
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function SelectChip({
  label,
  selected,
  onClick,
  landing,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  landing?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        landing
          ? `rounded-full px-3 py-2 text-sm font-semibold transition-[box-shadow,border-color,background-color,color] ${
              selected
                ? "border border-[#4dabff]/70 bg-[#141820] text-white shadow-[0_0_16px_rgba(77,171,255,0.2)]"
                : "border border-transparent bg-[#1f1f1f] text-[#a3a3a3] hover:text-white"
            }`
          : `rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
              selected
                ? "border border-blue-400/70 bg-[#141820] text-landing-text"
                : "border border-transparent bg-landing-elevated text-landing-muted hover:text-landing-text"
            }`
      }
    >
      {label}
    </button>
  );
}
