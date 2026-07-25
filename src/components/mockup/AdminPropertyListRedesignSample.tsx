"use client";

/**
 * 관리자 매물관리 목록 재구성 목업
 * — 운영: /admin/properties (AdminPropertyList 반영됨)
 */

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import {
  ADMIN_PROPERTY_LIST_SAMPLES,
  type AdminPropertyListSample,
} from "@/lib/mockup/admin-property-list-sample";

function statusTone(status: string): string {
  if (status === "공개") return "text-emerald-300";
  if (status === "계약중") return "text-amber-300";
  if (status === "비공개") return "text-white/45";
  return "text-white";
}

function matchesQuery(item: AdminPropertyListSample, q: string): boolean {
  if (!q) return true;
  const hay = [
    item.manageCode,
    item.title,
    item.category,
    item.typeLabel,
    item.address,
    item.region,
    item.status,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function AdminPropertyListRedesignSample() {
  const all = ADMIN_PROPERTY_LIST_SAMPLES;
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((item) => matchesQuery(item, q));
  }, [all, query]);

  function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setQuery(queryInput);
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="border-b border-amber-400/30 bg-[#12100a] px-4 py-3 text-center text-xs text-amber-100/90">
        <p className="font-bold text-amber-50">관리자 매물관리 목록 재구성 목업 → 운영 /admin/properties</p>
        <p className="mt-1 text-[11px] text-amber-100/70">
          경매관리 표 스타일 맞춤 · 관리번호 · 사진 · 분류/거래 · 소재지/면적 · 가격 · 상태 · 등록일 · 관리
        </p>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-white">매물 관리</h1>
            <p className="mt-1 text-sm text-white/45">
              {query
                ? `"${query}" 검색 결과 ${rows.length}건`
                : `전체 ${all.length}건 · 샘플 데이터`}
            </p>
          </div>
          <span className="rounded-lg bg-blue-500/80 px-4 py-2 text-sm font-semibold text-white opacity-80">
            + 매물 등록
          </span>
        </div>

        <form
          onSubmit={runSearch}
          className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="관리번호 · 제목 · 분류 · 거래 · 소재지 검색"
              className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#a78bfa] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400"
          >
            <Search className="h-4 w-4" />
            검색
          </button>
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQueryInput("");
                setQuery("");
              }}
              className="shrink-0 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/50 hover:bg-white/5"
            >
              초기화
            </button>
          ) : null}
        </form>

        <DataTable maxHeight="520px" className="mt-4">
          <table className="w-full min-w-[1080px] border-collapse text-left text-xs text-[#cbd5e1]">
            <thead>
              <tr className="border-b border-white/10 bg-black/35 text-[11px] text-white/45">
                <th className="w-[108px] px-3 py-3 text-center font-semibold">관리번호</th>
                <th className="w-[88px] px-3 py-3 font-semibold">사진</th>
                <th className="w-[120px] px-3 py-3 font-semibold">분류/거래</th>
                <th className="min-w-[200px] px-3 py-3 font-semibold">제목 · 소재지 / 면적</th>
                <th className="w-[130px] px-3 py-3 font-semibold">가격</th>
                <th className="w-[88px] px-3 py-3 font-semibold">상태</th>
                <th className="w-[100px] px-3 py-3 font-semibold">등록일</th>
                <th className="w-[96px] px-3 py-3 text-center font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-white/40">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.04]"
                  >
                    <td className="px-3 py-2.5 text-center align-middle">
                      <span className="whitespace-nowrap text-[11px] font-bold tabular-nums text-[#d4bfff]">
                        {item.manageCode}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex h-[64px] w-[72px] items-center justify-center overflow-hidden rounded-lg bg-black/40">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-xl text-white/25">
                            home
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <p className="font-bold text-white">{item.category}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-[#a78bfa]">
                        {item.typeLabel}
                      </p>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <p className="line-clamp-1 font-bold text-white">{item.title}</p>
                      <p className="mt-0.5 line-clamp-2 font-medium text-white/75">
                        {item.address || item.region || "—"}
                      </p>
                      <p className="mt-1 text-[11px] font-bold text-rose-400">{item.areaLabel}</p>
                    </td>
                    <td className="px-3 py-2.5 align-top tabular-nums">
                      <p className="font-bold text-[#60a5fa]">{item.priceLabel}</p>
                      {item.priceSub ? (
                        <p className="mt-0.5 text-[11px] text-white/55">{item.priceSub}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <p className={`font-bold ${statusTone(item.status)}`}>{item.status}</p>
                      {item.featured ? (
                        <p className="mt-0.5 text-[11px] font-semibold text-violet-300">추천 ★</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <p className="tabular-nums text-white/90">{item.publishedAt}</p>
                    </td>
                    <td className="px-3 py-2.5 align-middle text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button type="button" className="text-sm text-blue-400 hover:underline">
                          수정
                        </button>
                        <button type="button" className="text-sm text-red-400">
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </DataTable>
      </main>
    </div>
  );
}
