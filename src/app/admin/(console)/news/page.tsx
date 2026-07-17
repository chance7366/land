import { AdminNewsFeedClient } from "@/components/admin/AdminNewsFeedClient";
import { loadAdminNewsHealthRows } from "@/lib/admin-news-health";
import { withDbFallback } from "@/lib/db-fallback";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const initialRows = await withDbFallback("admin-news", () => loadAdminNewsHealthRows(), []);
  return <AdminNewsFeedClient initialRows={initialRows} />;
}
