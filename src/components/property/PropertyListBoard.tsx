"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PropertyRecommendStrip } from "@/components/property/PropertyRecommendStrip";
import { PropertyRegistryTable } from "@/components/property/PropertyRegistryTable";
import { categoryLabel } from "@/lib/format";
import { propertyCardDealBadgeLabel } from "@/lib/property-card-display";
import type { SerializedProperty } from "@/lib/property-split-view";
import { trackBrowserEvent } from "@/lib/analytics/track";

const panelClass =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

type SortKey = "price" | "publishedAt" | "title";

type Props = {
  items: SerializedProperty[];
  recommended: SerializedProperty[];
  totalCount: number;
};

export function PropertyListBoard({ items, recommended, totalCount }: Props) {
  const categories = useMemo(() => {
    const set = new Set(items.map((p) => categoryLabel(p.category)));
    return ["전체", ...Array.from(set).sort((a, b) => a.localeCompare(b, "ko"))];
  }, [items]);

  const dealTypes = useMemo(() => {
    const set = new Set(items.map((p) => propertyCardDealBadgeLabel(p)));
    return ["전체", ...Array.from(set).sort((a, b) => a.localeCompare(b, "ko"))];
  }, [items]);

  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [dealFilter, setDealFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("publishedAt");
  const [sortAsc, setSortAsc] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((p) => {
      if (categoryFilter !== "전체" && categoryLabel(p.category) !== categoryFilter) {
        return false;
      }
      if (dealFilter !== "전체" && propertyCardDealBadgeLabel(p) !== dealFilter) {
        return false;
      }
      if (!q) return true;
      const hay = [
        p.title,
        p.address,
        p.region,
        p.buildingName,
        p.manageCode,
        categoryLabel(p.category),
        propertyCardDealBadgeLabel(p),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "price": {
          const ap = a.type === "RENT" || a.type === "SHORT_TERM" ? a.deposit ?? a.price : a.price;
          const bp = b.type === "RENT" || b.type === "SHORT_TERM" ? b.deposit ?? b.price : b.price;
          cmp = ap - bp;
          break;
        }
        case "title":
          cmp = a.title.localeCompare(b.title, "ko");
          break;
        default:
          cmp = a.publishedAt.localeCompare(b.publishedAt);
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [items, categoryFilter, dealFilter, query, sortKey, sortAsc]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const t = window.setTimeout(() => {
      trackBrowserEvent({
        eventType: "search",
        menuKey: "properties",
        metadata: { keyword: q, resultCount: rows.length },
      });
    }, 600);
    return () => window.clearTimeout(t);
  }, [query, rows.length]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(key === "title");
    }
  }

  function sortLabel(key: SortKey, ascLabel: string, descLabel: string) {
    const on = sortKey === key;
    return (
      <button
        type="button"
        onClick={() => toggleSort(key)}
        className={`text-[11px] font-bold transition ${
          on ? "text-[#4dabff]" : "text-white/45 hover:text-white/75"
        }`}
      >
        {on ? (sortAsc ? ascLabel : descLabel) : `${ascLabel}/${descLabel}`}
      </button>
    );
  }

  return (
    <div className="space-y-6">
      <PropertyRecommendStrip items={recommended} />

      <section className={`${panelClass} space-y-3 p-4 md:p-5`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-white md:text-2xl">
              등록 매물{" "}
              <span className="text-[#c4b5fd]">
                [{rows.length.toLocaleString("ko-KR")}
                {query.trim() || categoryFilter !== "전체" || dealFilter !== "전체"
                  ? ` / ${totalCount.toLocaleString("ko-KR")}`
                  : ""}
                건]
              </span>
            </h1>
            <p className="mt-0.5 text-sm text-white/45">
              찬스부동산 중개 매물 · 행을 누르면 상세 페이지로 이동합니다
            </p>
          </div>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="제목 · 소재지 · 분류 검색"
              className="w-full rounded-xl border border-white/15 bg-black/40 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#a78bfa] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((t) => {
            const on = categoryFilter === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setCategoryFilter(t)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  on
                    ? "bg-gradient-to-r from-[#4dabff]/90 to-[#913dff]/80 text-white"
                    : "bg-white/8 text-white/50 ring-1 ring-white/10 hover:text-white"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {dealTypes.map((t) => {
            const on = dealFilter === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setDealFilter(t)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                  on
                    ? "bg-[#4dabff]/25 text-[#93c5fd] ring-1 ring-[#4dabff]/40"
                    : "bg-white/5 text-white/40 ring-1 ring-white/8 hover:text-white/70"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-3 text-[11px] text-white/40">
          <span className="font-bold text-white/55">정렬</span>
          {sortLabel("price", "가격↑", "가격↓")}
          {sortLabel("publishedAt", "등록일가까운", "등록일먼")}
          {sortLabel("title", "제목가나다", "제목역순")}
        </div>
      </section>

      <section className={`${panelClass} overflow-hidden p-0`}>
        {items.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-white/45">
            등록된 매물이 없습니다.
          </div>
        ) : (
          <PropertyRegistryTable items={rows} />
        )}
      </section>
    </div>
  );
}
