import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { R114WikiDetailSample } from "@/components/mockup/R114WikiDetailSample";
import { getR114WikiById, MOCK_R114_WIKI } from "@/lib/mockup/r114-wiki-sample";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return MOCK_R114_WIKI.map((row) => ({ id: row.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = getR114WikiById(id);
  return {
    title: item ? `디자인 목업 | ${item.title}` : "디자인 목업 | 부동산114",
    robots: { index: false, follow: false },
  };
}

export default async function R114NewsDetailMockupPage({ params }: Props) {
  const { id } = await params;
  const item = getR114WikiById(id);
  if (!item) notFound();

  return (
    <LandingShell>
      <div className="border-b border-[#d450ff]/30 bg-[#120818] px-4 py-2 text-center text-xs text-[#e9d5ff]">
        샘플 · 부동산114 상세{" "}
        <Link href="/mockup/r114-news" className="text-[#f0abfc] hover:underline">
          ← 목록
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
          <R114WikiDetailSample item={item} />
        </div>
      </div>
      <LandingFooter />
    </LandingShell>
  );
}
