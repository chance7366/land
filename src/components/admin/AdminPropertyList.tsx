"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { DataTable } from "@/components/ui/DataTable";
import type { Property } from "@prisma/client";
import {
  categoryLabel,
  formatAreaPyeong,
  formatDateYmd,
  formatPropertyPrice,
  parseImages,
  propertyStatusLabel,
  propertyTypeLabel,
} from "@/lib/format";

function propertyAreaLabel(item: Property): string {
  if (item.exclusiveArea != null && item.exclusiveArea > 0) {
    return `전용 ${item.exclusiveArea}㎡ (${formatAreaPyeong(item.exclusiveArea)})`;
  }
  if (item.supplyArea != null && item.supplyArea > 0) {
    return `공급 ${item.supplyArea}㎡ (${formatAreaPyeong(item.supplyArea)})`;
  }
  const raw = item.area?.trim();
  if (raw) return raw;
  return "—";
}

function priceLines(item: Property): { main: string; sub?: string } {
  const full = formatPropertyPrice(item);
  if (item.type === "RENT" || item.type === "SHORT_TERM") {
    if (item.isJeonse) return { main: full };
    const parts = full.split(" / ");
    if (parts.length >= 2) {
      return { main: parts[0]!, sub: parts.slice(1).join(" / ") };
    }
  }
  return { main: full };
}

function statusTone(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "text-emerald-300";
    case "SOLD":
      return "text-amber-300";
    case "HIDDEN":
      return "text-white/45";
    default:
      return "text-white";
  }
}

function matchesQuery(item: Property, q: string): boolean {
  if (!q) return true;
  const hay = [
    item.manageCode,
    item.title,
    categoryLabel(item.category),
    propertyTypeLabel(item.type),
    item.address,
    item.region,
    item.sigungu,
    item.eupmyeondong,
    propertyStatusLabel(item.status),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function AdminPropertyList({ items }: { items: Property[] }) {
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
    if (!confirm("이 매물을 삭제하시겠습니까?")) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "삭제에 실패했습니다. 목록을 새로고침 후 다시 시도하세요.");
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
            placeholder="관리번호 · 제목 · 분류 · 거래 · 소재지 검색"
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
          : `전체 ${items.length}건`}
      </p>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-sm text-white/40">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const thumb = parseImages(item.images)[0];
                const price = priceLines(item);
                const editHref = `/admin/properties/${item.id}/edit`;

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
                        href={editHref}
                        className="flex h-[64px] w-[72px] items-center justify-center overflow-hidden rounded-lg bg-black/40"
                      >
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-2xl text-white/20">
                            home
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <Link href={editHref} className="block space-y-0.5">
                        <p className="font-bold text-white">{categoryLabel(item.category)}</p>
                        <p className="text-[11px] font-semibold text-[#a78bfa]">
                          {propertyTypeLabel(item.type)}
                        </p>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <Link href={editHref} className="block space-y-0.5">
                        <p className="line-clamp-1 font-bold text-white">{item.title}</p>
                        <p
                          className="line-clamp-2 font-medium text-white/75"
                          title={item.address || item.region || undefined}
                        >
                          {item.address?.trim() || item.region || "—"}
                        </p>
                        <p className="mt-1 text-[11px] font-bold text-rose-400">
                          {propertyAreaLabel(item)}
                        </p>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-top tabular-nums">
                      <Link href={editHref} className="block space-y-0.5">
                        <p className="font-bold text-[#60a5fa]">{price.main}</p>
                        {price.sub ? (
                          <p className="text-[11px] text-white/55">{price.sub}</p>
                        ) : null}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <Link href={editHref} className="block">
                        <p className={`font-bold ${statusTone(item.status)}`}>
                          {propertyStatusLabel(item.status)}
                        </p>
                        {item.featured ? (
                          <p className="mt-0.5 text-[11px] font-semibold text-violet-300">
                            추천 ★
                          </p>
                        ) : null}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <p className="tabular-nums text-white/90">
                        {formatDateYmd(item.publishedAt)}
                      </p>
                    </td>
                    <td className="px-3 py-2.5 align-middle text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={editHref}
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
