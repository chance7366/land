"use client";

/**
 * 법령전문상담 목업 — Phase 1 운영: /admin/legal-counsel
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CircleHelp,
  ClipboardCopy,
  Gavel,
  Loader2,
  Scale,
  Send,
  Sparkles,
  StopCircle,
} from "lucide-react";
import {
  LEGAL_COUNSEL_PHASE1_CHECKLIST,
  LEGAL_COUNSEL_PHASE2_TASKS,
  LEGAL_COUNSEL_PHASE3_TASKS,
  LEGAL_COUNSEL_SAMPLE_ANSWER,
  LEGAL_COUNSEL_SAMPLE_QUERY,
  LEGAL_COUNSEL_SAMPLE_SOURCES,
  type CounselMessage,
} from "@/lib/mockup/legal-counsel-sample";

const panel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

const NAV_MOCK = [
  { label: "상담 예약", active: false },
  { label: "찬스상담소", active: false, href: "/admin/legal" },
  { label: "법령전문상담", active: true },
] as const;

export function LegalCounselSample() {
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<CounselMessage[]>([
    {
      id: "u1",
      role: "user",
      content: LEGAL_COUNSEL_SAMPLE_QUERY,
    },
    {
      id: "a1",
      role: "assistant",
      content: LEGAL_COUNSEL_SAMPLE_ANSWER,
      sources: [...LEGAL_COUNSEL_SAMPLE_SOURCES],
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function stopStream() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setStreaming(false);
  }

  function runMockStream(question: string) {
    const userMsg: CounselMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);
    setStreamText("");

    const full = LEGAL_COUNSEL_SAMPLE_ANSWER;
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 12;
      if (i >= full.length) {
        setStreamText(full);
        stopStream();
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            content: full,
            sources: [...LEGAL_COUNSEL_SAMPLE_SOURCES],
          },
        ]);
        setStreamText("");
        return;
      }
      setStreamText(full.slice(0, i));
    }, 28);
  }

  function handleSend() {
    const q = input.trim() || LEGAL_COUNSEL_SAMPLE_QUERY;
    if (streaming) return;
    runMockStream(q);
  }

  async function copyLastAssistant() {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return;
    try {
      await navigator.clipboard.writeText(last.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="border-b border-emerald-400/30 bg-[#0a1210] px-4 py-3 text-center text-xs text-emerald-100/90">
        <p className="font-bold text-emerald-50">법령전문상담 목업 — Phase 1 운영 적용됨</p>
        <p className="mt-1 text-[11px] text-emerald-100/70">
          실제: /admin/legal-counsel · 법령 API + Gemini 스트리밍 · 하단 Phase 2/3 로드맵
        </p>
        <p className="mt-1.5 flex flex-wrap justify-center gap-3 text-[11px]">
          <Link href="/admin/legal-counsel" className="font-semibold text-[#c4b5fd] underline-offset-2 hover:underline">
            관리자 법령전문상담 →
          </Link>
          <Link href="/admin/legal" className="text-white/40 underline-offset-2 hover:underline">
            찬스상담소
          </Link>
        </p>
      </div>

      <div className="mx-auto flex max-w-[1280px] gap-4 px-4 py-5 md:px-6">
        {/* Mini sidebar mock */}
        <aside className={`${panel} hidden w-56 shrink-0 p-3 md:block`}>
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-wider text-white/35">
            관리자 내비 (목업)
          </p>
          <ul className="space-y-1">
            {NAV_MOCK.map((item) => (
              <li key={item.label}>
                <div
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${
                    item.active
                      ? "bg-gradient-to-r from-[#4dabff]/25 to-[#913dff]/25 font-bold text-white"
                      : "text-white/50"
                  }`}
                >
                  {item.label === "찬스상담소" ? (
                    <CircleHelp className="h-3.5 w-3.5" />
                  ) : item.label === "법령전문상담" ? (
                    <Scale className="h-3.5 w-3.5" />
                  ) : (
                    <Gavel className="h-3.5 w-3.5" />
                  )}
                  {item.label}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 px-2 text-[10px] leading-relaxed text-white/30">
            실제 적용 시 AdminSidebar에 「법령전문상담」을 찬스상담소 바로 아래에 추가합니다.
          </p>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className={`${panel} p-4`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="flex items-center gap-2 text-lg font-extrabold text-white">
                  <Scale className="h-5 w-5 text-[#a78bfa]" />
                  법령전문상담
                </h1>
                <p className="mt-1 text-xs text-white/45">
                  관리자 전용 · 국가법령정보센터 + Gemini RAG · 찬스상담소 답변 초안용
                </p>
              </div>
              <button
                type="button"
                onClick={copyLastAssistant}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
              >
                <ClipboardCopy className="h-3.5 w-3.5" />
                {copied ? "복사됨" : "답변 복사"}
              </button>
            </div>
            <p className="mt-3 rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-100/85">
              본 AI 답변은 공공 데이터·생성형 AI 참고 자료이며, 고객 답변·계약·입찰 전 담당
              공인중개사의 최종 검토가 필요합니다. (목업 — API 미연동)
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            {/* Chat */}
            <div className={`${panel} flex min-h-[480px] flex-col`}>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-[#4dabff]/30 to-[#913dff]/30 text-white"
                          : "border border-white/10 bg-black/30 text-slate-200"
                      }`}
                    >
                      {m.role === "assistant" && (
                        <p className="mb-2 flex items-center gap-1 text-[10px] font-bold text-[#c4b5fd]">
                          <Sparkles className="h-3 w-3" />
                          AI 자문 (시뮬레이션)
                        </p>
                      )}
                      {m.content}
                    </div>
                  </div>
                ))}
                {streaming && streamText && (
                  <div className="flex justify-start">
                    <div className="max-w-[92%] rounded-2xl border border-[#4dabff]/30 bg-black/30 px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
                      <p className="mb-2 flex items-center gap-1 text-[10px] font-bold text-sky-300">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        스트리밍 중…
                      </p>
                      {streamText}
                      <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[#4dabff]" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-white/10 p-3">
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="질문을 입력하세요 (Enter 전송 · Shift+Enter 줄바꿈). 비우면 샘플 질의로 시뮬레이션합니다."
                    className="min-h-[64px] flex-1 resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-[#4dabff]/50"
                  />
                  {streaming ? (
                    <button
                      type="button"
                      onClick={stopStream}
                      className="inline-flex shrink-0 items-center gap-1 self-end rounded-xl border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-xs font-bold text-rose-100"
                    >
                      <StopCircle className="h-3.5 w-3.5" />
                      중단
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSend}
                      className="inline-flex shrink-0 items-center gap-1 self-end rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-3 py-2 text-xs font-bold text-white"
                    >
                      <Send className="h-3.5 w-3.5" />
                      전송
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sources + phase1 */}
            <div className="space-y-3">
              <div className={`${panel} p-3`}>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-sky-200">
                  <BookOpen className="h-3.5 w-3.5" />
                  이번 턴 참조 (목업)
                </p>
                <ul className="space-y-2">
                  {LEGAL_COUNSEL_SAMPLE_SOURCES.map((s) => (
                    <li
                      key={s.title}
                      className="rounded-lg border border-white/10 bg-black/25 px-2.5 py-2 text-[11px]"
                    >
                      <span className="text-[#a78bfa]">{s.kind}</span>
                      <p className="mt-0.5 font-semibold text-white">{s.title}</p>
                      <p className="text-white/40">{s.ref}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${panel} p-3`}>
                <p className="mb-2 text-xs font-bold text-emerald-200">Phase 1 (구현 예정)</p>
                <ul className="space-y-1.5 text-[11px] text-white/60">
                  {LEGAL_COUNSEL_PHASE1_CHECKLIST.map((t) => (
                    <li key={t} className="flex gap-1.5">
                      <span className="text-emerald-400/80">○</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Future roadmap — bottom of page */}
          <section className={`${panel} p-5`}>
            <h2 className="text-base font-extrabold text-white">향후 확장 — 해야 할 일</h2>
            <p className="mt-1 text-xs text-white/45">
              Phase 1 적용 후에도 순차 진행할 과제입니다. 본 목업에는 표시만 하며 운영에 반영하지 않습니다.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-sky-400/20 bg-sky-500/[0.06] p-4">
                <p className="text-sm font-bold text-sky-100">Phase 2 · RAG 고도화</p>
                <ul className="mt-3 space-y-3">
                  {LEGAL_COUNSEL_PHASE2_TASKS.map((t) => (
                    <li key={t.title} className="text-[12px]">
                      <p className="font-semibold text-white/90">{t.title}</p>
                      <p className="mt-0.5 leading-relaxed text-white/45">{t.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-violet-400/20 bg-violet-500/[0.06] p-4">
                <p className="text-sm font-bold text-violet-100">Phase 3 · 기관·멀티모달 확장</p>
                <ul className="mt-3 space-y-3">
                  {LEGAL_COUNSEL_PHASE3_TASKS.map((t) => (
                    <li key={t.title} className="text-[12px]">
                      <p className="font-semibold text-white/90">{t.title}</p>
                      <p className="mt-0.5 leading-relaxed text-white/45">{t.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-[11px] text-white/40">
              사용자 준비 사항(운영): 국가법령정보센터 OC 키 · Vercel/로컬 env · Gemini 할당량 ·
              (Phase 2+) 국토부·협회 데이터 활용신청
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
