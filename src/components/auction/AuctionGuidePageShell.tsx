import type { ReactNode } from "react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { UserBottomNav } from "@/components/user/UserShell";

/** 경매절차·입찰안내 — 히어로 앰버 골드 오로라 배경 */
export function AuctionGuidePageShell({ children }: { children: ReactNode }) {
  return (
    <LandingShell>
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-amber pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10">{children}</div>
      </div>
      <LandingFooter />
      <UserBottomNav />
    </LandingShell>
  );
}

export function GuidePageHeader({
  title,
  crumbs,
}: {
  title: string;
  crumbs: readonly string[];
}) {
  return (
    <header className="mb-10 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <h1 className="font-[family-name:var(--font-unifine)] text-3xl font-extrabold tracking-tight text-white md:text-4xl">
        {title}
      </h1>
      <nav aria-label="breadcrumb" className="text-xs font-medium text-white/45">
        {crumbs.map((c, i) => (
          <span key={`${c}-${i}`}>
            {i > 0 ? <span className="mx-1.5 text-white/25">›</span> : null}
            <span className={i === crumbs.length - 1 ? "text-[#fbbf24]" : undefined}>{c}</span>
          </span>
        ))}
      </nav>
    </header>
  );
}

export function GuideSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-white md:text-xl">
      <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[#fbbf24] to-[#d4af37]" aria-hidden />
      {children}
    </h2>
  );
}
