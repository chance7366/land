"use client";

/**
 * 관리자 경매 수정 · 분석 리포트 일반/회원 분리 목업.
 * 운영 AuctionForm / API / DB에 반영됨 (참고용 목업).
 */

import { useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  AUCTION_REPORT_MODELS,
  GEMINI_FLASH_MODEL,
  type AuctionReportModelId,
} from "@/lib/auction-report-models";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-[#4dabff]/50";

const GENERAL_SECTIONS = [
  "1. 물건 기본 정보 및 물리적 하자 분석 (Overview)",
  "2. 심층 권리분석 (Risk Assessment)",
  "3. 적정 가치 평가",
] as const;

const MEMBER_SECTIONS = [
  "1. 물건 기본 정보 및 물리적 하자 분석 (Overview)",
  "2. 심층 권리분석 (Risk Assessment)",
  "3. 적정 가치 평가",
  "4. 입지분석 — Track A/B · 대시보드·5대 요소·총평",
  "5. 수익률 분석 (Valuation & Yield) — 상세 지침 대기 포함",
  "6. 명도 계획 및 출구 전략 (Exit Strategy) — 상세 지침 대기 포함",
  "7. 최종 결론 및 추천 입찰가 (Final Recommendation) — 상세 지침 대기 포함",
] as const;

const TEXT_MODELS = AUCTION_REPORT_MODELS.filter((m) => m.textReport);

function ModelSelect({
  id,
  value,
  disabled,
  onChange,
}: {
  id: string;
  value: AuctionReportModelId;
  disabled?: boolean;
  onChange: (v: AuctionReportModelId) => void;
}) {
  return (
    <div className="max-w-md">
      <label htmlFor={id} className="block text-xs text-slate-400">
        텍스트·PDF 분석 모델
        <select
          id={id}
          className={`${inputClass} mt-1`}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as AuctionReportModelId)}
        >
          {TEXT_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label} — {m.hint}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-1 text-[11px] text-slate-500">
        서류 슬롯의 PNG 등은{" "}
        <span className="text-slate-300">gemini-3-pro-image-preview</span>
        (Nano Banana Pro)로 먼저 읽고, PDF·본문 분석은 위에서 고른 모델로 진행합니다.
      </p>
    </div>
  );
}

function ReportTypeCard({
  kind,
  badge,
  title,
  subtitle,
  sections,
  model,
  onModelChange,
  generating,
  onGenerate,
  reportReady,
  viewLabel,
}: {
  kind: "general" | "member";
  badge: string;
  title: string;
  subtitle: string;
  sections: readonly string[];
  model: AuctionReportModelId;
  onModelChange: (v: AuctionReportModelId) => void;
  generating: boolean;
  onGenerate: () => void;
  reportReady: boolean;
  viewLabel: string;
}) {
  const accent =
    kind === "general"
      ? "from-sky-500/20 to-indigo-500/10 border-sky-400/25"
      : "from-violet-500/20 to-fuchsia-500/10 border-violet-400/25";
  const badgeCls =
    kind === "general"
      ? "bg-sky-500/20 text-sky-200 ring-sky-400/30"
      : "bg-violet-500/20 text-violet-200 ring-violet-400/30";

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 md:p-5 ${accent}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${badgeCls}`}
          >
            {badge}
          </span>
          <h3 className="mt-2 text-base font-bold text-white">{title}</h3>
          <p className="mt-0.5 text-[12px] text-slate-400">{subtitle}</p>
        </div>
        {reportReady ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> PDF 저장됨 (목업)
          </span>
        ) : (
          <span className="text-[11px] text-slate-500">저장된 리포트 없음</span>
        )}
      </div>

      <ol className="mt-3 list-decimal space-y-1 pl-5 text-[12px] leading-relaxed text-slate-300">
        {sections.map((s) => (
          <li key={s} className="pl-0.5 marker:text-slate-500">
            {s.replace(/^\d+\.\s*/, "")}
          </li>
        ))}
      </ol>

      <div className="mt-4">
        <ModelSelect
          id={`${kind}-model`}
          value={model}
          disabled={generating}
          onChange={onModelChange}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={generating}
          onClick={onGenerate}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {generating ? "리포트 생성 중…" : `${title} 생성`}
        </button>
        {reportReady ? (
          <a
            href="#mock-report"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-200 hover:bg-emerald-500/20"
            onClick={(e) => e.preventDefault()}
          >
            <ExternalLink className="h-4 w-4" />
            {viewLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function AdminReportTypesSample() {
  const [generalModel, setGeneralModel] =
    useState<AuctionReportModelId>(GEMINI_FLASH_MODEL);
  const [memberModel, setMemberModel] =
    useState<AuctionReportModelId>(GEMINI_FLASH_MODEL);
  const [genBusy, setGenBusy] = useState(false);
  const [memBusy, setMemBusy] = useState(false);
  const [generalReady, setGeneralReady] = useState(true);
  const [memberReady, setMemberReady] = useState(false);

  const simulate = (kind: "general" | "member") => {
    if (kind === "general") {
      setGenBusy(true);
      window.setTimeout(() => {
        setGenBusy(false);
        setGeneralReady(true);
      }, 1200);
    } else {
      setMemBusy(true);
      window.setTimeout(() => {
        setMemBusy(false);
        setMemberReady(true);
      }, 1600);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] px-4 py-10 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="mx-auto mb-6 max-w-5xl rounded-2xl border border-white/15 bg-[#1a2234]/90 px-5 py-4 text-sm shadow-lg backdrop-blur">
        <p className="font-bold text-white">분석 리포트 분리 · 관리자 목업</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[12.5px] leading-relaxed text-slate-400">
          <li>
            <strong className="text-sky-300">일반리포트</strong> — 섹션 1~3만 생성·관리
          </li>
          <li>
            <strong className="text-violet-300">회원리포트</strong> — 현행 풀 리포트(1~7) 그대로
          </li>
          <li>텍스트·PDF 분석 모델은 종류별로 <strong className="text-white">독립 선택</strong></li>
          <li>
            <strong className="text-emerald-300">운영 AuctionForm / API / DB에 적용 완료</strong>
            {" "}
            (Supabase 마이그레이션 007 필요)
          </li>
        </ul>
      </div>

      <div className="mx-auto max-w-5xl pb-16">
        <GlassCard className="p-5 md:p-6">
          <div className="mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4dabff] to-[#913dff] text-xs font-extrabold text-white">
              13
            </span>
            <div>
              <h2 className="text-base font-bold text-white">분석 리포트</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                DB 텍스트 + 서류 첨부(PDF/이미지) + 적정가치평가 슬롯(PNG/TXT/CSV)을 함께
                분석합니다. 일반/회원으로 분리 생성·관리합니다.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ReportTypeCard
              kind="general"
              badge="GENERAL"
              title="일반리포트"
              subtitle="공개·요약용 · 섹션 1~3"
              sections={GENERAL_SECTIONS}
              model={generalModel}
              onModelChange={setGeneralModel}
              generating={genBusy}
              onGenerate={() => simulate("general")}
              reportReady={generalReady}
              viewLabel="일반리포트 보기"
            />
            <ReportTypeCard
              kind="member"
              badge="MEMBER"
              title="회원리포트"
              subtitle="회원 전용 · 현행 풀 리포트(1~7)"
              sections={MEMBER_SECTIONS}
              model={memberModel}
              onModelChange={setMemberModel}
              generating={memBusy}
              onGenerate={() => simulate("member")}
              reportReady={memberReady}
              viewLabel="회원리포트 보기"
            />
          </div>
        </GlassCard>

        {/* 목록 관리 미리보기 */}
        <GlassCard className="mt-5 p-5 md:p-6">
          <h3 className="text-sm font-bold text-white">목록 관리 미리보기 (부록)</h3>
          <p className="mt-1 text-[11px] text-slate-500">
            경매 목록에서 두 URL을 배지로 구분하는 예시 — 실제 AdminAuctionList는 미수정
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-medium">사건번호</th>
                  <th className="px-3 py-2 font-medium">소재지</th>
                  <th className="px-3 py-2 font-medium">리포트</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                <tr className="border-t border-white/10">
                  <td className="px-3 py-2.5">2025타경8398</td>
                  <td className="px-3 py-2.5 text-slate-400">대구 동구 신천동 …</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold text-sky-200 ring-1 ring-sky-400/25">
                        일반 PDF
                      </span>
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-500 ring-1 ring-white/10">
                        회원 없음
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-3 py-2.5">2024타경1201</td>
                  <td className="px-3 py-2.5 text-slate-400">서울 강남구 …</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold text-sky-200 ring-1 ring-sky-400/25">
                        일반 PDF
                      </span>
                      <span className="rounded-md bg-violet-500/15 px-2 py-0.5 text-[11px] font-semibold text-violet-200 ring-1 ring-violet-400/25">
                        회원 PDF
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
