"use client";

import { MessageSquare, Newspaper, Sparkles } from "lucide-react";
import type { Auction, Property } from "@prisma/client";
import { AppLink as Link } from "@/components/ui/AppLink";
import { FeaturedMarqueeRow } from "@/components/landing/FeaturedMarqueeRow";
import {
  formatAuctionMoney,
  parseImages,
} from "@/lib/format";
import {
  propertyCardDealBadgeLabel,
  propertyCardPriceLine,
  propertyCardTitle,
} from "@/lib/property-card-display";
import {
  HOME_NEWS_SAMPLES,
  HOME_QA_SAMPLES,
  HOME_STORY_CARDS,
  HOME_TRUST_POINTS,
  HOME_TRUST_TAGLINE,
  NEWS_SOURCE_BADGE,
  STORY_BADGE_CLASS,
} from "@/lib/mockup/landing-home-sections-sample";

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

/** SECTION 1 — 신뢰: 지정 텍스트만 (박스·장식 없음) */
export function HomeTrustBannerSample() {
  const points = HOME_TRUST_POINTS.map((p) => p.title).join(" · ");

  return (
    <section className="px-container-padding-mobile py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-hero-gothic-a1 text-[clamp(1.05rem,2.4vw,1.35rem)] font-bold leading-snug tracking-tight">
          <span className="bg-gradient-to-r from-[#93c5fd] via-[#d4bfff] to-[#fde68a] bg-clip-text text-transparent">
            {HOME_TRUST_TAGLINE}
          </span>
        </p>
        <p className="mt-3 text-[13px] leading-relaxed md:text-sm">
          <span className="text-sky-300/90">{points}</span>
          <span className="text-white/35"> — </span>
          <span className="text-white/50">
            {HOME_TRUST_POINTS.map((p) => p.body).join(" · ")}
          </span>
        </p>
      </div>
    </section>
  );
}

/** 축소 카드 — 제목·가격 중심 */
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
      href={`/auctions?id=${auction.id}`}
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

/** SECTION 2 — 추천 매물·경매 2열, 제목 중앙, 열 사이 간격만(엣지 페이드 없음) */
export function HomeFeaturedSectionSample({
  properties,
  auctions,
}: {
  properties: Property[];
  auctions: Auction[];
}) {
  const props = properties.slice(0, 12);
  const aucts = auctions.slice(0, 12);
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
          {props.length === 0 ? (
            <p className="text-xs text-white/40">등록된 매물이 없습니다.</p>
          ) : (
            <FeaturedMarqueeRow durationSec={48} className={marqueeClass}>
              {props.map((p) => (
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
          {aucts.length === 0 ? (
            <p className="text-xs text-white/40">등록된 경매가 없습니다.</p>
          ) : (
            <FeaturedMarqueeRow durationSec={52} className={marqueeClass}>
              {aucts.map((a) => (
                <CompactAuctionCard key={a.id} auction={a} />
              ))}
            </FeaturedMarqueeRow>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

/** SECTION 3 — 소식 · 상담소 · 성공스토리 3열 (내부 중첩 박스 제거, 스토리 이미지 없음) */
export function HomeTripleColumnSample() {
  return (
    <SectionShell>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* 지역소식 */}
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-white">
              <Newspaper className="h-4 w-4 text-[#d450ff]" />
              지역소식
            </h2>
            <Link href="/news" className="text-[11px] font-bold text-[#d4bfff] hover:underline">
              전체 →
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-white/10">
            {HOME_NEWS_SAMPLES.slice(0, 5).map((row) => (
              <li key={row.id}>
                <Link
                  href={row.href}
                  className="block py-2.5 transition hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${NEWS_SOURCE_BADGE[row.sourceKey]}`}
                    >
                      {row.source}
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] tabular-nums text-white/35">
                      {row.date.slice(5)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-white/85">
                    {row.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 찬스상담소 — 리스트만, 카드 중첩 없음 */}
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
          <ul className="mt-3 divide-y divide-white/10">
            {HOME_QA_SAMPLES.map((row) => (
              <li key={row.id}>
                <Link
                  href={row.href}
                  className="block py-2.5 transition hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-white/45">{row.category}</span>
                    <span className="font-bold text-emerald-300">답변완료</span>
                    <span className="ml-auto tabular-nums text-white/35">{row.date.slice(5)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-white/85">
                    {row.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 성공스토리 — 이미지 없음 */}
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
          <ul className="mt-3 divide-y divide-white/10">
            {HOME_STORY_CARDS.map((card) => (
              <li key={card.id}>
                <Link
                  href={card.href}
                  className="block py-2.5 transition hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${STORY_BADGE_CLASS[card.badgeTone]}`}
                    >
                      {card.badge}
                    </span>
                    <span className="ml-auto text-[10px] tabular-nums text-white/35">
                      {card.date.slice(5)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-white/85">
                    {card.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

/** SECTION 4 — 하단 CTA */
export function HomeConsultCtaSample() {
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

export function HomeSectionsSampleClient({
  properties,
  auctions,
}: {
  properties: Property[];
  auctions: Auction[];
}) {
  return (
    <div className="font-[family-name:var(--font-unifine),Outfit,sans-serif]">
      <div className="border-b border-dashed border-white/15 bg-[#0a0809] px-4 py-8 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-white/35">HERO (기존 유지)</p>
        <p className="mt-2 text-sm text-white/50">
          목업 v3 · 신뢰 텍스트만 · 추천 제목 중앙 · 열 사이 간격(페이드 없음)
        </p>
      </div>

      <HomeTrustBannerSample />
      <SectionDivider />
      <HomeFeaturedSectionSample properties={properties} auctions={auctions} />
      <SectionDivider />
      <HomeTripleColumnSample />
      <SectionDivider />
      <HomeConsultCtaSample />
    </div>
  );
}
