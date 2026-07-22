"use client";

import { useEffect, useMemo, useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { DataTable } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  CHANNEL_LABEL,
  SUBSCRIPTION_TYPE_LABEL,
  type NotifyChannel,
  type SubscriberStatus,
  type SubscriptionType,
} from "@/lib/subscription";

type Row = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subscriptionType: SubscriptionType;
  channels: NotifyChannel[];
  summary: string;
  status: SubscriberStatus;
  adminNote: string | null;
  notificationCount: number;
  createdAt: string;
};

const STATUS_LABEL: Record<SubscriberStatus, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "거절",
};

const STATUS_CLASS: Record<SubscriberStatus, string> = {
  PENDING: "border-white/20 bg-white/10 text-white/70",
  APPROVED: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  REJECTED: "border-red-400/40 bg-red-500/15 text-red-300",
};

const FILTERS: { id: "ALL" | SubscriberStatus; label: string }[] = [
  { id: "ALL", label: "전체" },
  { id: "PENDING", label: "대기" },
  { id: "APPROVED", label: "승인" },
  { id: "REJECTED", label: "거절" },
];

export function AdminSubscriptionsClient({ initialItems }: { initialItems: Row[] }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<"ALL" | SubscriberStatus>("PENDING");
  const [selectedId, setSelectedId] = useState(
    initialItems.find((r) => r.status === "PENDING")?.id ?? initialItems[0]?.id ?? "",
  );
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(
    () => (filter === "ALL" ? items : items.filter((r) => r.status === filter)),
    [filter, items],
  );

  const selected = items.find((r) => r.id === selectedId) ?? null;

  useEffect(() => {
    if (selected) setNote(selected.adminNote ?? "");
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(
    () => ({
      ALL: items.length,
      PENDING: items.filter((r) => r.status === "PENDING").length,
      APPROVED: items.filter((r) => r.status === "APPROVED").length,
      REJECTED: items.filter((r) => r.status === "REJECTED").length,
    }),
    [items],
  );

  async function save(status?: SubscriberStatus) {
    if (!selected) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/subscriptions/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status ?? selected.status,
          adminNote: note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "저장 실패");
        return;
      }
      setItems((prev) =>
        prev.map((row) =>
          row.id === data.id
            ? {
                ...row,
                status: data.status,
                adminNote: data.adminNote,
              }
            : row,
        ),
      );
      setMessage(
        status === "APPROVED"
          ? "승인되었습니다."
          : status === "REJECTED"
            ? "거절 처리되었습니다."
            : "저장되었습니다.",
      );
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
          <h1 className="font-headline-lg text-landing-text">맞춤 알림 관리</h1>
          <p className="mt-1 text-sm text-landing-muted">
            신청 승인·거절. 매물·경매는 등록 시 즉시 알림, 부동산소식은 매일 당일 리포트 메일입니다.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-blue-400 hover:underline">
          ← 대시보드
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                on
                  ? "border-[#4dabff]/50 bg-[#4dabff]/20 text-white"
                  : "border-white/15 bg-white/5 text-white/55 hover:bg-white/10"
              }`}
            >
              {f.label} ({counts[f.id]})
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <DataTable maxHeight="560px">
          <table>
            <thead>
              <tr>
                {["신청일시", "신청자", "구분", "채널", "조건", "상태"].map((h) => (
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-landing-muted">
                    해당 상태의 신청이 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const active = row.id === selectedId;
                  return (
                    <tr
                      key={row.id}
                      className={`cursor-pointer ${active ? "bg-white/5" : "hover:bg-white/[0.03]"}`}
                      onClick={() => {
                        setSelectedId(row.id);
                        setMessage("");
                      }}
                    >
                      <td className="whitespace-nowrap p-4 text-sm text-landing-muted">
                        {new Date(row.createdAt).toLocaleString("ko-KR", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-landing-text">{row.name || "—"}</p>
                        <p className="text-xs text-landing-muted">
                          {[row.email, row.phone].filter(Boolean).join(" / ") || "—"}
                        </p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                            row.subscriptionType === "REAL_ESTATE"
                              ? "border-sky-400/40 bg-sky-500/15 text-sky-300"
                              : row.subscriptionType === "NEWS"
                                ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-300"
                                : "border-amber-400/40 bg-amber-500/15 text-amber-300"
                          }`}
                        >
                          {row.subscriptionType === "REAL_ESTATE"
                            ? "부동산매매"
                            : row.subscriptionType === "NEWS"
                              ? "부동산소식"
                              : "경매물건"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-landing-muted">
                        {row.channels.map((c) => CHANNEL_LABEL[c]).join(" · ")}
                      </td>
                      <td className="max-w-[220px] truncate p-4 text-sm text-landing-text">
                        {row.summary}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_CLASS[row.status]}`}
                        >
                          {STATUS_LABEL[row.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </DataTable>

        <GlassCard className="h-fit p-5">
          {selected ? (
            <>
              <p className="text-xs font-bold text-white/45">선택 신청</p>
              <h2 className="mt-1 text-lg font-extrabold text-white">{selected.name || "이름 없음"}</h2>
              <p className="mt-1 text-sm text-white/55">
                {[selected.email, selected.phone].filter(Boolean).join(" / ") || "—"}
              </p>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-white/40">구분</dt>
                  <dd className="font-bold text-white">
                    {SUBSCRIPTION_TYPE_LABEL[selected.subscriptionType]}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/40">채널</dt>
                  <dd className="text-right text-white/80">
                    {selected.channels.map((c) => CHANNEL_LABEL[c]).join(" · ")}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/40">발송 이력</dt>
                  <dd className="text-white/80">{selected.notificationCount}건</dd>
                </div>
                <div>
                  <dt className="text-white/40">관심 조건</dt>
                  <dd className="mt-1 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs leading-relaxed text-white/75">
                    {selected.summary}
                  </dd>
                </div>
              </dl>

              <label className="mt-4 block text-xs font-bold text-white/45">
                관리 메모
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="거절 사유 등"
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#4dabff] focus:outline-none"
                />
              </label>

              {selected.status === "PENDING" ? (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => save("APPROVED")}
                    className="flex-1 rounded-xl border border-emerald-400/40 bg-emerald-500/15 py-2.5 text-sm font-bold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-50"
                  >
                    승인
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => save("REJECTED")}
                    className="flex-1 rounded-xl border border-red-400/40 bg-red-500/10 py-2.5 text-sm font-bold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    거절
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => save()}
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-bold text-white/70 hover:bg-white/10 disabled:opacity-50"
                  >
                    메모 저장
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => save("PENDING")}
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-bold text-white/50 hover:bg-white/10 disabled:opacity-50"
                  >
                    대기로 되돌리기
                  </button>
                </div>
              )}

              {message ? <p className="mt-3 text-xs font-medium text-emerald-300">{message}</p> : null}
            </>
          ) : (
            <p className="py-8 text-center text-sm text-white/40">행을 선택하세요.</p>
          )}
        </GlassCard>
      </div>
    </main>
  );
}
