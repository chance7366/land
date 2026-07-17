import { AdminLegalQuestionsClient } from "@/components/admin/AdminLegalQuestionsClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLegalQuestionsPage() {
  const items = await prisma.legalQuestion.findMany({ orderBy: { createdAt: "desc" } });
  return <AdminLegalQuestionsClient initialItems={items} />;
}
