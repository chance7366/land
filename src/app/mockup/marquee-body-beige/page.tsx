import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { getLandingFeaturedData } from "@/lib/data";

export const metadata: Metadata = {
  title: "디자인 목업 | 마퀴 카드 페이퍼 본문",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Sample: cream paper panel (#F5F2E7) + forest green body text (#1B4D3E).
 * Meta rows flat, white on dark card — no pill box.
 */
export default async function MarqueeBodyPaperMockupPage() {
  const data = await getLandingFeaturedData();

  return (
    <LandingShell>
      <div className="border-b border-white/10 bg-[#0e1a14] px-4 py-2 text-center text-xs text-[#c8e6d2]">
        샘플 · 본문 페이퍼(#F5F2E7) + 숲녹(#1B4D3E) · 주소/사건번호 흰색·박스 없음 · 홈 미적용.{" "}
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
          typeTone="bright"
          bodyTone="paper"
          isMockup
          mockupNote="크림 페이퍼 본문 + 숲녹 텍스트 · 제목 파랑/노랑 유지 · 하단 메타는 흰색(박스 없음)"
        />
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
