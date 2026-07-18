"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MobileBoardDetail } from "@/components/ui/MobileBoardDetail";
import {
  SUCCESS_STORY_CATEGORIES,
  SUCCESS_STORY_WRITE_CATEGORIES,
  formatStoryDate,
  type SuccessStoryCategory,
  type SuccessStoryCategoryFilter,
} from "@/lib/success-story";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#fbbf24] focus:outline-none";

export type SuccessStoryListItem = {
  id: string;
  category: string;
  title: string;
  content: string;
  authorMasked: string;
  createdAt: string;
};

type Props = {
  initialItems: SuccessStoryListItem[];
  initialOpenId?: string | null;
};

export function SuccessStoryBoardClient({ initialItems, initialOpenId = null }: Props) {
  const [category, setCategory] = useState<SuccessStoryCategoryFilter>("전체");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(initialItems);
  /** 모바일에서는 자동 선택하면 상세가 바로 전체화면으로 떠서, 진입 시에는 목록만 보이게 함 */
  const [selectedId, setSelectedId] = useState<string | null>(initialOpenId ?? null);
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

  const mobileDetailOpen = Boolean(selected);

  const detailBody = selected ? (
    <GlassCard className="p-5">
      <span className="rounded-full border border-[#fbbf24]/35 bg-[#fbbf24]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#fde68a]">
        {selected.category}
      </span>
      <h2 className="mt-3 text-base font-bold text-white">{selected.title}</h2>
      <p className="mt-1 text-xs text-white/40">
        {selected.authorMasked} · {formatStoryDate(selected.createdAt)}
      </p>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
        {selected.content}
      </p>
    </GlassCard>
  ) : (
    <GlassCard className="flex h-48 items-center justify-center p-5 text-sm text-white/45">
      목록에서 후기를 선택하세요.
    </GlassCard>
  );

  async function submitWrite(e: React.FormEvent) {
    e.preventDefault();
    setWriteError("");
    if (!form.author.trim() || !form.title.trim() || !form.body.trim()) {
      setWriteError("필수 항목을 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/success-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.category,
          authorName: form.author.trim(),
          title: form.title.trim(),
          content: form.body.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWriteError(data.error ?? "등록에 실패했습니다.");
        return;
      }
      const item = data as SuccessStoryListItem;
      setPosts((prev) => [item, ...prev]);
      setSelectedId(item.id);
      setForm({ category: "부동산중개", author: "", title: "", body: "" });
      setWriteOpen(false);
    } catch {
      setWriteError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8 md:py-14">
      <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-extrabold text-white md:text-4xl">성공스토리</h1>
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
        <div className={`space-y-2 lg:hidden ${mobileDetailOpen ? "hidden" : ""}`}>
          {filtered.length === 0 ? (
            <GlassCard className="p-8 text-center text-sm text-white/45">
              등록된 후기가 없습니다.
            </GlassCard>
          ) : (
            filtered.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setSelectedId(post.id)}
                className={`w-full rounded-2xl border px-4 py-3.5 text-left transition ${
                  selected?.id === post.id
                    ? "border-[#fbbf24]/45 bg-[#fbbf24]/10"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20"
                }`}
              >
                <span className="text-[11px] font-semibold text-[#fde68a]/80">{post.category}</span>
                <p className="mt-1.5 line-clamp-2 text-sm font-bold text-white">{post.title}</p>
                <p className="mt-2 text-[11px] text-white/40">
                  {post.authorMasked} · {formatStoryDate(post.createdAt)}
                </p>
              </button>
            ))
          )}
        </div>

        <GlassCard className="hidden overflow-hidden p-0 lg:block">
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
                        {formatStoryDate(post.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="hidden space-y-4 lg:block">
          {detailBody}
          <GlassCard className="p-5">
            <p className="text-xs leading-relaxed text-white/60">
              성공스토리는 실제 이용 고객의 공개 후기입니다. 서비스 경험과 만족하신 점을 자유롭게
              남겨 주세요.
            </p>
          </GlassCard>
        </div>
      </div>

      <MobileBoardDetail
        open={mobileDetailOpen}
        onClose={() => setSelectedId(null)}
        accentClassName="text-[#fde68a]"
      >
        {detailBody}
      </MobileBoardDetail>

      {writeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm">
          <GlassCard className="my-8 w-full max-w-lg p-5 md:p-6">
            <h3 className="text-lg font-bold text-white">후기 남기기</h3>
            <form onSubmit={(e) => void submitWrite(e)} className="mt-4 space-y-3">
              <select
                className={fieldClass}
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as SuccessStoryCategory })
                }
                required
              >
                {SUCCESS_STORY_WRITE_CATEGORIES.map((c) => (
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
