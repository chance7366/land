import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { HeroBackgroundSlideshow } from "@/components/landing/HeroBackgroundSlideshow";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { HERO_FONT_CATALOG, type HeroFontCategory } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 한글 폰트 카탈로그",
  robots: { index: false, follow: false },
};

const SAMPLE = "찬스부동산 경매중개";
const SAMPLE_SPLIT = ["찬스부동산", "경매중개"] as const;

const CATEGORY_ORDER: { key: HeroFontCategory; label: string }[] = [
  { key: "calligraphy", label: "캘리그라피 / 손글씨" },
  { key: "serif", label: "세리프 / 명조" },
  { key: "gothic", label: "고딕 / 산세리프" },
];

function FontCard({
  name,
  googleName,
  utilityClass,
  mood,
  weights,
}: {
  name: string;
  googleName: string;
  utilityClass: string;
  mood: string;
  weights: string;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19]/60">
      <div className="border-b border-white/10 bg-[#121622] px-4 py-3">
        <h3 className="text-sm font-bold text-white">{name}</h3>
        <p className="mt-0.5 text-[11px] text-[#a3a3a3]">
          {googleName} · {mood}
        </p>
        <p className="mt-1 font-mono text-[10px] text-[#4dabff]">
          className=&quot;{utilityClass}&quot;
        </p>
        <p className="font-mono text-[10px] text-[#737373]">weight {weights}</p>
      </div>
      <div className="relative min-h-[140px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b4d3e]/40 to-[#0B0F19]" />
        <div className="relative z-10 flex min-h-[140px] flex-col items-center justify-center px-4 py-6 text-center">
          <p className={`${utilityClass} text-2xl font-bold text-white drop-shadow-lg md:text-3xl`}>
            {SAMPLE}
          </p>
          <p className={`${utilityClass} mt-1 text-lg text-[#facc15] md:text-xl`}>
            {SAMPLE_SPLIT[0]} · {SAMPLE_SPLIT[1]}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function HeroFontsCatalogPage() {
  return (
    <LandingShell>
      <div className="border-b border-[#4dabff]/25 bg-[rgba(77,171,255,0.1)] px-4 py-2.5 text-center text-xs text-[#8ecfff]">
        프로젝트 전역 폰트 등록 완료 · <code className="text-[#c8e6d2]">src/lib/fonts.ts</code> · 홈 미적용.{" "}
        <Link href="/mockup/hero-title-designs" className="text-[#9fd4b5] hover:underline">
          타이틀 5안
        </Link>
        {" · "}
        <Link href="/" className="text-[#9fd4b5] hover:underline">
          ← 홈
        </Link>
      </div>

      <LandingHeader />
      <LandingNav />

      <main className="mx-auto max-w-6xl space-y-12 px-container-padding-mobile py-10 pb-20 md:px-8">
        <div className="space-y-3 text-center">
          <span className="inline-block rounded-full border border-[#4dabff]/30 bg-[#4dabff]/10 px-3.5 py-1 text-xs font-bold tracking-wider text-[#4dabff] uppercase">
            HERO FONT CATALOG
          </span>
          <h1 className="text-2xl font-extrabold text-white md:text-3xl">히어로용 한글 폰트 12종</h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#cbd5e1]">
            Google Fonts를 <code className="text-[#4dabff]">next/font</code>로 등록해 두었습니다. 아래{" "}
            <strong className="text-white">utilityClass</strong>를 컴포넌트에 붙이면 바로 사용할 수
            있습니다.
          </p>
        </div>

        {/* 히어로 미리보기 — 기본 고딕 */}
        <section className="overflow-hidden rounded-2xl border border-[#d4af37]/20">
          <div className="relative min-h-[220px]">
            <HeroBackgroundSlideshow intervalMs={5000} fadeMs={2800} showDots={false} />
            <div className="landing-hero-scrim pointer-events-none absolute inset-0" aria-hidden />
            <div className="relative z-10 flex min-h-[220px] flex-col items-center justify-center gap-2 px-4 py-10">
              <p className="font-hero-gothic-noto text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
                {SAMPLE}
              </p>
              <p className="text-[11px] text-[#a3a3a3]">미리보기: Noto Sans KR (font-hero-gothic-noto)</p>
            </div>
          </div>
        </section>

        {CATEGORY_ORDER.map(({ key, label }) => {
          const fonts = HERO_FONT_CATALOG.filter((f) => f.category === key);
          return (
            <section key={key}>
              <h2 className="mb-4 text-lg font-bold text-[#d4af37]">{label}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {fonts.map((font) => (
                  <FontCard
                    key={font.id}
                    name={font.name}
                    googleName={font.googleName}
                    utilityClass={font.utilityClass}
                    mood={font.mood}
                    weights={font.weights}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-2xl border border-white/5 bg-[#0a0a0a]/80 p-6 text-xs leading-relaxed text-[#cbd5e1]">
          <h3 className="mb-3 text-sm font-bold text-white">개발 시 사용법</h3>
          <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-[11px] text-[#c8e6d2]">{`import { HERO_FONT_CATALOG } from "@/lib/fonts";

// 예: 히어로 타이틀
<h1 className="font-hero-brush text-4xl font-bold text-white">
  찬스부동산 경매중개
</h1>`}</pre>
          <p className="mt-3 text-[#a3a3a3]">
            폰트 목록·추가는 <code>src/lib/fonts.ts</code> 한 곳에서 관리합니다.
          </p>
        </section>
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
