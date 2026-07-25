"use client";

/**
 * 고객용 매물 상세 전환 UX 목업
 * — 히어로 · 법적 표 · 관리비 카드 · 지도 · sticky 중개사 CTA
 * — 운영 /properties/[id] 미적용
 */

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  MapPin,
  MessageCircle,
  Phone,
  Calculator,
} from "lucide-react";
import { PropertyKvTable } from "@/components/property/PropertyKvTable";
import { COMPLIANCE_PROPERTY_SAMPLE as S } from "@/lib/mockup/property-compliance-sample";

const panel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

const legalRows = [
  { label: "소재지", value: S.locationLine },
  { label: "전용 / 공급면적", value: `전용 ${S.exclusiveArea}㎡ / 공급 ${S.supplyArea}㎡ (전용률 ${Math.round((S.exclusiveArea / S.supplyArea) * 100)}%)` },
  { label: "거래 형태 / 가격", value: `${S.dealType} / ${S.priceLabel}` },
  { label: "건축물 용도", value: S.buildingUse },
  { label: "방 수 / 욕실 수", value: `방 ${S.rooms}개 / 욕실 ${S.bathrooms}개` },
  { label: "방향", value: `${S.direction} (${S.directionBasis})` },
  { label: "해당층 / 총층", value: S.floorDisplay },
  { label: "총 주차대수", value: `총 ${S.parkingTotal}대 (세대당 ${S.parkingPerHousehold}대, 실사용 동일)` },
  { label: "승인 일자", value: `${S.useApprovalDate} (사용승인일)` },
  {
    label: "건물 상태",
    value: S.illegalBuilding ? "위반건축물" : "정상 건축물 (위반건축물 해당 없음)",
  },
  { label: "미등기", value: S.unregistered ? "미등기" : "등기 완료" },
  { label: "입주 가능일", value: S.moveIn },
];

export function PropertyDetailConversionSample() {
  const fixedSum = S.maintenance
    .filter((m) => m.amount != null)
    .reduce((a, m) => a + (m.amount ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="border-b border-emerald-400/30 bg-[#0a1210] px-4 py-3 text-center text-xs text-emerald-100/90">
        <p className="font-bold text-emerald-50">매물 상세 전환 UX 목업 — 운영 적용됨</p>
        <p className="mt-1 text-[11px] text-emerald-100/70">
          실제: /properties/[id] · Sticky CTA · 법적 표 · 관리비 카드
        </p>
        <p className="mt-1.5 flex flex-wrap justify-center gap-3 text-[11px]">
          <Link
            href="/mockup/property-register-compliance"
            className="font-semibold text-[#c4b5fd] underline-offset-2 hover:underline"
          >
            ← 등록 위저드 목업
          </Link>
          <Link
            href="/mockup/property-compliance-hub"
            className="text-amber-100/60 underline-offset-2 hover:underline"
          >
            허브
          </Link>
        </p>
      </div>

      <div className="relative overflow-hidden pb-28 lg:pb-16">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-4 py-5 md:px-6">
          <Link
            href="/mockup/property-list-redesign"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#c4b5fd] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            목록 목업으로
          </Link>

          {/* Hero gallery */}
          <div className={`${panel} mb-4 overflow-hidden p-0`}>
            <div className="grid gap-0.5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="flex h-[220px] items-center justify-center bg-[#0a0a12] md:h-[280px]">
                <span className="material-symbols-outlined text-5xl text-white/20">apartment</span>
              </div>
              <div className="grid grid-cols-2 gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex h-[109px] items-center justify-center bg-[#12101a] md:h-[139px]"
                  >
                    <span className="text-[10px] text-white/25">서브 {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,65%)_minmax(280px,35%)] lg:items-start">
            {/* Main */}
            <div className="space-y-3">
              <section className={`${panel} p-4 md:p-5`}>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {S.badges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-100"
                    >
                      <BadgeCheck className="h-3 w-3" />
                      {b}
                    </span>
                  ))}
                  {S.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#a78bfa]/40 bg-[#a78bfa]/12 px-2.5 py-0.5 text-[11px] font-bold text-[#ddd6fe]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h1 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
                  {S.title}
                </h1>
                <p className="mt-1 text-sm text-[#c4b5fd]/75">{S.featureSummary}</p>
                <p className="mt-3 text-2xl font-extrabold text-[#fbbf24] md:text-[1.65rem]">
                  {S.priceLabel}
                </p>

                {/* 4 key metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    ["가격", S.priceLabel],
                    ["전용면적", `${S.exclusiveArea}㎡`],
                    ["층수", S.floorDisplay],
                    ["방향", S.direction],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded-xl border border-white/10 bg-[rgba(10,10,18,0.45)] px-3 py-2.5 text-center"
                    >
                      <p className="text-[10px] font-semibold text-white/40">{k}</p>
                      <p className="mt-0.5 text-sm font-bold text-white">{v}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={`${panel} p-4 md:p-5`}>
                <h2 className="mb-3 text-sm font-bold text-white">법적 규격 상세 정보</h2>
                <PropertyKvTable rows={legalRows} />
              </section>

              <section className={`${panel} p-4 md:p-5`}>
                <h2 className="mb-1 text-sm font-bold text-white">관리비 세부 내역</h2>
                <p className="mb-3 text-[11px] text-white/40">
                  정액 관리비 월 {S.maintenanceTotal.toLocaleString("ko-KR")}원 (10만원 이상 · 7대 비목)
                </p>
                <div className="overflow-hidden rounded-xl border border-[#a78bfa]/20">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-[rgba(59,42,92,0.35)] text-xs text-[#c4b5fd]/80">
                        <th className="px-3 py-2 font-semibold">비목</th>
                        <th className="px-3 py-2 font-semibold">금액</th>
                        <th className="px-3 py-2 font-semibold">부과</th>
                      </tr>
                    </thead>
                    <tbody>
                      {S.maintenance.map((m) => (
                        <tr key={m.key} className="border-t border-white/10">
                          <td className="px-3 py-2 text-white/85">{m.label}</td>
                          <td className="px-3 py-2 font-semibold text-white">
                            {m.amount != null ? `${m.amount.toLocaleString("ko-KR")}원` : "실비"}
                          </td>
                          <td className="px-3 py-2 text-xs text-white/45">{m.note}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-[#a78bfa]/30 bg-[#a78bfa]/10">
                        <td className="px-3 py-2.5 font-bold text-[#ddd6fe]">합계 정액</td>
                        <td className="px-3 py-2.5 font-extrabold text-[#fbbf24]" colSpan={2}>
                          월 {fixedSum.toLocaleString("ko-KR")}원
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* simple bar viz */}
                <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-white/10">
                  {S.maintenance
                    .filter((m) => m.amount != null && m.amount > 0)
                    .map((m, i) => {
                      const colors = ["bg-[#4dabff]", "bg-[#913dff]", "bg-[#a78bfa]", "bg-[#67e8f9]"];
                      const pct = ((m.amount ?? 0) / fixedSum) * 100;
                      return (
                        <div
                          key={m.key}
                          className={`${colors[i % colors.length]}`}
                          style={{ width: `${pct}%` }}
                          title={`${m.label} ${pct.toFixed(0)}%`}
                        />
                      );
                    })}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-white/40">
                  전기료·가스·난방비는 실사용량에 따라 별도 부과되며 계절에 따라 변동될 수 있습니다.
                </p>
              </section>

              <section className={`${panel} overflow-hidden p-0`}>
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <MapPin className="h-4 w-4 text-[#c4b5fd]" />
                  <h2 className="text-sm font-bold text-white">지도 · 주변 입지</h2>
                </div>
                <div className="flex h-[200px] flex-col items-center justify-center bg-[#0a0a12] text-center">
                  <p className="text-sm text-white/40">카카오맵 SDK 영역 (목업 플레이스홀더)</p>
                  <p className="mt-1 text-xs text-white/30">{S.address}</p>
                  <p className="mt-2 text-[10px] text-white/25">대중교통 · 학군 · 편의시설 레이어</p>
                </div>
              </section>

              <section className={`${panel} p-4 md:p-5`}>
                <h2 className="mb-2 text-sm font-bold text-white">상세 설명 · 옵션</h2>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {S.options.map((o) => (
                    <span
                      key={o}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/70"
                    >
                      {o}
                    </span>
                  ))}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{S.description}</p>
              </section>
            </div>

            {/* Sticky sidebar */}
            <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
              <div className={`${panel} p-4`}>
                <p className="text-[11px] font-semibold text-white/40">핵심 조건</p>
                <p className="mt-1 text-xl font-extrabold text-[#fbbf24]">{S.priceLabel}</p>
                <ul className="mt-3 space-y-1.5 text-xs text-white/65">
                  <li>전용 {S.exclusiveArea}㎡ · {S.floorDisplay}</li>
                  <li>{S.direction} · {S.moveIn}</li>
                  <li>관리비 정액 월 {(fixedSum / 10000).toFixed(1)}만원+</li>
                </ul>
              </div>

              <div className={`${panel} p-4`}>
                <p className="mb-2 text-xs font-bold text-[#ddd6fe]">중개사무소 · 담당자</p>
                <p className="text-sm font-bold text-white">{S.office.name}</p>
                <p className="mt-1 text-[11px] text-white/45">등록번호 {S.office.regNo}</p>
                <p className="text-[11px] text-white/45">{S.office.address}</p>
                <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3 text-xs">
                  <p>
                    <span className="text-white/40">개업 </span>
                    <span className="font-semibold text-white">{S.office.brokerName}</span>
                    <span className="text-white/50"> · {S.office.brokerPhone}</span>
                  </p>
                  <p>
                    <span className="text-white/40">소속 </span>
                    <span className="font-semibold text-white">{S.office.agentName}</span>
                    <span className="text-white/50"> · {S.office.agentPhone}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:${S.office.brokerPhone.replace(/-/g, "")}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-3 text-sm font-bold text-white"
                >
                  <Phone className="h-4 w-4" />
                  전화 문의하기
                </a>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FEE500]/40 bg-[#FEE500]/15 px-4 py-2.5 text-sm font-bold text-[#FEE500]"
                >
                  <MessageCircle className="h-4 w-4" />
                  카카오톡 매물 상담
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/85"
                >
                  <Calendar className="h-4 w-4" />
                  현장 방문 예약
                </button>
              </div>

              <div className={`${panel} p-4`}>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-white">
                  <Calculator className="h-3.5 w-3.5 text-[#c4b5fd]" />
                  대출 · 세금 단순 추정
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>추정 대출 가능액 (LTV 70%)</span>
                    <span className="font-bold text-white">약 2억 2,750만</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>취득세 단순 추정</span>
                    <span className="font-bold text-white">약 360만</span>
                  </div>
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-white/30">
                  참고용 시뮬레이션이며 확정 견적이 아닙니다. 실제 심사·세율과 다를 수 있습니다.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#0B0F19]/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <a
            href={`tel:${S.office.brokerPhone.replace(/-/g, "")}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] py-2.5 text-sm font-bold text-white"
          >
            <Phone className="h-4 w-4" />
            전화
          </a>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#FEE500]/40 bg-[#FEE500]/15 py-2.5 text-sm font-bold text-[#FEE500]"
          >
            <MessageCircle className="h-4 w-4" />
            카톡
          </button>
        </div>
      </div>
    </div>
  );
}
