"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CATEGORY_GROUP_LABELS, getCategoryGroup } from "@/lib/property-naver/categories";
import type { CategoryGroup } from "@/lib/property-naver/types";
import { PROPERTY_SPLIT_SAMPLES } from "@/lib/mockup/property-split-sample-data";
import { PropertySplitDetail } from "./PropertySplitDetail";
import { PropertySplitList } from "./PropertySplitList";

const FILTERS: { key: "ALL" | CategoryGroup; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "APT_OFFICE", label: CATEGORY_GROUP_LABELS.APT_OFFICE },
  { key: "VILLA_HOUSE", label: CATEGORY_GROUP_LABELS.VILLA_HOUSE },
  { key: "RETAIL_OFFICE", label: CATEGORY_GROUP_LABELS.RETAIL_OFFICE },
  { key: "LAND", label: CATEGORY_GROUP_LABELS.LAND },
];

/** 히어로 오로라 패널 톤 */
const panelClass =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

export function PropertySplitSampleClient() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("ALL");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(PROPERTY_SPLIT_SAMPLES[0]?.id ?? null);
  const [mobileDetail, setMobileDetail] = useState(false);

  const items = useMemo(() => {
    return PROPERTY_SPLIT_SAMPLES.filter((p) => {
      if (filter !== "ALL" && getCategoryGroup(p.category) !== filter) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.buildingName || "").toLowerCase().includes(q) ||
        (p.address || "").toLowerCase().includes(q) ||
        (p.featureSummary || "").toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  useEffect(() => {
    if (!items.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !items.some((p) => p.id === selectedId)) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const selected = items.find((p) => p.id === selectedId) ?? null;

  function selectProperty(id: string) {
    setSelectedId(id);
    setMobileDetail(true);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-container-padding-mobile py-4 md:px-6 md:py-5">
      <div
        className={`${panelClass} mb-4 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5`}
      >
        <p className="text-xs text-white/65">
          <span className="font-bold text-[#c4b5fd]">샘플</span>
          {" · "}좌측 목록 5행 고정 스크롤 · 프로덕션 적용됨
        </p>
        <p className="text-[11px] text-white/40">승인 후 /properties 이식</p>
      </div>

      <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white md:text-2xl">추천 매물</h1>
          <p className="mt-0.5 text-sm text-white/50">{items.length}건 · 샘플 데이터</p>
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="단지명 · 주소 검색"
            className="w-full rounded-xl border border-white/15 bg-[rgba(10,10,18,0.55)] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#a78bfa] focus:outline-none"
          />
        </div>
      </header>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              filter === f.key
                ? "border-[#a78bfa]/55 bg-[#a78bfa]/15 text-[#ddd6fe]"
                : "border-white/10 text-white/55 hover:border-[#60a5fa]/35 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 좌측: 카드 5행 높이 고정 + 내부 스크롤 / 우측: 상세 */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,52%)_minmax(0,48%)] lg:items-start">
        <div
          className={`${mobileDetail ? "hidden lg:block" : "block"} lg:sticky lg:top-3 lg:pr-1`}
        >
          <div className={`${panelClass} p-2.5 md:p-3`}>
            {/* 카드≈180px × 5행 + gap 12px × 4 */}
            <div className="max-h-[calc(5*168px+4*0.625rem)] overflow-y-auto overscroll-contain pr-0.5 sm:max-h-[calc(5*180px+4*0.75rem)]">
              <PropertySplitList
                items={items}
                selectedId={selected?.id ?? null}
                onSelect={selectProperty}
              />
            </div>
          </div>
        </div>

        <div className={`${mobileDetail ? "block" : "hidden lg:block"}`}>
          <PropertySplitDetail
            property={selected}
            showBack={mobileDetail}
            onBack={() => setMobileDetail(false)}
          />
        </div>
      </div>
    </div>
  );
}
