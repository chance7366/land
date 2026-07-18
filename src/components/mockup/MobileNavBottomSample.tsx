"use client";

import { useState } from "react";
import {
  Bell,
  CalendarDays,
  FileText,
  Menu,
  PlayCircle,
  X,
} from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";

const BOTTOM_NAV = [
  { label: "홈", icon: "home", href: "/", accent: "#60a5fa" },
  { label: "부동산중개", icon: "apartment", href: "/properties", accent: "#4dabff" },
  { label: "경매공매", icon: "gavel", href: "/auctions", accent: "#d4af37" },
  { label: "부동산·지역소식", icon: "newspaper", href: "/news", accent: "#d450ff" },
  { label: "찬스상담소", icon: "balance", href: "/legal", accent: "#34d399" },
  { label: "성공스토리", icon: "star", href: "/success-stories", accent: "#fbbf24" },
  { label: "프로필", icon: "person", href: "/profile", accent: "#f472b6" },
  { label: "찾아오시는 길", icon: "location_on", href: "/location", accent: "#38bdf8" },
] as const;

const SHEET_MENU = [
  { label: "홈", href: "/" },
  { label: "부동산중개", href: "/properties" },
  { label: "경매공매", href: "/auctions" },
  { label: "경매절차", href: "/auctions/process", indent: true },
  { label: "입찰안내", href: "/auctions/bidding", indent: true },
  { label: "부동산·지역소식", href: "/news" },
  { label: "찬스상담소", href: "/legal" },
  { label: "성공스토리", href: "/success-stories" },
  { label: "프로필", href: "/profile" },
  { label: "찾아오시는 길", href: "/location" },
] as const;

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
      aria-hidden
      style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
    >
      {name}
    </span>
  );
}

/** 목업용 — 아이콘+라벨이 항상 보이는 채널 CTA */
function LabeledCtaRow() {
  return (
    <div className="space-y-2">
      <p className="px-0.5 text-[11px] font-bold text-white/40">바로가기</p>
      <button
        type="button"
        className="flex w-full min-h-12 items-center gap-3 rounded-xl border border-amber-400/40 bg-amber-500/15 px-3 text-left text-sm font-bold text-amber-100"
      >
        <Bell className="h-5 w-5 shrink-0 text-amber-300" />
        맞춤 알림
      </button>
      <button
        type="button"
        className="flex w-full min-h-12 items-center gap-3 rounded-xl border border-violet-400/40 bg-violet-500/15 px-3 text-left text-sm font-bold text-violet-100"
      >
        <CalendarDays className="h-5 w-5 shrink-0 text-violet-300" />
        상담 예약
      </button>
      <a
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full min-h-12 items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 text-left text-sm font-bold text-red-100"
      >
        <PlayCircle className="h-5 w-5 shrink-0 text-red-400" />
        YouTube
      </a>
      <a
        href="https://blog.naver.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full min-h-12 items-center gap-3 rounded-xl border border-[#03c75a]/45 bg-[#03c75a]/10 px-3 text-left text-sm font-bold text-emerald-100"
      >
        <FileText className="h-5 w-5 shrink-0 text-[#03c75a]" />
        네이버 블로그
      </a>
    </div>
  );
}

function PhoneFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[390px]">
      <p className="mb-2 text-center text-xs font-bold text-white/45">{title}</p>
      <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#0b0f19] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        {children}
      </div>
    </div>
  );
}

export function MobileNavBottomSample() {
  const [activeHref, setActiveHref] = useState("/");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="space-y-10">
      <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-center text-xs text-amber-100/90">
        샘플 · 프로덕션 미적용 · 하단 8탭 가로 스크롤 + 햄버거 Sheet CTA 라벨 개선안
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* A: 하단 네비 */}
        <PhoneFrame title="A · 하단 메뉴 1열 가로 스크롤 (손가락으로 밀기)">
          <div className="relative flex h-[640px] flex-col">
            <header className="flex items-center justify-between border-b border-white/10 px-3 py-3">
              <span className="truncate bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-[11px] font-bold text-transparent">
                CHANCE REAL ESTATE
              </span>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15"
                aria-label="메뉴"
              >
                <Menu className="h-5 w-5 text-white" />
              </button>
            </header>

            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="text-sm font-bold text-white">현재 탭</p>
              <p className="text-lg font-extrabold text-sky-300">
                {BOTTOM_NAV.find((n) => n.href === activeHref)?.label ?? "홈"}
              </p>
              <p className="mt-4 text-[11px] leading-relaxed text-white/45">
                하단 바를 좌우로 밀어 보세요.
                <br />
                소식 · 성공스토리 · 찾아오시는 길도 같은 줄에 있습니다.
              </p>
            </div>

            <nav
              aria-label="목업 하단 메뉴"
              className="border-t border-white/10 bg-[#0b0f19]/95 pb-3 pt-1.5 backdrop-blur"
            >
              <div className="flex items-stretch gap-0 overflow-x-auto overscroll-x-contain px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {BOTTOM_NAV.map((item) => {
                  const active = activeHref === item.href;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => setActiveHref(item.href)}
                      className={`flex min-h-12 min-w-[4.5rem] shrink-0 flex-col items-center justify-center gap-0.5 px-1.5 py-1 transition-colors ${
                        active ? "text-blue-400" : "text-white/45"
                      }`}
                    >
                      <MaterialIcon name={item.icon} filled={active} className="text-[22px]" />
                      <span
                        className={`max-w-[4.25rem] truncate text-center text-[9px] leading-tight ${
                          active ? "font-bold" : "font-medium"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-center text-[10px] text-white/30">← 스와이프 → · 총 8개</p>
            </nav>
          </div>
        </PhoneFrame>

        {/* B: 햄버거 Sheet */}
        <PhoneFrame title="B · 햄버거 Sheet (CTA에 아이콘+글자)">
          <div className="relative flex h-[640px] flex-col">
            <header className="flex items-center justify-between border-b border-white/10 px-3 py-3">
              <span className="truncate text-[11px] font-bold text-white/70">메뉴 미리보기</span>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5"
              >
                <Menu className="h-5 w-5 text-white" />
              </button>
            </header>
            <div className="flex flex-1 items-center justify-center px-6 text-center">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white"
              >
                햄버거 메뉴 열기 →
              </button>
            </div>

            {/* 현재(문제) vs 개선 비교 메모 */}
            <div className="space-y-2 border-t border-white/10 p-3 text-[11px] text-white/50">
              <p>
                <span className="text-red-300">Before</span> Sheet 하단 CTA가 아이콘만 보여 무엇을 누르는지 모름
              </p>
              <p>
                <span className="text-emerald-300">After</span> 맞춤 알림 · 상담 예약 · YouTube · 네이버 블로그
                전체 폭 버튼 + 라벨
              </p>
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* Sheet overlay — 목업 프레임 밖 전체에도 열림 */}
      {sheetOpen ? (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="닫기"
            onClick={() => setSheetOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col border-l border-white/10 bg-[#0b0f19] shadow-[-12px_0_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-sm font-bold text-white">메뉴</p>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15"
              >
                <X className="h-5 w-5 text-white/80" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-1">
                {SHEET_MENU.map((item) => (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveHref(item.href);
                        setSheetOpen(false);
                      }}
                      className={`flex min-h-12 w-full items-center rounded-xl border border-transparent px-3 text-left text-sm font-semibold text-white/80 hover:bg-white/[0.04] ${
                        "indent" in item && item.indent ? "ml-3" : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <LabeledCtaRow />
            </div>
          </div>
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/70">
        <h2 className="font-bold text-white">적용 시 변경 요약 (아직 미적용)</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
          <li>
            하단바: 홈 · 부동산중개 · 경매공매 · <strong className="text-white">부동산·지역소식</strong> ·
            찬스상담소 · <strong className="text-white">성공스토리</strong> · 프로필 ·{" "}
            <strong className="text-white">찾아오시는 길</strong> (1열 · 터치 가로 스크롤)
          </li>
          <li>
            햄버거 Sheet 하단 CTA: 아이콘만 → <strong className="text-white">아이콘 + 한글/영문 라벨</strong>{" "}
            세로 스택
          </li>
        </ul>
        <p className="mt-4 text-xs text-white/40">
          확인 후 승인하시면 프로덕션 `UserBottomNav` · `MobileNavSheet`에 반영합니다.
        </p>
        <Link href="/" className="mt-3 inline-block text-xs text-sky-300 hover:underline">
          ← 홈으로
        </Link>
      </section>
    </div>
  );
}
