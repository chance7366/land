"use client";

import { useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";

type NavChild = { href: string; label: string };

const ACCENT = "#d4af37";

const CHILDREN: readonly NavChild[] = [
  { href: "/auctions", label: "경매물건" },
  { href: "/auctions/process", label: "경매절차" },
  { href: "/auctions/bidding", label: "입찰안내" },
];

const NAV = [
  { href: "/", label: "홈", accent: "#f97316" },
  { href: "/properties", label: "부동산중개", accent: "#4dabff" },
  {
    href: "/auctions",
    label: "경매공매",
    accent: ACCENT,
    children: CHILDREN,
  },
  { href: "/news", label: "부동산소식", accent: "#d450ff" },
  { href: "/legal", label: "Q & A", accent: "#34d399" },
  { href: "/profile", label: "프로필", accent: "#f472b6" },
] as const;

/**
 * 샘플: 경매공매 = 링크(경매물건) + 호버 시 하위메뉴 / 화살표 없음
 */
export function AuctionNavClickSample() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="서비스 메뉴 (샘플)"
      className="relative z-30 border-b border-landing-border bg-landing-bg"
    >
      <ul className="mx-auto flex max-w-6xl items-stretch justify-center gap-1 px-container-padding-mobile md:gap-2 md:px-8">
        {NAV.map((item) => {
          const children = "children" in item ? item.children : null;
          const active = children
            ? pathname === "/auctions" || pathname.startsWith("/auctions/")
            : pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          if (children) {
            return (
              <li
                key={item.label}
                className="relative flex-1 md:flex-none"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <Link
                  href={item.href}
                  aria-haspopup="menu"
                  aria-expanded={open}
                  style={{ ["--nav-accent" as string]: item.accent }}
                  className={`flex h-11 w-full items-center justify-center border-b-2 px-3 text-sm font-semibold transition-colors md:px-5 ${
                    active
                      ? "border-[color:var(--nav-accent)] text-[color:var(--nav-accent)]"
                      : "border-transparent text-landing-muted hover:border-[color:var(--nav-accent)] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
                {open ? (
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
                            onClick={() => setOpen(false)}
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
            <li key={item.href} className="flex-1 md:flex-none">
              <Link
                href={item.href}
                style={{ ["--nav-accent" as string]: item.accent }}
                className={`flex h-11 items-center justify-center border-b-2 px-3 text-sm font-semibold transition-colors md:px-5 ${
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
