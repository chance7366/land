"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { newsFeedPageWindow } from "@/lib/news-feed-pagination";

type Props = {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onChange: (page: number) => void;
};

const btnBase =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border text-xs font-bold tabular-nums transition";
const btnNav =
  `${btnBase} border-white/15 px-2 text-white/70 hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-30`;
const btnNum =
  `${btnBase} border-transparent px-2.5 text-white/50 hover:bg-white/5 hover:text-white disabled:pointer-events-none`;
const btnActive = `${btnBase} border-[#d450ff]/40 bg-[#d450ff]/25 px-2.5 text-white`;

/** ≪ ＜ 1…10 ＞ ≫ — 숫자 최대 10개, Unifine 글래스 톤 */
export function NewsFeedPagination({
  page,
  totalPages,
  disabled = false,
  onChange,
}: Props) {
  const total = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), total);
  const { pages } = newsFeedPageWindow(current, total);

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-1.5 border-t border-white/10 px-4 py-4"
      role="navigation"
      aria-label="페이지"
    >
      <button
        type="button"
        aria-label="처음"
        disabled={disabled || current <= 1}
        onClick={() => onChange(1)}
        className={btnNav}
      >
        <ChevronsLeft className="h-3.5 w-3.5" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="이전"
        disabled={disabled || current <= 1}
        onClick={() => onChange(Math.max(1, current - 1))}
        className={btnNav}
      >
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
      </button>

      {pages.map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n}페이지`}
          aria-current={n === current ? "page" : undefined}
          disabled={disabled}
          onClick={() => onChange(n)}
          className={n === current ? btnActive : btnNum}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음"
        disabled={disabled || current >= total}
        onClick={() => onChange(Math.min(total, current + 1))}
        className={btnNav}
      >
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="마지막"
        disabled={disabled || current >= total}
        onClick={() => onChange(total)}
        className={btnNav}
      >
        <ChevronsRight className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
