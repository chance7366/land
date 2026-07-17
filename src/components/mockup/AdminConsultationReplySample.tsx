"use client";

import { useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  CONSULT_STATUS_LABEL,
  MOCK_CONSULTS,
  type ConsultStatus,
  type MockConsult,
} from "@/lib/mockup/consultation-sample-data";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#fbbf24] focus:outline-none";

function StatusBadge({ status }: { status: ConsultStatus }) {
  const meta = CONSULT_STATUS_LABEL[status];
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

/**
 * 샘플: 관리자 상담 답변 콘솔
 * 실서비스 위치 제안 → /admin/consultations (+ 상세 답변)
 */
export function AdminConsultationReplySample() {
  const [items, setItems] = useState<MockConsult[]>(() =>
    MOCK_CONSULTS.map((c) => ({ ...c, reply: c.reply ? { ...c.reply } : undefined })),
  );
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const [replyBody, setReplyBody] = useState(selected?.reply?.body ?? "");
  const [status, setStatus] = useState<ConsultStatus>(selected?.status ?? "RECEIVED");

  function selectRow(id: string) {
    const row = items.find((i) => i.id === id);
    setSelectedId(id);
    setReplyBody(row?.reply?.body ?? "");
    setStatus(row?.status ?? "RECEIVED");
  }

  function saveReply() {
    if (!selected) return;
    setItems((prev) =>
      prev.map((row) =>
        row.id === selected.id
          ? {
              ...row,
              status,
              reply:
                replyBody.trim().length > 0
                  ? {
                      body: replyBody.trim(),
                      repliedAt: new Date().toLocaleString("ko-KR"),
                      adminName: "김영찬 공인중개사",
                    }
                  : row.reply,
            }
          : row,
      ),
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8 md:py-14">
      <header className="mb-8 border-b border-white/10 pb-6">
        <p className="text-xs font-bold tracking-wide text-[#fde68a]">ADMIN · SAMPLE</p>
        <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">상담 답변 관리</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">
          관리자는 <code className="text-[#fde68a]">/admin/consultations</code>에서 목록을 보고,
          건별로 상태를 바꾸며 답변을 등록합니다. 고객은 상담예약 페이지 하단 비밀번호 조회로
          동일 내용을 확인합니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <Link href="/mockup/consultation-v2" className="font-bold text-[#93c5fd] hover:underline">
            ← 고객용 상담예약 샘플
          </Link>
          <Link href="/admin/consultations" className="font-bold text-white/45 hover:underline">
            현재 관리자 목록 (/admin/consultations)
          </Link>
        </div>
      </header>

      <GlassCard className="mb-6 p-4 md:p-5">
        <h2 className="text-sm font-bold text-white">운영 구상 (반영 시)</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-white/65">
          <li>
            관리자 로그인 후 <strong className="text-white">상담 예약 관리</strong> 메뉴
          </li>
          <li>목록에서 건 선택 → 상세 패널에서 상태(접수중/답변대기/답변완료) 변경</li>
          <li>답변 작성·저장 → 고객 조회 화면에 즉시 노출</li>
          <li>(선택) 답변 완료 시 문자/알림톡 발송</li>
        </ol>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <GlassCard className="overflow-hidden p-0">
          <div className="border-b border-white/10 px-4 py-3 text-xs font-bold text-white/50">
            상담 목록 ({items.length})
          </div>
          <ul className="max-h-[520px] overflow-auto">
            {items.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => selectRow(row.id)}
                  className={`w-full border-b border-white/5 px-4 py-3 text-left transition ${
                    selectedId === row.id ? "bg-[#fbbf24]/10" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-white/40">{row.id}</span>
                    <StatusBadge status={row.status} />
                  </div>
                  <p className="mt-1 text-sm font-bold text-white">{row.clientName}</p>
                  <p className="mt-0.5 truncate text-xs text-white/50">
                    {row.category} · {row.subType}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>

        {selected ? (
          <GlassCard className="p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-white/40">{selected.id}</p>
                <h2 className="mt-1 text-lg font-bold text-white">
                  {selected.clientName} · {selected.phone}
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  {selected.category} / {selected.subType} · {selected.method}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-white/75">
              <p className="text-xs font-bold text-white/40">고객 상담 내용</p>
              <p className="mt-2 whitespace-pre-wrap">{selected.detail}</p>
              <p className="mt-3 text-xs text-white/40">
                희망 일정 {selected.preferredAt} · 신청 {selected.createdAt}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block text-xs font-bold text-white/50">
                진행 상태
                <select
                  className={`${fieldClass} mt-1.5`}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ConsultStatus)}
                >
                  <option value="RECEIVED">접수중</option>
                  <option value="AWAITING">답변대기</option>
                  <option value="DONE">답변완료</option>
                </select>
              </label>
              <label className="block text-xs font-bold text-white/50">
                답변 내용
                <textarea
                  className={`${fieldClass} mt-1.5`}
                  rows={6}
                  placeholder="고객에게 보여줄 답변을 작성하세요."
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={saveReply}
                className="w-full rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#d4af37] py-3 text-sm font-bold text-[#1c140c]"
              >
                상태·답변 저장 (샘플)
              </button>
              {selected.reply ? (
                <p className="text-xs text-emerald-300/80">
                  마지막 저장 답변: {selected.reply.repliedAt}
                </p>
              ) : null}
            </div>
          </GlassCard>
        ) : null}
      </div>
    </div>
  );
}
