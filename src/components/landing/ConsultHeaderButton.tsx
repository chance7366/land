import { CalendarDays } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";

/** Header consult button — violet tint, matches channel shortcut style (~20% smaller) */
export function ConsultHeaderButton() {
  return (
    <Link
      href="/consultation"
      className="inline-flex items-center justify-center gap-1 rounded-lg border border-landing-border bg-violet-500/15 px-2 py-2 text-[11px] font-bold text-landing-text transition-colors hover:border-violet-400/50 hover:bg-violet-500/25 sm:px-2.5"
    >
      <CalendarDays className="h-4 w-4 shrink-0 text-violet-400" aria-hidden />
      <span className="hidden sm:inline">상담 예약</span>
    </Link>
  );
}
