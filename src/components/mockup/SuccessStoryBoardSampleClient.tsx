"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import { maskAuthor, formatQaDate } from "@/lib/qa";
import {
  SUCCESS_STORY_CATEGORIES,
  SUCCESS_STORY_SAMPLES,
  type SuccessStoryCategory,
  type SuccessStorySample,
} from "@/lib/mockup/success-story-sample";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#fbbf24] focus:outline-none";

const ACCENT = "#fbbf24";

const NAV_PREVIEW = [
  { label: "부동산중개", href: "/properties", active: false },
  { label: "경매공매", href: "/auctions", active: false },
  { label: "부동산·지역소식", href: "/news", active: false },
  { label: "찬스상담소", href: "/legal", active: false },
  { label: "성공스토리", href: "/success-stories", active: true },
  { label: "프로필", href: "/profile", active: false },
] as const;

export function SuccessStoryBoardSampleClient() {
  const [category, setCategory] = useState<(typeof SUCCESS_STORY_CATEGORIES)[number]>("전체");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<SuccessStorySample[]>(() => [...SUCCESS_STORY_SAMPLES]);
  const [selectedId, setSelectedId] = useState<string | null>(SUCCESS_STORY_SAMPLES[0]?.id ?? null);
  const [writeOpen, setWriteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [writeError, setWriteError] = useState("");
  const [form, setForm] = useState({
    category: "부동산중개" as SuccessStoryCategory,
    author: "",
    title: "",
    body: "",
  });

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (category !== "전체" && p.category !== category) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.authorMasked.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [posts, category, query]);

  const selected = useMemo(
    () => posts.find((p) => p.id === selectedId) ?? null,
    [posts, selectedId],
  );

  function submitWrite(e: React.FormEvent) {
    e.preventDefault();
    setWriteError("");
    if (!form.author.trim() || !form.title.trim() || !form.body.trim()) {
      setWriteError("필수 항목을 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      const id = `ss-local-${Date.now()}`;
      const next: SuccessStorySample = {
        id,
        category: form.category,
        title: form.title.trim(),
        content: form.body.trim(),
        authorName: form.author.trim(),
        authorMasked: maskAuthor(form.author),
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) => [next, ...prev]);
      setSelectedId(id);
      setForm({ category: "부동산중개", author: "", title: "", body: "" });
      setWriteOpen(false);
      setSubmitting(false);
    }, 400);
  }

  return (
    <div className="mx-auto max-w-6xl px-container-padding-mobile py-8 font-[family-name:var(--font-unifine),Outfit,sans-serif] md:px-8 md:py-12">
      <div className="mb-8 overflow-x-auto rounded-xl border border-white/10 bg-black/20">
        <p className="border-b border-white/10 px-3 py-2 text-[10px] font-semibold tracking-wide text-white/40">
          네비 미리보기 (프로덕션 적용됨)
        </p>
        <ul className="flex min-w-max items-stretch justify-center gap-1 px-2 md:gap-2">
          {NAV_PREVIEW.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                style={{ ["--nav-accent" as string]: ACCENT }}
                className={`flex h-11 items-center justify-center border-b-2 px-3 text-sm font-semibold transition-colors md:px-4 ${
                  item.active
                    ? "border-[color:var(--nav-accent)] text-[color:var(--nav-accent)]"
                    : "border-transparent text-landing-muted hover:border-white/30 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold text-white md:text-4xl">성공스토리</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            부동산중개·경매공매 서비스를 이용하신 고객님의 후기입니다. 친절한 상담, 소개 물건에 대한
            만족, 경매대리 낙찰 성공 이야기를 남겨 주세요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setWriteOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] px-4 py-2.5 text-sm font-bold text-[#1a1402] shadow-[0_8px_24px_rgba(251,191,36,0.25)]"
        >
          <Pencil className="h-4 w-4 shrink-0" aria-hidden />
          후기 남기기
        </button>
      </header>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {SUCCESS_STORY_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                category === c
                  ? "border-[#fbbf24]/50 bg-[#fbbf24]/15 text-[#fde68a]"
                  : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          className={`${fieldClass} sm:max-w-xs`}
          placeholder="키워드 · 작성자 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-white/5 text-xs text-white/45">
                <tr>
                  <th className="px-3 py-3 font-semibold">번호</th>
                  <th className="px-3 py-3 font-semibold">구분</th>
                  <th className="px-3 py-3 font-semibold">제목</th>
                  <th className="px-3 py-3 font-semibold">작성자</th>
                  <th className="px-3 py-3 font-semibold">등록일</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-10 text-center text-sm text-white/45">
                      등록된 후기가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((post, index) => (
                    <tr
                      key={post.id}
                      className={`cursor-pointer border-t border-white/10 transition hover:bg-white/[0.04] ${
                        selected?.id === post.id ? "bg-[#fbbf24]/10" : ""
                      }`}
                      onClick={() => setSelectedId(post.id)}
                    >
                      <td className="px-3 py-3 font-mono text-xs text-white/45">
                        {filtered.length - index}
                      </td>
                      <td className="px-3 py-3 text-xs text-white/70">{post.category}</td>
                      <td className="px-3 py-3 font-semibold text-white">
                        <span className="line-clamp-1">{post.title}</span>
                      </td>
                      <td className="px-3 py-3 text-white/60">{post.authorMasked}</td>
                      <td className="px-3 py-3 text-xs text-white/45">
                        {formatQaDate(post.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="space-y-4">
          {selected ? (
            <GlassCard className="p-5">
              <span className="rounded-full border border-[#fbbf24]/35 bg-[#fbbf24]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#fde68a]">
                {selected.category}
              </span>
              <h2 className="mt-3 text-base font-bold text-white">{selected.title}</h2>
              <p className="mt-1 text-xs text-white/40">
                {selected.authorMasked} · {formatQaDate(selected.createdAt)}
              </p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                {selected.content}
              </p>
            </GlassCard>
          ) : (
            <GlassCard className="flex h-48 items-center justify-center p-5 text-sm text-white/45">
              목록에서 후기를 선택하세요.
            </GlassCard>
          )}

          <GlassCard className="p-5">
            <p className="text-xs leading-relaxed text-white/60">
              성공스토리는 실제 이용 고객의 공개 후기입니다. 서비스 경험과 만족하신 점을 자유롭게
              남겨 주세요. (샘플 · DB에 저장되지 않습니다)
            </p>
          </GlassCard>
        </div>
      </div>

      {writeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm">
          <GlassCard className="my-8 w-full max-w-lg p-5 md:p-6">
            <h3 className="text-lg font-bold text-white">후기 남기기</h3>
            <p className="mt-1 text-xs text-white/50">샘플 작성 · 실제 저장되지 않습니다.</p>
            <form onSubmit={submitWrite} className="mt-4 space-y-3">
              <select
                className={fieldClass}
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as SuccessStoryCategory })
                }
                required
              >
                {SUCCESS_STORY_CATEGORIES.filter((c) => c !== "전체").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                className={fieldClass}
                placeholder="작성자명"
                required
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
              <input
                className={fieldClass}
                placeholder="제목"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                className={fieldClass}
                rows={5}
                placeholder="후기 내용 (친절·성실, 물건 만족, 낙찰 성공 등)"
                required
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />

              {writeError ? <p className="text-xs text-red-300">{writeError}</p> : null}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setWriteOpen(false)}
                  className="flex-1 rounded-xl border border-white/15 py-3 text-sm font-bold text-white/70"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] py-3 text-sm font-bold text-[#1a1402] disabled:opacity-50"
                >
                  {submitting ? "등록 중…" : "등록하기"}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
}
