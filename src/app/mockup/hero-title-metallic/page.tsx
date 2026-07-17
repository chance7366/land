import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | 메탈릭 골드 타이틀 5종",
  robots: { index: false, follow: false },
};

const TITLE = "찬스부동산 경매중개";
const EYEBROW = "홍성·예산·서산·당진·천안·대전·세종 부동산 매매·임대와 전국 경매 물건 추천";

function Frame({
  title,
  refNote,
  children,
  light,
}: {
  title: string;
  refNote: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10">
      <div className="border-b border-white/10 bg-[#121212] px-4 py-3">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <p className="mt-1 text-xs text-[#a3a3a3]">{refNote}</p>
      </div>
      <div
        className={`relative flex min-h-[260px] items-center justify-center px-4 py-14 ${
          light ? "bg-[#f4f4f4]" : "bg-[#0a0a0a]"
        }`}
      >
        {!light && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 50% at 50% 48%, rgba(90,70,25,0.28), transparent 70%)",
            }}
          />
        )}
        <div className="relative z-10 w-full max-w-4xl text-center">
          <p
            className={`mb-5 text-xs font-semibold tracking-wide md:text-sm ${
              light ? "text-[#8a6a20]" : "text-[#d4af37]/90"
            }`}
          >
            {EYEBROW}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}

export default function MetallicTitleSamplesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{`
        .mt-serif {
          font-family: Georgia, "Times New Roman", "Noto Serif KR", serif;
          font-weight: 900;
          font-size: clamp(2rem, 5.5vw, 3.4rem);
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        /* 1 — GOLD: silver face + gold extrusion (ref image 1) */
        .mt-gold-silver {
          background: linear-gradient(180deg, #f7f7f5 0%, #e8e6e0 40%, #cfc9bc 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(212, 175, 55, 0.85);
          filter:
            drop-shadow(0 1px 0 #c9a227)
            drop-shadow(0 2px 0 #b8860b)
            drop-shadow(0 3px 0 #9a7209)
            drop-shadow(0 4px 0 #7a5a08)
            drop-shadow(0 5px 0 #5c4406)
            drop-shadow(0 8px 18px rgba(0,0,0,0.55));
        }

        /* 2 — FONT: light face + gold bevel + bronze depth (ref image 2) */
        .mt-font-bevel {
          background: linear-gradient(180deg, #fafafa 0%, #e6e6e6 50%, #d0d0d0 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 2px #d4af37;
          filter:
            drop-shadow(0 1px 0 #b87333)
            drop-shadow(0 2px 0 #8b5a2b)
            drop-shadow(0 3px 0 #6b4423)
            drop-shadow(0 4px 0 #4a2f18)
            drop-shadow(0 6px 0 #2f1d0e)
            drop-shadow(0 10px 22px rgba(0,0,0,0.35));
        }

        /* 3 — PRINCE: polished gold + sparkle dots (ref image 3) */
        .mt-prince {
          position: relative;
          display: inline-block;
          background: linear-gradient(
            165deg,
            #fff6c8 0%,
            #ffe566 15%,
            #d4af37 40%,
            #b8860b 60%,
            #8b6914 80%,
            #f0d060 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 1px 0 #a67c00)
            drop-shadow(0 2px 0 #8a6600)
            drop-shadow(0 3px 0 #6e5200)
            drop-shadow(0 4px 0 #4a3800)
            drop-shadow(0 8px 20px rgba(0,0,0,0.7));
        }
        .mt-prince::before,
        .mt-prince::after {
          content: "✦";
          position: absolute;
          color: #fff8dc;
          font-size: 0.35em;
          font-style: normal;
          text-shadow: 0 0 8px #ffd700, 0 0 16px #ffec8b;
          -webkit-text-fill-color: #fff8dc;
          background: none;
          filter: none;
          pointer-events: none;
        }
        .mt-prince::before { top: -0.15em; left: 8%; }
        .mt-prince::after { top: 0.1em; right: 6%; }

        /* 4 — Soft luxury gold (less extrusion, more glow) */
        .mt-soft-gold {
          background: linear-gradient(180deg, #f5e6a8 0%, #e8c547 35%, #c9a227 70%, #a67c00 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 0 12px rgba(212,175,55,0.45))
            drop-shadow(0 2px 0 #6b5200)
            drop-shadow(0 4px 12px rgba(0,0,0,0.5));
        }

        /* 5 — Dual-tone chrome gold (face bright, deep side) */
        .mt-chrome {
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
          -webkit-text-stroke: 0.5px rgba(255, 236, 160, 0.4);
          filter:
            drop-shadow(1px 0 0 #5c4406)
            drop-shadow(0 1px 0 #5c4406)
            drop-shadow(2px 2px 0 #3d2e04)
            drop-shadow(3px 3px 0 #2a2003)
            drop-shadow(4px 5px 0 #1a1402)
            drop-shadow(0 10px 24px rgba(0,0,0,0.65));
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d4af37]">METALLIC SAMPLES</p>
            <h1 className="text-lg font-bold">찬스부동산 경매중개 · 메탈릭 타이틀 5안</h1>
          </div>
          <Link href="/" className="text-sm text-[#d4af37] hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 pb-16 md:px-8">
        <p className="text-sm text-[#a3a3a3]">
          첨부 이미지(골드/실버 3D, 베벨 FONT, 폴리시드 PRINCE)를 참고한 CSS 샘플입니다. 홈에는 아직
          미적용입니다.
        </p>

        <Frame title="1번 · Silver Face + Gold Depth" refNote="참고: GOLD — 실버 페이스 + 골드 압출">
          <h1 className="mt-serif mt-gold-silver">{TITLE}</h1>
        </Frame>

        <Frame
          title="2번 · Light Face + Gold Bevel"
          refNote="참고: FONT — 밝은 페이스 + 골드 베벨 + 브론즈 깊이"
          light
        >
          <h1 className="mt-serif mt-font-bevel">{TITLE}</h1>
        </Frame>

        <Frame title="3번 · Polished Gold + Sparkle" refNote="참고: PRINCE — 폴리시드 골드 + 스파클">
          <h1 className="mt-serif mt-prince">{TITLE}</h1>
        </Frame>

        <Frame title="4번 · Soft Luxury Glow" refNote="압출을 줄이고 골드 글로우 강조 · 히어로 사진 위에도 잘 읽힘">
          <h1 className="mt-serif mt-soft-gold">{TITLE}</h1>
        </Frame>

        <Frame title="5번 · Chrome Gold Dual-Tone" refNote="하이라이트↔브론즈 이중 톤 · 강한 메탈릭 대비">
          <h1 className="mt-serif mt-chrome">{TITLE}</h1>
        </Frame>
      </main>
    </div>
  );
}
