import { AdminSuccessStoriesClient } from "@/components/admin/AdminSuccessStoriesClient";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const items = await withDbFallback(
    "admin-reviews",
    () => prisma.successStory.findMany({ orderBy: { createdAt: "desc" } }),
    [],
  );
  return <AdminSuccessStoriesClient initialItems={items} />;
}
