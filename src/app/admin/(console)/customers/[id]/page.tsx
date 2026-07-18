import { notFound } from "next/navigation";
import { AdminCustomerDetailClient } from "@/components/admin/customers/AdminCustomerDetailClient";
import { findRelatedByPhone, getCustomer } from "@/lib/customers/service";
import { withDbFallback } from "@/lib/db-fallback";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await withDbFallback(`admin-customer-${id}`, () => getCustomer(id), null);
  if (!item) notFound();

  const related = await withDbFallback(
    `admin-customer-related-${id}`,
    () => findRelatedByPhone(item.phone),
    { consultations: [], subscribers: [] },
  );

  return <AdminCustomerDetailClient initial={item} related={related} />;
}
