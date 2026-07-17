import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { getLandingFeaturedData } from "@/lib/data";

export const metadata: Metadata = {
  title: "디자인 목업 | 매물↔경매 행 간격",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const SAMPLES = [
  {
    rowGap: "default" as const,
    name: "현행",
    note: "mb-14 · 약 56px (현재 홈)",
  },
  {
    rowGap: "md" as const,
    name: "1안 · 약간 넓게",
    note: "mb-20 · 약 80px",
  },
  {
    rowGap: "lg" as const,
    name: "2안 · 넓게",
    note: "mb-24 · 약 96px",
  },
  {
    rowGap: "xl" as const,
    name: "3안 · 더 넓게",
    note: "mb-28 · 약 112px",
  },
  {
    rowGap: "2xl" as const,
    name: "4안 · 가장 넓게",
    note: "mb-32~36 · 약 128~144px",
  },
];

function GapDiagram({ gapClass, label }: { gapClass: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B0F19]">
      <div className="border-b border-white/10 bg-[#121622] px-4 py-2.5">
        <p className="text-sm font-bold text-[#4dabff]">{label}</p>
      </div>
      <div className="px-4 py-5">
        <div className="rounded-lg border border-[#4dabff]/30 bg-[#4dabff]/10 px-3 py-2 text-center text-[11px] font-bold text-[#93c5fd]">
          추천 매물 마퀴 트랙
        </div>
        <div
          className={`flex items-center justify-center border-x border-dashed border-white/15 bg-white/[0.03] text-[10px] font-mono text-[#facc15] ${gapClass}`}
        >
          ← 간격 →
        </div>
        <div className="rounded-lg border border-[#d4af37]/35 bg-[#d4af37]/10 px-3 py-2 text-center text-[11px] font-bold text-[#f5e6b8]">
          추천 경매 헤딩 · 절차 · 더보기
        </div>
      </div>
    </div>
  );
}

export default async function MarqueeRowGapMockupPage() {
  const data = await getLandingFeaturedData();

  return (
    <LandingShell>
      <LandingHeader />
      <LandingNav />

      <main className="space-y-10 pb-16">
        <header className="mx-auto max-w-5xl space-y-2 px-4 pt-10 md:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4dabff]">
            Mockup · Not applied to home
          </p>
          <h1 className="text-2xl font-bold text-white">
            추천매물 ↔ 추천경매 위·아래 간격
          </h1>
          <p className="max-w-2xl text-sm text-[#a3a3a3]">
            매물 마퀴와 경매 헤딩 사이 여백 샘플입니다. 아래에서 비교한 뒤 안 번호를 알려주세요.
          </p>
          <p className="text-xs text-[#737373]">
            <Link href="/" className="text-[#4dabff] underline-offset-2 hover:underline">
              홈으로
            </Link>
          </p>
        </header>

        <section className="mx-auto grid max-w-5xl gap-4 px-4 sm:grid-cols-2 md:px-6 lg:grid-cols-3">
          {SAMPLES.map((s) => (
            <GapDiagram
              key={s.rowGap}
              gapClass={
                s.rowGap === "default"
                  ? "h-14"
                  : s.rowGap === "md"
                    ? "h-20"
                    : s.rowGap === "lg"
                      ? "h-24"
                      : s.rowGap === "xl"
                        ? "h-28"
                        : "h-32 md:h-36"
              }
              label={`${s.name} · ${s.note}`}
            />
          ))}
        </section>

        <section className="space-y-8">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <h2 className="text-lg font-bold text-white">실데이터 미리보기 (2안 · lg)</h2>
            <p className="mt-1 text-sm text-[#a3a3a3]">
              실제 마퀴로 간격 체감용 · rowGap=&quot;lg&quot; (mb-24)
            </p>
          </div>
          <FeaturedPicksMarquee
            properties={data.properties}
            auctions={data.auctions}
            cardSize="sm"
            rowHeadings="accent"
            layout="section"
            typeTone="bright"
            rowGap="lg"
            isMockup
            mockupNote="샘플 · 매물 마퀴 ↔ 경매 헤딩 간격 lg(mb-24) · 홈 미적용"
          />
        </section>

        <section className="mx-auto max-w-5xl px-4 md:px-6">
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] text-[#a3a3a3]">
            원하는 안을 알려주세요: <strong className="text-white">현행 / 1안(md) / 2안(lg) /
            3안(xl) / 4안(2xl)</strong>
          </p>
        </section>
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
