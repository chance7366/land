"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { DataTable } from "@/components/ui/DataTable";
import type { Auction } from "@prisma/client";
import { formatAuctionMoney, formatDateYmd } from "@/lib/format";

function statusLabel(status: string) {
  switch (status) {
    case "ONGOING":
      return "진행중";
    case "CLOSED":
      return "종결";
    case "FAILED":
      return "유찰";
    default:
      return status;
  }
}

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
        <table>
          <thead>
            <tr>
              {[
                "관리번호",
                "물건종류",
                "사건번호",
                "소재지",
                "감정가",
                "최저가",
                "매각기일",
                "상태",
                "관리",
              ].map((h) => (
                <th
                  key={h}
                  className="p-3 text-center text-xs font-semibold uppercase tracking-wide text-landing-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-sm text-landing-muted">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const minPrice = item.minPrice ?? item.recommendedPrice;
                return (
                  <tr key={item.id}>
                    <td className="p-3 text-center text-sm font-medium tabular-nums text-[#d4bfff] whitespace-nowrap">
                      {item.manageCode || "—"}
                    </td>
                    <td className="p-3 text-center text-sm font-medium text-landing-text">
                      {item.itemType || "—"}
                    </td>
                    <td className="p-3 text-center text-sm tabular-nums font-medium text-landing-text">
                      {item.caseNumber}
                    </td>
                    <td className="max-w-[240px] p-3 text-left text-sm text-landing-text">
                      <p className="line-clamp-2" title={addressPrimary(item)}>
                        {addressPrimary(item)}
                      </p>
                    </td>
                    <td className="p-3 text-center text-sm font-bold text-blue-400 whitespace-nowrap">
                      {formatAuctionMoney(item.appraisalPrice)}
                    </td>
                    <td className="p-3 text-center text-sm font-bold text-[#d4af37] whitespace-nowrap">
                      {formatAuctionMoney(minPrice)}
                    </td>
                    <td className="p-3 text-center text-sm tabular-nums whitespace-nowrap">
                      {item.saleDate ? formatDateYmd(item.saleDate) : `D-${item.dDay}`}
                    </td>
                    <td className="p-3 text-center text-sm">{statusLabel(item.status)}</td>
                    <td className="p-3 text-center">
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
