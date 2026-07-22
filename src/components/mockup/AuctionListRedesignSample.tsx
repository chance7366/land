"use client";

/**
 * 경매물건 목록 재구성 목업 — 추천 마퀴 + 전폭 표 (상세는 별도 페이지).
 * 운영 /auctions 미적용.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { FeaturedMarqueeRow } from "@/components/landing/FeaturedMarqueeRow";
import { AUCTION_SPLIT_SAMPLES, type AuctionSplitSample } from "@/lib/mockup/auction-split-sample-data";
import { formatAreaPyeong, formatAuctionMoney, formatDateYmd } from "@/lib/format";

const heroPanel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

const DETAIL_HREF = "/mockup/auction-detail-page";

type SortKey = "dDay" | "minPrice" | "appraisal" | "saleDate" | "caseNumber";

function failCount(a: AuctionSplitSample): number {
  return a.schedule.filter((s) => /유찰/.test(s.result || "")).length;
}

function areaLabel(a: AuctionSplitSample): string {
  if (a.exclusiveArea != null && a.exclusiveArea > 0) {
    return `전유 ${a.exclusiveArea}㎡ (${formatAreaPyeong(a.exclusiveArea)})`;
  }
  if (a.landArea != null && a.landArea > 0) {
    return `토지 ${a.landArea}㎡ (${formatAreaPyeong(a.landArea)})`;
  }
  if (a.buildingArea != null && a.buildingArea > 0) {
    return `건물 ${a.buildingArea}㎡ (${formatAreaPyeong(a.buildingArea)})`;
  }
  return "—";
}

function statusLabel(a: AuctionSplitSample): { main: string; sub?: string } {
  const n = failCount(a);
  if (n > 0) {
    const pct =
      a.appraisalPrice > 0
        ? Math.round((a.minPrice / a.appraisalPrice) * 100)
        : null;
    return {
      main: `유찰 ${n}회`,
      sub: pct != null ? `(${pct}%)` : undefined,
    };
  }
  return { main: "진행중" };
}

function CompactMockAuctionCard({ auction }: { auction: AuctionSplitSample }) {
  const cover = auction.images[0];
  return (
    <Link
      href={`${DETAIL_HREF}?id=${encodeURIComponent(auction.id)}`}
      className="featured-marquee-card group relative block w-[168px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] transition hover:border-[#d4af37]/45"
    >
      <div className="relative h-[88px] bg-black/40">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : null}
        <span className="absolute left-1.5 top-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[9px] font-bold text-[#fde68a]">
          추천
        </span>
      </div>
      <div className="space-y-0.5 p-2.5">
        <p className="line-clamp-1 text-[11px] font-bold text-white">{auction.title}</p>
        <p className="text-[12px] font-extrabold text-[#facc15]">
          최저 {formatAuctionMoney(auction.minPrice)}
        </p>
      </div>
    </Link>
  );
}

export function AuctionListRedesignSample() {
  const all = AUCTION_SPLIT_SAMPLES;
  const recommended = all.slice(0, 5);

  const itemTypes = useMemo(() => {
    const set = new Set(all.map((a) => a.itemType).filter(Boolean));
    return ["전체", ...Array.from(set)];
  }, [all]);

  const [typeFilter, setTypeFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dDay");
  const [sortAsc, setSortAsc] = useState(true);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = all.filter((a) => {
      if (typeFilter !== "전체" && a.itemType !== typeFilter) return false;
      if (!q) return true;
      const hay = [a.title, a.caseNumber, a.address, a.region, a.court, a.itemType]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "minPrice":
          cmp = a.minPrice - b.minPrice;
          break;
        case "appraisal":
          cmp = a.appraisalPrice - b.appraisalPrice;
          break;
        case "saleDate":
          cmp = a.saleDate.localeCompare(b.saleDate);
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
  }, [all, typeFilter, query, sortKey, sortAsc]);

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
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="border-b border-amber-400/30 bg-[#12100a] px-4 py-3 text-center text-xs text-amber-100/90">
        <p className="font-bold text-amber-50">
          경매물건 목록 재구성 목업 (운영 미적용)
        </p>
        <p className="mt-1 text-[11px] text-amber-100/70">
          상단 추천 · 하단 전폭 표 · 행 클릭 시 별도 상세 페이지
        </p>
      </div>

      <div className="relative overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1400px] space-y-6 px-4 py-5 md:px-6">
          {/* 추천 */}
          <section className={`${heroPanel} p-4 md:p-5`}>
            <div className="relative mb-3 flex items-center justify-center">
              <h2 className="text-sm font-extrabold text-[#d4af37]">추천 경매</h2>
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
              {recommended.map((a) => (
                <CompactMockAuctionCard key={a.id} auction={a} />
              ))}
            </FeaturedMarqueeRow>
          </section>

          {/* 검색 · 정렬 */}
          <section className={`${heroPanel} space-y-3 p-4 md:p-5`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-white md:text-2xl">
                  등록 경매{" "}
                  <span className="text-[#c4b5fd]">
                    [{rows.length.toLocaleString("ko-KR")}건]
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

          {/* 표 */}
          <section className={`${heroPanel} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="border-b border-white/10 bg-black/35 text-[11px] text-white/45">
                    <th className="w-[88px] px-3 py-3 font-semibold">사진</th>
                    <th className="w-[140px] px-3 py-3 font-semibold">용도/사건</th>
                    <th className="min-w-[200px] px-3 py-3 font-semibold">소재지 / 면적</th>
                    <th className="w-[120px] px-3 py-3 font-semibold">감정/최저가</th>
                    <th className="w-[96px] px-3 py-3 font-semibold">현재상태</th>
                    <th className="w-[110px] px-3 py-3 font-semibold">매각기일</th>
                    <th className="w-[100px] px-3 py-3 font-semibold">분석보고서</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-sm text-white/40">
                        조건에 맞는 경매가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    rows.map((a, idx) => {
                      const st = statusLabel(a);
                      const pct =
                        a.appraisalPrice > 0
                          ? Math.round((a.minPrice / a.appraisalPrice) * 1000) / 10
                          : null;
                      const hasReport = idx % 3 !== 2;
                      return (
                        <tr
                          key={a.id}
                          className="border-b border-white/5 transition hover:bg-white/[0.04]"
                        >
                          <td className="px-3 py-2.5">
                            <Link
                              href={`${DETAIL_HREF}?id=${encodeURIComponent(a.id)}`}
                              className="block h-[64px] w-[72px] overflow-hidden rounded-lg bg-black/40"
                            >
                              {a.images[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={a.images[0]}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-top">
                            <Link
                              href={`${DETAIL_HREF}?id=${encodeURIComponent(a.id)}`}
                              className="block space-y-0.5"
                            >
                              <p className="font-bold text-white">{a.itemType || "경매"}</p>
                              <p className="tabular-nums text-white/80">{a.caseNumber}</p>
                              <p className="text-[11px] text-white/40">{a.court}</p>
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-top">
                            <Link
                              href={`${DETAIL_HREF}?id=${encodeURIComponent(a.id)}`}
                              className="block space-y-1"
                            >
                              <p className="line-clamp-2 font-medium text-white/90">
                                {a.address || a.region || "—"}
                              </p>
                              <p className="text-[11px] font-bold text-rose-400">
                                {areaLabel(a)}
                              </p>
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-top tabular-nums">
                            <Link
                              href={`${DETAIL_HREF}?id=${encodeURIComponent(a.id)}`}
                              className="block space-y-0.5"
                            >
                              <p className="font-bold text-white">
                                {formatAuctionMoney(a.appraisalPrice)}
                              </p>
                              <p className="font-bold text-[#60a5fa]">
                                {formatAuctionMoney(a.minPrice)}
                              </p>
                              {pct != null ? (
                                <p className="text-[10px] text-white/40">{pct}%</p>
                              ) : null}
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-top">
                            <Link
                              href={`${DETAIL_HREF}?id=${encodeURIComponent(a.id)}`}
                              className="block"
                            >
                              <p className="font-bold text-white">{st.main}</p>
                              {st.sub ? (
                                <p className="text-[11px] font-semibold text-[#60a5fa]">{st.sub}</p>
                              ) : null}
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-top">
                            <Link
                              href={`${DETAIL_HREF}?id=${encodeURIComponent(a.id)}`}
                              className="block space-y-0.5"
                            >
                              <p className="tabular-nums text-white/90">
                                {formatDateYmd(a.saleDate)}
                              </p>
                              <p className="text-[11px] text-white/45">
                                입찰{" "}
                                <span className="font-bold text-rose-400">{a.dDay}</span>
                                일전
                              </p>
                            </Link>
                          </td>
                          <td className="px-3 py-2.5 align-middle">
                            {hasReport ? (
                              <a
                                href="#mock-general-report"
                                onClick={(e) => e.preventDefault()}
                                className="inline-flex items-center gap-1 rounded-lg border border-[#d450ff]/35 bg-[#d450ff]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#e9d5ff] hover:bg-[#d450ff]/20"
                              >
                                보기
                                <ExternalLink className="h-3 w-3" aria-hidden />
                              </a>
                            ) : (
                              <span className="text-[11px] text-white/35">준비중</span>
                            )}
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
