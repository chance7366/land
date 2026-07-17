import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { R114WikiSampleClient } from "@/components/mockup/R114WikiSampleClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 부동산114 위키",
  robots: { index: false, follow: false },
};

export default function R114NewsMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-[#d450ff]/30 bg-[#120818] px-4 py-2 text-center text-xs text-[#e9d5ff]">
        샘플 · 부동산114 위키 · 카테고리 아이콘 · 키워드 · 원문보기{" "}
        <Link href="/" className="text-[#f0abfc] hover:underline">
          ← 홈
        </Link>
        {" · "}
        <Link href="/mockup/rtech-news" className="text-white/40 hover:underline">
          부동산테크 샘플
        </Link>
        {" · "}
        <Link href="/news?source=r114" className="text-white/40 hover:underline">
          현재 /news
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10">
          <R114WikiSampleClient />
        </div>
      </div>
      <LandingFooter />
    </LandingShell>
  );
}
