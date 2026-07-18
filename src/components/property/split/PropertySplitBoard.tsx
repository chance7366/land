"use client";

import { useEffect, useMemo, useState } from "react";
import type { Property } from "@prisma/client";
import { Search } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { ItemDwellTracker } from "@/components/analytics/ItemDwellTracker";
import { PropertySplitDetail } from "@/components/property/split/PropertySplitDetail";
import { PropertySplitList } from "@/components/property/split/PropertySplitList";
import { trackBrowserEvent } from "@/lib/analytics/track";

const panelClass =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

export type SerializedProperty = Omit<Property, "publishedAt" | "createdAt" | "updatedAt"> & {
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  items: SerializedProperty[];
  initialId?: string | null;
  totalCount: number;
  filtered: boolean;
};

function toProperty(row: SerializedProperty): Property {
  return {
    ...row,
    publishedAt: new Date(row.publishedAt),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

export function PropertySplitBoard({ items, initialId = null, totalCount, filtered }: Props) {
  const properties = useMemo(() => items.map(toProperty), [items]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialId && properties.some((p) => p.id === initialId)
      ? initialId
      : (properties[0]?.id ?? null),
  );
  const [mobileDetail, setMobileDetail] = useState(
    Boolean(initialId && properties.some((p) => p.id === initialId)),
  );

  const visible = useMemo(() => {
    if (!query.trim()) return properties;
    const q = query.trim().toLowerCase();
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.buildingName || "").toLowerCase().includes(q) ||
        (p.address || "").toLowerCase().includes(q) ||
        (p.featureSummary || "").toLowerCase().includes(q) ||
        [p.sido, p.sigungu, p.eupmyeondong, p.ri].filter(Boolean).join(" ").toLowerCase().includes(q),
    );
  }, [properties, query]);

  useEffect(() => {
    if (!visible.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !visible.some((p) => p.id === selectedId)) {
      setSelectedId(visible[0].id);
    }
  }, [visible, selectedId]);

  useEffect(() => {
    if (!initialId) return;
    if (properties.some((p) => p.id === initialId)) {
      setSelectedId(initialId);
      setMobileDetail(true);
    }
  }, [initialId, properties]);

  const selected = visible.find((p) => p.id === selectedId) ?? null;

  function syncIdToUrl(id: string | null) {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("id", id);
    else url.searchParams.delete("id");
    const next = `${url.pathname}${url.search}`;
    window.history.replaceState(null, "", next);
  }

  function selectProperty(id: string) {
    setSelectedId(id);
    setMobileDetail(true);
    trackBrowserEvent({
      eventType: "item_click",
      menuKey: "properties",
      targetType: "property",
      targetId: id,
    });
    syncIdToUrl(id);
  }

  function backToList() {
    setMobileDetail(false);
    syncIdToUrl(null);
  }

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const t = window.setTimeout(() => {
      trackBrowserEvent({
        eventType: "search",
        menuKey: "properties",
        metadata: { keyword: q, resultCount: visible.length },
      });
    }, 600);
    return () => window.clearTimeout(t);
  }, [query, visible.length]);

  return (
    <div>
      <ItemDwellTracker targetType="property" targetId={selectedId} menuKey="properties" />
      <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white md:text-2xl">
            추천 매물{" "}
            <span className="text-[#c4b5fd]">
              [{visible.length.toLocaleString("ko-KR")}
              {filtered || query.trim() ? ` / ${totalCount.toLocaleString("ko-KR")}` : ""}건]
            </span>
          </h1>
          <p className="mt-0.5 text-sm text-white/50">목록에서 매물을 선택하면 상세 정보가 표시됩니다</p>
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

      {properties.length === 0 ? (
        <div className={`${panelClass} flex flex-col items-center px-4 py-16 text-center`}>
          <span className="material-symbols-outlined mb-4 text-5xl text-white/25">search_off</span>
          <p className="font-bold text-white">조건에 맞는 매물이 없습니다</p>
          <p className="mt-2 text-sm text-white/50">필터를 바꿔 다시 검색해 보세요</p>
          <Link
            href="/properties"
            className="mt-6 rounded-full border border-[#a78bfa]/40 bg-[#a78bfa]/12 px-6 py-2.5 text-sm font-bold text-[#ddd6fe]"
          >
            필터 초기화
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,52%)_minmax(0,48%)] lg:items-start">
          <div
            className={`${mobileDetail ? "hidden lg:block" : "block"} lg:sticky lg:top-3 lg:pr-1`}
          >
            <div className={`${panelClass} p-2.5 md:p-3`}>
              {visible.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-white/45">
                  검색어에 맞는 매물이 없습니다.
                </div>
              ) : (
                /* 카드≈180px × 5행 + gap — 내부 스크롤 */
                <div className="max-h-[calc(5*168px+4*0.625rem)] overflow-y-auto overscroll-contain pr-0.5 sm:max-h-[calc(5*180px+4*0.75rem)]">
                  <PropertySplitList
                    items={visible}
                    selectedId={selected?.id ?? null}
                    onSelect={selectProperty}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className={`${
              mobileDetail
                ? "fixed inset-0 z-40 overflow-y-auto bg-landing-bg px-4 pb-24 pt-3 md:px-6 lg:static lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0 lg:pb-0"
                : "hidden lg:block"
            }`}
          >
            <PropertySplitDetail
              property={selected}
              showBack={mobileDetail}
              onBack={backToList}
            />
          </div>
        </div>
      )}
    </div>
  );
}
