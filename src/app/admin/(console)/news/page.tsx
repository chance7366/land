import { AdminNewsFeedClient } from "@/components/admin/AdminNewsFeedClient";
import { loadAdminNewsHealthRows } from "@/lib/admin-news-health";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const initialRows = await loadAdminNewsHealthRows();
  return <AdminNewsFeedClient initialRows={initialRows} />;
}
