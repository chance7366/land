"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarDays, FileText, PlayCircle, X } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { AlertSubscribeModal } from "@/components/subscription/AlertSubscribeModal";

const MENU = [
  { href: "/", label: "홈", accent: "#f97316" },
  { href: "/properties", label: "부동산중개", accent: "#4dabff" },
  { href: "/auctions", label: "경매공매", accent: "#d4af37" },
  { href: "/auctions/process", label: "경매절차", accent: "#d4af37", indent: true },
  { href: "/auctions/bidding", label: "입찰안내", accent: "#d4af37", indent: true },
  { href: "/news", label: "부동산·지역소식", accent: "#d450ff" },
  { href: "/legal", label: "찬스상담소", accent: "#34d399" },
  { href: "/success-stories", label: "성공스토리", accent: "#fbbf24" },
  { href: "/profile", label: "프로필", accent: "#f472b6" },
  { href: "/location", label: "찾아오시는 길", accent: "#38bdf8" },
] as const;

const CHANNELS = {
  youtube:
    process.env.NEXT_PUBLIC_YOUTUBE_URL ??
    "https://www.youtube.com/@%EC%B0%AC%EC%8A%A4%EA%B2%BD%EB%A7%A4%EC%A4%91%EA%B0%9C",
  blog: process.env.NEXT_PUBLIC_BLOG_URL ?? "https://blog.naver.com/kimdayn",
} as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/auctions") return pathname === "/auctions";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileNavSheet({ open, onClose }: Props) {
  const pathname = usePathname();
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open && !alertOpen) return null;

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-[80] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="전체 메뉴"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="메뉴 닫기"
            onClick={onClose}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col border-l border-white/10 bg-[#0b0f19] shadow-[-12px_0_40px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-sm font-bold text-white">메뉴</p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/80"
                aria-label="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-1">
                {MENU.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`flex min-h-12 items-center rounded-xl border px-3 text-sm font-semibold transition ${
                          "indent" in item && item.indent ? "ml-3" : ""
                        } ${
                          active
                            ? "border-white/20 bg-white/10 text-white"
                            : "border-transparent text-white/75 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                        }`}
                        style={
                          active
                            ? { color: item.accent, borderColor: `${item.accent}55` }
                            : undefined
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-2 border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <p className="px-0.5 text-[11px] font-bold text-white/40">바로가기</p>
              <button
                type="button"
                onClick={() => {
                  setAlertOpen(true);
                  onClose();
                }}
                className="flex w-full min-h-12 items-center gap-3 rounded-xl border border-amber-400/40 bg-amber-500/15 px-3 text-left text-sm font-bold text-amber-100"
              >
                <Bell className="h-5 w-5 shrink-0 text-amber-300" aria-hidden />
                맞춤 알림
              </button>
              <Link
                href="/consultation"
                onClick={onClose}
                className="flex w-full min-h-12 items-center gap-3 rounded-xl border border-violet-400/40 bg-violet-500/15 px-3 text-left text-sm font-bold text-violet-100"
              >
                <CalendarDays className="h-5 w-5 shrink-0 text-violet-300" aria-hidden />
                상담 예약
              </Link>
              <a
                href={CHANNELS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex w-full min-h-12 items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 text-left text-sm font-bold text-red-100"
              >
                <PlayCircle className="h-5 w-5 shrink-0 text-red-400" aria-hidden />
                YouTube
              </a>
              <a
                href={CHANNELS.blog}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex w-full min-h-12 items-center gap-3 rounded-xl border border-[#03c75a]/45 bg-[#03c75a]/10 px-3 text-left text-sm font-bold text-emerald-100"
              >
                <FileText className="h-5 w-5 shrink-0 text-[#03c75a]" aria-hidden />
                네이버 블로그
              </a>
            </div>
          </div>
        </div>
      ) : null}
      <AlertSubscribeModal open={alertOpen} onClose={() => setAlertOpen(false)} />
    </>
  );
}
