import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { AuctionCardGlass } from "@/components/auction/AuctionCardGlass";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "디자인 목업 | 경매 카드 레이아웃",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AuctionCardFieldsMockupPage() {
  const [properties, auctions] = await Promise.all([
    prisma.property.findMany({
      where: { status: "ACTIVE" },
      take: 3,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.auction.findMany({
      where: { status: "ONGOING" },
      orderBy: [{ featured: "desc" }, { dDay: "asc" }],
    }),
  ]);

  return (
    <LandingShell>
      <div className="border-b border-[#d4af37]/30 bg-[rgba(212,175,55,0.1)] px-4 py-2 text-center text-xs text-[#d4af37]">
        샘플 · 배지 확대 · 소재지/권리분석/메모 마퀴 · 감정·최저가는 이미지 하단. 홈 마퀴 동일.
      </div>
      <LandingHeader />
      <LandingNav />

      <main className="pb-24">
        <section className="mx-auto max-w-6xl px-container-padding-mobile py-8 md:px-8">
          <h1 className="mb-2 text-lg font-bold text-[#d4af37]">
            경매 카드 [{auctions.length}건]
          </h1>
          <p className="mb-6 text-xs text-[#a3a3a3]">
            유형 배지↑ · D-day 분홍↑ · 소재지 마퀴 · 사건번호|매각기일 · 권리분석·메모 스크롤
          </p>
          <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 sm:justify-items-stretch lg:grid-cols-3">
            {auctions.map((a) => (
              <AuctionCardGlass key={a.id} auction={a} />
            ))}
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0a0a0a] py-10">
          <div className="mx-auto mb-4 max-w-6xl px-container-padding-mobile md:px-8">
            <h2 className="text-lg font-bold text-[#d4af37]">홈 추천 경매 마퀴</h2>
          </div>
          <FeaturedPicksMarquee
            properties={properties}
            auctions={auctions}
            cardSize="sm"
            rowHeadings="accent"
            layout="contained"
            isMockup
            mockupNote="홈 경매 마퀴에 동일 레이아웃 적용 미리보기"
          />
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-[#737373]">
        <Link href="/auctions" className="text-[#d4af37] hover:underline">
          /auctions
        </Link>
        {" · "}
        <Link href="/" className="text-[#4dabff] hover:underline">
          ← 홈
        </Link>
      </footer>
    </LandingShell>
  );
}
