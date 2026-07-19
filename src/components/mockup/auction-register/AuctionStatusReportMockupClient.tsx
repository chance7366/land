"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  getFixtureById,
  type StatusReport,
} from "@/lib/mockup/auction-court-fixtures";
import { StatusReportSection } from "@/components/auction/StatusReportSection";

const DEMO_ID = "hs-15044-1";

function cloneStatus(report: StatusReport): StatusReport {
  return {
    ...report,
    leases: report.leases.map((l) => ({ ...l })),
  };
}

export function AuctionStatusReportMockupClient() {
  const fixture = useMemo(() => getFixtureById(DEMO_ID)!, []);
  const [report, setReport] = useState<StatusReport>(() =>
    cloneStatus(fixture.statusReport!),
  );
  const [autoFilled, setAutoFilled] = useState(true);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 pb-16 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#d4bfff]/80">
          ADMIN SAMPLE · 현황조사서
        </p>
        <h1 className="mt-2 text-3xl font-extrabold italic tracking-tight text-white md:text-4xl">
          경매물건 자동등록
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          1·2·3 섹션 다음에 붙는 <strong className="text-white">4. 현황조사서</strong> 입력 서식
          샘플입니다. 페이지 진입 시 홍성지원 2026타경15044 데이터가 채워진 상태로 보입니다.
        </p>
      </header>

      {/* progress */}
      <div className="mb-6 flex flex-wrap gap-2 text-[11px]">
        {["기본", "가격·기일", "물건상세", "현황조사서"].map((label, i) => (
          <span
            key={label}
            className={`rounded-full border px-2.5 py-1 ${
              i === 3
                ? "border-emerald-400/40 bg-emerald-500/15 font-semibold text-emerald-200"
                : "border-white/10 text-slate-500"
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <div className="space-y-5">
        {/* compact context: 1~3 */}
        <GlassCard className="p-5 md:p-6 opacity-80">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-300">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs">
              1–3
            </span>
            기본 · 가격기일 · 물건상세 (요약)
          </div>
          <div className="grid gap-2 text-xs text-slate-400 md:grid-cols-3">
            <p>
              사건{" "}
              <span className="text-slate-200">{fixture.caseNumber}</span>
            </p>
            <p>
              법원 <span className="text-slate-200">{fixture.court}</span>
            </p>
            <p>
              물건{" "}
              <span className="text-slate-200">
                {fixture.itemType} · {fixture.title}
              </span>
            </p>
            <p className="md:col-span-3">
              소재지{" "}
              <span className="text-slate-200">{fixture.parcels[0]?.address}</span>
            </p>
          </div>
        </GlassCard>

        {/* 4 Status report — full form */}
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              샘플 자동입력됨 (민트 테두리)
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-[#d4bfff]" />
              법원 팝업 서식과 동일 구조
            </span>
            <button
              type="button"
              className="ml-auto text-[#d4bfff] underline-offset-2 hover:underline"
              onClick={() => {
                setReport(cloneStatus(fixture.statusReport!));
                setAutoFilled(true);
              }}
            >
              샘플 데이터 다시 채우기
            </button>
          </div>
          <StatusReportSection
            n={4}
            report={report}
            autoFilled={autoFilled}
            onChange={(next) => {
              setReport(next);
              setAutoFilled(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
