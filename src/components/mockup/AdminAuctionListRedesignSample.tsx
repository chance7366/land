"use client";

/**
 * 관리자 경매관리 목록 재구성 목업
 * — 사용자 /auctions 표 스타일 + 관리번호·리포트·관리 열 유지
 * — 운영 /admin/auctions 미적용
 */

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { AUCTION_SPLIT_SAMPLES, type AuctionSplitSample } from "@/lib/mockup/auction-split-sample-data";
import { formatAreaPyeong, formatAuctionMoney, formatDateYmd } from "@/lib/format";

function failCount(a: AuctionSplitSample): number {
  return a.schedule.filter((s) => /유찰/.test(s.result || "")).length;
}

function areaLabel(a: AuctionSplitSample): string {
  if (a.exclusiveArea != null && a.exclusiveArea > 0) {
    return `전유 ${a.exclusiveArea}㎡ (${formatAreaPyeong(a.exclusiveArea)})`;
  }
  if (a.landArea != null && a.landArea > 0 && a.buildingArea != null && a.buildingArea > 0) {
    return `토지 ${a.landArea}㎡ · 건물 ${a.buildingArea}㎡`;
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
  const pct =
    a.appraisalPrice > 0 ? Math.round((a.minPrice / a.appraisalPrice) * 1000) / 10 : null;
  if (n > 0) {
    return {
      main: `유찰 ${n}회`,
      sub: pct != null ? `(${pct}%)` : undefined,
    };
  }
  return { main: "진행중", sub: pct != null ? `(${pct}%)` : undefined };
}

export function AdminAuctionListRedesignSample() {
  const all = AUCTION_SPLIT_SAMPLES;
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((a) => {
      const hay = [
        a.manageCode,
        a.itemType,
        a.caseNumber,
        a.address,
        a.region,
        a.court,
        a.title,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [all, query]);

  return (
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="border-b border-amber-400/30 bg-[#12100a] px-4 py-3 text-center text-xs text-amber-100/90">
        <p className="font-bold text-amber-50">관리자 경매관리 목록 재구성 목업 (운영 미적용)</p>
        <p className="mt-1 text-[11px] text-amber-100/70">
          사용자 경매물건 표 스타일 · 관리번호 · 리포트(일반/회원) · 관리 열 유지
        </p>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-white">경매 관리</h1>
            <p className="mt-1 text-sm text-white/45">
              {query
                ? `"${query}" 검색 결과 ${rows.length}건`
                : `전체 ${all.length}건 · 샘플 데이터`}
            </p>
          </div>
          <span className="rounded-lg bg-blue-500/80 px-4 py-2 text-sm font-semibold text-white opacity-80">
            + 경매 자동등록
          </span>
        </div>

        <div className="relative mt-6 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="관리번호 · 물건종류 · 사건번호 · 소재지 검색"
            className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#a78bfa] focus:outline-none"
          />
        </div>

        <DataTable maxHeight="520px" className="mt-4">
          <table className="w-full min-w-[1100px] border-collapse text-left text-xs text-[#cbd5e1]">
            <thead>
              <tr className="border-b border-white/10 bg-black/35 text-[11px] text-white/45">
                <th className="w-[100px] px-3 py-3 text-center font-semibold">관리번호</th>
                <th className="w-[88px] px-3 py-3 font-semibold">사진</th>
                <th className="w-[140px] px-3 py-3 font-semibold">용도/사건</th>
                <th className="min-w-[180px] px-3 py-3 font-semibold">소재지 / 면적</th>
                <th className="w-[120px] px-3 py-3 font-semibold">감정/최저가</th>
                <th className="w-[96px] px-3 py-3 font-semibold">현재상태</th>
                <th className="w-[110px] px-3 py-3 font-semibold">매각기일</th>
                <th className="w-[100px] px-3 py-3 text-center font-semibold">리포트</th>
                <th className="w-[96px] px-3 py-3 text-center font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-sm text-white/40">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                rows.map((a, idx) => {
                  const st = statusLabel(a);
                  const hasGeneral = idx % 3 !== 2;
                  const hasMember = idx % 2 === 0;
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.04]"
                    >
                      <td className="px-3 py-2.5 text-center align-middle">
                        <span className="whitespace-nowrap text-[11px] font-bold tabular-nums text-[#d4bfff]">
                          {a.manageCode}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="h-[64px] w-[72px] overflow-hidden rounded-lg bg-black/40">
                          {a.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={a.images[0]}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <p className="font-bold text-white">{a.itemType || "경매"}</p>
                        <p className="tabular-nums text-white/80">{a.caseNumber}</p>
                        <p className="text-[11px] text-white/40">{a.court}</p>
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <p className="line-clamp-2 font-medium text-white/90">
                          {a.address || a.region || "—"}
                        </p>
                        <p className="mt-1 text-[11px] font-bold text-rose-400">{areaLabel(a)}</p>
                      </td>
                      <td className="px-3 py-2.5 align-top tabular-nums">
                        <p className="font-bold text-white">{formatAuctionMoney(a.appraisalPrice)}</p>
                        <p className="font-bold text-[#60a5fa]">{formatAuctionMoney(a.minPrice)}</p>
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <p className="font-bold text-white">{st.main}</p>
                        {st.sub ? (
                          <p className="text-[11px] font-semibold text-[#60a5fa]">{st.sub}</p>
                        ) : null}
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <p className="tabular-nums text-white/90">{formatDateYmd(a.saleDate)}</p>
                        <p className="text-[11px] text-white/45">
                          입찰 <span className="font-bold text-rose-400">{a.dDay}</span>일전
                        </p>
                      </td>
                      <td className="px-3 py-2.5 align-middle text-center">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {hasGeneral ? (
                            <a
                              href="#mock-general"
                              onClick={(e) => e.preventDefault()}
                              className="inline-flex items-center gap-1 rounded-md bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold text-sky-300 ring-1 ring-sky-400/25 hover:bg-sky-500/25"
                            >
                              일반
                              <ExternalLink className="h-3 w-3" aria-hidden />
                            </a>
                          ) : null}
                          {hasMember ? (
                            <a
                              href="#mock-member"
                              onClick={(e) => e.preventDefault()}
                              className="inline-flex items-center gap-1 rounded-md bg-violet-500/15 px-2 py-0.5 text-[11px] font-semibold text-violet-300 ring-1 ring-violet-400/25 hover:bg-violet-500/25"
                            >
                              회원
                              <ExternalLink className="h-3 w-3" aria-hidden />
                            </a>
                          ) : null}
                          {!hasGeneral && !hasMember ? (
                            <span className="text-[11px] text-white/35">—</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 align-middle text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            className="text-sm text-blue-400 hover:underline"
                          >
                            수정
                          </button>
                          <button type="button" className="text-sm text-red-400">
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </DataTable>
      </main>
    </div>
  );
}
