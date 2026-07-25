"use client";

/**
 * 사용자 부동산중개 목록 재구성 목업
 * — 운영: /properties (추천 마퀴 + 전폭 표 · 상세 /properties/[id])
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { FeaturedMarqueeRow } from "@/components/landing/FeaturedMarqueeRow";
import {
  PROPERTY_LIST_REDESIGN_SAMPLES,
  type PropertyListRedesignSample,
} from "@/lib/mockup/property-list-redesign-sample";

const heroPanel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

const DETAIL_HREF = "/mockup/property-detail-redesign";

type SortKey = "price" | "publishedAt" | "title";

function statusTone(status: string): string {
  if (status === "공개") return "text-emerald-300";
  if (status === "계약중") return "text-amber-300";
  return "text-white/55";
}

function CompactMockPropertyCard({ item }: { item: PropertyListRedesignSample }) {
  return (
    <Link
      href={`${DETAIL_HREF}?id=${encodeURIComponent(item.id)}`}
      className="featured-marquee-card group relative block w-[168px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] transition hover:border-[#4dabff]/45"
    >
      <div className="relative flex h-[88px] items-center justify-center bg-black/40">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-3xl text-white/20">home</span>
        )}
        <span className="absolute left-1.5 top-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[9px] font-bold text-[#93c5fd]">
          추천
        </span>
      </div>
      <div className="space-y-0.5 p-2.5">
        <p className="line-clamp-1 text-[11px] font-bold text-white">{item.title}</p>
        <p className="text-[12px] font-extrabold text-[#60a5fa]">{item.priceLabel}</p>
      </div>
    </Link>
  );
}

export function PropertyListRedesignSample() {
  const all = PROPERTY_LIST_REDESIGN_SAMPLES;
  const recommended = all.filter((p) => p.featured);

  const categories = useMemo(() => {
    const set = new Set(all.map((p) => p.category));
    return ["전체", ...Array.from(set)];
  }, [all]);

  const dealTypes = useMemo(() => {
    const set = new Set(all.map((p) => p.typeLabel));
    return ["전체", ...Array.from(set)];
  }, [all]);

  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [dealFilter, setDealFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("publishedAt");
  const [sortAsc, setSortAsc] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = all.filter((p) => {
      if (categoryFilter !== "전체" && p.category !== categoryFilter) return false;
      if (dealFilter !== "전체" && p.typeLabel !== dealFilter) return false;
      if (!q) return true;
      const hay = [p.title, p.address, p.region, p.category, p.typeLabel, p.status]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "price":
          cmp = a.priceWon - b.priceWon;
          break;
        case "title":
          cmp = a.title.localeCompare(b.title, "ko");
          break;
        default:
          cmp = a.publishedAt.localeCompare(b.publishedAt);
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [all, categoryFilter, dealFilter, query, sortKey, sortAsc]);

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
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="border-b border-amber-400/30 bg-[#12100a] px-4 py-3 text-center text-xs text-amber-100/90">
        <p className="font-bold text-amber-50">부동산중개 목록 재구성 목업 → 운영 /properties</p>
        <p className="mt-1 text-[11px] text-amber-100/70">
          경매물건과 동일 구조 · 추천 마퀴 + 전폭 표 · 행 클릭 시 별도 상세(목업)
        </p>
      </div>

      <div className="relative overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1400px] space-y-6 px-4 py-5 md:px-6">
          <section className={`${heroPanel} p-4 md:p-5`}>
            <div className="relative mb-3 flex items-center justify-center">
              <h2 className="text-sm font-extrabold text-[#93c5fd]">추천 매물</h2>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white/40">
                찬스 추천
              </span>
            </div>
            <p className="mb-2 text-center text-[10px] text-white/35 md:hidden">
              좌우로 넘겨 보세요
            </p>
            <FeaturedMarqueeRow
              durationSec={52}
              className="!rounded-none !py-1 [mask-image:none] [-webkit-mask-image:none]"
            >
              {recommended.map((p) => (
                <CompactMockPropertyCard key={p.id} item={p} />
              ))}
            </FeaturedMarqueeRow>
          </section>

          <section className={`${heroPanel} space-y-3 p-4 md:p-5`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-white md:text-2xl">
                  등록 매물{" "}
                  <span className="text-[#c4b5fd]">
                    [{rows.length.toLocaleString("ko-KR")}건]
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

          <section className={`${heroPanel} overflow-hidden p-0`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="border-b border-white/10 bg-black/35 text-[11px] text-white/45">
                    <th className="w-[88px] px-3 py-3 font-semibold">사진</th>
                    <th className="w-[120px] px-3 py-3 font-semibold">분류/거래</th>
                    <th className="min-w-[220px] px-3 py-3 font-semibold">제목 · 소재지 / 면적</th>
                    <th className="w-[130px] px-3 py-3 font-semibold">가격</th>
                    <th className="w-[88px] px-3 py-3 font-semibold">상태</th>
                    <th className="w-[100px] px-3 py-3 font-semibold">등록일</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center text-sm text-white/40">
                        조건에 맞는 매물이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    rows.map((item) => {
                      const href = `${DETAIL_HREF}?id=${encodeURIComponent(item.id)}`;
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-white/5 transition hover:bg-white/[0.04]"
                        >
                          <td className="px-3 py-2.5">
                            <Link
                              href={href}
                              className="flex h-[64px] w-[72px] items-center justify-center overflow-hidden rounded-lg bg-black/40"
                            >
                              {item.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.imageUrl}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="material-symbols-outlined text-2xl text-white/20">
                                  home
                                </span>
                              )}
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-top">
                            <Link href={href} className="block space-y-0.5">
                              <p className="font-bold text-white">{item.category}</p>
                              <p className="text-[11px] font-semibold text-[#a78bfa]">
                                {item.typeLabel}
                              </p>
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-top">
                            <Link href={href} className="block space-y-0.5">
                              <p className="line-clamp-1 font-bold text-white">{item.title}</p>
                              <p className="line-clamp-2 font-medium text-white/75">
                                {item.address || item.region}
                              </p>
                              <p className="mt-1 text-[11px] font-bold text-rose-400">
                                {item.areaLabel}
                              </p>
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-top tabular-nums">
                            <Link href={href} className="block space-y-0.5">
                              <p className="font-bold text-[#60a5fa]">{item.priceLabel}</p>
                              {item.priceSub ? (
                                <p className="text-[11px] text-white/55">{item.priceSub}</p>
                              ) : null}
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-top">
                            <Link href={href} className="block">
                              <p className={`font-bold ${statusTone(item.status)}`}>
                                {item.status}
                              </p>
                              {item.featured ? (
                                <p className="mt-0.5 text-[11px] font-semibold text-violet-300">
                                  추천 ★
                                </p>
                              ) : null}
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-top">
                            <Link href={href} className="block">
                              <p className="tabular-nums text-white/90">{item.publishedAt}</p>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
