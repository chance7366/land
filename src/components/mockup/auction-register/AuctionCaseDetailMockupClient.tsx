"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  HS_15044_CASE_DETAIL,
  HS_15044_SUMMARY,
  formatWon,
  type CaseDetailSummaryFields,
} from "@/lib/mockup/auction-case-detail-sample";
import { cloneCaseDetail } from "@/lib/auction-case-detail";
import { CaseDetailSection } from "@/components/auction/CaseDetailSection";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#4dabff]/50 focus:ring-1 focus:ring-[#4dabff]/30";
const autoClass = `${inputClass} border-emerald-400/35 bg-emerald-500/[0.07]`;

export function AuctionCaseDetailMockupClient() {
  const [data] = useState(() => cloneCaseDetail(HS_15044_CASE_DETAIL));
  const [summary, setSummary] = useState<CaseDetailSummaryFields>(() => ({
    ...HS_15044_SUMMARY,
  }));
  const [autoFilled, setAutoFilled] = useState(true);
  const cls = autoFilled ? autoClass : inputClass;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 pb-20 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#d4bfff]/80">
          ADMIN SAMPLE · 물건상세
        </p>
        <h1 className="mt-2 text-3xl font-extrabold italic tracking-tight text-white md:text-4xl">
          경매물건 자동등록
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          <strong className="text-white">3. 물건상세</strong> 목업 · 운영 폼과 동일 컴포넌트.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2 text-[11px]">
        {["기본", "가격·기일", "물건상세", "현황조사서"].map((label, i) => (
          <span
            key={label}
            className={`rounded-full border px-2.5 py-1 ${
              i === 2
                ? "border-emerald-400/40 bg-emerald-500/15 font-semibold text-emerald-200"
                : "border-white/10 text-slate-500"
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <div className="space-y-5">
        <GlassCard className="p-5 opacity-80 md:p-6">
          <div className="mb-3 text-sm font-bold text-slate-300">1–2 기본 · 가격·기일 (요약)</div>
          <div className="grid gap-2 text-xs text-slate-400 md:grid-cols-3">
            <p>
              사건 <span className="text-slate-200">{data.basic.caseNumber}</span>
            </p>
            <p>
              감정가{" "}
              <span className="text-slate-200">{formatWon(data.item.appraisalPrice)}</span>
            </p>
            <p>
              최저가 <span className="text-slate-200">{formatWon(data.item.minPrice)}</span>
            </p>
          </div>
        </GlassCard>

        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              샘플 자동입력됨
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-[#d4bfff]" />
              운영 폼 적용본과 동일 UI
            </span>
            <button
              type="button"
              className="ml-auto text-[#d4bfff] underline-offset-2 hover:underline"
              onClick={() => {
                setSummary({ ...HS_15044_SUMMARY });
                setAutoFilled(true);
              }}
            >
              샘플 데이터 다시 채우기
            </button>
          </div>

          <CaseDetailSection n={3} data={data}>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block text-xs text-slate-400">
                전유면적 (㎡)
                <input
                  className={`mt-1 ${cls}`}
                  value={summary.exclusiveArea}
                  onChange={(e) => {
                    setSummary((s) => ({ ...s, exclusiveArea: e.target.value }));
                    setAutoFilled(false);
                  }}
                />
              </label>
              <label className="block text-xs text-slate-400">
                대지권 분모
                <input
                  className={`mt-1 ${cls}`}
                  value={summary.landRightDenom}
                  onChange={(e) => {
                    setSummary((s) => ({ ...s, landRightDenom: e.target.value }));
                    setAutoFilled(false);
                  }}
                />
              </label>
              <label className="block text-xs text-slate-400">
                대지권 분자
                <input
                  className={`mt-1 ${cls}`}
                  value={summary.landRightNumer}
                  onChange={(e) => {
                    setSummary((s) => ({ ...s, landRightNumer: e.target.value }));
                    setAutoFilled(false);
                  }}
                />
              </label>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label className="block text-xs text-slate-400">
                점유
                <input
                  className={`mt-1 ${cls}`}
                  value={summary.possessionNote}
                  onChange={(e) => {
                    setSummary((s) => ({ ...s, possessionNote: e.target.value }));
                    setAutoFilled(false);
                  }}
                />
              </label>
              <label className="block text-xs text-slate-400">
                임차관계
                <input
                  className={`mt-1 ${cls}`}
                  value={summary.leaseNote}
                  onChange={(e) => {
                    setSummary((s) => ({ ...s, leaseNote: e.target.value }));
                    setAutoFilled(false);
                  }}
                />
              </label>
              <label className="block text-xs text-slate-400">
                매수인 인수 권리
                <input
                  className={`mt-1 ${cls}`}
                  value={summary.assumeRightsNote}
                  onChange={(e) => {
                    setSummary((s) => ({ ...s, assumeRightsNote: e.target.value }));
                    setAutoFilled(false);
                  }}
                />
              </label>
            </div>
          </CaseDetailSection>
        </div>
      </div>
    </div>
  );
}
