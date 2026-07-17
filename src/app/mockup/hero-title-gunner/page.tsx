import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 3D 타이포",
  robots: { index: false, follow: false },
};

const EYEBROW = "홍성·예산·서산·당진·천안·대전·세종 부동산 매매·임대와 전국 경매 물건 추천";
const TITLE = "찬스부동산 경매중개";

function SampleFrame({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10">
      <div className="border-b border-white/10 bg-[#121212] px-4 py-3">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <p className="mt-1 text-xs text-[#a3a3a3]">{note}</p>
      </div>
      <div className="relative flex min-h-[280px] items-center justify-center bg-[#0a0a0a] px-4 py-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(80,60,20,0.35), transparent 70%)",
          }}
        />
        <div className="relative z-10 w-full max-w-4xl text-center">{children}</div>
      </div>
    </section>
  );
}

/** 1번: CSS text-shadow 3D 압출 + 노랑-주황 그라데이션 */
function StyleGunnerCss() {
  return (
    <div>
      <p className="mb-5 text-sm font-semibold tracking-wide text-[#f0c14b]/90 md:text-base">
        {EYEBROW}
      </p>
      <h1
        className="hero-title-gunner-1 text-[clamp(2rem,6vw,3.75rem)] font-black italic leading-[1.2] tracking-tight"
        style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Black', sans-serif" }}
      >
        {TITLE}
      </h1>
    </div>
  );
}

/** 2번: 더 두꺼운 3D + 대각 광택 오버레이 */
function StyleGunnerSheen() {
  return (
    <div>
      <p className="mb-5 text-sm font-semibold tracking-wide text-[#ffb347] md:text-base">{EYEBROW}</p>
      <h1 className="hero-title-gunner-2 relative inline-block text-[clamp(2rem,6vw,3.75rem)] font-black italic leading-[1.2] tracking-tight">
        <span className="hero-title-gunner-2__face relative z-10">{TITLE}</span>
      </h1>
    </div>
  );
}

/** 3번: 아웃라인 + 골드 페이스 (조금 더 고급/부동산 톤) */
function StyleGunnerOutline() {
  return (
    <div>
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#d4af37] md:text-sm">
        {EYEBROW}
      </p>
      <h1
        className="hero-title-gunner-3 text-[clamp(2rem,5.5vw,3.5rem)] font-extrabold italic leading-[1.25] tracking-wide"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {TITLE}
      </h1>
    </div>
  );
}

export default function HeroTitleGunnerSamplesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{`
        .hero-title-gunner-1 {
          background: linear-gradient(180deg, #ffe566 0%, #ffcc33 35%, #ff9900 70%, #e67a00 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 1px 0 #a85a00)
            drop-shadow(0 2px 0 #7a3f00)
            drop-shadow(0 3px 0 #5c2e00)
            drop-shadow(0 4px 0 #3d1f00)
            drop-shadow(0 5px 0 #2a1500)
            drop-shadow(0 8px 16px rgba(0,0,0,0.65));
        }

        .hero-title-gunner-2 {
          font-family: Impact, Haettenschweiler, "Arial Black", sans-serif;
        }
        .hero-title-gunner-2__face {
          display: inline-block;
          background: linear-gradient(
            180deg,
            #fff6a8 0%,
            #ffe566 18%,
            #ffb800 55%,
            #ff8a00 85%,
            #e06a00 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 1px 0 #c45f00)
            drop-shadow(0 2px 0 #9a4800)
            drop-shadow(0 3px 0 #7a3600)
            drop-shadow(0 4px 0 #5a2800)
            drop-shadow(0 5px 0 #3f1c00)
            drop-shadow(0 6px 0 #2a1200)
            drop-shadow(0 10px 20px rgba(0,0,0,0.7));
        }
        .hero-title-gunner-2__face::after {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            -32deg,
            transparent 0 10px,
            rgba(255,255,255,0.22) 10px 12px,
            transparent 12px 22px
          );
          mix-blend-mode: soft-light;
          pointer-events: none;
          -webkit-mask-image: linear-gradient(180deg, #ffe566, #ff8a00);
          mask-image: linear-gradient(180deg, #ffe566, #ff8a00);
        }

        .hero-title-gunner-3 {
          background: linear-gradient(180deg, #f5e6a8 0%, #d4af37 45%, #b8860b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 1px rgba(90, 55, 0, 0.55);
          filter: drop-shadow(0 2px 0 #5c3d00)
            drop-shadow(0 4px 0 #3d2800)
            drop-shadow(0 6px 14px rgba(0,0,0,0.55));
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#ffb800]">TYPO SAMPLES</p>
            <h1 className="text-lg font-bold">히어로 타이틀 · GUNNER 스타일 3안</h1>
          </div>
          <Link href="/" className="text-sm text-[#ffb800] hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 pb-16 md:px-8">
        <p className="text-sm text-[#a3a3a3]">
          참고 이미지: 이탤릭 헤비 산세리프 · 노랑→주황 그라데이션 · 3D 압출 · 대각 광택. 아래는
          「찬스부동산 경매중개」에 적용한 CSS 샘플입니다. (홈 미적용)
        </p>

        <SampleFrame
          title="1번 · 클래식 GUNNER (추천)"
          note="노랑→주황 그라데이션 + text-shadow 압출 · 참고안과 가장 유사"
        >
          <StyleGunnerCss />
        </SampleFrame>

        <SampleFrame
          title="2번 · 광택 스트라이프"
          note="더 두꺼운 3D + 대각 하이라이트 스트릭 · 스포츠/게이밍 느낌 강함"
        >
          <StyleGunnerSheen />
        </SampleFrame>

        <SampleFrame
          title="3번 · 골드 세리프 3D"
          note="세리프 + 골드 톤 · 부동산 브랜드에 조금 더 맞는 절충안"
        >
          <StyleGunnerOutline />
        </SampleFrame>
      </main>
    </div>
  );
}
