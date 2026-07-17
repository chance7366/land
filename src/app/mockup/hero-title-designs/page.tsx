import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { HeroBackgroundSlideshow } from "@/components/landing/HeroBackgroundSlideshow";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 타이틀 5종",
  robots: { index: false, follow: false },
};

const EYEBROW =
  "홍성·예산·서산·당진·천안·대전·세종 부동산 매매·임대와 전국 경매 물건 추천";

type Sample = {
  n: number;
  name: string;
  ref: string;
  mood: string;
  titleClass: string;
  layout: "single" | "split" | "stack";
};

const SAMPLES: Sample[] = [
  {
    n: 1,
    name: "포레스트 페이퍼 페어링",
    ref: "Adobe Fonts · 크림+숲녹 이중 서체",
    mood: "신뢰 · 고급 · 차분",
    titleClass: "ht-forest-pair",
    layout: "split",
  },
  {
    n: 2,
    name: "유니파인 네온 인사이트",
    ref: "CHANCE 브랜드 · #4dabff→#913dff",
    mood: "스마트 · 현대 · 프로테크",
    titleClass: "ht-neon-insight",
    layout: "single",
  },
  {
    n: 3,
    name: "크롬 골드 트러스트",
    ref: "메탈릭 Dual-Tone · 홈 현행안 개선",
    mood: "권위 · 안정 · 명품",
    titleClass: "ht-chrome-gold",
    layout: "split",
  },
  {
    n: 4,
    name: "스트로크 & 스크립트",
    ref: "Illustrator · 아웃라인+손글씨 레이어",
    mood: "개성 · 친근 · 기억에 남음",
    titleClass: "ht-stroke-script",
    layout: "stack",
  },
  {
    n: 5,
    name: "3D 익스트루드 임팩트",
    ref: "Illustrator Extrude · 코랄→골드",
    mood: "에너지 · 경매 · 주목",
    titleClass: "ht-extrude-impact",
    layout: "single",
  },
];

function TitleBlock({ sample }: { sample: Sample }) {
  if (sample.layout === "split") {
    return (
      <h1 className={sample.titleClass}>
        <span className="ht-line-main">찬스부동산</span>
        <span className="ht-line-sub">경매중개</span>
      </h1>
    );
  }
  if (sample.layout === "stack") {
    return (
      <h1 className={sample.titleClass}>
        <span className="ht-stack-outline" aria-hidden>
          찬스부동산
        </span>
        <span className="ht-stack-main">찬스부동산</span>
        <span className="ht-stack-script">경매중개</span>
      </h1>
    );
  }
  return <h1 className={sample.titleClass}>찬스부동산 경매중개</h1>;
}

function HeroPreview({ sample }: { sample: Sample }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19]">
      <div className="border-b border-white/10 bg-[#121622] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#4dabff]">
              {sample.n}안 · {sample.name}
            </h2>
            <p className="mt-1 text-[11px] text-[#a3a3a3]">
              참고: {sample.ref} · 무드: {sample.mood}
            </p>
          </div>
          <span className="rounded-full border border-[#1b4d3e]/50 bg-[#1b4d3e]/25 px-3 py-1 text-[11px] font-bold text-[#c8e6d2]">
            샘플 {sample.n}
          </span>
        </div>
      </div>

      <div className="relative min-h-[300px] overflow-hidden md:min-h-[340px]">
        <HeroBackgroundSlideshow intervalMs={4500} fadeMs={2800} showDots={false} />
        <div className="landing-hero-scrim pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(77,171,255,0.15), transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center px-4 py-14 md:min-h-[340px]">
          <p className="mb-4 max-w-md text-center text-[10px] font-semibold tracking-wide text-[#d4af37]/85 md:text-xs">
            {EYEBROW}
          </p>
          <TitleBlock sample={sample} />
        </div>
      </div>
    </section>
  );
}

export default function HeroTitleDesignsMockupPage() {
  return (
    <LandingShell>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=East+Sea+Dokdo&family=Noto+Serif+KR:wght@700;900&family=Outfit:wght@700;800&display=swap');

        .ht-base {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          line-height: 1.15;
        }

        .ht-forest-pair,
        .ht-chrome-gold {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .ht-forest-pair {
          font-family: 'Noto Serif KR', Georgia, serif;
          gap: 0.15rem;
        }
        .ht-forest-pair .ht-line-main,
        .ht-forest-pair .ht-line-sub {
          display: block;
          padding: 0.35rem 1.25rem;
          border-radius: 0.75rem;
          background: linear-gradient(180deg, #faf7ef 0%, #f5f2e7 55%, #ebe4d4 100%);
          border: 1px solid rgba(27, 77, 62, 0.14);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.6) inset,
            0 12px 32px rgba(0,0,0,0.45);
        }
        .ht-forest-pair .ht-line-main {
          font-size: clamp(1.85rem, 5.5vw, 3.1rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #1b4d3e;
        }
        .ht-forest-pair .ht-line-sub {
          font-size: clamp(1.1rem, 3.2vw, 1.65rem);
          font-weight: 700;
          letter-spacing: 0.28em;
          color: #2d6b56;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }

        /* 2 · Unifine neon insight */
        .ht-neon-insight {
          font-family: 'Outfit', system-ui, sans-serif;
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(105deg, #ffffff 0%, #4dabff 28%, #7c5cff 62%, #913dff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 0 18px rgba(77, 171, 255, 0.45))
            drop-shadow(0 0 32px rgba(145, 61, 255, 0.25))
            drop-shadow(0 4px 12px rgba(0, 0, 0, 0.85));
        }

        /* 3 · Chrome gold trust (refined home style) */
        .ht-chrome-gold {
          font-family: Georgia, 'Noto Serif KR', serif;
        }
        .ht-chrome-gold .ht-line-main {
          display: block;
          font-size: clamp(2rem, 5.8vw, 3.4rem);
          font-weight: 900;
          letter-spacing: -0.01em;
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            #f5e6a8 18%,
            #d4af37 42%,
            #8b6914 68%,
            #d4af37 88%,
            #fff0b3 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(2px 2px 0 #3d2e04)
            drop-shadow(0 8px 20px rgba(0,0,0,0.65));
        }
        .ht-chrome-gold .ht-line-sub {
          display: block;
          font-size: clamp(1rem, 2.8vw, 1.35rem);
          font-weight: 700;
          letter-spacing: 0.42em;
          padding-left: 0.42em;
          color: #f5e6b8;
          text-shadow: 0 1px 0 #5c4406, 0 3px 10px rgba(0,0,0,0.7);
        }

        /* 4 · Stroke + script (Illustrator pairing) */
        .ht-stroke-script {
          position: relative;
          display: inline-block;
          font-family: 'Outfit', system-ui, sans-serif;
          padding: 0.5rem 0;
        }
        .ht-stroke-script .ht-stack-outline {
          position: absolute;
          inset: 0;
          font-size: clamp(2.1rem, 6.2vw, 3.6rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: transparent;
          -webkit-text-stroke: 2px rgba(212, 175, 55, 0.55);
          transform: translate(3px, 4px);
          user-select: none;
          pointer-events: none;
        }
        .ht-stroke-script .ht-stack-main {
          position: relative;
          display: block;
          font-size: clamp(2.1rem, 6.2vw, 3.6rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          text-shadow: 0 2px 12px rgba(0,0,0,0.8);
        }
        .ht-stroke-script .ht-stack-script {
          display: block;
          margin-top: -0.15rem;
          font-family: 'East Sea Dokdo', cursive;
          font-size: clamp(1.6rem, 4.5vw, 2.4rem);
          font-weight: 400;
          letter-spacing: 0.06em;
          color: #facc15;
          text-shadow: 0 2px 8px rgba(0,0,0,0.75);
          transform: rotate(-2deg);
        }

        /* 5 · 3D extrude impact (Illustrator CREATE style) */
        .ht-extrude-impact {
          font-family: 'Outfit', system-ui, sans-serif;
          font-size: clamp(1.9rem, 5.8vw, 3.25rem);
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1.2;
          background: linear-gradient(180deg, #fff4e0 0%, #ffb347 25%, #ff6b35 55%, #e85d04 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 1px 0 #c2410c)
            drop-shadow(0 2px 0 #9a3412)
            drop-shadow(0 3px 0 #7c2d12)
            drop-shadow(0 4px 0 #5c1d0a)
            drop-shadow(0 6px 0 #3f1508)
            drop-shadow(0 10px 22px rgba(0,0,0,0.75));
        }
      `}</style>

      <div className="border-b border-[#4dabff]/25 bg-[rgba(77,171,255,0.1)] px-4 py-2.5 text-center text-xs text-[#8ecfff]">
        샘플 · 히어로 타이틀 5종 (Adobe 페어링 + Illustrator 효과 + Unifine 브랜드) · 홈 미적용.{" "}
        <Link href="/" className="text-[#9fd4b5] hover:underline font-semibold">
          ← 홈
        </Link>
      </div>

      <LandingHeader />
      <LandingNav />

      <main className="mx-auto max-w-5xl space-y-10 px-container-padding-mobile py-10 pb-20 md:px-8">
        <div className="space-y-3 text-center">
          <span className="inline-block rounded-full border border-[#4dabff]/30 bg-[#4dabff]/10 px-3.5 py-1 text-xs font-bold tracking-wider text-[#4dabff] uppercase">
            HERO TITLE DESIGN
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            찬스부동산 경매중개 · 첫인상 타이틀 5안
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#cbd5e1]">
            부동산·경매 방문자의 첫 느낌을 위해 신뢰(숲녹·골드), 현대감(네온 그라데이션), 기억력(스트로크·3D)을
            조합한 5가지 방향입니다. 실제 히어로 슬라이드쇼 위에서 가독성을 기준으로 설계했습니다.
          </p>
        </div>

        <div className="space-y-8">
          {SAMPLES.map((sample) => (
            <HeroPreview key={sample.n} sample={sample} />
          ))}
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0a0a]/80 p-6 md:p-8">
          <h3 className="mb-4 text-base font-bold text-white">디자이너 추천 가이드</h3>
          <ul className="grid gap-4 text-xs leading-relaxed text-[#cbd5e1] md:grid-cols-2">
            <li>
              <strong className="text-[#1b4d3e] bg-[#f5f2e7] px-1 rounded">1안 포레스트</strong> — 차분하고
              고급스러운 첫인상. 브랜드 신뢰·전문성 강조 시 최적.
            </li>
            <li>
              <strong className="text-[#4dabff]">2안 네온</strong> — 젊고 스마트한 인상. 유니파인 시스템과 가장
              일관됨.
            </li>
            <li>
              <strong className="text-[#d4af37]">3안 크롬 골드</strong> — 현재 홈 스타일 개선형. 권위·안정감.
            </li>
            <li>
              <strong className="text-[#facc15]">4안 스트로크</strong> — 친근·개성. 지역 중개사 정체성 강조.
            </li>
            <li>
              <strong className="text-[#ff6b35]">5안 3D</strong> — 경매·기회 강조. 시선 집중·에너지형.
            </li>
          </ul>
        </div>
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
