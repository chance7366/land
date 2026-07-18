"use client";

import { AppLink as Link } from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  CalendarDays,
  CircleHelp,
  Gavel,
  LayoutDashboard,
  Newspaper,
  Search,
  Star,
  User,
  Users,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "대시보드", Icon: LayoutDashboard },
  { href: "/admin/customers", label: "고객 관리", Icon: Users },
  { href: "/admin/properties", label: "매물 관리", Icon: Search },
  { href: "/admin/auctions", label: "경매 관리", Icon: Gavel },
  { href: "/admin/news", label: "부동산 소식", Icon: Newspaper },
  { href: "/admin/subscriptions", label: "맞춤 알림", Icon: Bell },
  { href: "/admin/reviews", label: "성공스토리", Icon: Star },
  { href: "/admin/consultations", label: "상담 예약", Icon: CalendarDays },
  { href: "/admin/legal", label: "찬스상담소", Icon: CircleHelp },
];

type AdminSidebarProps = {
  authEnabled: boolean;
};

export function AdminSidebar({ authEnabled }: AdminSidebarProps) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-56 flex-col border-r border-white/10 bg-white/[0.04] py-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mb-8 px-4">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-1 text-xs text-landing-muted hover:text-blue-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          사용자 페이지
        </Link>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 shrink-0 text-blue-400" aria-hidden />
          <h1 className="text-sm font-bold tracking-tight text-landing-text">찬스 관리자</h1>
        </div>
        <p className="text-[11px] text-landing-muted opacity-80">관리 콘솔</p>
        {!authEnabled && (
          <span className="mt-2 inline-block rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300">
            개발 · 인증 비활성
          </span>
        )}
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {NAV.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-full px-3 py-2.5 transition-all ${
                active
                  ? "scale-95 bg-gradient-to-r from-cta-from/25 to-cta-to/25 text-landing-text"
                  : "text-landing-muted hover:bg-white/5 hover:text-landing-text"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-white/10 px-4 pt-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cta-from to-cta-to text-white">
            <User className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-landing-text">관리자 님</p>
            <p className="text-[10px] text-landing-muted">
              {authEnabled ? "시스템 최고권한" : "개발 모드"}
            </p>
          </div>
        </div>
        {authEnabled ? (
          <button
            type="button"
            onClick={logout}
            className="mt-4 text-sm text-landing-muted hover:text-blue-400"
          >
            로그아웃
          </button>
        ) : (
          <p className="mt-3 text-[10px] leading-relaxed text-landing-muted">
            환경설정에서 관리자 로그인을 켜면 인증이 활성화됩니다.
          </p>
        )}
      </div>
    </aside>
  );
}
