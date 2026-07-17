import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { getLandingFeaturedData } from "@/lib/data";

export const metadata: Metadata = {
  title: "디자인 목업 | 마퀴 카드 타이포 bright",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Sample typeTone=bright:
 * 1) address + date — same 11px, aligned height, white bold
 * 2) price — slightly larger, bright pink
 * 3) auction case/sale date — white
 */
export default async function MarqueeTypeBrightMockupPage() {
  const data = await getLandingFeaturedData();

  return (
    <LandingShell>
      <div className="border-b border-white/10 bg-[#0e1a14] px-4 py-2 text-center text-xs text-[#c8e6d2]">
        샘플 · 주소/날짜 흰·동일크기 · 가격 밝은분홍·조금크게 · 경매메타 흰색 · 홈 미적용.{" "}
        <Link href="/" className="text-[#9fd4b5] hover:underline">
          ← 홈
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <main>
        <FeaturedPicksMarquee
          properties={data.properties}
          auctions={data.auctions}
          cardSize="sm"
          rowHeadings="accent"
          layout="section"
          isMockup
          typeTone="bright"
          mockupNote="1) 주소·날짜: 동일 11px·높이 맞춤·흰 굵게  2) 가격: sm→조금 크게·#f472b6  3) 사건번호·매각기일: 흰색"
        />
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
