"use client";

import { useState } from "react";
import type { LegalQuestionStatus } from "@prisma/client";
import { AppLink as Link } from "@/components/ui/AppLink";
import { DataTable } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { QA_STATUS_META } from "@/lib/qa";

const fieldClass =
  "w-full rounded-xl border border-landing-border bg-landing-elevated px-4 py-3 text-sm text-landing-text focus:border-[#34d399] focus:outline-none";

/** 서버에서 ISO 문자열로 직렬화된 행 */
type Row = {
  id: string;
  category: string;
  question: string;
  content: string;
  authorName: string;
  phone: string | null;
  answer: string | null;
  answerer: string | null;
  status: LegalQuestionStatus;
  isPublic: boolean;
  isSecret: boolean;
  accessCode: string;
  suggestConsult: boolean;
  answeredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function AdminLegalQuestionsClient({ initialItems }: { initialItems: Row[] }) {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const [status, setStatus] = useState<LegalQuestionStatus>(selected?.status ?? "PENDING");
  const [answer, setAnswer] = useState(selected?.answer ?? "");
  const [suggestConsult, setSuggestConsult] = useState(selected?.suggestConsult ?? true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function selectRow(id: string) {
    const row = items.find((i) => i.id === id);
    setSelectedId(id);
    setStatus(row?.status ?? "PENDING");
    setAnswer(row?.answer ?? "");
    setSuggestConsult(row?.suggestConsult ?? true);
    setMessage("");
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/legal-questions/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, answer, suggestConsult }),
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
          <h1 className="font-headline-lg text-landing-text">찬스상담소 관리</h1>
          <p className="mt-1 text-sm text-landing-muted">
            상태 변경 · 답변 작성. 고객은 /legal 에서 확인합니다.
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
                {["등록일", "작성자", "카테고리", "상태", "제목"].map((h) => (
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
                    등록된 질문이 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const meta = QA_STATUS_META[row.status];
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
                        {row.isSecret ? (
                          <span className="ml-1 text-[10px] text-amber-300">비밀</span>
                        ) : null}
                      </td>
                      <td className="p-4 text-sm">{row.category}</td>
                      <td className="p-4 text-sm">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="max-w-[220px] truncate p-4 text-sm text-landing-muted">
                        {row.question}
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
            <p className="text-xs text-landing-muted">{selected.phone || "연락처 없음"}</p>
            <h2 className="mt-1 text-lg font-bold text-landing-text">{selected.question}</h2>
            <p className="mt-1 text-sm text-landing-muted">
              {selected.authorName || "익명"} · {selected.category}
              {selected.isSecret && selected.accessCode ? (
                <span className="ml-2 font-mono text-[#fde68a]">PW {selected.accessCode}</span>
              ) : null}
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-landing-muted whitespace-pre-wrap">
              {selected.content || selected.question}
            </div>
            <label className="mt-4 block text-xs font-bold text-landing-muted">
              진행 상태
              <select
                className={`${fieldClass} mt-1.5`}
                value={status}
                onChange={(e) => setStatus(e.target.value as LegalQuestionStatus)}
              >
                <option value="PENDING">접수중</option>
                <option value="REVIEWING">검토중</option>
                <option value="ANSWERED">답변완료</option>
              </select>
            </label>
            <label className="mt-3 block text-xs font-bold text-landing-muted">
              답변
              <textarea
                className={`${fieldClass} mt-1.5`}
                rows={7}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="고객에게 보여줄 답변"
              />
            </label>
            <label className="mt-3 flex items-center gap-2 text-xs text-landing-muted">
              <input
                type="checkbox"
                checked={suggestConsult}
                onChange={(e) => setSuggestConsult(e.target.checked)}
                className="accent-[#34d399]"
              />
              상담예약 유도 표시
            </label>
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#34d399] to-[#059669] py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "저장 중…" : "상태·답변 저장"}
            </button>
            {message ? <p className="mt-2 text-xs text-emerald-300">{message}</p> : null}
          </GlassCard>
        ) : (
          <GlassCard className="flex h-48 items-center justify-center p-5 text-sm text-landing-muted">
            목록에서 질문을 선택하세요.
          </GlassCard>
        )}
      </div>
    </main>
  );
}
