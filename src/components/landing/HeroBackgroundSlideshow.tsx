"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const HERO_SLIDE_IMAGES = [
  "/images/hero-slides/01.png",
  "/images/hero-slides/02.png",
  "/images/hero-slides/03.png",
  "/images/hero-slides/04.png",
  "/images/hero-slides/05.png",
] as const;

type HeroBackgroundSlideshowProps = {
  /** Time between slide advances (ms). Should be ≥ fadeMs for a calm pace. */
  intervalMs?: number;
  /** Cross-fade duration (ms) — longer = slower dissolve */
  fadeMs?: number;
  className?: string;
  showDots?: boolean;
};

/**
 * Slow cross-fading hero background slideshow.
 */
export function HeroBackgroundSlideshow({
  intervalMs = 4500,
  fadeMs = 2800,
  className = "",
  showDots = true,
}: HeroBackgroundSlideshowProps) {
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
      setIndex((i) => (i + 1) % HERO_SLIDE_IMAGES.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, reduceMotion]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {HERO_SLIDE_IMAGES.map((src, i) => {
        const active = reduceMotion ? i === 0 : i === index;
        return (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover object-[center_40%] ${
              active ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionProperty: "opacity",
              transitionDuration: reduceMotion ? "0ms" : `${fadeMs}ms`,
              transitionTimingFunction: "ease-in-out",
            }}
          />
        );
      })}
      {showDots && !reduceMotion ? (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-[1] flex -translate-x-1/2 gap-1.5">
          {HERO_SLIDE_IMAGES.map((src, i) => (
            <span
              key={src}
              className={`h-1.5 rounded-full transition-all ease-in-out ${
                i === index ? "w-4 bg-white" : "w-1.5 bg-white/45"
              }`}
              style={{ transitionDuration: `${Math.min(fadeMs, 1200)}ms` }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
