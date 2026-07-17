"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NewsFeedPagination } from "@/components/news/NewsFeedPagination";

/** 샘플: 총 69페이지처럼 많은 목록에서 숫자 10개 + ≪＜＞≫ */
export function NewsPaginationSampleClient() {
  const totalPages = 69;
  const [page, setPage] = useState(2);

  return (
    <div className="mx-auto max-w-3xl px-container-padding-mobile py-10 md:px-8 md:py-14">
      <header className="mb-6 border-b border-white/10 pb-6">
        <p className="text-xs font-bold tracking-wide text-[#e9d5ff]">디자인 목업</p>
        <h1 className="mt-1 text-3xl font-extrabold text-white md:text-4xl">
          소식 페이지네이션
        </h1>
        <p className="mt-2 text-sm text-white/60">
          숫자는 한 번에 최대 10개 · ≪ 처음 · ＜ 이전 · ＞ 다음 · ≫ 마지막 (기존 글래스 색)
        </p>
      </header>

      <GlassCard className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-xs text-white/45">예시 · 총 552건 (8건×69페이지)</p>
          <p className="text-[11px] text-white/35">
            {page} / {totalPages} 페이지
          </p>
        </div>

        <ul className="divide-y divide-white/10">
          {Array.from({ length: 3 }, (_, i) => (
            <li key={i} className="px-4 py-4">
              <p className="text-sm font-bold text-white/80">
                샘플 기사 제목 — {page}페이지 {i + 1}번
              </p>
              <p className="mt-1.5 text-[11px] text-white/35">한경 집코노미 · 2026-07-15</p>
            </li>
          ))}
        </ul>

        <NewsFeedPagination page={page} totalPages={totalPages} onChange={setPage} />
      </GlassCard>

      <p className="mt-4 text-center text-[11px] text-white/40">
        11페이지로 이동하면 숫자 블록이 11–20으로 바뀝니다.
      </p>
    </div>
  );
}
