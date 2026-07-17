"use client";

import { useEffect, useState } from "react";
import { AURORA_BACKGROUNDS } from "@/components/landing/AuroraBackgroundCycle";
import {
  HERO_SLOGAN_A,
  HERO_SLOGAN_B,
  HERO_SLOGAN_SETS,
} from "@/components/landing/HeroCalligraphy";
import { HeroServiceCards } from "@/components/landing/HeroServiceCards";

export { HERO_SLOGAN_A, HERO_SLOGAN_B };

const LINE_COUNT = 4;

const HERO_EYEBROW_TEXT =
  "홍성·예산·서산·당진·천안·대전·세종 등 충청권 전역 부동산 매매와 임대, 전국 경매 물건 권리분석과 입찰가격 추천합니다.";

/**
 * 목업: 좌측 슬로건 2종
 * — 1→2→3→4행 순차 등장 → 길게 유지 → 한번에 페이드아웃 → 1초 공백 → 다음
 * 프로덕션 미적용.
 */
export function HeroSloganRotateSample({
  auroraIntervalMs = 4500,
  holdMs = 3600,
  gapMs = 1000,
  lineStaggerMs = 380,
  lineFadeMs = 320,
  fadeOutMs = 480,
}: {
  auroraIntervalMs?: number;
  /** 4행이 모두 나타난 뒤 유지 시간 */
  holdMs?: number;
  /** 사라진 뒤 다음이 나타나기 전 공백 */
  gapMs?: number;
  /** 행과 행 사이 간격 */
  lineStaggerMs?: number;
  /** 한 행 페이드인 시간 */
  lineFadeMs?: number;
  /** 전체 페이드아웃 */
  fadeOutMs?: number;
}) {
  const [auroraIndex, setAuroraIndex] = useState(0);
  const [sloganIndex, setSloganIndex] = useState(0);
  /** 현재까지 나타난 행 수 (0~4) */
  const [shownLines, setShownLines] = useState(0);
  /** true면 전체 한번에 숨김 */
  const [exiting, setExiting] = useState(false);
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
      setAuroraIndex((i) => (i + 1) % AURORA_BACKGROUNDS.length);
    }, auroraIntervalMs);
    return () => window.clearInterval(id);
  }, [auroraIntervalMs, reduceMotion]);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => resolve(), ms);
        timers.push(id);
      });

    async function revealLines() {
      setExiting(false);
      setShownLines(0);
      await wait(16);
      if (cancelled) return;

      if (reduceMotion) {
        setShownLines(LINE_COUNT);
        return;
      }

      for (let n = 1; n <= LINE_COUNT; n += 1) {
        setShownLines(n);
        await wait(lineStaggerMs);
        if (cancelled) return;
      }
      // 마지막 행 페이드인이 끝날 때까지 짧게 대기
      await wait(lineFadeMs);
    }

    async function loop() {
      while (!cancelled) {
        await revealLines();
        if (cancelled) break;

        await wait(holdMs);
        if (cancelled) break;

        setExiting(true);
        await wait(reduceMotion ? 0 : fadeOutMs);
        if (cancelled) break;

        setShownLines(0);
        await wait(gapMs);
        if (cancelled) break;

        setSloganIndex((i) => (i + 1) % HERO_SLOGAN_SETS.length);
        await wait(16);
      }
    }

    void loop();
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [holdMs, gapMs, lineStaggerMs, lineFadeMs, fadeOutMs, reduceMotion]);

  const active = AURORA_BACKGROUNDS[auroraIndex];
  const lines = HERO_SLOGAN_SETS[sloganIndex];
  const fullyVisible = shownLines >= LINE_COUNT && !exiting;

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
            opacity: i === auroraIndex ? 1 : 0,
            transition: reduceMotion ? "none" : "opacity 2200ms ease-in-out",
          }}
          aria-hidden
        >
          <div className="hr3-glow absolute inset-0" />
        </div>
      ))}
      <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      {/* 좌측 — 행 순차 등장 / 한번에 퇴장 */}
      <div
        className="pointer-events-none absolute left-2 top-3 z-[5] max-w-[min(100%,11.5rem)] sm:left-3 sm:top-4 sm:max-w-[13rem] md:left-4 md:top-20 md:max-w-[16rem] lg:left-8 lg:top-24 lg:max-w-[19rem] xl:left-12"
        aria-live="polite"
      >
        <p
          className="font-hero-pen text-left text-[0.95rem] leading-[1.2] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-[1.15rem] md:text-[1.85rem] md:leading-[1.25] lg:text-[2.2rem]"
          style={{
            opacity: exiting ? 0 : 1,
            transition: reduceMotion
              ? "none"
              : `opacity ${fadeOutMs}ms ease-in-out`,
          }}
          aria-hidden={exiting || shownLines === 0}
        >
          {lines.map((text, i) => {
            const on = i < shownLines && !exiting;
            return (
              <span
                key={`${sloganIndex}-${text}`}
                className="block whitespace-nowrap"
                style={{
                  color: active.sloganColors[i] ?? "#ffffff",
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(0.35em)",
                  transition: reduceMotion
                    ? "none"
                    : [
                        `opacity ${lineFadeMs}ms ease-out`,
                        `transform ${lineFadeMs}ms ease-out`,
                        "color 2200ms ease-in-out",
                      ].join(", "),
                }}
              >
                {text}
              </span>
            );
          })}
        </p>
        <span className="sr-only">
          {fullyVisible ? lines.join(" ") : ""}
        </span>
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
                transition: reduceMotion
                  ? "none"
                  : "background 2200ms ease-in-out",
              }}
            />
            <h2
              className="our-services-title text-xl font-semibold tracking-wide md:text-2xl"
              style={{
                color: active.sloganColors[1],
                transition: reduceMotion ? "none" : "color 2200ms ease-in-out",
              }}
            >
              Our Services
            </h2>
            <span
              className="h-px w-10 md:w-16"
              style={{
                background: `linear-gradient(to left, transparent, ${active.accent})`,
                transition: reduceMotion
                  ? "none"
                  : "background 2200ms ease-in-out",
              }}
            />
          </div>

          <HeroServiceCards />
        </div>
      </div>
    </section>
  );
}
