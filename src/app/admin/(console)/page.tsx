import { AdminDashboardView } from "@/components/admin/dashboard/AdminDashboardView";
import { getAdminDashboardPayload } from "@/lib/supabase/repos/dashboard-stats";

export { dynamic } from "@/lib/page-config";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardPayload();
  return <AdminDashboardView data={data} />;
}
