"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { DataTable } from "@/components/ui/DataTable";
import type { Property } from "@prisma/client";
import {
  categoryLabel,
  formatDateYmd,
  formatPropertyArea,
  formatPropertyPrice,
  formatPropertySummary,
  parseImages,
  propertyStatusLabel,
  propertyTypeLabel,
} from "@/lib/format";

const HEADERS = ["관리번호", "매물", "분류", "거래", "가격", "지역", "상태", "등록일", "관리"] as const;

export function AdminPropertyList({ items }: { items: Property[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

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
      {error && (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      <DataTable maxHeight="520px" className="mt-8">
        <table>
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-landing-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const thumb = parseImages(item.images)[0];
              return (
                <tr key={item.id}>
                  <td className="p-4 text-center text-sm font-medium tabular-nums text-[#d4bfff] whitespace-nowrap">
                    {item.manageCode || "—"}
                  </td>
                  <td className="p-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-white/5">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-landing-muted">
                            <span className="material-symbols-outlined text-sm">home</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="font-medium text-landing-text">{item.title}</p>
                        <p className="text-xs text-landing-muted">{formatPropertySummary(item)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm">{categoryLabel(item.category)}</td>
                  <td className="p-4 text-center text-sm">{propertyTypeLabel(item.type)}</td>
                  <td className="p-4 text-center text-sm font-bold text-blue-400">
                    {formatPropertyPrice(item)}
                  </td>
                  <td className="p-4 text-center text-sm">{formatPropertyArea(item)}</td>
                  <td className="p-4 text-center text-sm">
                    {propertyStatusLabel(item.status)}
                    {item.featured && <span className="ml-1 text-xs text-violet-300">★</span>}
                  </td>
                  <td className="p-4 text-center text-sm tabular-nums">
                    {formatDateYmd(item.publishedAt)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/properties/${item.id}/edit`}
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
            })}
          </tbody>
        </table>
      </DataTable>
    </>
  );
}
