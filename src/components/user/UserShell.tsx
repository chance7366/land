"use client";

import { AppLink as Link } from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ChannelShortcuts } from "@/components/landing/ChannelShortcuts";
import { ConsultHeaderButton } from "@/components/landing/ConsultHeaderButton";

const NAV_ITEMS = [
  { label: "부동산중개", icon: "home", href: "/properties" },
  { label: "경매공매", icon: "gavel", href: "/auctions" },
  { label: "부동산·지역소식", icon: "newspaper", href: "/news" },
  { label: "찬스상담소", icon: "balance", href: "/legal" },
  { label: "성공스토리", icon: "star", href: "/success-stories" },
  { label: "찾아오시는 길", icon: "location_on", href: "/location" },
];

function MaterialIcon({
  name,
  filled,
  className = "",
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      aria-hidden="true"
      style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
    >
      {name}
    </span>
  );
}

export function DashboardScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={containerRef}
      id="dashboard-scroll"
      className="flex snap-x snap-mandatory scroll-smooth gap-4 overflow-x-auto p-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:snap-none md:p-6 md:items-stretch"
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
}

export function UserBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 grid w-full grid-cols-4 border-t border-white/10 bg-landing-bg/85 py-3 backdrop-blur-xl md:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-colors ${
              active ? "text-blue-400" : "text-landing-muted hover:text-landing-text"
            }`}
          >
            <MaterialIcon name={item.icon} filled={active} />
            <span className={`font-caption ${active ? "font-bold" : "font-medium"}`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function UserHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-landing-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-container-padding-mobile py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <MaterialIcon name="gavel" className="text-2xl text-blue-400" />
          <span className="bg-gradient-to-r from-cta-from to-cta-to bg-clip-text font-['Times_New_Roman',serif] text-lg font-bold text-transparent">
            CHANCE REAL ESTATE & AUCTION
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden items-center gap-1 rounded-xl border border-landing-border px-3 py-2 text-landing-muted transition-colors hover:border-white/20 hover:text-landing-text sm:flex"
            title="관리자 페이지"
          >
            <MaterialIcon name="admin_panel_settings" className="text-lg" />
            <span className="font-label-md">관리자</span>
          </Link>
          <ConsultHeaderButton />
          <ChannelShortcuts />
        </div>
      </div>
    </header>
  );
}
