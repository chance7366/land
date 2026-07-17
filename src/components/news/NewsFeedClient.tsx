"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import {
  Building,
  Building2,
  ChartColumn,
  ExternalLink,
  Home,
  Landmark,
  LayoutDashboard,
  MapPinned,
  Newspaper,
  Search,
  SearchX,
  Sparkles,
  X,
  type LucideProps,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NewsFeedPagination } from "@/components/news/NewsFeedPagination";
import { R114WikiCategoryBar } from "@/components/news/R114WikiCategoryBar";
import {
  NEWS_FEED_PAGE_SIZE,
  NEWS_FEED_SIDEBAR_GROUPS,
  getNewsFeedGroupLabel,
  getNewsFeedSourceMeta,
  isNewsFeedSourceId,
  newsFeedGroupForSource,
  type NewsFeedGroupId,
  type NewsFeedSourceId,
  type NewsFeedSourceKey,
  type R114WikiCategoryId,
} from "@/lib/news-feed";

export type NewsFeedListItem = {
  id: string;
  source: string;
  sourceName: string;
  title: string;
  summary?: string | null;
  press?: string | null;
  originUrl: string;
  imageUrl?: string | null;
  rank?: number | null;
  pubDate: string;
};

type FeedResponse = {
  items: NewsFeedListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: Record<string, number>;
  groupCounts?: Record<NewsFeedGroupId, Record<string, number>>;
  group?: NewsFeedGroupId;
  keywords?: string[];
};

const SIDEBAR_ICONS: Record<NewsFeedSourceKey, ComponentType<LucideProps>> = {
  all: LayoutDashboard,
  naver: Newspaper,
  molit: Landmark,
  chungnam: Building2,
  hongseong: Home,
  yesan: MapPinned,
  rtech: ChartColumn,
  r114: Building,
};

const GROUP_HEADER: Record<
  NewsFeedGroupId,
  { accent: string; glow: string; iconBg: string; hint: string }
> = {
  estate: {
    accent: "from-[#d450ff] to-[#4dabff]",
    glow: "shadow-[0_0_24px_rgba(212,80,255,0.18)]",
    iconBg: "bg-gradient-to-br from-[#d450ff]/35 to-[#4dabff]/25",
    hint: "뉴스 · 보도 · 위키",
  },
  region: {
    accent: "from-[#34d399] to-[#4dabff]",
    glow: "shadow-[0_0_24px_rgba(52,211,153,0.14)]",
    iconBg: "bg-gradient-to-br from-[#34d399]/30 to-[#4dabff]/20",
    hint: "도·군 행정 소식",
  },
};

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#d450ff] focus:outline-none";

function SourceBadge({ source }: { source: string }) {
  if (!isNewsFeedSourceId(source)) {
    return (
      <span className="inline-flex shrink-0 whitespace-nowrap rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-bold leading-none text-white/60">
        {source}
      </span>
    );
  }
  const meta = getNewsFeedSourceMeta(source);
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 text-[11px] font-bold leading-none ${meta.badgeClass}`}
    >
      {meta.shortLabel}
    </span>
  );
}

function openOrigin(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
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

type Props = {
  initial: FeedResponse;
  initialSource?: NewsFeedSourceKey;
  initialGroup?: NewsFeedGroupId;
};

export function NewsFeedClient({
  initial,
  initialSource = "all",
  initialGroup = "estate",
}: Props) {
  const [groupId, setGroupId] = useState<NewsFeedGroupId>(
    initial.group ??
      (initialSource !== "all" && isNewsFeedSourceId(initialSource)
        ? newsFeedGroupForSource(initialSource)
        : initialGroup),
  );
  const [source, setSource] = useState<NewsFeedSourceKey>(initialSource);
  const [r114Category, setR114Category] = useState<R114WikiCategoryId>("all");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [data, setData] = useState(initial);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const load = useCallback(
    async (
      nextGroup: NewsFeedGroupId,
      nextSource: NewsFeedSourceKey,
      nextPage: number,
      nextKeywords: string[],
      nextR114Category: R114WikiCategoryId = "all",
    ) => {
      setLoading(true);
      setLoadError("");
      try {
        const qs = new URLSearchParams({
          group: nextGroup,
          source: nextSource,
          page: String(nextPage),
          pageSize: String(NEWS_FEED_PAGE_SIZE),
        });
        if (nextKeywords.length) qs.set("q", nextKeywords.join(","));
        if (nextSource === "r114" && nextR114Category !== "all") {
          qs.set("category", nextR114Category);
        }
        const res = await fetch(`/api/news-feed?${qs}`);
        const json = (await res.json().catch(() => null)) as FeedResponse | null;
        if (res.ok && json) {
          setData(json);
        } else {
          setLoadError("소식을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        }
      } catch {
        setLoadError("네트워크 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  function selectItem(nextGroup: NewsFeedGroupId, nextSource: NewsFeedSourceKey) {
    if (nextGroup === groupId && nextSource === source) return;
    setGroupId(nextGroup);
    setSource(nextSource);
    setR114Category("all");
    void load(nextGroup, nextSource, 1, keywords, "all");
  }

  function selectR114Category(next: R114WikiCategoryId) {
    if (next === r114Category) return;
    setR114Category(next);
    void load(groupId, "r114", 1, keywords, next);
  }

  function goPage(next: number) {
    void load(groupId, source, next, keywords, r114Category);
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
    void load(groupId, source, 1, next, r114Category);
  }

  function removeKeyword(k: string) {
    const next = keywords.filter((x) => x !== k);
    setKeywords(next);
    void load(groupId, source, 1, next, r114Category);
  }

  useEffect(() => {
    setData(initial);
  }, [initial]);

  const groupMeta = NEWS_FEED_SIDEBAR_GROUPS.find((g) => g.id === groupId)!;
  const activeLabel =
    source === "all"
      ? `${getNewsFeedGroupLabel(groupId)} 전체`
      : groupMeta.items.find((i) => i.key === source)?.label ?? "소식";

  const totalPages = data.totalPages || 1;
  const groupCounts = data.groupCounts;
  // 네이버뉴스 페이지에서만 썸네일 — 그룹 전체에서는 생략
  const showThumb = source === "naver";

  const subtitle =
    source === "all"
      ? groupId === "estate"
        ? "부동산소식 그룹 소식을 등록일 최신순으로 모았습니다. 같은 날 소식은 출처를 섞어 보여 줍니다."
        : "지역소식 그룹 소식을 등록일 최신순으로 모았습니다. 같은 날 소식은 출처를 섞어 보여 줍니다."
      : source === "naver"
        ? "네이버부동산 헤드라인입니다. 최근 30일 자료를 모으며, 썸네일·요약과 원문 링크로 이동합니다."
        : source === "molit"
          ? "국토교통부 주택·토지 보도자료입니다. 제목·주요내용과 원문 상세 페이지로 이동합니다."
          : source === "chungnam"
            ? "충청남도 최근 소식입니다. 공지는 제외하며, 제목·내용(첫 줄)과 원문으로 이동합니다."
            : source === "hongseong"
              ? "홍성군 공지사항·공고/고시입니다. 고정 공지는 제외하며, 제목·요약과 원문으로 이동합니다."
              : source === "yesan"
                ? "예산군 공지사항·공고입니다. 홍성군청과 동일 구성이며, 수집 URL은 추후 반영합니다."
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

  function countFor(gId: NewsFeedGroupId, key: NewsFeedSourceKey) {
    if (groupCounts?.[gId]) return groupCounts[gId][key] ?? 0;
    if (key === "all") {
      return NEWS_FEED_SIDEBAR_GROUPS.find((g) => g.id === gId)!
        .items.filter((i) => i.key !== "all")
        .reduce((sum, i) => sum + (data.counts[i.key] ?? 0), 0);
    }
    return data.counts[key] ?? 0;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-container-padding-mobile py-10 md:flex-row md:px-8 md:py-14">
      <aside className="w-full shrink-0 md:w-60 lg:w-64">
        <GlassCard className="sticky top-24 space-y-4 p-3">
          {NEWS_FEED_SIDEBAR_GROUPS.map((g) => {
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
                    <p className="text-[10px] text-white/35">{style.hint}</p>
                  </div>
                </div>
                <nav className="space-y-1" aria-label={g.label}>
                  {g.items.map((item) => {
                    const active = groupId === g.id && source === item.key;
                    const count = countFor(g.id, item.key);
                    const Icon = SIDEBAR_ICONS[item.key];
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
          <h1 className="mt-1 text-3xl font-extrabold text-white md:text-4xl">{activeLabel}</h1>
          <p className="mt-2 text-sm text-white/60">{subtitle}</p>
        </header>

        {source === "r114" ? (
          <GlassCard className="mb-5 p-4">
            <p className="mb-3 text-xs font-bold text-white/55">카테고리</p>
            <R114WikiCategoryBar active={r114Category} onSelect={selectR114Category} />
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
            <p className="text-xs text-white/45">
              {loading ? "불러오는 중…" : loadError ? loadError : `총 ${data.total}건`}
            </p>
            <p className="text-[11px] text-white/35">
              {data.page} / {totalPages} 페이지
            </p>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-white/45">
              목록을 불러오는 중…
            </div>
          ) : data.items.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-white/45">
              <SearchX className="h-8 w-8 text-white/25" aria-hidden />
              {source === "yesan"
                ? "예산군청 소식은 수집 URL 반영 후 제공됩니다."
                : "해당 조건의 뉴스가 없습니다."}
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {data.items.map((row) => (
                <li key={row.id}>
                  <div className="flex flex-col gap-3 px-4 py-4 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-3">
                    {source === "r114" && row.press ? (
                      <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-2.5 text-[11px] font-bold leading-none text-fuchsia-300">
                        {row.press}
                      </span>
                    ) : (
                      <SourceBadge source={row.source as NewsFeedSourceId} />
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

          <NewsFeedPagination
            page={data.page}
            totalPages={totalPages}
            disabled={loading}
            onChange={goPage}
          />
          <p className="border-t border-white/10 px-4 py-3 text-center text-[11px] text-white/35">
            {footerNote}
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
