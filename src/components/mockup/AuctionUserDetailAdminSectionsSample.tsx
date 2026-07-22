"use client";

/**
 * 사용자 경매 Split 상세 우측 패널 — 관리자 1~6절 구조 목업.
 * 운영 AuctionSplitDetail 에는 미적용.
 */

import { useState } from "react";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";
import { BasicPropertyInfoPanel } from "@/components/auction/BasicPropertyInfoPanel";
import { ListDetailsPanel } from "@/components/auction/ListDetailsPanel";
import { CaseDetailSection } from "@/components/auction/CaseDetailSection";
import { StatusReportSection } from "@/components/auction/StatusReportSection";
import { SAMPLE_APT_15044 } from "@/lib/mockup/auction-basic-info-sample";
import { LIST_DETAILS_SAMPLES } from "@/lib/mockup/auction-list-details-sample";
import {
  HS_15044_CASE_DETAIL,
  HS_15044_SUMMARY,
} from "@/lib/mockup/auction-case-detail-sample";
import { FIXTURES } from "@/lib/mockup/auction-court-fixtures";
import { formatAuctionMoney } from "@/lib/format";

const heroPanel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

const IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
];

const APPRAISAL_SUMMARY = `【건물개황】
소재지: 충청남도 홍성군 홍북읍 신경리 1204 엘에이치스타힐스 103동 5층501호
구조: 철근콘크리트조
이용상태: 아파트로 이용중
전유면적: 84.92㎡ / 대지권: 48.215 / 24,561.3

【가격산출】
거래사례비교법 및 원가법을 병용하여 시산가격을 산출하고, 인근 유사 아파트 실거래·호가를 참작하여 감정평가액을 결정함.

【기타】
임차인 점유(월세). 현황조사서(2026.02.02) 기준 점유관계 확인 요망.`;

function Section({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`${heroPanel} p-4 md:p-5`}>
      <h3 className="mb-1 flex items-center gap-2 border-b border-white/10 pb-2 text-sm font-bold text-white">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#a78bfa]/20 text-[10px] text-[#ddd6fe]">
          {n}
        </span>
        {title}
      </h3>
      {hint ? <p className="mb-3 text-[11px] text-white/40">{hint}</p> : <div className="mb-3" />}
      {children}
    </section>
  );
}

export function AuctionUserDetailAdminSectionsSample() {
  const basic = SAMPLE_APT_15044;
  const listSample =
    LIST_DETAILS_SAMPLES.find((s) => s.id.includes("apt") || s.label.includes("아파트")) ??
    LIST_DETAILS_SAMPLES[LIST_DETAILS_SAMPLES.length - 1];
  const unitList = {
    ...listSample,
    rows: [
      {
        no: 1,
        listKind: "집합건물",
        detail: [
          "충청남도 홍성군 홍북읍 신경리 1204 엘에이치스타힐스 103동 5층501호",
          "철근콘크리트구조",
          `전유면적 ${HS_15044_SUMMARY.exclusiveArea}㎡`,
          `대지권 ${HS_15044_SUMMARY.landRightNumer} / ${HS_15044_SUMMARY.landRightDenom}`,
        ].join("\n"),
      },
    ],
  };
  const statusFixture = FIXTURES.find((f) => f.id === "hs-15044-1")?.statusReport;
  const [statusReport] = useState(
    () =>
      statusFixture ?? {
        available: true,
        court: "홍성지원",
        ordRound: "1",
        caseLabel: "2026타경15044",
        surveyedAt: "2026년02월02일",
        photoCount: 4,
        photoLabel: "전경도 4건",
        possessionAddress: basic.locations[0]?.address ?? "",
        possessionRelation: HS_15044_SUMMARY.possessionNote,
        possessionEtc: "",
        leases: [],
      },
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="border-b border-amber-400/30 bg-[#12100a] px-4 py-3 text-center text-xs text-amber-100/90">
        <p className="font-bold text-amber-50">
          사용자 경매상세 우측 패널 · 관리자 1~6절 구조 목업 (미적용)
        </p>
        <p className="mt-1 text-[11px] text-amber-100/70">
          1 기본정보 · 2 기일 내역 · 3 목록 내역 · 4 감정요약 · 5 물건상세 · 6 현황조사서
        </p>
      </div>

      <div className="relative min-h-[70vh] overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-4 md:px-6 md:py-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,52%)_minmax(0,48%)] lg:items-start">
            {/* 좌: 사진·CTA (현행과 유사한 자리) */}
            <div className="space-y-3">
              <div className={`${heroPanel} overflow-hidden`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES[0]}
                  alt=""
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <div className={`${heroPanel} flex flex-wrap gap-2 p-3`}>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2.5 text-sm font-bold text-white"
                >
                  <Phone className="h-4 w-4" /> 상담 전화
                </button>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-slate-200"
                >
                  <MessageSquare className="h-4 w-4" /> 문의
                </button>
              </div>
              <p className="text-center text-[11px] text-white/35">
                ← 좌측 미디어·CTA는 현행 유지 · 우측만 1~6절 제안
              </p>
            </div>

            {/* 우: 관리자 1~6절 */}
            <div className="space-y-3">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white/80"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> 목록으로
              </button>

              <Section n={1} title="기본정보" hint="관리자 수정 §1 · 법원 물건기본정보 표">
                <BasicPropertyInfoPanel data={basic} />
              </Section>

              <Section n={2} title="기일 내역" hint="관리자 수정 §2 · 기일·종류·최저가·결과">
                <div className="data-table max-h-56 overflow-auto rounded-xl border border-white/10">
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
                      {basic.schedule.map((row) => (
                        <tr key={`${row.date}-${row.kind}`} className="border-t border-white/5">
                          <td className="px-3 py-2">{row.date}</td>
                          <td className="px-3 py-2">{row.kind}</td>
                          <td className="px-3 py-2">
                            {row.minPrice != null
                              ? formatAuctionMoney(row.minPrice)
                              : "—"}
                          </td>
                          <td className="px-3 py-2">{row.result || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section n={3} title="목록 내역" hint="관리자 수정 §3 · 법원 목록내역">
                <ListDetailsPanel rows={unitList.rows} />
              </Section>

              <Section n={4} title="감정요약" hint="관리자 수정 §4 · 감정평가요항표 원문">
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-xs leading-relaxed text-[#cbd5e1]">
                  {APPRAISAL_SUMMARY}
                </pre>
              </Section>

              <div className="[&_.glass-card]:!bg-[rgba(20,18,28,0.78)] [&_.glass-card]:!shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
                <CaseDetailSection n={5} data={HS_15044_CASE_DETAIL} hideLists>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <FactChip label="전유면적" value={`${HS_15044_SUMMARY.exclusiveArea}㎡`} />
                    <FactChip
                      label="대지권"
                      value={`${HS_15044_SUMMARY.landRightNumer} / ${HS_15044_SUMMARY.landRightDenom}`}
                    />
                    <FactChip label="점유" value={HS_15044_SUMMARY.possessionNote} />
                  </div>
                </CaseDetailSection>
              </div>

              <Section n={6} title="현황조사서" hint="관리자 수정 §6 · 법원 현황조사서 서식">
                <StatusReportSection
                  bare
                  report={statusReport}
                  onChange={() => {
                    /* 목업 읽기 전용 */
                  }}
                />
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
