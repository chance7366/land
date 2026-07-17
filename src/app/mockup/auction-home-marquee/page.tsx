import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { AuctionCardGlass } from "@/components/auction/AuctionCardGlass";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "디자인 목업 | 홈 경매 마퀴 가격 배치",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AuctionHomeMarqueeMockupPage() {
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
        샘플 · 홈 마퀴만: 감정가·최저가 → 본문(구 권리분석·메모 자리). 권리분석·메모 삭제. /auctions 카드는 기존 유지.
      </div>
      <LandingHeader />
      <LandingNav />

      <main className="pb-24">
        <section className="border-b border-white/5 bg-[#0a0a0a] py-10">
          <div className="mx-auto mb-4 max-w-6xl px-container-padding-mobile md:px-8">
            <h1 className="text-lg font-bold text-[#d4af37]">홈 추천 경매 마퀴</h1>
            <p className="mt-1 text-xs text-[#a3a3a3]">
              이미지: 유형·D-day만 · 본문: 소재지 → 사건번호|매각기일 → 감정가 → 최저가
            </p>
          </div>
          <FeaturedPicksMarquee
            properties={properties}
            auctions={auctions}
            cardSize="sm"
            rowHeadings="accent"
            layout="contained"
            isMockup
            mockupNote="홈 전용 · 감정가/최저가 본문 배치 · 권리분석·메모 없음"
          />
        </section>

        <section className="mx-auto max-w-6xl px-container-padding-mobile py-8 md:px-8">
          <h2 className="mb-2 text-lg font-bold text-[#a3a3a3]">
            비교 · /auctions 카드 (변경 없음)
          </h2>
          <p className="mb-6 text-xs text-[#737373]">
            목록 페이지는 이미지 우측 상단 가격 + 권리분석·메모 유지
          </p>
          <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 sm:justify-items-stretch lg:grid-cols-3">
            {auctions.slice(0, 3).map((a) => (
              <AuctionCardGlass key={a.id} auction={a} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-[#737373]">
        <Link href="/" className="text-[#4dabff] hover:underline">
          ← 홈
        </Link>
        {" · "}
        <Link href="/auctions" className="text-[#d4af37] hover:underline">
          /auctions
        </Link>
      </footer>
    </LandingShell>
  );
}
