"use client";

import { useEffect, useState } from "react";
import {
  AURORA_BACKGROUNDS,
} from "@/components/landing/AuroraBackgroundCycle";
import { HERO_TAGLINE_LINES } from "@/components/landing/HeroCalligraphy";
import { HeroServiceCards } from "@/components/landing/HeroServiceCards";

/** 히어로 우측 — 신뢰 문구 4줄 */
export const HERO_TRUST_RIGHT_LINES = [
  "안전한 중개",
  "정확한 권리분석",
  "성공적인 경매 투자",
  "찬스부동산이 함께 합니다.",
] as const;

const HERO_EYEBROW_TEXT =
  "홍성·예산·서산·당진·천안·대전·세종 등 충청권 전역 부동산 매매와 임대, 전국 경매 물건 권리분석과 입찰가격 추천합니다.";

/**
 * 목업: 기존 좌측 슬로건 유지 + 우측 신뢰 문구 4줄.
 * 프로덕션 AuroraPenHeroPreview는 수정하지 않음.
 */
export function HeroTrustRightSample({
  intervalMs = 4500,
  fadeMs = 2200,
}: {
  intervalMs?: number;
  fadeMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % AURORA_BACKGROUNDS.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, reduceMotion]);

  const active = AURORA_BACKGROUNDS[index];

  return (
    <section
      className="relative overflow-hidden bg-[#0a0809] px-container-padding-mobile pb-8 pt-12 md:px-8 md:pb-10 md:pt-16"
      aria-label="찬스부동산 경매중개 소개 (목업)"
    >
      {AURORA_BACKGROUNDS.map((bg, i) => (
        <div
          key={bg.id}
          className={`hr-aurora-layer hr-aurora-${bg.id} pointer-events-none absolute inset-0`}
          style={{
            opacity: i === index ? 1 : 0,
            transition: reduceMotion ? "none" : `opacity ${fadeMs}ms ease-in-out`,
          }}
          aria-hidden
        >
          <div className="hr3-glow absolute inset-0" />
        </div>
      ))}
      <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      {/* 좌측 — 기존 슬로건 */}
      <div
        className="pointer-events-none absolute left-2 top-3 z-[5] max-w-[min(100%,11.5rem)] sm:left-3 sm:top-4 sm:max-w-[13rem] md:left-4 md:top-20 md:max-w-[16rem] lg:left-8 lg:top-24 lg:max-w-[19rem] xl:left-12"
        aria-hidden
      >
        <p className="font-hero-pen text-left text-[0.95rem] leading-[1.2] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-[1.15rem] md:text-[1.85rem] md:leading-[1.25] lg:text-[2.2rem]">
          {HERO_TAGLINE_LINES.map((line, i) => (
            <span
              key={line.text}
              className="block whitespace-nowrap"
              style={{
                color: active.sloganColors[i] ?? "#ffffff",
                transition: reduceMotion ? "none" : `color ${fadeMs}ms ease-in-out`,
              }}
            >
              {line.text}
            </span>
          ))}
        </p>
      </div>

      {/* 우측 — 신뢰 문구 4줄 */}
      <div
        className="pointer-events-none absolute right-2 top-3 z-[5] max-w-[min(100%,11.5rem)] sm:right-3 sm:top-4 sm:max-w-[13rem] md:right-4 md:top-20 md:max-w-[16rem] lg:right-8 lg:top-24 lg:max-w-[19rem] xl:right-12"
        aria-hidden
      >
        <p className="font-hero-pen text-right text-[0.95rem] leading-[1.2] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-[1.15rem] md:text-[1.85rem] md:leading-[1.25] lg:text-[2.2rem]">
          {HERO_TRUST_RIGHT_LINES.map((text, i) => (
            <span
              key={text}
              className="block whitespace-nowrap"
              style={{
                color: active.sloganColors[i] ?? "#ffffff",
                transition: reduceMotion ? "none" : `color ${fadeMs}ms ease-in-out`,
              }}
            >
              {text}
            </span>
          ))}
        </p>
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col">
        <div className="mx-auto w-full max-w-4xl text-center">
          <div
            className="hero-marquee mx-auto mb-4 w-full max-w-[448px]"
            aria-label={HERO_EYEBROW_TEXT}
          >
            <div className="hero-marquee__track">
              {[0, 1].map((copy) => (
                <span key={copy} className="hero-marquee__item">
                  {HERO_EYEBROW_TEXT}
                  <span className="hero-marquee__dot" aria-hidden />
                </span>
              ))}
            </div>
          </div>

          <h1 className="font-hero-pen hr3-text-pen text-[clamp(2.15rem,6.8vw,3.75rem)] font-bold leading-[1.2] tracking-[-0.02em]">
            찬스부동산 경매중개
          </h1>
        </div>

        <div className="mt-10 md:mt-14">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span
              className="h-px w-10 md:w-16"
              style={{
                background: `linear-gradient(to right, transparent, ${active.accent})`,
                transition: reduceMotion ? "none" : `background ${fadeMs}ms ease-in-out`,
              }}
            />
            <h2
              className="our-services-title text-xl font-semibold tracking-wide md:text-2xl"
              style={{
                color: active.sloganColors[1],
                transition: reduceMotion ? "none" : `color ${fadeMs}ms ease-in-out`,
              }}
            >
              Our Services
            </h2>
            <span
              className="h-px w-10 md:w-16"
              style={{
                background: `linear-gradient(to left, transparent, ${active.accent})`,
                transition: reduceMotion ? "none" : `background ${fadeMs}ms ease-in-out`,
              }}
            />
          </div>

          <HeroServiceCards />
        </div>
      </div>
    </section>
  );
}
