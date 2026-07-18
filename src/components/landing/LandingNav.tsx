"use client";

import { useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";

type NavChild = { href: string; label: string };

type NavItem =
  | { href: string; label: string; accent: string; children?: undefined }
  | { href: string; label: string; accent: string; children: readonly NavChild[] };

const NAV: readonly NavItem[] = [
  { href: "/properties", label: "부동산중개", accent: "#4dabff" },
  {
    href: "/auctions",
    label: "경매공매",
    accent: "#d4af37",
    children: [
      { href: "/auctions", label: "경매물건" },
      { href: "/auctions/process", label: "경매절차" },
      { href: "/auctions/bidding", label: "입찰안내" },
    ],
  },
  { href: "/news", label: "부동산·지역소식", accent: "#d450ff" },
  { href: "/legal", label: "찬스상담소", accent: "#34d399" },
  { href: "/success-stories", label: "성공스토리", accent: "#fbbf24" },
  { href: "/profile", label: "프로필", accent: "#f472b6" },
  { href: "/location", label: "찾아오시는 길", accent: "#38bdf8" },
];

const HOME_ITEM: NavItem = { href: "/", label: "홈", accent: "#f97316" };

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LandingNav() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const items = isHomePage ? [...NAV] : [HOME_ITEM, ...NAV];
  const [auctionOpen, setAuctionOpen] = useState(false);

  return (
    <nav
      aria-label="서비스 메뉴"
      className="relative z-30 border-b border-landing-border bg-landing-bg"
    >
      <ul className="mx-auto flex max-w-6xl items-stretch justify-start gap-0 overflow-x-auto overscroll-x-contain px-container-padding-mobile [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center md:gap-2 md:overflow-visible md:px-8 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const children = item.children;
          const active = children
            ? pathname === "/auctions" || pathname.startsWith("/auctions/")
            : isActivePath(pathname, item.href);

          if (children) {
            return (
              <li
                key={item.label}
                className="relative shrink-0"
                onMouseEnter={() => setAuctionOpen(true)}
                onMouseLeave={() => setAuctionOpen(false)}
              >
                <Link
                  href={item.href}
                  aria-haspopup="menu"
                  aria-expanded={auctionOpen}
                  style={{ ["--nav-accent" as string]: item.accent }}
                  className={`flex h-11 w-full items-center justify-center whitespace-nowrap border-b-2 px-2.5 text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs md:px-5 md:text-sm ${
                    active
                      ? "border-[color:var(--nav-accent)] text-[color:var(--nav-accent)]"
                      : "border-transparent text-landing-muted hover:border-[color:var(--nav-accent)] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
                {auctionOpen ? (
                  <ul
                    role="menu"
                    className="absolute left-1/2 top-full z-40 min-w-[10.5rem] -translate-x-1/2 overflow-hidden rounded-xl border border-[#d4af37]/35 bg-[#14100a]/95 py-1 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md"
                  >
                    {children.map((child) => {
                      const childActive =
                        child.href === "/auctions"
                          ? pathname === "/auctions"
                          : pathname === child.href || pathname.startsWith(`${child.href}/`);
                      return (
                        <li key={child.href} role="none">
                          <Link
                            role="menuitem"
                            href={child.href}
                            className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                              childActive
                                ? "bg-[#d4af37]/15 text-[#fbbf24]"
                                : "text-white/80 hover:bg-white/5 hover:text-[#fbbf24]"
                            }`}
                            onClick={() => setAuctionOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          }

          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                style={{ ["--nav-accent" as string]: item.accent }}
                className={`flex h-11 items-center justify-center whitespace-nowrap border-b-2 px-2.5 text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs md:px-5 md:text-sm ${
                  active
                    ? "border-[color:var(--nav-accent)] text-[color:var(--nav-accent)]"
                    : "border-transparent text-landing-muted hover:border-[color:var(--nav-accent)] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
