"use client";

import { useMemo, useState } from "react";
import type { PropertyCategory } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
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

const SAMPLE_REGIONS = ["홍성군", "예산군", "서산시", "당진시", "천안시"];

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
      <span>{label}</span>
      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""} ${
          open ? "text-[#6ee7b7]" : "text-white/35"
        }`}
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

export function PropertyFilterPillsSample() {
  const [open, setOpen] = useState<PanelKey | null>("category");
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [deals, setDeals] = useState<FilterDealValue[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [sort, setSort] = useState<FilterSortValue>("latest");

  const selection: PropertyFilterSelection = useMemo(
    () => ({ categories, deals, regions, sort }),
    [categories, deals, regions, sort],
  );

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
  const regionLabel = summarize(regions, "지역선택");
  const sortLabel = SORT_CHIPS.find((s) => s.value === sort)?.label ?? "최신순";

  function togglePanel(key: PanelKey) {
    setOpen((prev) => (prev === key ? null : key));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-container-padding-mobile py-6 md:px-8 md:py-8">
      <GlassCard className="p-5 md:p-6">
        <p className="text-xs font-bold tracking-wide text-emerald-200/90">
          프로덕션 적용됨 · /properties
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-white">매물 필터 · 히어로 톤</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">
          필터 바에 랜딩 히어로와 같은 바이올렛 오로라 배경이 적용되어 있습니다.
        </p>
      </GlassCard>

      {/* 히어로 오로라 배경 필터 바 */}
      <div className="relative overflow-hidden rounded-2xl border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_40px_rgba(167,139,250,0.12)]">
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
              onClick={() => togglePanel("category")}
            />
            <TabTrigger
              label={dealLabel}
              open={open === "deal"}
              active={deals.length > 0}
              onClick={() => togglePanel("deal")}
            />
            <TabTrigger
              label={regionLabel}
              open={open === "region"}
              active={regions.length > 0}
              onClick={() => togglePanel("region")}
            />
            <TabTrigger
              label={sortLabel}
              open={open === "sort"}
              active={sort !== "latest"}
              onClick={() => togglePanel("sort")}
            />
          </div>

          {open === "category" ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {CATEGORY_CHIPS.map((chip) => (
                <QaPill
                  key={chip.key}
                  label={chip.label}
                  selected={isCategoryChipSelected(chip, categories)}
                  onClick={() => setCategories(toggleCategoryChip(categories, chip))}
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
                  selected={
                    chip.value === "ALL" ? deals.length === 0 : deals.includes(chip.value)
                  }
                  onClick={() => setDeals(toggleDealChip(deals, chip.value))}
                />
              ))}
            </div>
          ) : null}

          {open === "region" ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <QaPill
                label="전체"
                selected={regions.length === 0}
                onClick={() => setRegions([])}
              />
              {SAMPLE_REGIONS.map((r) => (
                <QaPill
                  key={r}
                  label={r}
                  selected={regions.includes(r)}
                  onClick={() => setRegions(toggleRegionChip(regions, r))}
                />
              ))}
            </div>
          ) : null}

          {open === "sort" ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SORT_CHIPS.map((chip) => (
                <QaPill
                  key={chip.value}
                  label={chip.label}
                  selected={sort === chip.value}
                  onClick={() => setSort(chip.value)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <GlassCard className="p-4 md:p-5">
        <p className="text-xs font-bold text-white/45">선택 상태 (미리보기)</p>
        <pre className="mt-2 overflow-x-auto text-xs leading-relaxed text-[#6ee7b7]/90">
          {JSON.stringify(selection, null, 2)}
        </pre>
      </GlassCard>
    </div>
  );
}
