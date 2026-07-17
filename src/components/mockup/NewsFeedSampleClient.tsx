"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  MOCK_NEWS_FEED_ITEMS,
  NEWS_FEED_PAGE_SIZE,
  NEWS_FEED_SIDEBAR,
  getSourceMeta,
  type NewsFeedSampleItem,
  type NewsFeedSourceKey,
} from "@/lib/mockup/news-feed-sample-data";

function SourceBadge({ source }: { source: NewsFeedSampleItem["source"] }) {
  const meta = getSourceMeta(source);
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.badgeClass}`}
    >
      {meta.shortLabel}
    </span>
  );
}

function openOrigin(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/** 샘플: 출처별 사이드바 + 부동산 소식 리스트 + 페이지네이션 */
export function NewsFeedSampleClient() {
  const [source, setSource] = useState<NewsFeedSourceKey>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(MOCK_NEWS_FEED_ITEMS);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (source === "all") return items;
    return items.filter((row) => row.source === source);
  }, [items, source]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / NEWS_FEED_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * NEWS_FEED_PAGE_SIZE,
    safePage * NEWS_FEED_PAGE_SIZE,
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    for (const row of items) {
      map[row.source] = (map[row.source] ?? 0) + 1;
    }
    return map;
  }, [items]);

  function selectSource(next: NewsFeedSourceKey) {
    if (next === source) return;
    setLoading(true);
    setSource(next);
    setPage(1);
    // 비동기 목록 조회 시뮬레이션
    window.setTimeout(() => {
      startTransition(() => {
        setItems([...MOCK_NEWS_FEED_ITEMS]);
        setLoading(false);
      });
    }, 280);
  }

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const activeLabel =
    source === "all"
      ? "전체 소식"
      : NEWS_FEED_SIDEBAR.find((s) => s.key === source)?.label ?? "소식";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-container-padding-mobile py-10 md:flex-row md:px-8 md:py-14">
      {/* Sidebar */}
      <aside className="w-full shrink-0 md:w-56 lg:w-60">
        <GlassCard className="sticky top-24 p-3">
          <p className="mb-2 px-2 text-[11px] font-bold tracking-wide text-[#e9d5ff]">출처</p>
          <nav className="space-y-1" aria-label="뉴스 출처">
            {NEWS_FEED_SIDEBAR.map((item) => {
              const active = source === item.key;
              const count = counts[item.key] ?? 0;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => selectSource(item.key)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-gradient-to-r from-[#d450ff]/25 to-[#4dabff]/20 text-white shadow-[0_0_20px_rgba(212,80,255,0.15)]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{item.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                      active ? "bg-white/15 text-white" : "bg-white/5 text-white/40"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </GlassCard>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        <header className="mb-6 border-b border-white/10 pb-6">
          <p className="text-xs font-bold tracking-wide text-[#e9d5ff]">부동산 소식</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white md:text-4xl">{activeLabel}</h1>
          <p className="mt-2 text-sm text-white/60">
            출처별 보도자료·뉴스를 모았습니다. 본문은 제공하지 않으며, 원문 사이트에서 확인하세요.
          </p>
        </header>

        <GlassCard className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-xs text-white/45">
              {loading ? "불러오는 중…" : `총 ${filtered.length}건`}
            </p>
            <p className="text-[11px] text-white/35">
              {safePage} / {totalPages} 페이지
            </p>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-white/45">
              목록을 불러오는 중…
            </div>
          ) : pageItems.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-white/45">
              <span className="material-symbols-outlined text-3xl text-white/25">search_off</span>
              해당 출처의 소식이 없습니다.
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {pageItems.map((row) => (
                <li key={row.id}>
                  <div className="flex flex-col gap-3 px-4 py-4 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-4">
                    <SourceBadge source={row.source} />
                    <button
                      type="button"
                      onClick={() => openOrigin(row.originUrl)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="line-clamp-2 text-sm font-bold text-white hover:text-[#e9d5ff] sm:line-clamp-1">
                        {row.title}
                      </p>
                      <p className="mt-1 text-[11px] text-white/40 sm:hidden">{row.pubDate}</p>
                    </button>
                    <time
                      className="hidden shrink-0 text-xs tabular-nums text-white/45 sm:block"
                      dateTime={row.pubDate}
                    >
                      {row.pubDate}
                    </time>
                    <button
                      type="button"
                      onClick={() => openOrigin(row.originUrl)}
                      className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg border border-[#d450ff]/35 bg-[#d450ff]/10 px-3 py-1.5 text-xs font-bold text-[#e9d5ff] transition hover:bg-[#d450ff]/20 sm:self-center"
                    >
                      원문 보기
                      <span className="material-symbols-outlined text-sm" aria-hidden>
                        open_in_new
                      </span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-white/10 px-4 py-4">
            <button
              type="button"
              disabled={safePage <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-white/70 disabled:opacity-30"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                disabled={loading}
                onClick={() => setPage(n)}
                className={`min-w-8 rounded-lg px-2.5 py-1.5 text-xs font-bold tabular-nums transition ${
                  n === safePage
                    ? "bg-[#d450ff]/25 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={safePage >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-white/70 disabled:opacity-30"
            >
              다음
            </button>
          </div>
        </GlassCard>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-white/40">
          샘플 데이터입니다. 프로덕션에서는 하루 3회 자동 수집 ·{" "}
          <code className="text-white/50">origin_url</code> 중복 방지로 갱신됩니다. ·{" "}
          <Link href="/news" className="text-[#e9d5ff]/80 hover:underline">
            현재 /news
          </Link>
        </p>
      </div>
    </div>
  );
}
