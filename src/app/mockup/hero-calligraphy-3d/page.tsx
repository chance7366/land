import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { HeroCalligraphyCss3D } from "@/components/landing/HeroCalligraphyCss3D";
import { HeroCalligraphyThree3D } from "@/components/landing/HeroCalligraphyThree3D";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 캘리 3D 2종",
  robots: { index: false, follow: false },
};

export default function HeroCalligraphy3dMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-[#4dabff]/30 bg-[rgba(77,171,255,0.1)] px-4 py-2 text-center text-xs text-[#4dabff]">
        샘플 · ① CSS 의사 3D · ② Three.js(R3F) 실 WebGL 3D. 홈 미적용.
      </div>
      <LandingHeader />
      <LandingNav />

      <main className="pb-16">
        {/* 1. CSS */}
        <section className="relative min-h-[340px] overflow-hidden px-container-padding-mobile py-14 md:min-h-[400px] md:px-8 md:py-16">
          <Image
            src="/images/hero-naepo.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] brightness-[1.2] contrast-[1.05]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B0F19]/20 via-[#0B0F19]/55 to-[#0a0a0a]"
            aria-hidden
          />
          <div className="absolute left-3 top-6 z-[5] sm:left-5 sm:top-8 md:left-8 md:top-16 lg:left-12">
            <HeroCalligraphyCss3D />
          </div>
          <div className="relative z-10 mx-auto max-w-6xl pt-24 text-center md:pt-28">
            <p className="text-xs font-bold tracking-wide text-[#4dabff]">1 · CSS 의사 3D</p>
            <h1 className="hero-title-chrome mt-2 text-3xl md:text-4xl">찬스부동산 경매중개</h1>
            <p className="mt-2 text-[11px] text-[#a3a3a3]">
              perspective · text-shadow 두께 · rotateY/X float 루프 · 번들 증가 없음
            </p>
          </div>
        </section>

        {/* 2. Three.js */}
        <section className="relative min-h-[380px] overflow-hidden border-t border-white/10 px-container-padding-mobile py-10 md:min-h-[440px] md:px-8 md:py-12">
          <Image
            src="/images/hero-naepo.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[center_40%] brightness-[1.05] saturate-[0.95]"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[#0a0a0a]/70" aria-hidden />
          <div className="relative z-10 mx-auto max-w-6xl">
            <p className="text-center text-xs font-bold tracking-wide text-[#d4af37]">
              2 · Three.js / React Three Fiber
            </p>
            <p className="mt-1 text-center text-[11px] text-[#a3a3a3]">
              WebGL Canvas · troika Text · 조명 · 좌우 기울임·부유 애니메이션
            </p>
            <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-[2px]">
              <HeroCalligraphyThree3D />
            </div>
            <p className="mt-3 text-center text-[11px] text-[#737373]">
              실제 홈 적용 시 번들·모바일 GPU 부담이 큽니다. 장식용이면 1번(CSS)을 권장합니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-container-padding-mobile py-8 md:px-8">
          <h2 className="text-sm font-bold text-white">비교 요약</h2>
          <ul className="mt-3 space-y-2 text-xs text-[#cbd5e1]">
            <li>
              <span className="font-semibold text-[#4dabff]">1 CSS</span> — 가볍고 기존 캘리 서체·행
              색상 그대로, 의사 3D 두께+흔들림
            </li>
            <li>
              <span className="font-semibold text-[#d4af37]">2 Three.js</span> — 진짜 3D 공간·조명,
              패키지 추가·폰트 로드·성능 비용
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-[#737373]">
        <Link href="/mockup/hero-calligraphy-lines" className="text-[#facc15] hover:underline">
          줄바꿈 샘플
        </Link>
        {" · "}
        <Link href="/" className="text-[#4dabff] hover:underline">
          ← 홈
        </Link>
      </footer>
    </LandingShell>
  );
}
