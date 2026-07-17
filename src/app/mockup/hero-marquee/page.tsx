import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 문구 마퀴",
  robots: { index: false, follow: false },
};

const TEXT = "홍성·예산·서산·당진·천안·대전·세종 부동산 매매·임대와 전국 경매 물건 추천";

function Frame({
  n,
  name,
  note,
  children,
}: {
  n: number;
  name: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10">
      <div className="border-b border-white/10 bg-[#121212] px-4 py-3">
        <h2 className="text-sm font-bold text-white">
          {n}번 · {name}
        </h2>
        <p className="mt-1 text-xs text-[#a3a3a3]">{note}</p>
      </div>
      <div className="relative bg-[#0a0a0a] px-0 py-14">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(80,60,20,0.2), transparent 70%)",
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </section>
  );
}

export default function HeroMarqueeSamplesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{`
        .mq-serif {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          color: #fff;
          white-space: nowrap;
        }

        @keyframes mq-rtl {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .mq-track {
          display: flex;
          width: max-content;
          animation: mq-rtl 28s linear infinite;
        }
        .mq-track--fast {
          animation-duration: 16s;
        }
        .mq-track--slow {
          animation-duration: 40s;
        }

        .mq-item {
          display: inline-flex;
          align-items: center;
          padding: 0 2.5rem;
        }
        .mq-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          margin: 0 1.25rem;
          border-radius: 9999px;
          background: #d4af37;
          opacity: 0.8;
        }

        .mq-mask {
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }

        .mq-fade-edges {
          position: relative;
        }
        .mq-fade-edges::before,
        .mq-fade-edges::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 64px;
          z-index: 2;
          pointer-events: none;
        }
        .mq-fade-edges::before {
          left: 0;
          background: linear-gradient(90deg, #0a0a0a, transparent);
        }
        .mq-fade-edges::after {
          right: 0;
          background: linear-gradient(270deg, #0a0a0a, transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .mq-track {
            animation: none;
            justify-content: center;
            width: 100%;
          }
          .mq-track .mq-item:nth-child(n + 2) {
            display: none;
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d4af37]">MARQUEE SAMPLES</p>
            <h1 className="text-lg font-bold">히어로 안내 문구 · 우→좌 반복</h1>
          </div>
          <Link href="/" className="text-sm text-[#d4af37] hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 pb-16 md:px-8">
        <p className="text-sm text-[#a3a3a3]">
          오른쪽에서 왼쪽으로 흐르며 끊김 없이 반복되는 마퀴(티커) 샘플입니다. 홈에는 아직 미적용입니다.
        </p>

        <Frame n={1} name="기본 마퀴 (추천)" note="동일 문구 2번 이어 붙여 루프 · 양끝 페이드 · 약 28초">
          <div className="mq-fade-edges overflow-hidden">
            <div className="mq-track">
              {[0, 1].map((copy) => (
                <span key={copy} className="mq-item mq-serif">
                  {TEXT}
                  <span className="mq-dot" aria-hidden />
                  {TEXT}
                  <span className="mq-dot" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </Frame>

        <Frame n={2} name="빠른 티커" note="같은 구조, 속도만 빠르게 (16초) · 임팩트 강조">
          <div className="mq-fade-edges overflow-hidden">
            <div className="mq-track mq-track--fast">
              {[0, 1].map((copy) => (
                <span key={copy} className="mq-item mq-serif">
                  {TEXT}
                  <span className="mq-dot" aria-hidden />
                  {TEXT}
                  <span className="mq-dot" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </Frame>

        <Frame n={3} name="느린 우아한 흐름" note="40초 · 여유 있는 고급 톤 · 히어로 사진 위에 잘 어울림">
          <div className="mq-fade-edges overflow-hidden">
            <div className="mq-track mq-track--slow">
              {[0, 1].map((copy) => (
                <span key={copy} className="mq-item mq-serif text-[#d4af37]">
                  {TEXT}
                  <span className="mq-dot" aria-hidden />
                  {TEXT}
                  <span className="mq-dot" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </Frame>
      </main>
    </div>
  );
}
