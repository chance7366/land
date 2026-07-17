"use client";

import { useMemo, useState } from "react";
import {
  ExternalLink,
  Newspaper,
  Search,
  SearchX,
  Sparkles,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NewsFeedPagination } from "@/components/news/NewsFeedPagination";
import { R114WikiCategoryBar } from "@/components/news/R114WikiCategoryBar";
import {
  MOCK_GROUPED_NEWS_ITEMS,
  NEWS_GROUP_PAGE_SIZE,
  NEWS_SIDEBAR_GROUPS,
  countGroupedNews,
  filterGroupedNewsItems,
  getGroupedSourceBadge,
  sortGroupAllByDateThenRandom,
  type NewsGroupId,
  type NewsGroupSampleItem,
  type NewsSidebarSourceKey,
} from "@/lib/mockup/news-sidebar-groups-sample";
import type { R114WikiCategoryId } from "@/lib/news-feed";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#d450ff] focus:outline-none";

function SourceBadge({ source }: { source: NewsGroupSampleItem["source"] }) {
  const meta = getGroupedSourceBadge(source);
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 text-[11px] font-bold leading-none ${meta.badgeClass}`}
    >
      {meta.shortLabel}
    </span>
  );
}

function NewsThumb({ src }: { src: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div className="flex h-full items-center justify-center text-white/25">
        <Newspaper className="h-6 w-6" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="h-full w-full object-cover"
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
    />
  );
}

function openOrigin(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

const GROUP_HEADER: Record<
  NewsGroupId,
  { accent: string; glow: string; iconBg: string }
> = {
  estate: {
    accent: "from-[#d450ff] to-[#4dabff]",
    glow: "shadow-[0_0_24px_rgba(212,80,255,0.18)]",
    iconBg: "bg-gradient-to-br from-[#d450ff]/35 to-[#4dabff]/25",
  },
  region: {
    accent: "from-[#34d399] to-[#4dabff]",
    glow: "shadow-[0_0_24px_rgba(52,211,153,0.14)]",
    iconBg: "bg-gradient-to-br from-[#34d399]/30 to-[#4dabff]/20",
  },
};

export function NewsSidebarGroupsSampleClient() {
  const [groupId, setGroupId] = useState<NewsGroupId>("estate");
  const [source, setSource] = useState<NewsSidebarSourceKey>("all");
  const [page, setPage] = useState(1);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [r114Category, setR114Category] = useState<R114WikiCategoryId>("all");
  /** 그룹 전체 진입·새로고침 시 동일일자 랜덤 시드 */
  const [shuffleSeed, setShuffleSeed] = useState(() => Date.now());

  const group = NEWS_SIDEBAR_GROUPS.find((g) => g.id === groupId)!;

  const filtered = useMemo(() => {
    let rows = filterGroupedNewsItems(MOCK_GROUPED_NEWS_ITEMS, groupId, source);
    if (source === "r114" && r114Category !== "all") {
      rows = rows.filter((r) => r.press === getR114PressLabel(r114Category));
    }
    if (keywords.length) {
      rows = rows.filter((row) => {
        const hay = `${row.title} ${row.summary} ${row.press}`.toLowerCase();
        return keywords.some((k) => hay.includes(k.toLowerCase()));
      });
    }
    if (source === "all") {
      return sortGroupAllByDateThenRandom(rows, shuffleSeed);
    }
    return [...rows].sort((a, b) =>
      a.pubDate < b.pubDate ? 1 : a.pubDate > b.pubDate ? -1 : 0,
    );
  }, [groupId, source, keywords, r114Category, shuffleSeed]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / NEWS_GROUP_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * NEWS_GROUP_PAGE_SIZE,
    safePage * NEWS_GROUP_PAGE_SIZE,
  );

  function selectItem(nextGroup: NewsGroupId, nextSource: NewsSidebarSourceKey) {
    if (nextGroup === groupId && nextSource === source) return;
    setGroupId(nextGroup);
    setSource(nextSource);
    setPage(1);
    setR114Category("all");
    if (nextSource === "all") setShuffleSeed(Date.now());
  }

  function addKeyword(raw: string) {
    const parts = raw
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const next = [...keywords];
    for (const p of parts) {
      if (!next.some((k) => k.toLowerCase() === p.toLowerCase())) next.push(p);
    }
    setKeywords(next);
    setDraft("");
    setPage(1);
  }

  function removeKeyword(k: string) {
    setKeywords(keywords.filter((x) => x !== k));
    setPage(1);
  }

  const activeLabel =
    source === "all"
      ? `${group.label} 전체`
      : group.items.find((i) => i.key === source)?.label ?? group.label;

  const subtitle =
    source === "all"
      ? "등록일 최신순으로 모으고, 같은 등록일끼리는 출처를 섞어 보여 줍니다. (하위 메뉴 순서 아님)"
      : source === "naver"
        ? "네이버부동산 헤드라인입니다. 최근 30일 자료를 모으며, 썸네일·요약과 원문 링크로 이동합니다."
        : source === "molit"
          ? "국토교통부 주택·토지 보도자료입니다. 제목·주요내용과 원문 상세 페이지로 이동합니다."
          : source === "chungnam"
            ? "충청남도 최근 소식입니다. 공지는 제외하며, 제목·내용(첫 줄)과 원문으로 이동합니다."
            : source === "hongseong" || source === "yesan"
              ? source === "yesan"
                ? "예산군 공지사항·공고입니다. 홍성군청과 동일 구성이며, 수집 URL은 추후 반영합니다."
                : "홍성군 공지사항·공고/고시입니다. 고정 공지는 제외하며, 제목·요약과 원문으로 이동합니다."
              : source === "rtech"
                ? "부동산테크 부동산 뉴스입니다. 2026년 1월부터 제목·등록일과 한경 집코노미 원문으로 이동합니다."
                : "부동산114 위키입니다. 카테고리별 용어·해설을 최근 30일 기준으로 모으며, 원문으로 이동합니다.";

  const keywordPlaceholder =
    source === "molit"
      ? "예: 전세, 분양, 신도시 — Enter로 추가"
      : source === "chungnam"
        ? "예: 건설, 내포, 주택 — Enter로 추가"
        : source === "hongseong" || source === "yesan"
          ? "예: 공고, 고시, 지원 — Enter로 추가"
          : source === "rtech"
            ? "예: 분양, 전세, 대전 — Enter로 추가"
            : source === "r114"
              ? "예: 전세, 청약, 경매 — Enter로 추가"
              : "예: 내포, 경매, 전세 — Enter로 추가";

  const showThumb = source === "naver";

  const footerNote =
    source === "naver"
      ? "뉴스 본문·이미지 저작권은 제공처 또는 네이버에 있습니다. 제목·요약·썸네일 URL·원문 링크만 표시합니다."
      : source === "molit"
        ? "보도자료 저작권은 국토교통부에 있습니다. 제목·주요내용·원문 링크만 표시합니다."
        : source === "chungnam"
          ? "게시물 저작권은 충청남도에 있습니다. 제목·내용(첫 줄)·원문 링크만 표시합니다."
          : source === "hongseong"
            ? "게시물 저작권은 홍성군에 있습니다. 제목·요약·원문 링크만 표시합니다."
            : source === "yesan"
              ? "게시물 저작권은 예산군에 있습니다. 제목·요약·원문 링크만 표시합니다."
              : source === "r114"
                ? "게시·원문 저작권은 부동산114에 있습니다. 제목·요약·원문 링크만 표시합니다."
                : source === "rtech"
                  ? "게시·원문 저작권은 한국부동산원 부동산테크 및 한경 집코노미에 있습니다. 제목·등록일·원문 링크만 표시합니다."
                  : "각 출처 게시·원문 저작권은 해당 기관에 있습니다. 제목·요약·원문 링크만 표시합니다.";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-container-padding-mobile py-10 md:flex-row md:px-8 md:py-14">
      <aside className="w-full shrink-0 md:w-60 lg:w-64">
        <GlassCard className="sticky top-24 space-y-4 p-3">
          {NEWS_SIDEBAR_GROUPS.map((g) => {
            const style = GROUP_HEADER[g.id];
            return (
              <div key={g.id}>
                <div
                  className={`mb-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 ${style.glow}`}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${style.iconBg}`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`bg-gradient-to-r ${style.accent} bg-clip-text text-[12px] font-extrabold tracking-wide text-transparent`}
                    >
                      {g.label}
                    </p>
                    <p className="text-[10px] text-white/35">
                      {g.id === "estate" ? "뉴스 · 보도 · 위키" : "도·군 행정 소식"}
                    </p>
                  </div>
                </div>
                <nav className="space-y-1" aria-label={g.label}>
                  {g.items.map((item) => {
                    const active = groupId === g.id && source === item.key;
                    const count = countGroupedNews(
                      MOCK_GROUPED_NEWS_ITEMS,
                      g.id,
                      item.key,
                    );
                    const Icon = item.icon;
                    return (
                      <button
                        key={`${g.id}-${item.key}`}
                        type="button"
                        onClick={() => selectItem(g.id, item.key)}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                          active
                            ? "bg-gradient-to-r from-[#d450ff]/25 to-[#4dabff]/20 text-white shadow-[0_0_20px_rgba(212,80,255,0.15)]"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                        <span className="min-w-0 flex-1 truncate font-semibold leading-tight">
                          {item.label}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                            active ? "bg-white/15 text-white" : "bg-white/5 text-white/40"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </GlassCard>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="mb-6 border-b border-white/10 pb-6">
          <p className="text-xs font-bold tracking-wide text-[#e9d5ff]">부동산·지역소식</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white md:text-4xl">
            {activeLabel}
          </h1>
          <p className="mt-2 text-sm text-white/60">{subtitle}</p>
        </header>

        {source === "r114" ? (
          <GlassCard className="mb-5 p-4">
            <p className="mb-3 text-xs font-bold text-white/55">카테고리</p>
            <R114WikiCategoryBar
              active={r114Category}
              onSelect={(next) => {
                setR114Category(next);
                setPage(1);
              }}
            />
          </GlassCard>
        ) : null}

        <GlassCard className="mb-5 p-4">
          <label className="block text-xs font-bold text-white/55">키워드 검색 (복수 · OR)</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {keywords.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => removeKeyword(k)}
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
                placeholder={keywordPlaceholder}
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
            <p className="text-xs text-white/45">총 {total}건</p>
            <p className="text-[11px] text-white/35">
              {safePage} / {totalPages} 페이지
            </p>
          </div>

          {pageItems.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-white/45">
              <SearchX className="h-8 w-8 text-white/25" aria-hidden />
              해당 조건의 뉴스가 없습니다.
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {pageItems.map((row) => (
                <li key={row.id}>
                  <div className="flex flex-col gap-3 px-4 py-4 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-3">
                    {source === "r114" && row.press ? (
                      <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-2.5 text-[11px] font-bold leading-none text-fuchsia-300">
                        {row.press}
                      </span>
                    ) : (
                      <SourceBadge source={row.source} />
                    )}
                    {showThumb ? (
                      <button
                        type="button"
                        onClick={() => openOrigin(row.originUrl)}
                        className="relative h-[70px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-black/40"
                      >
                        {row.imageUrl ? (
                          <NewsThumb src={row.imageUrl} />
                        ) : (
                          <div className="flex h-full items-center justify-center text-white/25">
                            <Newspaper className="h-6 w-6" />
                          </div>
                        )}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => openOrigin(row.originUrl)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="line-clamp-2 text-sm font-bold leading-snug text-white hover:text-[#e9d5ff] md:line-clamp-1">
                        {row.title}
                      </p>
                      {row.summary ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/55 md:line-clamp-1">
                          {row.summary}
                        </p>
                      ) : null}
                      <p className="mt-1.5 text-[11px] text-white/35">
                        {source !== "r114" && row.press ? (
                          <>
                            {row.press}
                            <span className="mx-1.5 text-white/20">·</span>
                          </>
                        ) : null}
                        {row.pubDate}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => openOrigin(row.originUrl)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#d450ff]/35 bg-[#d450ff]/10 px-3 py-1.5 text-xs font-bold text-[#e9d5ff] transition hover:bg-[#d450ff]/20"
                    >
                      원문보기
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <NewsFeedPagination page={safePage} totalPages={totalPages} onChange={setPage} />
          <p className="border-t border-white/10 px-4 py-3 text-center text-[11px] text-white/35">
            {footerNote}
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

function getR114PressLabel(id: R114WikiCategoryId): string {
  const map: Partial<Record<R114WikiCategoryId, string>> = {
    sale: "매매",
    rent: "전월세",
    finance: "금융",
    subscription: "청약",
    tax: "세금",
    auction: "경매",
    policy: "제도",
    redevelopment: "정비사업",
    commercial: "상업용",
    lifestyle: "생활정보",
  };
  return map[id] ?? "";
}
