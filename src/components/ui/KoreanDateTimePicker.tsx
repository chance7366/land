"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const DEFAULT_TIMES = ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseValue(value: string): { y: number; m: number; d: number; time: string } | null {
  if (!value) return null;
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})$/);
  if (!m) return null;
  return {
    y: Number(m[1]),
    m: Number(m[2]),
    d: Number(m[3]),
    time: m[4],
  };
}

function toValue(y: number, m: number, d: number, time: string) {
  return `${y}-${pad(m)}-${pad(d)}T${time}`;
}

function formatDisplay(value: string) {
  const p = parseValue(value);
  if (!p) return "";
  const date = new Date(p.y, p.m - 1, p.d);
  const wd = WEEKDAYS[date.getDay()];
  return `${p.y}년 ${p.m}월 ${p.d}일 (${wd}) ${p.time}`;
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}

function startWeekday(y: number, m: number) {
  return new Date(y, m - 1, 1).getDay();
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  timeOptions?: string[];
  className?: string;
};

/**
 * 한글 달력 + 시간 선택. 달력 아이콘은 입력창 좌측.
 */
export function KoreanDateTimePicker({
  value,
  onChange,
  required,
  timeOptions = DEFAULT_TIMES,
  className = "",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const parsed = parseValue(value);
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [viewY, setViewY] = useState(parsed?.y ?? now.getFullYear());
  const [viewM, setViewM] = useState(parsed?.m ?? now.getMonth() + 1);
  const [draftDay, setDraftDay] = useState<number | null>(parsed?.d ?? null);
  const [draftTime, setDraftTime] = useState(parsed?.time ?? timeOptions[0] ?? "14:00");

  useEffect(() => {
    if (!open) return;
    const p = parseValue(value);
    if (p) {
      setViewY(p.y);
      setViewM(p.m);
      setDraftDay(p.d);
      setDraftTime(p.time);
    } else {
      setViewY(now.getFullYear());
      setViewM(now.getMonth() + 1);
      setDraftDay(null);
      setDraftTime(timeOptions[0] ?? "14:00");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open 시 초기화
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const cells = useMemo(() => {
    const total = daysInMonth(viewY, viewM);
    const start = startWeekday(viewY, viewM);
    const list: Array<number | null> = [];
    for (let i = 0; i < start; i += 1) list.push(null);
    for (let d = 1; d <= total; d += 1) list.push(d);
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [viewY, viewM]);

  function shiftMonth(delta: number) {
    const d = new Date(viewY, viewM - 1 + delta, 1);
    setViewY(d.getFullYear());
    setViewM(d.getMonth() + 1);
  }

  function confirm(day: number, time: string) {
    onChange(toValue(viewY, viewM, day, time));
    setOpen(false);
  }

  const display = formatDisplay(value);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {/* native required 검증용 숨김 필드 */}
      <input
        tabIndex={-1}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        value={value}
        onChange={() => {}}
        required={required}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-left text-sm text-white transition hover:border-white/25 focus:border-[#60a5fa] focus:outline-none"
      >
        <Calendar className="h-4 w-4 shrink-0 text-[#93c5fd]" aria-hidden />
        <span className={display ? "text-white" : "text-white/35"}>
          {display || "희망 일시를 선택하세요"}
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-white/15 bg-[#12161f] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.55)]">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="이전 달"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-bold text-white">
              {viewY}년 {viewM}월
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="다음 달"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[11px] font-bold text-white/40">
            {WEEKDAYS.map((w, i) => (
              <span
                key={w}
                className={i === 0 ? "text-rose-300/80" : i === 6 ? "text-sky-300/80" : ""}
              >
                {w}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, idx) => {
              if (day == null) {
                return <span key={`e-${idx}`} className="h-9" />;
              }
              const selected =
                draftDay === day &&
                parsed?.y === viewY &&
                parsed?.m === viewM &&
                value !== "";
              const isDraft = draftDay === day;
              const dow = (startWeekday(viewY, viewM) + day - 1) % 7;
              return (
                <button
                  key={`${viewY}-${viewM}-${day}`}
                  type="button"
                  onClick={() => setDraftDay(day)}
                  className={`h-9 rounded-lg text-sm font-semibold transition ${
                    selected || isDraft
                      ? "bg-[#60a5fa] text-white"
                      : "text-white/80 hover:bg-white/10"
                  } ${dow === 0 && !isDraft && !selected ? "text-rose-300/90" : ""} ${
                    dow === 6 && !isDraft && !selected ? "text-sky-300/90" : ""
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="mb-2 text-[11px] font-bold text-white/45">시간</p>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {timeOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setDraftTime(t);
                    if (draftDay != null) confirm(draftDay, t);
                  }}
                  className={`rounded-lg border px-1 py-1.5 text-[11px] font-bold ${
                    draftTime === t
                      ? "border-[#60a5fa]/50 bg-[#60a5fa]/20 text-[#93c5fd]"
                      : "border-white/10 text-white/65 hover:border-white/25"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={draftDay == null}
              onClick={() => draftDay != null && confirm(draftDay, draftTime)}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-2.5 text-xs font-bold text-white disabled:opacity-40"
            >
              선택 완료
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** API용: `2026-07-21T14:00` → `2026-07-21 14:00` */
export function preferredAtLabel(value: string) {
  const p = parseValue(value);
  if (!p) return value;
  return `${p.y}-${pad(p.m)}-${pad(p.d)} ${p.time}`;
}
