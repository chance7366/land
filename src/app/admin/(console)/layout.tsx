import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isAdminAuthEnabled } from "@/lib/admin-auth";

export { dynamic } from "@/lib/page-config";

export default function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-landing-bg text-landing-text md:flex-row">
      <AdminSidebar authEnabled={isAdminAuthEnabled()} />
      {/* 모바일: 하단 네비 여백 / 데스크톱: 좌측 사이드바 여백 */}
      <div className="min-w-0 flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] md:ml-56 md:pb-0">
        {children}
      </div>
    </div>
  );
}
