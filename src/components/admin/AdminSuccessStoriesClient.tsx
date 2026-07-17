"use client";

import { useState } from "react";
import type { SuccessStory, SuccessStoryStatus } from "@prisma/client";
import { AppLink as Link } from "@/components/ui/AppLink";
import { DataTable } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { SUCCESS_STORY_WRITE_CATEGORIES } from "@/lib/success-story";

const fieldClass =
  "w-full rounded-xl border border-landing-border bg-landing-elevated px-4 py-3 text-sm text-landing-text focus:border-[#fbbf24] focus:outline-none";

const STATUS_META: Record<SuccessStoryStatus, { label: string; className: string }> = {
  PUBLISHED: {
    label: "게시",
    className: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  },
  HIDDEN: {
    label: "숨김",
    className: "border-slate-400/40 bg-slate-500/15 text-slate-300",
  },
};

export function AdminSuccessStoriesClient({ initialItems }: { initialItems: SuccessStory[] }) {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const [status, setStatus] = useState<SuccessStoryStatus>(selected?.status ?? "PUBLISHED");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function selectRow(id: string) {
    const row = items.find((i) => i.id === id);
    setSelectedId(id);
    setStatus(row?.status ?? "PUBLISHED");
    setMessage("");
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/success-stories/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "저장 실패");
        return;
      }
      setItems((prev) => prev.map((row) => (row.id === data.id ? data : row)));
      setMessage("저장되었습니다.");
    } catch {
      setMessage("네트워크 오류");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selected) return;
    if (!window.confirm("이 후기를 삭제할까요?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/success-stories/${selected.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error ?? "삭제 실패");
        return;
      }
      setItems((prev) => {
        const next = prev.filter((r) => r.id !== selected.id);
        setSelectedId(next[0]?.id ?? "");
        setStatus(next[0]?.status ?? "PUBLISHED");
        return next;
      });
      setMessage("삭제되었습니다.");
    } catch {
      setMessage("네트워크 오류");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-6 md:p-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-landing-text">성공스토리 관리</h1>
          <p className="mt-1 text-sm text-landing-muted">
            게시/숨김 · 삭제. 고객은 /success-stories 에서 확인합니다.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-blue-400 hover:underline">
          ← 대시보드
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <DataTable maxHeight="560px">
          <table>
            <thead>
              <tr>
                {["등록일", "작성자", "구분", "상태", "제목"].map((h) => (
                  <th
                    key={h}
                    className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-landing-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-landing-muted">
                    등록된 후기가 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const meta = STATUS_META[row.status];
                  const active = row.id === selectedId;
                  return (
                    <tr
                      key={row.id}
                      className={`cursor-pointer ${active ? "bg-white/5" : "hover:bg-white/[0.03]"}`}
                      onClick={() => selectRow(row.id)}
                    >
                      <td className="p-4 text-sm">
                        {new Date(row.createdAt).toLocaleString("ko-KR")}
                      </td>
                      <td className="p-4 text-sm font-bold text-landing-text">
                        {row.authorName || "익명"}
                      </td>
                      <td className="p-4 text-sm">{row.category}</td>
                      <td className="p-4 text-sm">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="max-w-[280px] truncate p-4 text-sm text-landing-muted">
                        {row.title}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </DataTable>

        {selected ? (
          <GlassCard className="space-y-4 p-5">
            <div>
              <p className="text-xs text-landing-muted">구분</p>
              <p className="mt-1 text-sm text-landing-text">
                {SUCCESS_STORY_WRITE_CATEGORIES.includes(
                  selected.category as (typeof SUCCESS_STORY_WRITE_CATEGORIES)[number],
                )
                  ? selected.category
                  : selected.category}
              </p>
            </div>
            <div>
              <p className="text-xs text-landing-muted">제목</p>
              <p className="mt-1 text-sm font-bold text-landing-text">{selected.title}</p>
            </div>
            <div>
              <p className="text-xs text-landing-muted">본문</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-landing-muted">
                {selected.content}
              </p>
            </div>
            <label className="block text-xs text-landing-muted">
              상태
              <select
                className={`${fieldClass} mt-1`}
                value={status}
                onChange={(e) => setStatus(e.target.value as SuccessStoryStatus)}
              >
                <option value="PUBLISHED">게시</option>
                <option value="HIDDEN">숨김</option>
              </select>
            </label>
            {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void save()}
                className="rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] px-4 py-2.5 text-sm font-bold text-[#1a1402] disabled:opacity-50"
              >
                {saving ? "저장 중…" : "상태 저장"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void remove()}
                className="rounded-xl border border-red-400/40 px-4 py-2.5 text-sm font-bold text-red-300 disabled:opacity-50"
              >
                삭제
              </button>
              <Link
                href={`/success-stories?id=${selected.id}`}
                className="self-center text-sm text-blue-400 hover:underline"
              >
                사용자 페이지에서 보기 →
              </Link>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="flex h-48 items-center justify-center p-5 text-sm text-landing-muted">
            목록에서 후기를 선택하세요.
          </GlassCard>
        )}
      </div>
    </main>
  );
}
