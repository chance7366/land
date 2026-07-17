import { GlassCard } from "@/components/ui/GlassCard";
import type { FlowStep } from "@/lib/auction-guide/bidding-content";

export function BidFlowRow({
  title,
  steps,
}: {
  title: string;
  steps: FlowStep[];
}) {
  return (
    <div className="mb-6 last:mb-0">
      <p className="mb-3 text-sm font-bold text-[#fbbf24]">{title}</p>
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <li key={step.num} className="flex items-center gap-2">
            <span className="inline-flex max-w-[11rem] items-center gap-1.5 rounded-full border border-[#60a5fa]/55 bg-[#0f172a]/55 px-3 py-1.5 text-xs font-bold text-white shadow-[0_0_16px_rgba(96,165,250,0.12)] sm:max-w-none">
              <span className="text-[#93c5fd]">{step.num}</span>
              <span className="leading-snug">{step.label}</span>
            </span>
            {i < steps.length - 1 ? (
              <span className="hidden text-[#60a5fa]/70 sm:inline" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function BidStepBadge({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#60a5fa]/50 bg-[#0f172a]/50 px-3 py-1.5 text-sm font-bold text-white">
      <span className="text-[#93c5fd]">{num}</span>
      <span>{title}</span>
    </div>
  );
}

export function OtherInfoBox({
  items,
}: {
  items: { num: string; title: string; body: string }[];
}) {
  return (
    <GlassCard className="p-5 md:p-6">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.num} className="text-sm leading-relaxed text-white/80">
            <span className="font-bold text-[#fbbf24]">
              [{item.num}] {item.title}
            </span>
            <p className="mt-1 text-white/70">{item.body}</p>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
