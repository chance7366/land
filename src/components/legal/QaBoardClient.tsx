"use client";

import { useEffect, useMemo, useState } from "react";
import type { LegalQuestionStatus } from "@prisma/client";
import { CalendarDays, Lock, Pencil } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import { MobileBoardDetail } from "@/components/ui/MobileBoardDetail";
import {
  ANSWER_FOOTER,
  QA_CATEGORIES,
  QA_STATUS_META,
  consultHrefFromQaCategory,
  formatQaDate,
  maskAuthor,
} from "@/lib/qa";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#34d399] focus:outline-none";

export type QaListItem = {
  id: string;
  category: string;
  question: string;
  authorMasked: string;
  isSecret: boolean;
  status: LegalQuestionStatus;
  createdAt: string;
  hasAnswer: boolean;
};

type QaDetail = {
  id: string;
  category: string;
  question: string;
  content: string;
  authorMasked: string;
  isSecret: boolean;
  status: LegalQuestionStatus;
  createdAt: string;
  answer: string | null;
  answerer: string | null;
  answeredAt: string | null;
  suggestConsult: boolean;
  answerFooter: string;
};

function StatusBadge({ status }: { status: LegalQuestionStatus }) {
  const meta = QA_STATUS_META[status];
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

type Props = {
  initialItems: QaListItem[];
  initialOpenId?: string | null;
};

export function QaBoardClient({ initialItems, initialOpenId = null }: Props) {
  const [category, setCategory] = useState<(typeof QA_CATEGORIES)[number]>("전체");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(initialItems);
  const [selected, setSelected] = useState<QaDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [pwModal, setPwModal] = useState<QaListItem | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [writeOpen, setWriteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [writeError, setWriteError] = useState("");
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
        p.question.toLowerCase().includes(q) ||
        p.authorMasked.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [posts, category, query]);

  async function fetchDetail(id: string, accessCode?: string) {
    setLoadingDetail(true);
    try {
      const res = await fetch("/api/legal-questions/detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, accessCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "조회에 실패했습니다.");
      }
      setSelected(data as QaDetail);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "조회에 실패했습니다.";
      setPwError(message);
      return false;
    } finally {
      setLoadingDetail(false);
    }
  }

  async function openPost(post: QaListItem) {
    setPwError("");
    if (post.isSecret) {
      setPwModal(post);
      setPwInput("");
      return;
    }
    setPwModal(null);
    await fetchDetail(post.id);
  }

  async function confirmPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!pwModal) return;
    const ok = await fetchDetail(pwModal.id, pwInput);
    if (ok) setPwModal(null);
  }

  async function submitWrite(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setWriteError("");
    try {
      const res = await fetch("/api/legal-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.category,
          question: form.title,
          content: form.body,
          authorName: form.author,
          phone: form.phone || undefined,
          isSecret: form.isSecret,
          accessCode: form.isSecret ? form.password : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWriteError(data.error ?? "등록에 실패했습니다.");
        return;
      }

      const listRes = await fetch("/api/legal-questions");
      if (listRes.ok) {
        const list = (await listRes.json()) as QaListItem[];
        setPosts(list);
      } else {
        // 목록 갱신 실패 시에도 방금 등록한 글은 목록에 반영
        setPosts((prev) => [
          {
            id: data.id,
            category: data.category,
            question: data.question,
            authorMasked: maskAuthor(form.author.trim() || "익명"),
            isSecret: Boolean(data.isSecret),
            status: data.status,
            createdAt: new Date().toISOString(),
            hasAnswer: false,
          },
          ...prev.filter((p) => p.id !== data.id),
        ]);
      }

      const unlockCode = form.isSecret ? form.password : undefined;
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

      await fetchDetail(data.id, unlockCode);
    } catch {
      setWriteError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (initialOpenId) {
      const target = initialItems.find((p) => p.id === initialOpenId);
      if (target) void openPost(target);
      return;
    }
    // PC: 첫 공개글을 바로 열어 답변이 보이게. 모바일은 목록만 유지.
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      return;
    }
    const first = initialItems.find((p) => !p.isSecret);
    if (first) void openPost(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open once on mount
  }, [initialOpenId]);

  const mobileDetailOpen = Boolean(selected || loadingDetail);

  const detailBody = loadingDetail ? (
    <GlassCard className="flex h-48 items-center justify-center p-5 text-sm text-white/45">
      불러오는 중…
    </GlassCard>
  ) : selected ? (
    <GlassCard className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white/60">
          {selected.category}
        </span>
        <StatusBadge status={selected.status} />
      </div>
      <h2 className="mt-3 text-base font-bold text-white">{selected.question}</h2>
      <p className="mt-1 text-xs text-white/40">
        {selected.authorMasked} · {formatQaDate(selected.createdAt)}
      </p>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
        {selected.content}
      </p>

      {selected.answer ? (
        <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
          <p className="text-xs font-bold text-emerald-300">
            전문가 답변{selected.answerer ? ` · ${selected.answerer}` : ""}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-white/85">{selected.answer}</p>
          <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/50">
            {selected.answerFooter || ANSWER_FOOTER}
          </p>
          <Link
            href={consultHrefFromQaCategory(selected.category)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#6ee7b7] hover:underline"
          >
            방문/전화/출장 상담예약 →
          </Link>
        </div>
      ) : (
        <p className="mt-5 text-sm text-white/45">아직 답변이 등록되지 않았습니다.</p>
      )}
    </GlassCard>
  ) : (
    <GlassCard className="flex h-48 items-center justify-center p-5 text-sm text-white/45">
      목록에서 게시글을 선택하세요.
    </GlassCard>
  );

  return (
    <div className="mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8 md:py-14">
      <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-extrabold text-white md:text-4xl">찬스상담소</h1>
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
            <Pencil className="h-4 w-4 shrink-0" aria-hidden />
            질문 등록하기
          </button>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#34d399]/40 bg-[#34d399]/10 px-4 py-2.5 text-sm font-bold text-[#6ee7b7]"
          >
            <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
            상담예약 하기
          </Link>
        </div>
      </header>

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
        <div className={`space-y-2 lg:hidden ${mobileDetailOpen ? "hidden" : ""}`}>
          {filtered.length === 0 ? (
            <GlassCard className="p-8 text-center text-sm text-white/45">
              등록된 질문이 없습니다.
            </GlassCard>
          ) : (
            filtered.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => void openPost(post)}
                className={`w-full rounded-2xl border px-4 py-3.5 text-left transition ${
                  selected?.id === post.id
                    ? "border-[#34d399]/45 bg-[#34d399]/10"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white/50">{post.category}</span>
                  <StatusBadge status={post.status} />
                </div>
                <p className="mt-1.5 flex items-start gap-1.5 text-sm font-bold text-white">
                  {post.isSecret ? (
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/50" aria-hidden />
                  ) : null}
                  <span className="line-clamp-2">{post.question}</span>
                </p>
                <p className="mt-2 text-[11px] text-white/40">
                  {post.authorMasked} · {formatQaDate(post.createdAt)}
                </p>
              </button>
            ))
          )}
        </div>

        <GlassCard className="hidden overflow-hidden p-0 lg:block">
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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-white/45">
                      등록된 질문이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((post, index) => (
                    <tr
                      key={post.id}
                      className={`cursor-pointer border-t border-white/10 transition hover:bg-white/[0.04] ${
                        selected?.id === post.id ? "bg-[#34d399]/8" : ""
                      }`}
                      onClick={() => void openPost(post)}
                    >
                      <td className="px-3 py-3 font-mono text-xs text-white/45">
                        {filtered.length - index}
                      </td>
                      <td className="px-3 py-3 text-xs text-white/70">{post.category}</td>
                      <td className="px-3 py-3 font-semibold text-white">
                        <span className="inline-flex items-center gap-1.5">
                          {post.isSecret ? (
                            <Lock className="h-3.5 w-3.5 shrink-0 text-white/50" aria-hidden />
                          ) : null}
                          <span className="line-clamp-1">{post.question}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3 text-white/60">{post.authorMasked}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={post.status} />
                      </td>
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

        <div className="hidden space-y-4 lg:block">
          {detailBody}
          <GlassCard className="p-5">
            <p className="text-xs leading-relaxed text-white/60">
              찬스상담소는 부담 없는 소통 창구입니다. 더 정밀한 권리분석·현장 방문·대행이 필요하시면
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

      <MobileBoardDetail
        open={mobileDetailOpen}
        onClose={() => setSelected(null)}
        accentClassName="text-[#6ee7b7]"
      >
        {detailBody}
      </MobileBoardDetail>

      {pwModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <GlassCard className="w-full max-w-sm p-5">
            <h3 className="text-base font-bold text-white">비밀글 확인</h3>
            <p className="mt-1 text-xs text-white/50">작성 시 설정한 4자리 비밀번호를 입력하세요.</p>
            <form onSubmit={(e) => void confirmPassword(e)} className="mt-4 space-y-3">
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

      {writeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm">
          <GlassCard className="my-8 w-full max-w-lg p-5 md:p-6">
            <h3 className="text-lg font-bold text-white">질문 등록</h3>
            <form onSubmit={(e) => void submitWrite(e)} className="mt-4 space-y-3">
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
                  href={consultHrefFromQaCategory(form.category)}
                  className="mt-2 inline-block text-xs font-bold text-[#6ee7b7] hover:underline"
                >
                  1:1 맞춤 상담예약하기 →
                </Link>
              </div>

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
                  className="flex-[2] rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-3 text-sm font-bold text-white disabled:opacity-50"
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
