"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { SerializedAuction } from "@/lib/auction-split-view";
import { AuctionSplitDetail } from "./AuctionSplitDetail";
import { AuctionSplitList } from "./AuctionSplitList";

const panelClass =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

type Props = {
  items: SerializedAuction[];
  initialId?: string | null;
  totalCount: number;
};

export function AuctionSplitBoard({ items, initialId = null, totalCount }: Props) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialId && items.some((a) => a.id === initialId) ? initialId : (items[0]?.id ?? null),
  );
  const [mobileDetail, setMobileDetail] = useState(
    Boolean(initialId && items.some((a) => a.id === initialId)),
  );

  const visible = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((a) => {
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
  }, [items, query]);

  useEffect(() => {
    if (!visible.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !visible.some((a) => a.id === selectedId)) {
      setSelectedId(visible[0].id);
    }
  }, [visible, selectedId]);

  useEffect(() => {
    if (!initialId) return;
    if (items.some((a) => a.id === initialId)) {
      setSelectedId(initialId);
      setMobileDetail(true);
    }
  }, [initialId, items]);

  const selected = visible.find((a) => a.id === selectedId) ?? null;

  function selectAuction(id: string) {
    setSelectedId(id);
    setMobileDetail(true);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("id", id);
      window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    }
  }

  return (
    <div>
      <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white md:text-2xl">
            추천 경매{" "}
            <span className="text-[#c4b5fd]">
              [{visible.length.toLocaleString("ko-KR")}
              {query.trim() ? ` / ${totalCount.toLocaleString("ko-KR")}` : ""}건]
            </span>
          </h1>
          <p className="mt-0.5 text-sm text-white/50">
            목록에서 경매를 선택하면 상세 정보가 표시됩니다
          </p>
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="사건번호 · 소재지 · 물건종류 검색"
            className="w-full rounded-xl border border-white/15 bg-[rgba(10,10,18,0.55)] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#a78bfa] focus:outline-none"
          />
        </div>
      </header>

      {items.length === 0 ? (
        <div className={`${panelClass} flex flex-col items-center px-4 py-16 text-center`}>
          <span className="material-symbols-outlined mb-4 text-5xl text-white/25">gavel</span>
          <p className="font-bold text-white">진행 중인 경매가 없습니다</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,52%)_minmax(0,48%)] lg:items-start">
          <div
            className={`${mobileDetail ? "hidden lg:block" : "block"} lg:sticky lg:top-3 lg:pr-1`}
          >
            <div className={`${panelClass} p-2.5 md:p-3`}>
              {visible.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-white/45">
                  검색어에 맞는 경매가 없습니다.
                </div>
              ) : (
                <div className="max-h-[calc(5*168px+4*0.625rem)] overflow-y-auto overscroll-contain pr-0.5 sm:max-h-[calc(5*180px+4*0.75rem)]">
                  <AuctionSplitList
                    items={visible}
                    selectedId={selected?.id ?? null}
                    onSelect={selectAuction}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={`${mobileDetail ? "block" : "hidden lg:block"}`}>
            <AuctionSplitDetail
              auction={selected}
              showBack={mobileDetail}
              onBack={() => setMobileDetail(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
