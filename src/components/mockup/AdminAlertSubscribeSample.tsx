"use client";

import { useMemo, useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { DataTable } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";

type AlertType = "property" | "auction";
type ChannelId = "EMAIL" | "SMS" | "KAKAO";
type Status = "PENDING" | "APPROVED" | "REJECTED";

type Row = {
  id: string;
  name: string;
  contact: string;
  type: AlertType;
  channels: ChannelId[];
  summary: string;
  status: Status;
  createdAt: string;
};

const SEED: Row[] = [
  {
    id: "a1",
    name: "김민수",
    contact: "minsu@example.com",
    type: "property",
    channels: ["EMAIL"],
    summary: "홍성군, 예산군 · 아파트/오피스텔 · 매매",
    status: "PENDING",
    createdAt: "2026-07-16 09:12",
  },
  {
    id: "a2",
    name: "이서연",
    contact: "010-2345-6789",
    type: "auction",
    channels: ["SMS", "KAKAO"],
    summary: "보령시 · 상가/토지 · 감정가 1억~3억",
    status: "PENDING",
    createdAt: "2026-07-16 08:41",
  },
  {
    id: "a3",
    name: "박지훈",
    contact: "jihun@example.com / 010-9876-5432",
    type: "property",
    channels: ["EMAIL", "SMS"],
    summary: "서산시 · 단독·다가구 · 전세/월세",
    status: "PENDING",
    createdAt: "2026-07-15 21:05",
  },
  {
    id: "a4",
    name: "최유진",
    contact: "010-1111-2222",
    type: "auction",
    channels: ["KAKAO"],
    summary: "당진시 · 아파트 · 감정가 —~2억",
    status: "APPROVED",
    createdAt: "2026-07-14 16:20",
  },
  {
    id: "a5",
    name: "정하늘",
    contact: "haneul@example.com",
    type: "property",
    channels: ["EMAIL"],
    summary: "아산시 · 상가 · 매매",
    status: "REJECTED",
    createdAt: "2026-07-13 11:48",
  },
];

const STATUS_LABEL: Record<Status, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "거절",
};

const STATUS_CLASS: Record<Status, string> = {
  PENDING: "border-white/20 bg-white/10 text-white/70",
  APPROVED: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  REJECTED: "border-red-400/40 bg-red-500/15 text-red-300",
};

const FILTERS: { id: "ALL" | Status; label: string }[] = [
  { id: "ALL", label: "전체" },
  { id: "PENDING", label: "대기" },
  { id: "APPROVED", label: "승인" },
  { id: "REJECTED", label: "거절" },
];

/** 샘플 전용 — /admin/subscriptions 프로덕션에는 미적용 */
export function AdminAlertSubscribeSample() {
  const [items, setItems] = useState<Row[]>(SEED);
  const [filter, setFilter] = useState<"ALL" | Status>("PENDING");
  const [selectedId, setSelectedId] = useState(SEED.find((r) => r.status === "PENDING")?.id ?? SEED[0].id);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const filtered = useMemo(
    () => (filter === "ALL" ? items : items.filter((r) => r.status === filter)),
    [filter, items],
  );

  const selected = items.find((r) => r.id === selectedId) ?? null;

  const counts = useMemo(
    () => ({
      ALL: items.length,
      PENDING: items.filter((r) => r.status === "PENDING").length,
      APPROVED: items.filter((r) => r.status === "APPROVED").length,
      REJECTED: items.filter((r) => r.status === "REJECTED").length,
    }),
    [items],
  );

  function setStatus(id: string, status: Status) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setMessage(status === "APPROVED" ? "승인 처리되었습니다. (샘플)" : "거절 처리되었습니다. (샘플)");
  }

  return (
    <main className="mx-auto max-w-6xl px-container-padding-mobile py-8 md:px-8 md:py-10">
      <div className="mb-2 rounded-xl border border-amber-400/30 bg-[#12100a] px-4 py-2 text-center text-xs text-amber-100/90">
        샘플 · 맞춤 알림 관리자 승인 · 프로덕션 /admin 미적용{" "}
        <Link href="/mockup/alert-subscribe" className="text-amber-200 hover:underline">
          ← 신청 UI
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-wide text-amber-200/90">Admin sample</p>
          <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">맞춤 알림 신청 관리</h1>
          <p className="mt-1 text-sm text-white/55">
            고객 신청을 검토한 뒤 승인하면, 이후 조건에 맞는 매물·경매 등록 시 선택한 수단으로 즉시 알림합니다.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-white/35 hover:text-white/60 hover:underline">
          (참고) 실제 /admin →
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
        <DataTable maxHeight="520px">
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
                        setNote("");
                      }}
                    >
                      <td className="whitespace-nowrap p-4 text-sm text-landing-muted">{row.createdAt}</td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-landing-text">{row.name}</p>
                        <p className="text-xs text-landing-muted">{row.contact}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                            row.type === "property"
                              ? "border-sky-400/40 bg-sky-500/15 text-sky-300"
                              : "border-amber-400/40 bg-amber-500/15 text-amber-300"
                          }`}
                        >
                          {row.type === "property" ? "부동산매매" : "경매물건"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-landing-muted">{row.channels.join(" · ")}</td>
                      <td className="max-w-[220px] truncate p-4 text-sm text-landing-text">{row.summary}</td>
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
              <h2 className="mt-1 text-lg font-extrabold text-white">{selected.name}</h2>
              <p className="mt-1 text-sm text-white/55">{selected.contact}</p>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-white/40">구분</dt>
                  <dd className="font-bold text-white">
                    {selected.type === "property" ? "부동산매매 알림" : "경매물건 알림"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/40">채널</dt>
                  <dd className="text-right text-white/80">{selected.channels.join(" · ")}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/40">상태</dt>
                  <dd>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_CLASS[selected.status]}`}
                    >
                      {STATUS_LABEL[selected.status]}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-white/40">관심 조건</dt>
                  <dd className="mt-1 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs leading-relaxed text-white/75">
                    {selected.summary}
                  </dd>
                </div>
              </dl>

              <label className="mt-4 block text-xs font-bold text-white/45">
                관리 메모 (선택)
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="거절 사유 등 (샘플, 저장되지 않음)"
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#4dabff] focus:outline-none"
                />
              </label>

              {selected.status === "PENDING" ? (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus(selected.id, "APPROVED")}
                    className="flex-1 rounded-xl border border-emerald-400/40 bg-emerald-500/15 py-2.5 text-sm font-bold text-emerald-300 hover:bg-emerald-500/25"
                  >
                    승인
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(selected.id, "REJECTED")}
                    className="flex-1 rounded-xl border border-red-400/40 bg-red-500/10 py-2.5 text-sm font-bold text-red-300 hover:bg-red-500/20"
                  >
                    거절
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setStatus(selected.id, "PENDING")}
                  className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-bold text-white/70 hover:bg-white/10"
                >
                  대기로 되돌리기
                </button>
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
