"use client";

import { MessageSquare, Newspaper, Sparkles } from "lucide-react";
import type { Auction, LegalQuestion, NewsFeedItem, Property, SuccessStory } from "@prisma/client";
import { AppLink as Link } from "@/components/ui/AppLink";
import { FeaturedMarqueeRow } from "@/components/landing/FeaturedMarqueeRow";
import { formatAuctionMoney, parseImages } from "@/lib/format";
import {
  STORY_BADGE_CLASS,
  qaCategoryBadgeClass,
  storyBadgeFromCategory,
} from "@/lib/landing-home";
import {
  formatNewsFeedDate,
  getNewsFeedSourceMeta,
  isNewsFeedSourceId,
} from "@/lib/news-feed";
import {
  propertyCardDealBadgeLabel,
  propertyCardPriceLine,
  propertyCardTitle,
} from "@/lib/property-card-display";
import { formatStoryDate } from "@/lib/success-story";

function SectionDivider() {
  return (
    <div
      className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/15 to-transparent"
      aria-hidden
    />
  );
}

function SectionShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`px-container-padding-mobile py-10 md:px-8 md:py-12 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function CompactPropertyCard({ property }: { property: Property }) {
  const cover = parseImages(property.images)[0];
  const title = propertyCardTitle(property);
  const price = propertyCardPriceLine(property);
  const deal = propertyCardDealBadgeLabel(property);

  return (
    <Link
      href={`/properties?id=${property.id}`}
      className="featured-marquee-card group relative block w-[168px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] transition hover:border-[#4dabff]/45"
    >
      <div className="relative h-[88px] bg-black/40">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : null}
        <span className="absolute left-1.5 top-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[9px] font-bold text-sky-200">
          {deal}
        </span>
      </div>
      <div className="space-y-0.5 p-2.5">
        <p className="line-clamp-1 text-[11px] font-bold text-white">{title}</p>
        <p className="text-[12px] font-extrabold text-[#4dabff]">{price}</p>
      </div>
    </Link>
  );
}

function CompactAuctionCard({ auction }: { auction: Auction }) {
  const cover = parseImages(auction.images)[0];
  const min = auction.minPrice
    ? formatAuctionMoney(auction.minPrice)
    : formatAuctionMoney(auction.appraisalPrice);

  return (
    <Link
      href={`/auctions/${auction.id}`}
      className="featured-marquee-card group relative block w-[168px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] transition hover:border-[#d4af37]/45"
    >
      <div className="relative h-[88px] bg-black/40">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : null}
        <span className="absolute left-1.5 top-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[9px] font-bold text-[#fde68a]">
          경매
        </span>
      </div>
      <div className="space-y-0.5 p-2.5">
        <p className="line-clamp-1 text-[11px] font-bold text-white">{auction.title}</p>
        <p className="text-[12px] font-extrabold text-[#facc15]">최저 {min}</p>
      </div>
    </Link>
  );
}

function HomeFeaturedSection({
  properties,
  auctions,
}: {
  properties: Property[];
  auctions: Auction[];
}) {
  const marqueeClass =
    "!rounded-none !py-1 [mask-image:none] [-webkit-mask-image:none]";

  return (
    <SectionShell className="py-6 md:py-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="min-w-0">
          <div className="relative mb-2.5 flex items-center justify-center">
            <h2 className="text-sm font-extrabold text-[#4dabff]">추천 매물</h2>
            <Link
              href="/properties"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white/45 hover:text-white"
            >
              전체 →
            </Link>
          </div>
          <p className="mb-1.5 text-center text-[10px] text-white/35 md:hidden">좌우로 넘겨 보세요</p>
          {properties.length === 0 ? (
            <p className="text-xs text-white/40">등록된 매물이 없습니다.</p>
          ) : (
            <FeaturedMarqueeRow durationSec={48} className={marqueeClass}>
              {properties.map((p) => (
                <CompactPropertyCard key={p.id} property={p} />
              ))}
            </FeaturedMarqueeRow>
          )}
        </div>
        <div className="min-w-0">
          <div className="relative mb-2.5 flex items-center justify-center">
            <h2 className="text-sm font-extrabold text-[#d4af37]">추천 경매</h2>
            <Link
              href="/auctions"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white/45 hover:text-white"
            >
              전체 →
            </Link>
          </div>
          <p className="mb-1.5 text-center text-[10px] text-white/35 md:hidden">좌우로 넘겨 보세요</p>
          {auctions.length === 0 ? (
            <p className="text-xs text-white/40">등록된 경매가 없습니다.</p>
          ) : (
            <FeaturedMarqueeRow durationSec={52} className={marqueeClass}>
              {auctions.map((a) => (
                <CompactAuctionCard key={a.id} auction={a} />
              ))}
            </FeaturedMarqueeRow>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

function newsBadgeClass(source: string) {
  if (isNewsFeedSourceId(source)) {
    return getNewsFeedSourceMeta(source).badgeClass;
  }
  return "border-white/20 bg-white/10 text-white/70";
}

function newsShortLabel(row: NewsFeedItem) {
  if (isNewsFeedSourceId(row.source)) {
    return getNewsFeedSourceMeta(row.source).shortLabel;
  }
  return row.sourceName || row.source;
}

function HomeTripleColumn({
  newsFeed,
  legalQuestions,
  successStories,
}: {
  newsFeed: NewsFeedItem[];
  legalQuestions: LegalQuestion[];
  successStories: SuccessStory[];
}) {
  return (
    <SectionShell>
      <div className="grid gap-8 lg:grid-cols-3">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-white">
              <Newspaper className="h-4 w-4 text-[#d450ff]" />
              부동산·지역소식
            </h2>
            <Link href="/news" className="text-[11px] font-bold text-[#d4bfff] hover:underline">
              전체 →
            </Link>
          </div>
          {newsFeed.length === 0 ? (
            <p className="mt-3 text-xs text-white/40">등록된 소식이 없습니다.</p>
          ) : (
            <ul className="mt-3 divide-y divide-white/10">
              {newsFeed.map((row) => (
                <li key={row.id}>
                  <a
                    href={row.originUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2.5 transition hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${newsBadgeClass(row.source)}`}
                      >
                        {newsShortLabel(row)}
                      </span>
                      <span className="ml-auto shrink-0 text-[10px] tabular-nums text-white/35">
                        {formatNewsFeedDate(row.pubDate).slice(5)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-white/85">
                      {row.title}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-white">
              <MessageSquare className="h-4 w-4 text-[#34d399]" />
              찬스상담소
            </h2>
            <Link href="/legal" className="text-[11px] font-bold text-[#6ee7b7] hover:underline">
              전체 →
            </Link>
          </div>
          {legalQuestions.length === 0 ? (
            <p className="mt-3 text-xs text-white/40">등록된 질문이 없습니다.</p>
          ) : (
            <ul className="mt-3 divide-y divide-white/10">
              {legalQuestions.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/legal?id=${row.id}`}
                    className="block py-2.5 transition hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${qaCategoryBadgeClass(row.category)}`}
                      >
                        {row.category}
                      </span>
                      <span
                        className={
                          row.status === "ANSWERED"
                            ? "text-[10px] font-bold text-emerald-300"
                            : "text-[10px] font-bold text-amber-200/80"
                        }
                      >
                        {row.status === "ANSWERED" ? "답변완료" : "대기중"}
                      </span>
                      <span className="ml-auto text-[10px] tabular-nums text-white/35">
                        {formatStoryDate(row.createdAt).slice(5)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-white/85">
                      {row.question}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-white">
              <Sparkles className="h-4 w-4 text-[#fbbf24]" />
              성공스토리
            </h2>
            <Link
              href="/success-stories"
              className="text-[11px] font-bold text-[#fde68a] hover:underline"
            >
              전체 →
            </Link>
          </div>
          {successStories.length === 0 ? (
            <p className="mt-3 text-xs text-white/40">등록된 스토리가 없습니다.</p>
          ) : (
            <ul className="mt-3 divide-y divide-white/10">
              {successStories.map((row) => {
                const { badge, tone } = storyBadgeFromCategory(row.category);
                return (
                  <li key={row.id}>
                    <Link
                      href={`/success-stories?id=${row.id}`}
                      className="block py-2.5 transition hover:bg-white/[0.03]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${STORY_BADGE_CLASS[tone]}`}
                        >
                          {badge}
                        </span>
                        <span className="ml-auto text-[10px] tabular-nums text-white/35">
                          {formatStoryDate(row.createdAt).slice(5)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-white/85">
                        {row.title}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

function HomeConsultCta() {
  return (
    <SectionShell className="pt-4 md:pt-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#4dabff]/15 via-transparent to-[#913dff]/20 px-6 py-8 text-center md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
          <div className="hr-aurora-layer hr-aurora-violet absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto max-w-xl">
          <h2 className="text-lg font-extrabold text-white md:text-xl">
            1:1 권리분석 및 중개 상담 신청
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/65">
            고민 중인 경매 사건이나 찾으시는 매물이 있으신가요? 지금 바로 전문가의 자문을 구해보세요.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/consultation"
              className="inline-flex rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-5 py-2.5 text-sm font-extrabold text-white"
            >
              빠른 상담 문의하기
            </Link>
            <Link
              href="/legal"
              className="inline-flex rounded-xl border border-[#34d399]/40 px-5 py-2.5 text-sm font-bold text-[#6ee7b7]"
            >
              찬스상담소 질문하기
            </Link>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function HomeBelowHero({
  properties,
  auctions,
  newsFeed,
  legalQuestions,
  successStories,
}: {
  properties: Property[];
  auctions: Auction[];
  newsFeed: NewsFeedItem[];
  legalQuestions: LegalQuestion[];
  successStories: SuccessStory[];
}) {
  return (
    <div className="font-[family-name:var(--font-unifine),Outfit,sans-serif]">
      <HomeFeaturedSection properties={properties} auctions={auctions} />
      <SectionDivider />
      <HomeTripleColumn
        newsFeed={newsFeed}
        legalQuestions={legalQuestions}
        successStories={successStories}
      />
      <SectionDivider />
      <HomeConsultCta />
    </div>
  );
}
