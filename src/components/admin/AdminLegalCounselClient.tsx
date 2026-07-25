"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ClipboardCopy,
  Loader2,
  Scale,
  Send,
  Sparkles,
  StopCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LEGAL_COUNSEL_DISCLAIMER } from "@/lib/legal-counsel/system-prompt";
import type { LegalCounselSource } from "@/lib/legal-counsel/types";
import {
  LEGAL_COUNSEL_PHASE2_TASKS,
  LEGAL_COUNSEL_PHASE3_TASKS,
} from "@/lib/mockup/legal-counsel-sample";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: LegalCounselSource[];
};

type Health = { gemini: boolean; lawOpenApi: boolean };

export function AdminLegalCounselClient() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [liveSources, setLiveSources] = useState<LegalCounselSource[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void fetch("/api/admin/legal-counsel/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Health) => setHealth(d))
      .catch(() => setHealth(null));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
  }

  async function send() {
    const message = input.trim();
    if (!message || streaming) return;

    setError("");
    setWarnings([]);
    setLiveSources([]);
    setInput("");
    const userMsg: ChatMsg = { id: `u-${Date.now()}`, role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setStreaming(true);
    setStreamText("");

    const history = [...messages, userMsg]
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/admin/legal-counsel/chat", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
        signal: ac.signal,
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `요청 실패 (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";
      let sources: LegalCounselSource[] = [];
      let finished = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const block of parts) {
          const line = block.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          let payload: {
            type?: string;
            text?: string;
            error?: string;
            sources?: LegalCounselSource[];
            warnings?: string[];
          };
          try {
            payload = JSON.parse(line.slice(6)) as typeof payload;
          } catch {
            continue;
          }

          if (payload.type === "meta") {
            sources = payload.sources ?? [];
            setLiveSources(sources);
            setWarnings(payload.warnings ?? []);
          } else if (payload.type === "delta" && payload.text) {
            full += payload.text;
            setStreamText(full);
          } else if (payload.type === "error") {
            throw new Error(payload.error || "오류");
          } else if (payload.type === "done") {
            finished = true;
            setMessages((prev) => [
              ...prev,
              {
                id: `a-${Date.now()}`,
                role: "assistant",
                content: full,
                sources,
              },
            ]);
            setStreamText("");
          }
        }
      }

      if (full && !finished) {
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: full, sources },
        ]);
        setStreamText("");
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        setStreamText((current) => {
          if (current) {
            setMessages((prev) => [
              ...prev,
              {
                id: `a-${Date.now()}`,
                role: "assistant",
                content: `${current}\n\n(중단됨)`,
                sources: liveSources,
              },
            ]);
          }
          return "";
        });
      } else {
        setError(e instanceof Error ? e.message : "상담 요청에 실패했습니다.");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  async function copyLast() {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return;
    await navigator.clipboard.writeText(last.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-headline-lg text-landing-text">
            <Scale className="h-6 w-6 text-[#a78bfa]" />
            법령전문상담
          </h1>
          <p className="mt-1 text-sm text-landing-muted">
            관리자 전용 · 국가법령정보센터 + Gemini ·{" "}
            <Link href="/admin/legal" className="text-[#4dabff] hover:underline">
              찬스상담소
            </Link>
            답변 초안용
          </p>
        </div>
        <button
          type="button"
          onClick={copyLast}
          disabled={!messages.some((m) => m.role === "assistant")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
        >
          <ClipboardCopy className="h-3.5 w-3.5" />
          {copied ? "복사됨" : "답변 복사"}
        </button>
      </div>

      {health && (
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span
            className={`rounded-full border px-2.5 py-1 ${
              health.gemini
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border-rose-400/30 bg-rose-500/10 text-rose-100"
            }`}
          >
            Gemini {health.gemini ? "OK" : "키 없음"}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 ${
              health.lawOpenApi
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border-amber-400/30 bg-amber-500/10 text-amber-100"
            }`}
          >
            법령 API {health.lawOpenApi ? "OK" : "OC 미설정"}
          </span>
        </div>
      )}

      <GlassCard className="p-3">
        <p className="text-[11px] leading-relaxed text-amber-100/85">{LEGAL_COUNSEL_DISCLAIMER}</p>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <GlassCard className="flex min-h-[520px] flex-col overflow-hidden p-0">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && !streaming && (
              <p className="text-sm text-slate-500">
                예: 근저당보다 전입이 빠른 임차인의 대항력과 배당·인수 관계는?
              </p>
            )}
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
                      AI 자문
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
            {error && <p className="mb-2 text-xs text-rose-300">{error}</p>}
            {warnings.length > 0 && (
              <ul className="mb-2 space-y-0.5 text-[10px] text-amber-200/70">
                {warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="질문 입력 · Enter 전송 · Shift+Enter 줄바꿈"
                className="min-h-[64px] flex-1 resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-[#4dabff]/50"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={stop}
                  className="inline-flex shrink-0 items-center gap-1 self-end rounded-xl border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-xs font-bold text-rose-100"
                >
                  <StopCircle className="h-3.5 w-3.5" />
                  중단
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void send()}
                  className="inline-flex shrink-0 items-center gap-1 self-end rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-3 py-2 text-xs font-bold text-white"
                >
                  <Send className="h-3.5 w-3.5" />
                  전송
                </button>
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="h-fit p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-sky-200">
            <BookOpen className="h-3.5 w-3.5" />
            이번 턴 참조
          </p>
          {liveSources.length === 0 ? (
            <p className="text-[11px] text-white/35">검색된 법령·판례가 여기 표시됩니다.</p>
          ) : (
            <ul className="space-y-2">
              {liveSources.map((s) => (
                <li
                  key={`${s.kind}-${s.title}`}
                  className="rounded-lg border border-white/10 bg-black/25 px-2.5 py-2 text-[11px]"
                >
                  <span className="text-[#a78bfa]">{s.kind}</span>
                  <p className="mt-0.5 font-semibold text-white">{s.title}</p>
                  <p className="text-white/40">{s.ref}</p>
                  {s.summary && <p className="mt-1 text-white/50">{s.summary}</p>}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <h2 className="text-base font-extrabold text-white">향후 확장 — 해야 할 일</h2>
        <p className="mt-1 text-xs text-white/45">
          Phase 1(현재) 이후 순차 진행 과제입니다.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
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
      </GlassCard>
    </div>
  );
}
