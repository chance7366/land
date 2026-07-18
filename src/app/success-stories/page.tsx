import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { SuccessStoryBoardClient } from "@/components/success-stories/SuccessStoryBoardClient";
import { UserBottomNav } from "@/components/user/UserShell";
import { maskStoryAuthor } from "@/lib/success-story";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { listSuccessStoriesFromSupabase } from "@/lib/supabase/repos/catalog";

export const metadata: Metadata = {
  title: "성공스토리 | 찬스부동산 경매중개",
  description: "부동산중개·경매공매 고객 성공 후기",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ id?: string }>;

export default async function SuccessStoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id: openId } = await searchParams;
  const rows = await withDbFallback(
    "success-stories-page",
    async () => {
      if (isSupabaseEnabled()) return listSuccessStoriesFromSupabase(200);
      return prisma.successStory.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 200,
      });
    },
    [],
  );

  const initialItems = rows.map((row) => ({
    id: row.id,
    category: row.category,
    title: row.title,
    content: row.content,
    authorMasked: maskStoryAuthor(row.authorName || "익명"),
    createdAt: row.createdAt.toISOString(),
  }));

  return (
    <LandingShell>
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10">
          <SuccessStoryBoardClient initialItems={initialItems} initialOpenId={openId ?? null} />
        </div>
      </div>
      <LandingFooter />
      <UserBottomNav />
    </LandingShell>
  );
}
