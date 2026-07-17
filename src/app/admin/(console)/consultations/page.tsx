import { AdminConsultationsClient } from "@/components/admin/AdminConsultationsClient";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminConsultationsPage() {
  const items = await withDbFallback(
    "admin-consultations",
    () => prisma.consultation.findMany({ orderBy: { createdAt: "desc" } }),
    [],
  );

  // Serialize dates for client component
  const initialItems = items.map((row) => ({
    ...row,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    repliedAt: row.repliedAt,
  }));

  return <AdminConsultationsClient initialItems={initialItems} />;
}
