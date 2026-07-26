import { AdminCustomersClient } from "@/components/admin/customers/AdminCustomersClient";
import { listCustomers } from "@/lib/customers/service";
import { withDbFallback } from "@/lib/db-fallback";

export const dynamic = "force-dynamic";

type CustomersView = "dashboard" | "list" | "create";

function parseView(raw: string | string[] | undefined): CustomersView {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "list" || v === "create" || v === "dashboard") return v;
  return "dashboard";
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const sp = await searchParams;
  const items = await withDbFallback("admin-customers", () => listCustomers(), []);
  return (
    <AdminCustomersClient initialItems={items} initialView={parseView(sp.view)} />
  );
}
