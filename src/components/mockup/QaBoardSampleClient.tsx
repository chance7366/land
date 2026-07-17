"use client";

import { useMemo, useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  ANSWER_FOOTER,
  MOCK_QA_POSTS,
  QA_CATEGORIES,
  QA_STATUS_META,
  type MockQaPost,
  type QaStatus,
} from "@/lib/mockup/qa-sample-data";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#34d399] focus:outline-none";

function StatusBadge({ status }: { status: QaStatus }) {
  const meta = QA_STATUS_META[status];
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function consultHref(category?: string) {
  if (!category || category === "전체") return "/consultation";
  const map: Record<string, string> = {
    "부동산 중개": "brokerage",
    "경매/권리분석": "auction",
    "세무/법률": "consulting",
  };
  const key = map[category];
  return key ? `/consultation?from=qa&category=${encodeURIComponent(category)}` : "/consultation";
}

/** 샘플: Q&A 게시판 + 상담예약 전환 */
export function QaBoardSampleClient() {
  const [category, setCategory] = useState<(typeof QA_CATEGORIES)[number]>("전체");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(MOCK_QA_POSTS);
  const [selected, setSelected] = useState<MockQaPost | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);
  const [pwModal, setPwModal] = useState<MockQaPost | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [writeOpen, setWriteOpen] = useState(false);
  const [form, setForm] = useState({
    category: "부동산 중개",
    author: "",
    phone: "",
    title: "",
    body: "",
    isSecret: false,
    password: "",
  });

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (category !== "전체" && p.category !== category) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q)
      );
    });
  }, [posts, category, query]);

  function openPost(post: MockQaPost) {
    if (post.isSecret && !unlockedIds.includes(post.id)) {
      setPwModal(post);
      setPwInput("");
      setPwError("");
      return;
    }
    setSelected(post);
  }

  function confirmPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!pwModal) return;
    if (pwInput !== pwModal.password) {
      setPwError("비밀번호가 일치하지 않습니다. (샘플: 1234 / 5678)");
      return;
    }
    setUnlockedIds((ids) => [...ids, pwModal.id]);
    setSelected(pwModal);
    setPwModal(null);
  }

  function submitWrite(e: React.FormEvent) {
    e.preventDefault();
    const nextId = Math.max(...posts.map((p) => p.id)) + 1;
    const title = form.isSecret
      ? form.title.startsWith("비밀글")
        ? form.title
        : `비밀글] ${form.title}`
      : form.title;
    const newPost: MockQaPost = {
      id: nextId,
      category: form.category,
      title,
      body: form.body,
      author: form.author.slice(0, 1) + "**",
      isSecret: form.isSecret,
      password: form.isSecret ? form.password || "0000" : undefined,
      status: "PENDING",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPosts((prev) => [newPost, ...prev]);
    setWriteOpen(false);
    setForm({
      category: "부동산 중개",
      author: "",
      phone: "",
      title: "",
      body: "",
      isSecret: false,
      password: "",
    });
    if (newPost.isSecret) {
      setUnlockedIds((ids) => [...ids, newPost.id]);
    }
    setSelected(newPost);
  }

  return (
    <div className="mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8 md:py-14">
      {/* Banner */}
      <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-wide text-[#6ee7b7]">Q & A</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white md:text-4xl">질의응답</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            부동산 중개·경매·세무·법률 등 궁금하신 점을 편하게 남겨주시면 전문가가 명쾌하게
            답변해 드립니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setWriteOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cta-from to-cta-to px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(37,99,236,0.25)]"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            질문 등록하기
          </button>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#34d399]/40 bg-[#34d399]/10 px-4 py-2.5 text-sm font-bold text-[#6ee7b7]"
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            상담예약 하기
          </Link>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {QA_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                category === c
                  ? "border-[#34d399]/50 bg-[#34d399]/15 text-[#6ee7b7]"
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
        {/* List */}
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-white/5 text-xs text-white/45">
                <tr>
                  <th className="px-3 py-3 font-semibold">번호</th>
                  <th className="px-3 py-3 font-semibold">카테고리</th>
                  <th className="px-3 py-3 font-semibold">제목</th>
                  <th className="px-3 py-3 font-semibold">작성자</th>
                  <th className="px-3 py-3 font-semibold">상태</th>
                  <th className="px-3 py-3 font-semibold">등록일</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr
                    key={post.id}
                    className={`cursor-pointer border-t border-white/10 transition hover:bg-white/[0.04] ${
                      selected?.id === post.id ? "bg-[#34d399]/8" : ""
                    }`}
                    onClick={() => openPost(post)}
                  >
                    <td className="px-3 py-3 font-mono text-xs text-white/45">{post.id}</td>
                    <td className="px-3 py-3 text-xs text-white/70">{post.category}</td>
                    <td className="px-3 py-3 font-semibold text-white">
                      <span className="inline-flex items-center gap-1.5">
                        {post.isSecret ? (
                          <span className="material-symbols-outlined text-sm text-white/50" aria-hidden>
                            lock
                          </span>
                        ) : null}
                        <span className="line-clamp-1">{post.title}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3 text-white/60">{post.author}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-3 py-3 text-xs text-white/45">{post.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Detail */}
        <div className="space-y-4">
          {selected ? (
            <GlassCard className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white/60">
                  {selected.category}
                </span>
                <StatusBadge status={selected.status} />
              </div>
              <h2 className="mt-3 text-base font-bold text-white">{selected.title}</h2>
              <p className="mt-1 text-xs text-white/40">
                {selected.author} · {selected.createdAt}
              </p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                {selected.body}
              </p>

              {selected.answer ? (
                <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                  <p className="text-xs font-bold text-emerald-300">전문가 답변</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-white/85">
                    {selected.answer.body}
                  </p>
                  <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/50">
                    {ANSWER_FOOTER}
                  </p>
                  {(selected.answer.suggestConsult || true) && (
                    <Link
                      href={consultHref(selected.category)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#6ee7b7] hover:underline"
                    >
                      방문/전화/출장 상담예약 →
                    </Link>
                  )}
                </div>
              ) : (
                <p className="mt-5 text-sm text-white/45">아직 답변이 등록되지 않았습니다.</p>
              )}
            </GlassCard>
          ) : (
            <GlassCard className="flex h-48 items-center justify-center p-5 text-sm text-white/45">
              목록에서 게시글을 선택하세요.
            </GlassCard>
          )}

          <GlassCard className="p-5">
            <p className="text-xs leading-relaxed text-white/60">
              Q&A는 부담 없는 소통 창구입니다. 더 정밀한 권리분석·현장 방문·대행이 필요하시면
              상담예약을 이용해 주세요.
            </p>
            <Link
              href="/consultation"
              className="mt-3 inline-flex rounded-xl border border-[#34d399]/35 bg-[#34d399]/10 px-3 py-2 text-xs font-bold text-[#6ee7b7]"
            >
              1:1 맞춤 상담예약하기
            </Link>
          </GlassCard>
        </div>
      </div>

      {/* Password modal */}
      {pwModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <GlassCard className="w-full max-w-sm p-5">
            <h3 className="text-base font-bold text-white">비밀글 확인</h3>
            <p className="mt-1 text-xs text-white/50">작성 시 설정한 4자리 비밀번호를 입력하세요.</p>
            <form onSubmit={confirmPassword} className="mt-4 space-y-3">
              <input
                className={fieldClass}
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="비밀번호"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                autoFocus
              />
              {pwError ? <p className="text-xs text-red-300">{pwError}</p> : null}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPwModal(null)}
                  className="flex-1 rounded-xl border border-white/15 py-2.5 text-sm font-bold text-white/70"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-2.5 text-sm font-bold text-white"
                >
                  확인
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      ) : null}

      {/* Write modal */}
      {writeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm">
          <GlassCard className="my-8 w-full max-w-lg p-5 md:p-6">
            <h3 className="text-lg font-bold text-white">질문 등록</h3>
            <form onSubmit={submitWrite} className="mt-4 space-y-3">
              <select
                className={fieldClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                {QA_CATEGORIES.filter((c) => c !== "전체").map((c) => (
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
                placeholder="연락처 (비공개 · 답변 알림용)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                placeholder="질문 내용"
                required
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
              <label className="flex items-center gap-2 text-xs text-white/65">
                <input
                  type="checkbox"
                  checked={form.isSecret}
                  onChange={(e) => setForm({ ...form, isSecret: e.target.checked })}
                  className="accent-[#34d399]"
                />
                비공개(비밀글)로 설정
              </label>
              {form.isSecret ? (
                <input
                  className={fieldClass}
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="비밀글 비밀번호 4자리"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              ) : null}

              <div className="rounded-xl border border-[#34d399]/25 bg-[#34d399]/8 p-3">
                <p className="text-xs text-white/65">
                  더 정밀한 권리분석이나 현장 방문/대행이 필요하신가요?
                </p>
                <Link
                  href={consultHref(form.category)}
                  className="mt-2 inline-block text-xs font-bold text-[#6ee7b7] hover:underline"
                >
                  1:1 맞춤 상담예약하기 →
                </Link>
              </div>

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
                  className="flex-[2] rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-3 text-sm font-bold text-white"
                >
                  등록하기 (샘플)
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
}
