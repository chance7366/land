import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | 글자 디자인 5종",
  robots: { index: false, follow: false },
};

const TITLE = "찬스부동산 경매중개";

function Frame({
  n,
  name,
  note,
  children,
  light,
}: {
  n: number;
  name: string;
  note: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10">
      <div className="border-b border-white/10 bg-[#121212] px-4 py-3">
        <h2 className="text-sm font-bold text-white">
          {n}번 · {name}
        </h2>
        <p className="mt-1 text-xs text-[#a3a3a3]">{note}</p>
      </div>
      <div
        className={`relative flex min-h-[240px] items-center justify-center px-4 py-16 ${
          light ? "bg-[#ececec]" : "bg-[#080808]"
        }`}
      >
        {!light && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(100,75,20,0.25), transparent 70%)",
            }}
          />
        )}
        <div className="relative z-10 text-center">{children}</div>
      </div>
    </section>
  );
}

export default function LetterDesignSamplesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{`
        /* 공통: 폰트는 무시하고 굵기·자간만 — 효과로 글자를 디자인 */
        .ld {
          font-family: system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
          font-weight: 900;
          font-size: clamp(1.85rem, 5.2vw, 3.25rem);
          line-height: 1.3;
          letter-spacing: 0.04em;
          display: inline-block;
        }

        /* 1 — 입체 골드 블록 (압출 레이어) */
        .ld-1-wrap { position: relative; display: inline-block; }
        .ld-1-depth, .ld-1-face {
          font-family: inherit;
          font-weight: 900;
          font-size: inherit;
          letter-spacing: inherit;
          line-height: inherit;
        }
        .ld-1-depth {
          position: absolute;
          inset: 0;
          color: #5c3d00;
          transform: translate(4px, 5px);
          text-shadow:
            1px 1px 0 #4a3200,
            2px 2px 0 #3d2800,
            3px 3px 0 #2f1f00,
            4px 4px 0 #241800;
          z-index: 0;
          user-select: none;
        }
        .ld-1-face {
          position: relative;
          z-index: 1;
          background: linear-gradient(180deg, #fff6c8, #ffd700 30%, #d4af37 60%, #b8860b);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 1px rgba(255,220,100,0.5);
        }

        /* 2 — 실버 페이스 + 골드 테두리 링 */
        .ld-2 {
          background: linear-gradient(180deg, #fff 0%, #e8e8e8 45%, #bdbdbd 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 2.5px #d4af37;
          paint-order: stroke fill;
          filter:
            drop-shadow(0 2px 0 #8b6914)
            drop-shadow(0 4px 0 #5c4406)
            drop-shadow(0 8px 16px rgba(0,0,0,0.55));
        }

        /* 3 — 양각 메탈 (안쪽 그림자 + 하이라이트) */
        .ld-3 {
          color: #c9a227;
          background: none;
          text-shadow:
            0 -1px 0 #fff3c4,
            0 1px 0 #5c4406,
            0 2px 0 #3d2e04,
            0 3px 0 #2a2003,
            0 6px 14px rgba(0,0,0,0.6),
            inset 0 0 0 transparent;
          filter: contrast(1.05);
        }
        .ld-3-inner {
          background: linear-gradient(180deg, #f5e6a8, #a67c00);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 -1px 0 rgba(255,255,255,0.55))
            drop-shadow(0 2px 0 rgba(60,40,0,0.85))
            drop-shadow(0 5px 12px rgba(0,0,0,0.5));
        }

        /* 4 — 크롬 반사 줄무늬 */
        .ld-4 {
          background: linear-gradient(
            115deg,
            #6b5200 0%,
            #f5e6a8 18%,
            #fff 28%,
            #d4af37 42%,
            #5c4406 55%,
            #ffe566 68%,
            #8b6914 82%,
            #fff6c8 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(2px 2px 0 #2a2003)
            drop-shadow(3px 4px 0 #1a1402)
            drop-shadow(0 10px 20px rgba(0,0,0,0.65));
          animation: ld-shine 4s linear infinite;
        }
        @keyframes ld-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ld-4 { animation: none; }
        }

        /* 5 — 이중 글자 스택 (아웃라인 + 솔리드) */
        .ld-5-wrap { position: relative; display: inline-block; }
        .ld-5-outline, .ld-5-fill {
          font: inherit;
          letter-spacing: inherit;
        }
        .ld-5-outline {
          position: absolute;
          inset: 0;
          color: transparent;
          -webkit-text-stroke: 3px #d4af37;
          transform: translate(3px, 3px);
          z-index: 0;
          user-select: none;
        }
        .ld-5-fill {
          position: relative;
          z-index: 1;
          background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 1.5px #f0d060;
          filter: drop-shadow(0 0 18px rgba(212,175,55,0.35));
        }
        .ld-5-on-light .ld-5-fill {
          background: linear-gradient(180deg, #2a2a2a, #111);
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d4af37]">LETTER DESIGN</p>
            <h1 className="text-lg font-bold">폰트 무시 · 글자 디자인 5안</h1>
          </div>
          <Link href="/" className="text-sm text-[#d4af37] hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 pb-16 md:px-8">
        <p className="text-sm text-[#a3a3a3]">
          서체 선택은 최소화하고, 압출·테두리·양각·크롬 반사·이중 스택 등{" "}
          <strong className="text-white">글자 표면 디자인</strong>만 다르게 한 샘플입니다.
        </p>

        <Frame n={1} name="입체 골드 블록" note="뒤 레이어로 두께를 만들고, 앞면에 골드 그라데이션">
          <span className="ld ld-1-wrap">
            <span className="ld-1-depth" aria-hidden>
              {TITLE}
            </span>
            <span className="ld-1-face">{TITLE}</span>
          </span>
        </Frame>

        <Frame n={2} name="실버 페이스 + 골드 링" note="밝은 글자 면 + 두꺼운 골드 외곽선 + 하단 압출">
          <span className="ld ld-2">{TITLE}</span>
        </Frame>

        <Frame n={3} name="양각 메탈" note="위 하이라이트·아래 그림자로 파낸 듯한 금속 양각">
          <span className="ld ld-3-inner">{TITLE}</span>
        </Frame>

        <Frame n={4} name="크롬 반사 줄무늬" note="메탈 반사 그라데이션이 글자 위를 지나가는 효과">
          <span className="ld ld-4">{TITLE}</span>
        </Frame>

        <Frame n={5} name="이중 스택 아웃라인" note="골드 외곽 글자 위에 다크 페이스를 겹친 로고형">
          <span className="ld ld-5-wrap">
            <span className="ld-5-outline" aria-hidden>
              {TITLE}
            </span>
            <span className="ld-5-fill">{TITLE}</span>
          </span>
        </Frame>
      </main>
    </div>
  );
}
