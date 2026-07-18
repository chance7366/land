"use client";

import { useEffect, useState } from "react";
import { HERO_SLOGAN_SETS } from "@/components/landing/HeroCalligraphy";
import { HeroServiceCards } from "@/components/landing/HeroServiceCards";

export const AURORA_BACKGROUNDS = [
  {
    id: "rose",
    label: "로즈 블러시",
    accent: "#fb7185",
    sloganColors: ["#ffffff", "#fecdd3", "#fda4af", "#fb7185"],
  },
  {
    id: "sapphire",
    label: "사파이어 블루",
    accent: "#60a5fa",
    sloganColors: ["#ffffff", "#bfdbfe", "#93c5fd", "#60a5fa"],
  },
  {
    id: "amber",
    label: "앰버 골드",
    accent: "#fbbf24",
    sloganColors: ["#ffffff", "#fde68a", "#fcd34d", "#fbbf24"],
  },
  {
    id: "emerald",
    label: "에메랄드 미스트",
    accent: "#34d399",
    sloganColors: ["#ffffff", "#bbf7d0", "#86efac", "#34d399"],
  },
  {
    id: "violet",
    label: "바이올렛 오로라",
    accent: "#a78bfa",
    sloganColors: ["#ffffff", "#ddd6fe", "#c4b5fd", "#a78bfa"],
  },
] as const;

export type AuroraBgId = (typeof AURORA_BACKGROUNDS)[number]["id"];

const HERO_EYEBROW_TEXT =
  "홍성·예산·서산·당진·천안·대전·세종 등 충청권 전역 부동산 매매와 임대, 전국 경매 물건 권리분석과 입찰가격 추천합니다.";

const LINE_COUNT = 4;

type Props = {
  intervalMs?: number;
  fadeMs?: number;
  /** 우측 하단 색상 라벨 (목업용) */
  showLabel?: boolean;
  /** section aria-label */
  ariaLabel?: string;
  /** 4행이 모두 나타난 뒤 유지 시간 */
  sloganHoldMs?: number;
  /** 사라진 뒤 다음 슬로건 전 공백 */
  sloganGapMs?: number;
  lineStaggerMs?: number;
  lineFadeMs?: number;
  sloganFadeOutMs?: number;
};

/**
 * 펜글씨 슬로건 교차(행 순차 등장) + 오로라 배경·슬로건 색 동기 순환 히어로.
 */
export function AuroraPenHeroPreview({
  intervalMs = 4500,
  fadeMs = 2200,
  showLabel = false,
  ariaLabel = "찬스부동산 경매중개 소개",
  sloganHoldMs = 3600,
  sloganGapMs = 1000,
  lineStaggerMs = 380,
  lineFadeMs = 320,
  sloganFadeOutMs = 480,
}: Props) {
  const [index, setIndex] = useState(0);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [shownLines, setShownLines] = useState(0);
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
      setIndex((i) => (i + 1) % AURORA_BACKGROUNDS.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, reduceMotion]);

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
      await wait(lineFadeMs);
    }

    async function loop() {
      while (!cancelled) {
        await revealLines();
        if (cancelled) break;

        await wait(sloganHoldMs);
        if (cancelled) break;

        setExiting(true);
        await wait(reduceMotion ? 0 : sloganFadeOutMs);
        if (cancelled) break;

        setShownLines(0);
        await wait(sloganGapMs);
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
  }, [
    sloganHoldMs,
    sloganGapMs,
    lineStaggerMs,
    lineFadeMs,
    sloganFadeOutMs,
    reduceMotion,
  ]);

  const active = AURORA_BACKGROUNDS[index];
  const lines = HERO_SLOGAN_SETS[sloganIndex];
  const fullyVisible = shownLines >= LINE_COUNT && !exiting;

  return (
    <section
      className="relative overflow-hidden bg-[#0a0809] px-container-padding-mobile pb-8 pt-12 md:px-8 md:pb-10 md:pt-16"
      aria-label={ariaLabel}
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

      {/* 좌측 슬로건 — 1→4행 순차 등장 / 한번에 퇴장 / A↔B 교차 */}
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
              : `opacity ${sloganFadeOutMs}ms ease-in-out`,
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
                        `color ${fadeMs}ms ease-in-out`,
                      ].join(", "),
                }}
              >
                {text}
              </span>
            );
          })}
        </p>
        <span className="sr-only">{fullyVisible ? lines.join(" ") : ""}</span>
      </div>

      {showLabel ? (
        <div className="pointer-events-none absolute bottom-4 right-4 z-[6] md:bottom-6 md:right-6">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm"
            style={{ boxShadow: `0 0 20px ${active.accent}33` }}
          >
            <span
              className="h-2 w-2 rounded-full transition-colors duration-700"
              style={{ backgroundColor: active.accent }}
            />
            {active.label}
          </span>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col">
        <div className="mx-auto w-full max-w-4xl text-center">
          <div
            className="hero-marquee mx-auto mb-4 w-full max-w-[180px] sm:max-w-[280px] md:max-w-[448px]"
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
