import { Gavel } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { AlertSubscribeHeaderButton } from "@/components/landing/AlertSubscribeHeaderButton";
import { ChannelShortcuts } from "@/components/landing/ChannelShortcuts";
import { ConsultHeaderButton } from "@/components/landing/ConsultHeaderButton";
import { LandingHeaderMenuButton } from "@/components/landing/LandingHeaderMenuButton";

function HeaderTooltip({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`group/tip relative inline-flex min-w-0 ${className}`.trim()}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-[60] mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/15 bg-[#141820] px-2.5 py-1 text-[11px] font-medium text-landing-text opacity-0 shadow-lg transition-opacity group-hover/tip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-landing-border bg-landing-bg/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-container-padding-mobile py-3 sm:gap-3 sm:py-4 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
          <HeaderTooltip label="관리자 페이지 이동" className="shrink-0">
            <Link
              href="/admin"
              aria-label="관리자 페이지 이동"
              className="shrink-0 rounded-md outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
            >
              <Gavel className="h-5 w-5 text-blue-400 sm:h-6 sm:w-6" aria-hidden />
            </Link>
          </HeaderTooltip>
          <HeaderTooltip label="홈으로 이동" className="min-w-0 flex-1">
            <Link
              href="/"
              aria-label="홈으로 이동"
              className="block min-w-0 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
            >
              <span className="block truncate bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text font-['Times_New_Roman',serif] text-[11px] font-bold leading-tight text-transparent sm:text-sm md:text-lg">
                CHANCE REAL ESTATE & AUCTION
              </span>
            </Link>
          </HeaderTooltip>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-1.5 sm:gap-2 md:flex">
            <AlertSubscribeHeaderButton />
            <ConsultHeaderButton />
            <ChannelShortcuts />
          </div>
          <LandingHeaderMenuButton />
        </div>
      </div>
    </header>
  );
}
