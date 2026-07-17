import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  BidFlowRow,
  BidStepBadge,
  OtherInfoBox,
} from "@/components/auction/AuctionBiddingBlocks";
import {
  AuctionGuidePageShell,
  GuidePageHeader,
  GuideSectionTitle,
} from "@/components/auction/AuctionGuidePageShell";
import {
  BIDDING_BREADCRUMB,
  BIDDING_OVERVIEW,
  DATE_BID_DETAILS,
  DATE_BID_FLOW,
  DATE_BID_NOTES,
  OTHER_INFO,
  PERIOD_BID_DETAILS,
  PERIOD_BID_FLOW,
  PERIOD_BID_NOTES,
} from "@/lib/auction-guide/bidding-content";

export const metadata: Metadata = {
  title: "입찰안내 | CHANCE AUCTION",
  description: "기일입찰·기간입찰 절차와 유의사항 안내",
};

export default function AuctionBiddingPage() {
  return (
    <AuctionGuidePageShell>
      <main className="mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8 md:py-14">
        <GuidePageHeader title="입찰안내" crumbs={BIDDING_BREADCRUMB} />

        <section className="mb-12">
          <GuideSectionTitle>입찰절차 안내</GuideSectionTitle>
          <GlassCard className="p-5 md:p-6">
            <BidFlowRow title="기일입찰" steps={DATE_BID_FLOW} />
            <BidFlowRow title="기간입찰" steps={PERIOD_BID_FLOW} />
          </GlassCard>
        </section>

        <section className="mb-12">
          <GuideSectionTitle>입찰관련 개요</GuideSectionTitle>
          <GlassCard className="p-5 md:p-6">
            <p className="text-sm leading-relaxed text-white/75">{BIDDING_OVERVIEW}</p>
          </GlassCard>
        </section>

        <section className="mb-12">
          <GuideSectionTitle>기일입찰 안내</GuideSectionTitle>
          <div className="space-y-6">
            {DATE_BID_DETAILS.map((step) => (
              <GlassCard key={step.num} className="p-5 md:p-6">
                <BidStepBadge num={step.num} title={step.title} />
                <div className="space-y-2">
                  {step.body.map((line) => (
                    <p key={line.slice(0, 28)} className="text-sm leading-relaxed text-white/72">
                      {line}
                    </p>
                  ))}
                </div>
              </GlassCard>
            ))}
            <GlassCard className="p-5 md:p-6">
              <h3 className="mb-4 text-sm font-bold text-[#fbbf24]">유의사항</h3>
              <ul className="space-y-3">
                {DATE_BID_NOTES.map((note) => (
                  <li key={note.title} className="text-sm leading-relaxed text-white/75">
                    <span className="font-bold text-white">· {note.title}</span>
                    <p className="mt-1 text-white/65">{note.body}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </section>

        <section className="mb-12">
          <GuideSectionTitle>기간입찰 안내</GuideSectionTitle>
          <div className="space-y-6">
            {PERIOD_BID_DETAILS.map((step) => (
              <GlassCard key={step.num} className="p-5 md:p-6">
                <BidStepBadge num={step.num} title={step.title} />
                <div className="space-y-2">
                  {step.body.map((line) => (
                    <p key={line.slice(0, 28)} className="text-sm leading-relaxed text-white/72">
                      {line}
                    </p>
                  ))}
                </div>
              </GlassCard>
            ))}
            <GlassCard className="p-5 md:p-6">
              <h3 className="mb-4 text-sm font-bold text-[#fbbf24]">유의사항</h3>
              <ul className="space-y-3">
                {PERIOD_BID_NOTES.map((note) => (
                  <li key={note.title} className="text-sm leading-relaxed text-white/75">
                    <span className="font-bold text-white">· {note.title}</span>
                    <p className="mt-1 text-white/65">{note.body}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </section>

        <section>
          <GuideSectionTitle>기타안내</GuideSectionTitle>
          <OtherInfoBox items={OTHER_INFO} />
        </section>
      </main>
    </AuctionGuidePageShell>
  );
}
