import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { QaBoardClient } from "@/components/legal/QaBoardClient";
import { maskAuthor } from "@/lib/qa";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "찬스상담소 | 찬스부동산 경매중개",
  description: "부동산 중개·경매·세무·법률 찬스상담소",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ id?: string }>;

export default async function LegalPage({ searchParams }: { searchParams: SearchParams }) {
  const { id: openId } = await searchParams;
  const rows = await withDbFallback(
    "legal-page",
    () =>
      prisma.legalQuestion.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    [],
  );

  const initialItems = rows.map((row) => ({
    id: row.id,
    category: row.category,
    question: row.question,
    authorMasked: maskAuthor(row.authorName || "익명"),
    isSecret: row.isSecret,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    hasAnswer: Boolean(row.answer),
  }));

  return (
    <LandingShell>
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden">
        <div className="hr-aurora-layer hr-aurora-sapphire pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10">
          <QaBoardClient initialItems={initialItems} initialOpenId={openId ?? null} />
        </div>
      </div>
      <LandingFooter />
    </LandingShell>
  );
}
