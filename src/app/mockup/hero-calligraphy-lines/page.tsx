import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import {
  HeroCalligraphyOptions,
  HeroCalligraphyVariantList,
  HERO_TAGLINE_LINES,
} from "@/components/landing/HeroCalligraphy";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 캘리 모바일 축소",
  robots: { index: false, follow: false },
};

export default function HeroCalligraphyLinesMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-[#facc15]/30 bg-[rgba(250,204,21,0.1)] px-4 py-2 text-center text-xs text-[#facc15]">
        샘플 · 모바일 작은 글씨로 4행 전체 표시 · 데스크톱 확대. 홈 미적용.
      </div>
      <LandingHeader />
      <LandingNav />

      <main>
        <section className="relative min-h-[320px] overflow-hidden px-container-padding-mobile py-14 md:min-h-[420px] md:px-8 md:py-20">
          <Image
            src="/images/hero-naepo.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] brightness-[1.22] contrast-[1.05] saturate-[1.02]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B0F19]/15 via-[#0B0F19]/50 to-[#0a0a0a]"
            aria-hidden
          />
          <HeroCalligraphyOptions activeId="C" />
          <div className="relative z-10 mx-auto max-w-6xl pt-16 text-center md:pt-0">
            <h1 className="hero-title-chrome text-3xl md:text-4xl">찬스부동산 경매중개</h1>
            <p className="mt-3 text-xs text-[#a3a3a3]">
              모바일: ~0.95rem · sm 1.15rem · md+ 확대 · 좌측 상단 배치
            </p>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0a0a0a] px-container-padding-mobile py-8 md:px-8">
          <h2 className="mb-2 text-sm font-bold text-white">행별 색상</h2>
          <ol className="mb-6 space-y-1 text-sm">
            {HERO_TAGLINE_LINES.map((line, i) => (
              <li key={line.text} className={line.color}>
                {i + 1}. {line.text}
              </li>
            ))}
          </ol>

          <h2 className="mb-2 text-sm font-bold text-white">서체 비교 (C안)</h2>
          <p className="mb-3 text-[11px] text-[#737373]">
            창 너비를 줄여 모바일 글자 크기를 확인해 보세요.
          </p>
          <HeroCalligraphyVariantList />
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-[#737373]">
        <Link href="/" className="text-[#4dabff] hover:underline">
          ← 홈
        </Link>
      </footer>
    </LandingShell>
  );
}
