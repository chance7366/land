"use client";

import { Bell, CalendarDays } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { HeroServiceCards } from "@/components/landing/HeroServiceCards";

/**
 * Gemini 랜딩 피드백 반영 목업
 * - 손글씨 → Gothic/Outfit 가독성
 * - 마퀴 중복 제거 → 정적 한 줄 소개
 * - 핵심 타이틀 임팩트
 * - CTA 주황/밝은 톤 강화 (+ 히어로 내 CTA)
 */

const BRAND = "찬스부동산 경매중개";
const HEADLINE = "내포신도시 & 충청권 전문 경매·부동산 중개";
const SUPPORT =
  "홍성·예산·서산·당진·천안·대전·세종 등 충청권 매매·임대와 전국 경매 권리분석·입찰 추천";

export function LandingHeroClaritySample() {
  return (
    <div className="font-[family-name:var(--font-unifine),Outfit,sans-serif]">
      {/* 헤더 CTA 강화 샘플 */}
      <div className="border-b border-white/10 bg-[#0B0F19]/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-semibold text-white/45">헤더 CTA 강화 미리보기</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 px-3.5 py-2 text-xs font-extrabold text-[#1a1205] shadow-[0_6px_20px_rgba(251,146,60,0.35)]"
            >
              <Bell className="h-3.5 w-3.5" />
              맞춤 알림
            </button>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-[#f97316] px-3.5 py-2 text-xs font-extrabold text-white shadow-[0_6px_20px_rgba(249,115,22,0.4)]"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              상담 예약
            </Link>
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden bg-[#0a0809] px-container-padding-mobile pb-8 pt-12 md:px-8 md:pb-10 md:pt-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr-aurora-layer hr-aurora-sapphire absolute inset-0 opacity-70" />
          <div className="hr3-glow absolute inset-0" />
          <div className="hr3-vignette absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col">
          <div className="mx-auto w-full max-w-3xl text-center">
            {/* 브랜드 — 손글씨 대신 고딕/Outfit */}
            <p className="font-[family-name:var(--font-unifine),Outfit,sans-serif] text-xs font-bold tracking-[0.28em] text-sky-300/90 md:text-sm">
              CHANCE REAL ESTATE
            </p>
            <h1 className="font-hero-gothic-a1 mt-3 text-[clamp(2rem,5.5vw,3.25rem)] font-black leading-[1.15] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]">
              {BRAND}
            </h1>

            {/* 핵심 타이틀 — 임팩트 */}
            <h2 className="mt-5 text-[clamp(1.25rem,3.4vw,1.85rem)] font-extrabold leading-snug tracking-tight text-[#fde68a] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              {HEADLINE}
            </h2>

            {/* 지역 소개 — 마퀴/중복 제거, 정적 한 줄 */}
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-[0.95rem]">
              {SUPPORT}
            </p>

            {/* 히어로 CTA */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 text-sm font-extrabold text-[#1a1205] shadow-[0_10px_28px_rgba(249,115,22,0.45)] transition hover:brightness-110"
              >
                <CalendarDays className="h-4 w-4" />
                상담 예약하기
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/50 bg-amber-400/15 px-5 py-3 text-sm font-bold text-amber-100 backdrop-blur-sm transition hover:bg-amber-400/25"
              >
                <Bell className="h-4 w-4 text-amber-300" />
                맞춤 알림 받기
              </button>
            </div>

            <p className="mt-4 text-[11px] text-white/40">
              변경점: Nanum Pen → Gothic/Outfit · 마퀴 중복 제거 · 핵심 타이틀 강조 · CTA 주황 톤
            </p>
          </div>

          <div className="mt-10 md:mt-14">
            <div className="mb-4 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-sky-400/80 md:w-16" />
              <h3 className="text-xl font-semibold tracking-wide text-[#fef08a] md:text-2xl">
                Our Services
              </h3>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-sky-400/80 md:w-16" />
            </div>
            <HeroServiceCards />
          </div>
        </div>
      </section>

      {/* Before / After 요약 */}
      <section className="mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8">
        <h3 className="text-lg font-bold text-white">피드백 반영 요약</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <CompareCard
            title="Before (현재 프로덕션)"
            items={[
              "브랜드·슬로건 Nanum Pen 손글씨 + 빛번짐",
              "지역 문구 마퀴 2중 복사 → 중복·잘림 인지",
              "핵심 타깃 문구가 히어로 중심에 약함",
              "헤더 CTA: 연한 violet/amber 보더 버튼",
            ]}
          />
          <CompareCard
            title="After (이 목업)"
            items={[
              "브랜드 Gothic/Outfit 블랙 웨이트로 가독성",
              "지역 문구 정적 1줄 (중복·클리핑 제거)",
              "「내포신도시 & 충청권 전문…」 핵심 타이틀 강조",
              "상담 예약·맞춤 알림 주황/앰버 솔리드 CTA",
            ]}
            highlight
          />
        </div>
      </section>
    </div>
  );
}

function CompareCard({
  title,
  items,
  highlight,
}: {
  title: string;
  items: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-orange-400/40 bg-orange-500/10"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <p className={`text-sm font-bold ${highlight ? "text-orange-200" : "text-white/70"}`}>
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/65">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className={highlight ? "text-orange-300" : "text-white/35"}>·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
