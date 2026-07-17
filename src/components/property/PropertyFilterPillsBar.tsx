"use client";

import { useEffect, useRef, useState } from "react";
import type { PropertyCategory } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import type {
  FilterDealValue,
  FilterSortValue,
  PropertyFilterSelection,
} from "@/components/property/PropertyFilterDropdownBar";
import {
  CATEGORY_CHIPS,
  DEAL_CHIPS,
  SORT_CHIPS,
  isCategoryChipSelected,
  toggleCategoryChip,
  toggleDealChip,
  toggleRegionChip,
} from "@/lib/property-filter-pills";

type PanelKey = "category" | "deal" | "region" | "sort";

type Props = {
  regions: string[];
  categories?: PropertyCategory[];
  deals?: FilterDealValue[];
  selectedRegions?: string[];
  sort?: FilterSortValue;
  onChange?: (next: PropertyFilterSelection) => void;
  onOpenChange?: (panel: PanelKey | null) => void;
};

function QaPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
        selected
          ? "border-[#34d399]/50 bg-[#34d399]/15 text-[#6ee7b7]"
          : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function TabTrigger({
  label,
  open,
  active,
  onClick,
}: {
  label: string;
  open: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1 border-b-2 px-1 pb-2 text-sm font-semibold transition ${
        open
          ? "border-[#34d399] text-[#6ee7b7]"
          : active
            ? "border-transparent text-white hover:text-[#6ee7b7]"
            : "border-transparent text-white/50 hover:text-white/80"
      }`}
    >
      <span className="max-w-[10rem] truncate sm:max-w-none">{label}</span>
      <ChevronDown
        className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180 text-[#6ee7b7]" : "text-white/35"}`}
        aria-hidden
      />
    </button>
  );
}

function summarize(labels: string[], fallback: string) {
  if (labels.length === 0) return fallback;
  if (labels.length <= 2) return labels.join(" · ");
  return `${labels[0]} 외 ${labels.length - 1}`;
}

export function PropertyFilterPillsBar({
  regions,
  categories: controlledCategories,
  deals: controlledDeals,
  selectedRegions: controlledRegions,
  sort: controlledSort = "latest",
  onChange,
  onOpenChange,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<PanelKey | null>(null);
  const [categories, setCategories] = useState<PropertyCategory[]>(controlledCategories ?? []);
  const [deals, setDeals] = useState<FilterDealValue[]>(controlledDeals ?? []);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(controlledRegions ?? []);
  const [sort, setSort] = useState<FilterSortValue>(controlledSort);

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

  function setOpenPanel(next: PanelKey | null) {
    setOpen(next);
    onOpenChange?.(next);
  }

  function emit(partial: Partial<PropertyFilterSelection>) {
    const next: PropertyFilterSelection = {
      categories: partial.categories ?? categories,
      deals: partial.deals ?? deals,
      regions: partial.regions ?? selectedRegions,
      sort: partial.sort ?? sort,
    };
    onChange?.(next);
  }

  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => {
    function close() {
      setOpen(null);
      onOpenChangeRef.current?.(null);
    }
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const categoryLabel = summarize(
    CATEGORY_CHIPS.filter((c) => c.key !== "ALL" && isCategoryChipSelected(c, categories)).map(
      (c) => c.label,
    ),
    "매물유형",
  );
  const dealLabel = summarize(
    DEAL_CHIPS.filter((d) => d.value !== "ALL" && deals.includes(d.value)).map((d) => d.label),
    "거래유형",
  );
  const regionLabel = summarize(selectedRegions, "지역선택");
  const sortLabel = SORT_CHIPS.find((s) => s.value === sort)?.label ?? "최신순";

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-2xl border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_40px_rgba(167,139,250,0.12)]"
    >
      <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
        <div className="hr3-glow absolute inset-0" />
      </div>
      <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1] opacity-80" aria-hidden />
      <div className="relative z-10 px-4 py-3 md:px-5 md:py-4">
        <div className="flex flex-wrap items-end gap-x-5 gap-y-2 border-b border-white/15 pb-1">
          <TabTrigger
            label={categoryLabel}
            open={open === "category"}
            active={categories.length > 0}
            onClick={() => setOpenPanel(open === "category" ? null : "category")}
          />
          <TabTrigger
            label={dealLabel}
            open={open === "deal"}
            active={deals.length > 0}
            onClick={() => setOpenPanel(open === "deal" ? null : "deal")}
          />
          <TabTrigger
            label={regionLabel}
            open={open === "region"}
            active={selectedRegions.length > 0}
            onClick={() => setOpenPanel(open === "region" ? null : "region")}
          />
          <TabTrigger
            label={sortLabel}
            open={open === "sort"}
            active={sort !== "latest"}
            onClick={() => setOpenPanel(open === "sort" ? null : "sort")}
          />
        </div>

        {open === "category" ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CATEGORY_CHIPS.map((chip) => (
              <QaPill
                key={chip.key}
                label={chip.label}
                selected={isCategoryChipSelected(chip, categories)}
                onClick={() => {
                  const next = toggleCategoryChip(categories, chip);
                  setCategories(next);
                  emit({ categories: next });
                }}
              />
            ))}
          </div>
        ) : null}

        {open === "deal" ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {DEAL_CHIPS.map((chip) => (
              <QaPill
                key={chip.value}
                label={chip.label}
                selected={chip.value === "ALL" ? deals.length === 0 : deals.includes(chip.value)}
                onClick={() => {
                  const next = toggleDealChip(deals, chip.value);
                  setDeals(next);
                  emit({ deals: next });
                }}
              />
            ))}
          </div>
        ) : null}

        {open === "region" ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <QaPill
              label="전체"
              selected={selectedRegions.length === 0}
              onClick={() => {
                setSelectedRegions([]);
                emit({ regions: [] });
              }}
            />
            {regions.length === 0 ? (
              <span className="self-center text-xs text-white/40">등록된 지역이 없습니다</span>
            ) : (
              regions.map((r) => (
                <QaPill
                  key={r}
                  label={r}
                  selected={selectedRegions.includes(r)}
                  onClick={() => {
                    const next = toggleRegionChip(selectedRegions, r);
                    setSelectedRegions(next);
                    emit({ regions: next });
                  }}
                />
              ))
            )}
          </div>
        ) : null}

        {open === "sort" ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SORT_CHIPS.map((chip) => (
              <QaPill
                key={chip.value}
                label={chip.label}
                selected={sort === chip.value}
                onClick={() => {
                  setSort(chip.value);
                  emit({ sort: chip.value });
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
