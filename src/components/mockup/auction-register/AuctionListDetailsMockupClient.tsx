"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataTable } from "@/components/ui/DataTable";
import { ListDetailsPanel } from "@/components/mockup/auction-register/ListDetailsPanel";
import {
  LIST_DETAILS_SAMPLES,
  type AuctionListDetailsSample,
} from "@/lib/mockup/auction-list-details-sample";

const STEP_LABELS = ["기본정보", "기일 내역", "목록 내역", "물건상세", "현황조사서"];

export function AuctionListDetailsMockupClient() {
  const [sample, setSample] = useState<AuctionListDetailsSample>(LIST_DETAILS_SAMPLES[0]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 pb-20 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#d4bfff]/80">
          ADMIN SAMPLE · 목록내역
        </p>
        <h1 className="mt-2 text-3xl font-extrabold italic tracking-tight text-white md:text-4xl">
          경매물건 자동등록
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          법원 사건상세(PGJ151F00){" "}
          <strong className="text-white">목록내역</strong>을{" "}
          <strong className="text-white">3. 목록 내역</strong> 섹션으로 둔 목업입니다.
          1건·다건 모두 동일 표로 표시하며, 운영 폼에는 아직 적용하지 않았습니다.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2 text-[11px]">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`rounded-full border px-2.5 py-1 ${
              i === 2
                ? "border-emerald-400/40 bg-emerald-500/15 font-semibold text-emerald-200"
                : i < 2
                  ? "border-white/15 text-slate-400"
                  : "border-white/10 text-slate-600"
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {LIST_DETAILS_SAMPLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSample(s)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              sample.id === s.id
                ? "border-[#4dabff]/50 bg-[#4dabff]/15 font-semibold text-white"
                : "border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200"
            }`}
          >
            {s.label}
            <span className="ml-1.5 text-slate-500">{s.rows.length}건</span>
          </button>
        ))}
      </div>

      <div className="space-y-5">
        <GlassCard className="p-5 opacity-50 md:p-6">
          <SectionHead n={1} title="기본정보" hint="목업 맥락 · 생략" />
          <p className="text-sm text-slate-500">물건기본정보 표 (기존 섹션)</p>
        </GlassCard>

        <GlassCard className="p-5 opacity-50 md:p-6">
          <SectionHead n={2} title="기일 내역" hint="목업 맥락 · 생략" />
          <DataTable maxHeight="120px">
            <table className="w-full text-left text-xs text-[#cbd5e1]">
              <thead>
                <tr className="bg-[#0B0F19]/90">
                  <th className="px-3 py-2">기일</th>
                  <th className="px-3 py-2">구분</th>
                  <th className="px-3 py-2">최저매각가격</th>
                  <th className="px-3 py-2">결과</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/5">
                  <td className="px-3 py-2 text-slate-500" colSpan={4}>
                    기일내역 표 (기존 섹션)
                  </td>
                </tr>
              </tbody>
            </table>
          </DataTable>
        </GlassCard>

        <GlassCard className="p-5 md:p-6 ring-1 ring-[#4dabff]/25">
          <SectionHead
            n={3}
            title="목록 내역"
            hint={`법원 목록내역 · ${sample.itemType} · ${sample.hint}`}
          />
          <p className="mb-3 text-[11px] text-slate-500">
            샘플 사건{" "}
            <span className="text-slate-300">{sample.caseNumber}</span>
            {" · "}
            수집 DOM{" "}
            <code className="text-[#4dabff]/80">#mf_wfm_mainFrame_grp_lstDtsLimtMin</code>
          </p>
          <ListDetailsPanel rows={sample.rows} showSourceHint />
        </GlassCard>
      </div>
    </div>
  );
}

function SectionHead({
  n,
  title,
  hint,
}: {
  n: number;
  title: string;
  hint: string;
}) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4dabff] to-[#913dff] text-xs font-extrabold text-white">
        {n}
      </span>
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>
      </div>
    </div>
  );
}
