import type { LegalQuestionStatus } from "@prisma/client";
import { AdminLegalQuestionsClient } from "@/components/admin/AdminLegalQuestionsClient";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { listAllLegalQuestionsFromSupabase } from "@/lib/supabase/repos/catalog";

export const dynamic = "force-dynamic";

function serializeLegal(row: {
  id: string;
  category: string;
  question: string;
  content: string;
  authorName: string;
  phone: string | null;
  answer: string | null;
  answerer: string | null;
  status: string;
  isPublic: boolean;
  isSecret: boolean;
  accessCode: string;
  suggestConsult: boolean;
  answeredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...row,
    status: row.status as LegalQuestionStatus,
    answeredAt: row.answeredAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export default async function AdminLegalQuestionsPage() {
  const items = await withDbFallback(
    "admin-legal",
    async () => {
      const rows = isSupabaseEnabled()
        ? await listAllLegalQuestionsFromSupabase(500)
        : await prisma.legalQuestion.findMany({ orderBy: { createdAt: "desc" } });
      return rows.map(serializeLegal);
    },
    [],
  );
  return <AdminLegalQuestionsClient initialItems={items} />;
}
