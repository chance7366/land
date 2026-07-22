"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AuctionRecommendStrip } from "@/components/auction/AuctionRecommendStrip";
import { AuctionRegistryTable } from "@/components/auction/AuctionRegistryTable";
import type { SerializedAuction } from "@/lib/auction-split-view";
import { trackBrowserEvent } from "@/lib/analytics/track";

const panelClass =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

type SortKey = "dDay" | "minPrice" | "appraisal" | "saleDate" | "caseNumber";

type Props = {
  items: SerializedAuction[];
  recommended: SerializedAuction[];
  totalCount: number;
};

export function AuctionListBoard({ items, recommended, totalCount }: Props) {
  const itemTypes = useMemo(() => {
    const set = new Set(
      items.map((a) => a.itemType?.trim()).filter((t): t is string => Boolean(t)),
    );
    return ["전체", ...Array.from(set).sort((a, b) => a.localeCompare(b, "ko"))];
  }, [items]);

  const [typeFilter, setTypeFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dDay");
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((a) => {
      if (typeFilter !== "전체" && a.itemType !== typeFilter) return false;
      if (!q) return true;
      const hay = [
        a.title,
        a.caseNumber,
        a.manageCode,
        a.address,
        a.address2,
        a.itemType,
        a.region,
        a.court,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "minPrice": {
          const am = a.minPrice ?? a.recommendedPrice ?? 0;
          const bm = b.minPrice ?? b.recommendedPrice ?? 0;
          cmp = am - bm;
          break;
        }
        case "appraisal":
          cmp = a.appraisalPrice - b.appraisalPrice;
          break;
        case "saleDate":
          cmp = (a.saleDate ?? "").localeCompare(b.saleDate ?? "");
          break;
        case "caseNumber":
          cmp = a.caseNumber.localeCompare(b.caseNumber, "ko");
          break;
        default:
          cmp = a.dDay - b.dDay;
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [items, typeFilter, query, sortKey, sortAsc]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const t = window.setTimeout(() => {
      trackBrowserEvent({
        eventType: "search",
        menuKey: "auctions",
        metadata: { keyword: q, resultCount: rows.length },
      });
    }, 600);
    return () => window.clearTimeout(t);
  }, [query, rows.length]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(key === "dDay" || key === "saleDate");
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
      <AuctionRecommendStrip items={recommended} />

      <section className={`${panelClass} space-y-3 p-4 md:p-5`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-white md:text-2xl">
              등록 경매{" "}
              <span className="text-[#c4b5fd]">
                [{rows.length.toLocaleString("ko-KR")}
                {query.trim() || typeFilter !== "전체"
                  ? ` / ${totalCount.toLocaleString("ko-KR")}`
                  : ""}
                건]
              </span>
            </h1>
            <p className="mt-0.5 text-sm text-white/45">
              찬스부동산이 등록한 경매물건 · 행을 누르면 상세 페이지로 이동합니다
            </p>
          </div>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="사건번호 · 소재지 · 법원 검색"
              className="w-full rounded-xl border border-white/15 bg-black/40 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#a78bfa] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {itemTypes.map((t) => {
            const on = typeFilter === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
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

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-3 text-[11px] text-white/40">
          <span className="font-bold text-white/55">정렬</span>
          {sortLabel("appraisal", "감정가↑", "감정가↓")}
          {sortLabel("minPrice", "최저가↑", "최저가↓")}
          {sortLabel("saleDate", "입찰일가까운", "입찰일먼")}
          {sortLabel("caseNumber", "사건번호오래된", "사건번호최근")}
          {sortLabel("dDay", "D-day가까운", "D-day먼")}
        </div>
      </section>

      {items.length === 0 ? (
        <div className={`${panelClass} flex flex-col items-center px-4 py-16 text-center`}>
          <span className="material-symbols-outlined mb-4 text-5xl text-white/25">gavel</span>
          <p className="font-bold text-white">진행 중인 경매가 없습니다</p>
        </div>
      ) : (
        <section className={`${panelClass} overflow-hidden`}>
          <AuctionRegistryTable items={rows} />
        </section>
      )}
    </div>
  );
}
