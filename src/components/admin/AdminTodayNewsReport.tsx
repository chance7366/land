"use client";

/**
 * 관리자 — 오늘의 뉴스 HTML 보고서 (인쇄 · 다시 생성)
 */

import { useCallback, useState } from "react";
import { ArrowLeft, Loader2, Printer, RefreshCw } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { navigateTo } from "@/lib/navigate";

type Props = {
  dateKey: string;
  articleHtml: string;
  hasReport: boolean;
  articleCountHint?: number | null;
};

export function AdminTodayNewsReport({
  dateKey,
  articleHtml,
  hasReport,
  articleCountHint,
}: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleRegenerate = useCallback(async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/news-feed/today-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateKey }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        reportUrl?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "보고서 생성에 실패했습니다.");
        return;
      }
      navigateTo(data.reportUrl ?? `/admin/news/today-report?date=${dateKey}&t=${Date.now()}`);
    } catch {
      setError("네트워크 오류로 생성에 실패했습니다.");
    } finally {
      setGenerating(false);
    }
  }, [dateKey]);

  return (
    <div className="min-h-screen bg-[#D8D4CE] font-[family-name:var(--font-unifine),Pretendard,Noto_Sans_KR,sans-serif] text-[#2F2F2F] print:bg-white">
      <div className="mx-auto flex max-w-[794px] flex-wrap items-center justify-between gap-3 px-4 py-4 print:hidden">
        <Link
          href="/admin/news"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3D342C]/80 hover:text-[#3D342C]"
        >
          <ArrowLeft className="h-4 w-4" />
          부동산 소식으로
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#6B5344]/15 px-3 py-1 text-[11px] font-bold text-[#6B5344]">
            {dateKey}
            {articleCountHint != null ? ` · ${articleCountHint}건` : ""}
          </span>
          <button
            type="button"
            disabled={generating}
            onClick={() => void handleRegenerate()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#6B5344]/25 bg-white px-4 py-2.5 text-sm font-bold text-[#3D342C] shadow-sm hover:bg-[#F7E8D8] disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {generating ? "생성 중…" : hasReport ? "다시 생성" : "보고서 생성"}
          </button>
          {hasReport ? (
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#6B5344] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#5a4638]"
            >
              <Printer className="h-4 w-4" />
              인쇄
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="mx-auto mb-3 max-w-[794px] px-4 text-center text-sm text-red-700 print:hidden">
          {error}
        </p>
      ) : null}

      {hasReport ? (
        <article
          className="chance-today-news relative mx-auto mb-12 w-full max-w-[794px] bg-white px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/5 sm:px-10 print:mb-0 print:shadow-none print:ring-0"
          dangerouslySetInnerHTML={{ __html: articleHtml }}
        />
      ) : (
        <div className="mx-auto max-w-[794px] rounded-2xl bg-white px-8 py-12 text-center shadow-sm">
          <h1 className="text-lg font-bold text-[#3D342C]">저장된 보고서가 없습니다</h1>
          <p className="mt-2 text-sm text-[#6B5344]/90">
            「보고서 생성」을 누르면 당일(네이버·부동산114·부동산테크) 기사를 Gemini로 요약합니다.
          </p>
          <Link
            href="/admin/news"
            className="mt-4 inline-block text-sm text-[#4dabff] hover:underline"
          >
            수집 모니터에서 기사 수집하기
          </Link>
        </div>
      )}
    </div>
  );
}
