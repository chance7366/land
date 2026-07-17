import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isAdminAuthEnabled } from "@/lib/admin-auth";

export { dynamic } from "@/lib/page-config";

export default function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-landing-bg text-landing-text">
      <AdminSidebar authEnabled={isAdminAuthEnabled()} />
      <div className="ml-56 min-w-0 flex-1">{children}</div>
    </div>
  );
}
