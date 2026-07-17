import { AdminLegalQuestionsClient } from "@/components/admin/AdminLegalQuestionsClient";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLegalQuestionsPage() {
  const items = await withDbFallback(
    "admin-legal",
    () => prisma.legalQuestion.findMany({ orderBy: { createdAt: "desc" } }),
    [],
  );
  return <AdminLegalQuestionsClient initialItems={items} />;
}
