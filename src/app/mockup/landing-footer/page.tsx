import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { getLandingFeaturedData } from "@/lib/data";

export const metadata: Metadata = {
  title: "디자인 목업 | 홈 사업자 정보 푸터",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LandingFooterMockupPage() {
  const data = await getLandingFeaturedData();

  return (
    <LandingShell>
      <div className="border-b border-[#d4af37]/30 bg-[rgba(212,175,55,0.1)] px-4 py-2 text-center text-xs text-[#d4af37]">
        샘플 · 헤더 브랜드 문구 · 채널/상담시간/바로가기 삭제 · 라벨 컬러 · 타이트 높이. 홈 미적용.
      </div>
      <LandingHeader />
      <LandingNav />
      <main>
        <div className="border-b border-white/5 px-container-padding-mobile py-8 md:px-8">
          <h1 className="text-lg font-bold text-white">사업자 정보 푸터</h1>
          <p className="mt-1 text-xs text-[#a3a3a3]">
            스크롤 하단에서 확인 · 승인 시 홈 메인에 동일 컴포넌트 적용
          </p>
        </div>
        <FeaturedPicksMarquee
          properties={data.properties.slice(0, 8)}
          auctions={data.auctions}
          cardSize="sm"
          rowHeadings="accent"
          layout="section"
        />
      </main>
      <LandingFooter />
      <div className="border-t border-white/10 bg-[#05070c] px-6 py-4 text-center text-xs text-[#737373]">
        <Link href="/" className="text-[#4dabff] hover:underline">
          ← 홈
        </Link>
        {" · "}
        홈에는 아직 미적용
      </div>
    </LandingShell>
  );
}
