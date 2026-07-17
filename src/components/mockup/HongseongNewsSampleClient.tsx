"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Home, Newspaper, Search, X } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  MOCK_HONGSEONG_NEWS,
  matchHongseongKeywords,
} from "@/lib/mockup/hongseong-news-sample";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#d450ff] focus:outline-none";

function openOrigin(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/** 샘플: 충남과 동일 구성 — 공지사항+공고/고시, 공지 배지 제외, 사진 없음 */
export function HongseongNewsSampleClient() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const filtered = useMemo(
    () =>
      MOCK_HONGSEONG_NEWS.filter((row) =>
        matchHongseongKeywords(row.title, row.summary, keywords),
      ),
    [keywords],
  );

  function addKeyword(raw: string) {
    const parts = raw
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    setKeywords((prev) => {
      const next = [...prev];
      for (const p of parts) {
        if (!next.some((k) => k.toLowerCase() === p.toLowerCase())) next.push(p);
      }
      return next;
    });
    setDraft("");
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-container-padding-mobile py-10 md:flex-row md:px-8 md:py-14">
      <aside className="w-full shrink-0 md:w-60 lg:w-64">
        <GlassCard className="sticky top-24 p-3">
          <p className="mb-2 px-2 text-[11px] font-bold tracking-wide text-[#e9d5ff]">출처</p>
          <nav className="space-y-1" aria-label="뉴스 출처">
            {[
              { label: "전체", count: 16, active: false, Icon: Newspaper },
              { label: "네이버부동산뉴스", count: 6, active: false, Icon: Newspaper },
              { label: "국토교통부", count: 6, active: false, Icon: Newspaper },
              { label: "충남도청", count: 6, active: false, Icon: Newspaper },
              { label: "홍성군청", count: filtered.length, active: true, Icon: Home },
              { label: "부동산테크", count: 2, active: false, Icon: Newspaper },
              { label: "부동산114", count: 2, active: false, Icon: Newspaper },
            ].map((item) => {
              const Icon = item.Icon;
              return (
                <div
                  key={item.label}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm ${
                    item.active
                      ? "bg-gradient-to-r from-[#d450ff]/25 to-[#4dabff]/20 text-white"
                      : "text-white/40"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <span className="min-w-0 flex-1 truncate font-semibold">{item.label}</span>
                  <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </nav>
        </GlassCard>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="mb-6 border-b border-white/10 pb-6">
          <p className="text-xs font-bold tracking-wide text-[#e9d5ff]">부동산 소식</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white md:text-4xl">홍성군청</h1>
          <p className="mt-2 text-sm text-white/60">
            공지사항(공지 배지 제외) + 공고/고시 · 소관부서·등록일 · 내용(첫 줄) · 원문 (사진 없음)
          </p>
        </header>

        <GlassCard className="mb-5 p-4">
          <label className="block text-xs font-bold text-white/55">키워드 검색 (복수 · OR)</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {keywords.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKeywords((prev) => prev.filter((x) => x !== k))}
                className="inline-flex items-center gap-1 rounded-full border border-[#d450ff]/40 bg-[#d450ff]/15 px-2.5 py-1 text-xs font-bold text-[#e9d5ff]"
              >
                {k}
                <X className="h-3 w-3" aria-hidden />
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                className={`${fieldClass} pl-9`}
                placeholder="예: 내포, 도시, 공고 — Enter로 추가"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addKeyword(draft);
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => addKeyword(draft)}
              className="shrink-0 rounded-xl bg-gradient-to-r from-[#d450ff] to-[#4dabff] px-4 py-2.5 text-sm font-bold text-white"
            >
              추가
            </button>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-xs text-white/45">총 {filtered.length}건</p>
            <p className="text-[11px] text-white/35">1 / 1 페이지</p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-white/45">
              키워드에 맞는 소식이 없습니다.
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {filtered.map((row) => (
                <li key={row.id}>
                  <div className="flex flex-col gap-3 px-4 py-4 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-3">
                    <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border border-orange-400/40 bg-orange-500/15 px-2.5 text-[11px] font-bold leading-none text-orange-300">
                      {row.category === "gosi" ? "공고" : "홍성"}
                    </span>
                    <button
                      type="button"
                      onClick={() => openOrigin(row.originUrl)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="line-clamp-2 text-sm font-bold leading-snug text-white hover:text-[#e9d5ff] md:line-clamp-1">
                        {row.title}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-white/55">
                        {row.summary}
                      </p>
                      <p className="mt-1.5 text-[11px] text-white/35">
                        {row.press}
                        <span className="mx-1.5 text-white/20">·</span>
                        {row.pubDate}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => openOrigin(row.originUrl)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#d450ff]/35 bg-[#d450ff]/10 px-3 py-1.5 text-xs font-bold text-[#e9d5ff] transition hover:bg-[#d450ff]/20"
                    >
                      원문 보기
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-white/10 px-4 py-4">
            <span className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-white/30">
              이전
            </span>
            <span className="min-w-8 rounded-lg bg-[#d450ff]/25 px-2.5 py-1.5 text-center text-xs font-bold text-white">
              1
            </span>
            <span className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-white/30">
              다음
            </span>
          </div>
        </GlassCard>

        <p className="mt-4 text-center text-[11px] text-white/40">
          샘플 · 공지사항+공고/고시 ·{" "}
          <Link href="/news?source=hongseong" className="text-[#e9d5ff]/80 hover:underline">
            현재 /news?source=hongseong
          </Link>
        </p>
      </div>
    </div>
  );
}
