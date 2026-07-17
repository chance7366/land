"use client";

import { useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { DataTable } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { CONSULT_STATUS_META } from "@/lib/consultation";
import type { Consultation, ConsultationStatus } from "@prisma/client";

const fieldClass =
  "w-full rounded-xl border border-landing-border bg-landing-elevated px-4 py-3 text-sm text-landing-text focus:border-[#fbbf24] focus:outline-none";

type Row = Consultation;

export function AdminConsultationsClient({ initialItems }: { initialItems: Row[] }) {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const [status, setStatus] = useState<ConsultationStatus>(selected?.status ?? "PENDING");
  const [reply, setReply] = useState(selected?.reply ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function selectRow(id: string) {
    const row = items.find((i) => i.id === id);
    setSelectedId(id);
    setStatus(row?.status ?? "PENDING");
    setReply(row?.reply ?? "");
    setMessage("");
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/consultations/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reply }),
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

  return (
    <main className="p-6 md:p-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-landing-text">상담 예약 관리</h1>
          <p className="mt-1 text-sm text-landing-muted">
            상태 변경 · 답변 작성. 고객은 /consultation 하단에서 비밀번호로 확인합니다.
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
                {["일시", "의뢰인", "분류", "상태", "요약"].map((h) => (
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
                    접수된 상담이 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const meta = CONSULT_STATUS_META[row.status];
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
                      <td className="p-4 text-sm font-bold text-landing-text">{row.clientName}</td>
                      <td className="p-4 text-sm">
                        {row.category}
                        {row.subCategory ? (
                          <span className="block text-xs text-landing-muted">{row.subCategory}</span>
                        ) : null}
                      </td>
                      <td className="p-4 text-sm">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="max-w-[220px] truncate p-4 text-sm text-landing-muted">
                        {row.summary}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </DataTable>

        {selected ? (
          <GlassCard className="h-fit p-5">
            <p className="text-xs text-landing-muted">{selected.phone}</p>
            <h2 className="mt-1 text-lg font-bold text-landing-text">{selected.clientName}</h2>
            <p className="mt-1 text-sm text-landing-muted">
              {selected.method ?? "-"} · {selected.preferredAt ?? "-"}
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-landing-muted whitespace-pre-wrap">
              {selected.detail}
            </div>
            <label className="mt-4 block text-xs font-bold text-landing-muted">
              진행 상태
              <select
                className={`${fieldClass} mt-1.5`}
                value={status}
                onChange={(e) => setStatus(e.target.value as ConsultationStatus)}
              >
                <option value="PENDING">접수중</option>
                <option value="PROCESSING">답변대기</option>
                <option value="DONE">답변완료</option>
              </select>
            </label>
            <label className="mt-3 block text-xs font-bold text-landing-muted">
              답변
              <textarea
                className={`${fieldClass} mt-1.5`}
                rows={7}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="고객에게 보여줄 답변"
              />
            </label>
            {selected.accessCode ? (
              <p className="mt-2 text-xs text-landing-faint">
                고객 조회 비밀번호:{" "}
                <span className="font-mono text-[#fde68a]">{selected.accessCode}</span>
              </p>
            ) : null}
            <button
              type="button"
              disabled={saving}
              onClick={save}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#d4af37] py-3 text-sm font-bold text-[#1c140c] disabled:opacity-50"
            >
              {saving ? "저장 중…" : "상태·답변 저장"}
            </button>
            {message ? <p className="mt-2 text-xs text-emerald-300">{message}</p> : null}
          </GlassCard>
        ) : (
          <GlassCard className="flex h-48 items-center justify-center p-5 text-sm text-landing-muted">
            목록에서 상담 건을 선택하세요.
          </GlassCard>
        )}
      </div>
    </main>
  );
}
