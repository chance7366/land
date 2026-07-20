"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataTable } from "@/components/ui/DataTable";
import {
  BASIC_INFO_SAMPLES,
  formatWon,
  type AuctionBasicInfoSample,
} from "@/lib/mockup/auction-basic-info-sample";
import { BasicPropertyInfoPanel } from "@/components/mockup/auction-register/BasicPropertyInfoPanel";

export function AuctionBasicInfoMockupClient() {
  const [sample, setSample] = useState<AuctionBasicInfoSample>(BASIC_INFO_SAMPLES[0]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 pb-20 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#d4bfff]/80">
          ADMIN SAMPLE · 물건기본정보
        </p>
        <h1 className="mt-2 text-3xl font-extrabold italic tracking-tight text-white md:text-4xl">
          경매물건 자동등록
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          법원 사건검색 결과의{" "}
          <strong className="text-white">물건기본정보</strong> 서식으로{" "}
          <strong className="text-white">1·2 섹션</strong>을 재구성한 목업입니다.
          운영 폼에는 아직 적용하지 않았습니다.{" "}
          <span className="text-slate-500">
            기일내역 표는 기존과 동일하게 유지합니다.
          </span>
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2 text-[11px]">
        {["기본정보", "기일 내역", "물건상세", "현황조사서"].map((label, i) => (
          <span
            key={label}
            className={`rounded-full border px-2.5 py-1 ${
              i <= 1
                ? "border-emerald-400/40 bg-emerald-500/15 font-semibold text-emerald-200"
                : "border-white/10 text-slate-500"
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {/* 물건종류별 샘플 전환 */}
      <div className="mb-5 flex flex-wrap gap-2">
        {BASIC_INFO_SAMPLES.map((s) => (
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
            <span className="ml-1.5 text-slate-500">{s.caseNumber}</span>
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {/* 1 · 물건기본정보 (법원 서식) */}
        <GlassCard className="p-5 md:p-6">
          <div className="mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4dabff] to-[#913dff] text-xs font-extrabold text-white">
              1
            </span>
            <div>
              <h2 className="text-base font-bold text-white">기본정보</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                법원 물건기본정보 표 구조 · 목록 소재지 {sample.locations.length}건
              </p>
            </div>
          </div>
          <BasicPropertyInfoPanel data={sample} showSourceHint />
        </GlassCard>

        {/* 2 · 가격은 상단 표에 포함, 기일표만 유지 */}
        <GlassCard className="p-5 md:p-6">
          <div className="mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4dabff] to-[#913dff] text-xs font-extrabold text-white">
              2
            </span>
            <div>
              <h2 className="text-base font-bold text-white">기일 내역</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                감정가·최저가·보증금·청구금액·입찰방법·매각기일은 위 물건기본정보에 통합 ·
                아래 기일내역 표는 기존 유지
              </p>
            </div>
          </div>

          <p className="mb-3 text-[11px] text-slate-500">
            참고 · 현재 최저가{" "}
            <span className="text-slate-300">{formatWon(sample.minPrice)}</span>
            {sample.appraisalPrice > 0 && sample.minPrice > 0 && (
              <>
                {" "}
                · 감정가 대비{" "}
                <span className="text-slate-300">
                  {Math.round((sample.minPrice / sample.appraisalPrice) * 100)}%
                </span>
              </>
            )}
          </p>

          {sample.schedule.length > 0 && (
            <DataTable maxHeight="240px">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#0B0F19]/90">
                    <th className="px-3 py-2">기일</th>
                    <th className="px-3 py-2">종류</th>
                    <th className="px-3 py-2">최저가</th>
                    <th className="px-3 py-2">결과</th>
                  </tr>
                </thead>
                <tbody>
                  {sample.schedule.map((row) => (
                    <tr key={`${row.date}-${row.kind}`} className="border-t border-white/5">
                      <td className="px-3 py-2">{row.date}</td>
                      <td className="px-3 py-2">{row.kind}</td>
                      <td className="px-3 py-2">
                        {row.minPrice != null ? formatWon(row.minPrice) : "—"}
                      </td>
                      <td className="px-3 py-2">{row.result || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataTable>
          )}
        </GlassCard>

        <GlassCard className="border-dashed border-white/15 bg-transparent p-4 text-[11px] text-slate-500">
          <p className="font-semibold text-slate-400">수집 위치 (참고)</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              사건번호·물건번호·종류·가격·비고·담당 →{" "}
              <code className="text-slate-400">#mf_wfm_mainFrame_wq_uuid_876</code>{" "}
              (화면마다 uuid 변동 가능)
            </li>
            <li>
              목록 N 소재지(1~N) →{" "}
              <code className="text-slate-400">#mf_wfm_mainFrame_gen_lstSt</code>
            </li>
            <li>
              사건접수·개시일·배당종기·청구금액 →{" "}
              <code className="text-slate-400">#mf_wfm_mainFrame_wq_uuid_933</code>
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
