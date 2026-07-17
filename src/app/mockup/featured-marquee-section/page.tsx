import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "디자인 목업 | 마퀴 전폭 · 헤딩 max-w-6xl",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function FeaturedMarqueeSectionMockupPage() {
  const [properties, auctions] = await Promise.all([
    prisma.property.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    }),
    prisma.auction.findMany({
      where: { status: "ONGOING" },
      orderBy: [{ featured: "desc" }, { dDay: "asc" }],
    }),
  ]);

  return (
    <LandingShell>
      <div className="border-b border-[#4dabff]/30 bg-[rgba(77,171,255,0.1)] px-4 py-2 text-center text-xs text-[#4dabff]">
        샘플 · 추천 매물/경매 헤딩·더보기는 당초 max-w-6xl · 카드 마퀴만 섹션 전폭. 홈 미적용.
      </div>
      <LandingHeader />
      <LandingNav />
      <main>
        <div className="border-b border-white/5 px-container-padding-mobile py-6 md:px-8">
          <h1 className="text-lg font-bold text-white">헤딩 유지 · 마퀴 전폭</h1>
          <p className="mt-1 text-xs text-[#a3a3a3]">
            「추천 매물 / 추천 경매 + 더보기」는 기존 너비, 카드 트랙만 섹션 가로 전체
          </p>
        </div>
        <FeaturedPicksMarquee
          properties={properties}
          auctions={auctions}
          isMockup
          cardSize="sm"
          rowHeadings="accent"
          layout="section"
          mockupNote="샘플 · 헤딩 max-w-6xl 유지 · 마퀴 트랙 섹션 전폭 · 승인 시 홈 layout=section"
        />
      </main>
      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-[#737373]">
        <Link href="/" className="text-[#4dabff] hover:underline">
          ← 홈
        </Link>
        {" · "}
        <Link
          href="/mockup/featured-marquee-contained"
          className="text-[#d4af37] hover:underline"
        >
          기존 contained 비교
        </Link>
      </footer>
    </LandingShell>
  );
}
