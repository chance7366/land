import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | Our Services 타이틀",
  robots: { index: false, follow: false },
};

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
      <div className="relative flex min-h-[160px] items-center justify-center bg-[#0a0a0a] px-4 py-12">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(80,60,20,0.2), transparent 70%)",
          }}
        />
        <div className="relative z-10 flex items-center justify-center gap-4">{children}</div>
      </div>
    </section>
  );
}

function GoldLines({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4af37] md:w-16" />
      {children}
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4af37] md:w-16" />
    </>
  );
}

export default function OurServicesTitleSamplesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <style>{`
        .os-serif {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 600;
          font-size: clamp(1.25rem, 2.5vw, 1.5rem);
          letter-spacing: 0.08em;
        }

        /* 1 — 현재 (비교용) */
        .os-1 { color: #fff; }

        /* 2 — 골드 단색 + 소프트 글로우 (참고 번짐 효과의 골드 버전) */
        .os-2 {
          color: #d4af37;
          text-shadow:
            0 0 8px rgba(212, 175, 55, 0.85),
            0 0 18px rgba(212, 175, 55, 0.55),
            0 0 32px rgba(212, 175, 55, 0.35);
        }

        /* 3 — 화이트 면 + 골드 글로우 */
        .os-3 {
          color: #fff;
          text-shadow:
            0 0 10px rgba(212, 175, 55, 0.7),
            0 0 22px rgba(212, 175, 55, 0.45),
            0 0 40px rgba(212, 175, 55, 0.25);
        }

        /* 4 — 크롬 골드 그라데이션 (히어로 타이틀과 톤 맞춤) */
        .os-4 {
          background: linear-gradient(180deg, #fff0b3 0%, #d4af37 45%, #8b6914 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.55))
            drop-shadow(0 2px 0 rgba(60, 40, 0, 0.5));
        }

        /* 5 — 네온 퍼플 글로우 (첨부 이미지 분석 톤) */
        .os-5 {
          color: #d450ff;
          text-shadow:
            0 0 8px rgba(212, 80, 255, 0.85),
            0 0 18px rgba(212, 80, 255, 0.55),
            0 0 32px rgba(212, 80, 255, 0.35);
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d4af37]">TITLE SAMPLES</p>
            <h1 className="text-lg font-bold">Our Services 제목 스타일</h1>
          </div>
          <Link href="/" className="text-sm text-[#d4af37] hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 pb-16 md:px-8">
        <p className="text-sm text-[#a3a3a3]">
          히어로 안 「Our Services」 제목용 샘플입니다. 2·3번은 첨부하신 번짐(글로우) 효과를 골드/화이트에
          적용한 안입니다.
        </p>

        <Frame n={1} name="현재" note="화이트 세리프 · 골드 라인 (지금 홈과 동일)">
          <GoldLines>
            <h2 className="os-serif os-1">Our Services</h2>
          </GoldLines>
        </Frame>

        <Frame n={2} name="골드 + 소프트 글로우 (추천)" note="글자색 골드 + 같은 색 외곽 번짐 · 카드 아이콘 톤과 통일">
          <GoldLines>
            <h2 className="os-serif os-2">Our Services</h2>
          </GoldLines>
        </Frame>

        <Frame n={3} name="화이트 + 골드 글로우" note="글자는 흰색, 후광만 골드 · 가독성 좋음">
          <GoldLines>
            <h2 className="os-serif os-3">Our Services</h2>
          </GoldLines>
        </Frame>

        <Frame n={4} name="크롬 골드 그라데이션" note="히어로 「찬스부동산 경매중개」와 비슷한 메탈 톤">
          <GoldLines>
            <h2 className="os-serif os-4">Our Services</h2>
          </GoldLines>
        </Frame>

        <Frame n={5} name="네온 퍼플 글로우" note="첨부 이미지(News)와 같은 마젠타 발광 · 참고용">
          <GoldLines>
            <h2 className="os-serif os-5">Our Services</h2>
          </GoldLines>
        </Frame>
      </main>
    </div>
  );
}
