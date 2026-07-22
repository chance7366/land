"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Search } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { DataTable } from "@/components/ui/DataTable";
import type { Auction } from "@prisma/client";
import {
  auctionAreaLabel,
  auctionStatusDisplay,
  formatAuctionPriceLine,
} from "@/lib/auction-list-display";
import { formatDateYmd, parseImages } from "@/lib/format";

/** 목록에는 소재지1만 표시 (address2·개행 결합분 제외) */
function addressPrimary(item: Auction): string {
  const raw = item.address?.trim() || "";
  if (!raw) return item.region || "—";
  if (raw.includes("\n")) return raw.split("\n")[0]?.trim() || "—";
  if (raw.includes(" / ")) return raw.split(" / ")[0]?.trim() || "—";
  return raw;
}

function matchesQuery(item: Auction, q: string): boolean {
  if (!q) return true;
  const hay = [
    item.manageCode,
    item.itemType,
    item.caseNumber,
    String(item.itemNo ?? 1),
    `${item.caseNumber} ${item.itemNo ?? 1}`,
    `${item.caseNumber}/${item.itemNo ?? 1}`,
    item.address,
    item.address2,
    item.region,
    item.court,
    item.title,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function AdminAuctionList({ items }: { items: Auction[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => matchesQuery(item, q));
  }, [items, query]);

  function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setQuery(queryInput);
  }

  async function handleDelete(id: string) {
    if (!confirm("이 경매를 삭제하시겠습니까?")) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/auctions/${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "삭제에 실패했습니다.");
        setBusyId(null);
        return;
      }
      router.refresh();
    } catch {
      setError("삭제 요청 중 오류가 발생했습니다.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <form
        onSubmit={runSearch}
        className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-landing-muted" />
          <input
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="관리번호 · 물건종류 · 사건번호 · 물건번호 · 소재지 검색"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-landing-text outline-none placeholder:text-landing-muted focus:border-[#4dabff]/50"
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
            className="shrink-0 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-landing-muted hover:bg-white/5"
          >
            초기화
          </button>
        ) : null}
      </form>
      <p className="mt-2 text-xs text-landing-muted">
        {query
          ? `"${query}" 검색 결과 ${filtered.length}건`
          : `전체 ${items.length}건 · 매각기일 빠른 순`}
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center text-sm text-white/40">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const cover = parseImages(item.images)[0];
                const min = item.minPrice ?? item.recommendedPrice;
                const st = auctionStatusDisplay({
                  status: item.status,
                  rightsAnalysis: item.rightsAnalysis,
                  appraisalPrice: item.appraisalPrice,
                  minPrice: min,
                });
                const generalUrl =
                  (item as { generalReportUrl?: string | null }).generalReportUrl?.trim() ||
                  null;
                const memberUrl = item.reportUrl?.trim() || null;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.04]"
                  >
                    <td className="px-3 py-2.5 text-center align-middle">
                      <span className="whitespace-nowrap text-[11px] font-bold tabular-nums text-[#d4bfff]">
                        {item.manageCode || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/admin/auctions/${item.id}/edit`}
                        className="block h-[64px] w-[72px] overflow-hidden rounded-lg bg-black/40"
                      >
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cover} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full items-center justify-center text-white/20">
                            <span className="material-symbols-outlined text-2xl">gavel</span>
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <Link href={`/admin/auctions/${item.id}/edit`} className="block space-y-0.5">
                        <p className="font-bold text-white">{item.itemType || "경매"}</p>
                        <p className="tabular-nums text-white/80">{item.caseNumber}</p>
                        <p className="text-[11px] text-white/40">{item.court || "—"}</p>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <Link href={`/admin/auctions/${item.id}/edit`} className="block space-y-1">
                        <p className="line-clamp-2 font-medium text-white/90" title={addressPrimary(item)}>
                          {addressPrimary(item)}
                        </p>
                        <p className="text-[11px] font-bold text-rose-400">
                          {auctionAreaLabel({
                            landArea: item.landArea,
                            buildingArea: item.buildingArea,
                          })}
                        </p>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-top tabular-nums">
                      <Link href={`/admin/auctions/${item.id}/edit`} className="block space-y-0.5">
                        <p className="font-bold text-white">
                          {formatAuctionPriceLine(item.appraisalPrice)}
                        </p>
                        <p className="font-bold text-[#60a5fa]">{formatAuctionPriceLine(min)}</p>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <Link href={`/admin/auctions/${item.id}/edit`} className="block">
                        <p className="font-bold text-white">{st.main}</p>
                        {st.sub ? (
                          <p className="text-[11px] font-semibold text-[#60a5fa]">{st.sub}</p>
                        ) : null}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <Link href={`/admin/auctions/${item.id}/edit`} className="block space-y-0.5">
                        <p className="tabular-nums text-white/90">
                          {item.saleDate ? formatDateYmd(item.saleDate) : "—"}
                        </p>
                        <p className="text-[11px] text-white/45">
                          입찰 <span className="font-bold text-rose-400">{item.dDay}</span>
                          일전
                        </p>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-middle text-center">
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {generalUrl ? (
                          <a
                            href={generalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold text-sky-300 ring-1 ring-sky-400/25 hover:bg-sky-500/25"
                          >
                            일반
                            <ExternalLink className="h-3 w-3" aria-hidden />
                          </a>
                        ) : null}
                        {memberUrl ? (
                          <a
                            href={memberUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-violet-500/15 px-2 py-0.5 text-[11px] font-semibold text-violet-300 ring-1 ring-violet-400/25 hover:bg-violet-500/25"
                          >
                            회원
                            <ExternalLink className="h-3 w-3" aria-hidden />
                          </a>
                        ) : null}
                        {!generalUrl && !memberUrl ? (
                          <span className="text-[11px] text-white/35">—</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 align-middle text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/auctions/${item.id}/edit`}
                          className="text-sm text-blue-400 hover:underline"
                        >
                          수정
                        </Link>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="text-sm text-red-400 disabled:opacity-50"
                        >
                          {busyId === item.id ? "삭제 중…" : "삭제"}
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
    </>
  );
}
