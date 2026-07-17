"use client";

import { AppLink as Link } from "@/components/ui/AppLink";
import { usePathname, useSearchParams } from "next/navigation";
import { navigateTo } from "@/lib/navigate";
import type { PropertyCategory } from "@prisma/client";
import { PROPERTY_CATEGORIES, PROPERTY_DEAL_TYPES, PROPERTY_REGIONS } from "@/lib/property-fields";
import {
  buildFilterSummary,
  FILTER_ALL_ACTIVE,
  FILTER_ALL_INACTIVE,
  getCategoryUi,
  getDealUi,
} from "@/lib/property-ui";

type PropertyFiltersProps = {
  counts?: Partial<Record<PropertyCategory, number>>;
  totalCount?: number;
  resultCount?: number;
};

export function PropertyFilters({ counts = {}, totalCount = 0, resultCount }: PropertyFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeDeal = searchParams.get("deal");
  const activeRegion = searchParams.get("region");
  const activeSort = searchParams.get("sort") ?? "latest";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    navigateTo(`${pathname}?${params.toString()}`);
  }

  const summary =
    resultCount != null
      ? buildFilterSummary({
          category: activeCategory,
          deal: activeDeal,
          region: activeRegion,
          count: resultCount,
        })
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-landing-border border-t-4 border-t-blue-500 bg-landing-surface p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-landing-text">매물 필터</p>
        {summary && (
          <span className="rounded-full bg-cta-from/15 px-3 py-1 font-caption font-bold text-blue-400">
            {summary}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-landing-muted">물건 유형</p>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            <CategoryChip
              active={!activeCategory}
              label={`전체 ${totalCount}`}
              icon="grid_view"
              activeClass={FILTER_ALL_ACTIVE}
              inactiveClass={FILTER_ALL_INACTIVE}
              onClick={() => updateParam("category", null)}
            />
            {PROPERTY_CATEGORIES.map((item) => {
              const ui = getCategoryUi(item.value);
              return (
                <CategoryChip
                  key={item.value}
                  active={activeCategory === item.value}
                  label={`${item.label} ${counts[item.value] ?? 0}`}
                  icon={ui.icon}
                  activeClass={ui.filterActive}
                  inactiveClass={ui.filterInactive}
                  onClick={() => updateParam("category", item.value)}
                />
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-landing-muted">거래</p>
          <div className="flex flex-wrap gap-2">
            <DealChip
              active={!activeDeal}
              label="전체"
              activeClass={FILTER_ALL_ACTIVE}
              inactiveClass={FILTER_ALL_INACTIVE}
              onClick={() => updateParam("deal", null)}
            />
            {PROPERTY_DEAL_TYPES.map((item) => {
              const ui = getDealUi(item.value);
              return (
                <DealChip
                  key={item.value}
                  active={activeDeal === item.value}
                  label={item.label}
                  activeClass={ui.chipActive}
                  inactiveClass={ui.chipInactive}
                  onClick={() => updateParam("deal", item.value)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="w-full text-xs font-semibold text-landing-muted sm:mr-1 sm:w-auto">지역</p>
          <FilterChip
            active={!activeRegion}
            label="전체"
            activeClass={FILTER_ALL_ACTIVE}
            inactiveClass={FILTER_ALL_INACTIVE}
            onClick={() => updateParam("region", null)}
          />
          {PROPERTY_REGIONS.filter((r) => r !== "기타").map((region) => (
            <FilterChip
              key={region}
              active={activeRegion === region}
              label={region}
              activeClass="bg-cta-from/20 text-blue-300 border border-cta-from/30 filter-chip-active"
              inactiveClass="bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20"
              onClick={() => updateParam("region", region)}
            />
          ))}
          <select
            value={activeSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="ml-auto rounded-full border border-landing-border bg-landing-elevated px-4 py-1.5 text-sm font-medium text-landing-text focus:border-blue-400 focus:outline-none"
          >
            <option value="latest">최신순</option>
            <option value="price_asc">가격 낮은순</option>
            <option value="price_desc">가격 높은순</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  icon,
  active,
  activeClass,
  inactiveClass,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  activeClass: string;
  inactiveClass: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
        active ? activeClass : inactiveClass
      }`}
    >
      <span className="material-symbols-outlined text-sm">{icon}</span>
      {label}
    </button>
  );
}

function DealChip({
  label,
  active,
  activeClass,
  inactiveClass,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  inactiveClass: string;
  onClick: () => void;
}) {
  return (
    <FilterChip
      label={label}
      active={active}
      activeClass={activeClass}
      inactiveClass={inactiveClass}
      onClick={onClick}
    />
  );
}

function FilterChip({
  label,
  active,
  activeClass,
  inactiveClass,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClass: string;
  inactiveClass: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
        active ? activeClass : inactiveClass
      }`}
    >
      {label}
    </button>
  );
}

export function PropertyFiltersLinkBar() {
  return (
    <div className="flex gap-2 text-xs">
      {PROPERTY_CATEGORIES.slice(0, 4).map((item) => (
        <Link
          key={item.value}
          href={`/properties?category=${item.value}`}
          className="rounded-full px-2 py-0.5 font-medium text-blue-400 hover:bg-cta-from/10"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
