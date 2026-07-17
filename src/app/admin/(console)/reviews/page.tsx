import { AdminSuccessStoriesClient } from "@/components/admin/AdminSuccessStoriesClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const items = await prisma.successStory.findMany({ orderBy: { createdAt: "desc" } });
  return <AdminSuccessStoriesClient initialItems={items} />;
}
