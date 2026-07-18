import { AdminCustomersClient } from "@/components/admin/customers/AdminCustomersClient";
import { listCustomers } from "@/lib/customers/service";
import { withDbFallback } from "@/lib/db-fallback";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const items = await withDbFallback("admin-customers", () => listCustomers(), []);
  return <AdminCustomersClient initialItems={items} />;
}
