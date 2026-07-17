import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  AuctionGuidePageShell,
  GuidePageHeader,
  GuideSectionTitle,
} from "@/components/auction/AuctionGuidePageShell";
import {
  PROCESS_BREADCRUMB,
  PROCESS_OVERVIEW,
  PROCESS_STEPS,
} from "@/lib/auction-guide/process-content";

export const metadata: Metadata = {
  title: "경매절차 | CHANCE AUCTION",
  description: "부동산 강제경매·임의경매 절차 안내 — 신청부터 배당까지",
};

export default function AuctionProcessPage() {
  return (
    <AuctionGuidePageShell>
      <main className="mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8 md:py-14">
        <GuidePageHeader title="경매절차" crumbs={PROCESS_BREADCRUMB} />

        <section className="mb-12">
          <GuideSectionTitle>{PROCESS_OVERVIEW.title}</GuideSectionTitle>
          <GlassCard className="space-y-3 p-5 md:p-6">
            {PROCESS_OVERVIEW.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-white/75">
                {p}
              </p>
            ))}
            <p className="pt-2 text-xs text-white/40">{PROCESS_OVERVIEW.source}</p>
          </GlassCard>
        </section>

        <section className="mb-10">
          <GuideSectionTitle>절차 한눈에 보기</GuideSectionTitle>
          <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {PROCESS_STEPS.map((step) => (
              <li key={step.num}>
                <a
                  href={`#step-${step.num}`}
                  className="flex h-full flex-col rounded-2xl border border-[#d4af37]/30 bg-black/25 px-3 py-3 transition hover:border-[#fbbf24]/60 hover:bg-black/40"
                >
                  <span className="text-xs font-bold text-[#fbbf24]">{step.num}</span>
                  <span className="mt-1 text-sm font-semibold leading-snug text-white">
                    {step.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-8">
          {PROCESS_STEPS.map((step) => (
            <section key={step.num} id={`step-${step.num}`} className="scroll-mt-24">
              <GlassCard className="overflow-hidden p-0">
                <div className="flex flex-col gap-3 border-b border-white/10 bg-gradient-to-r from-[#d4af37]/15 to-transparent px-5 py-4 sm:flex-row sm:items-start sm:gap-4 md:px-6">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d4af37]/50 bg-[#1c140c] text-sm font-extrabold text-[#fbbf24]">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">{step.summary}</p>
                  </div>
                </div>
                <div className="space-y-5 px-5 py-5 md:px-6 md:py-6">
                  {step.sections.map((sec) => (
                    <div key={sec.heading}>
                      <h4 className="mb-2 text-sm font-bold text-[#fde68a]">{sec.heading}</h4>
                      <div className="space-y-2">
                        {sec.body.map((line) => (
                          <p key={line.slice(0, 32)} className="text-sm leading-relaxed text-white/72">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </section>
          ))}
        </div>
      </main>
    </AuctionGuidePageShell>
  );
}
