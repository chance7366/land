"use client";

import { HERO_TAGLINE_LINES } from "@/components/landing/HeroCalligraphy";

/**
 * Sample: CSS perspective + layered text-shadow + float animation.
 */
export function HeroCalligraphyCss3D({ className = "" }: { className?: string }) {
  return (
    <div className={`hero-calligraphy-css-3d-stage pointer-events-none ${className}`}>
      <p
        className={`hero-calligraphy-css-3d font-hero-dokdo text-[0.95rem] leading-[1.2] sm:text-[1.15rem] md:text-[1.85rem] md:leading-[1.25] lg:text-[2.2rem]`}
      >
        {HERO_TAGLINE_LINES.map((line) => (
          <span key={line.text} className={`hero-calligraphy-css-3d__line ${line.color}`}>
            {line.text}
          </span>
        ))}
      </p>
    </div>
  );
}
