import type { ReactNode } from "react";
import type { Auction, Property } from "@prisma/client";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingCta } from "@/components/landing/LandingCta";
import { FeaturedMarqueeRow } from "@/components/landing/FeaturedMarqueeRow";
import { OverflowMarquee } from "@/components/ui/OverflowMarquee";
import {
  formatAuctionMoney,
  formatDateYmd,
  parseImages,
  categoryLabel,
} from "@/lib/format";
import {
  propertyCardAddressLine,
  propertyCardDealBadgeLabel,
  propertyCardPriceLine,
  propertyCardPriceSegments,
  auctionMoneyPriceSegments,
  propertyCardRegisteredDate,
  propertyCardSpecLine,
  propertyCardTitle,
  type PriceSegment,
} from "@/lib/property-card-display";

export type FeaturedMarqueeCardSize = "md" | "sm";

type FeaturedPicksMarqueeProps = {
  properties: Property[];
  auctions: Auction[];
  /** Show mockup banner above the section */
  isMockup?: boolean;
  /** md = 300px (default), sm ≈ 20% smaller (240px) */
  cardSize?: FeaturedMarqueeCardSize;
  /**
   * legacy: 부동산중개 / 경매공매
   * accent: 추천 매물·경매 + 서비스카드 액센트 색 + 골드 선
   */
  rowHeadings?: "legacy" | "accent";
  /** full = 마퀴 전폭 / contained = max-w-6xl / section = 섹션 전폭(패딩만) */
  layout?: "full" | "contained" | "section";
  mockupNote?: string;
  /**
   * default = current colors
   * bright = address/date white same size · price bright pink larger · auction meta white
   */
  typeTone?: "default" | "bright";
  /** default = card shell only · beige = warm beige · paper = cream + forest green (ref Adobe Fonts) */
  bodyTone?: "default" | "beige" | "paper";
  /**
   * Gap between property marquee and auction heading.
   * default = mb-14 (현행) · md/lg/xl/2xl = 더 넓은 간격
   */
  rowGap?: "default" | "md" | "lg" | "xl" | "2xl";
};

function GoldRule({ direction }: { direction: "to" | "from" }) {
  return (
    <span
      className={
        direction === "to"
          ? "h-px w-10 shrink-0 bg-gradient-to-r from-transparent to-[#d4af37] md:w-16"
          : "h-px w-10 shrink-0 bg-gradient-to-l from-transparent to-[#d4af37] md:w-16"
      }
      aria-hidden
    />
  );
}

const cardShell =
  "featured-marquee-card shrink-0 overflow-hidden rounded-2xl border border-landing-border bg-landing-card shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(212,175,55,0.06)]";

const sizeStyles = {
  sm: {
    card: `${cardShell} w-[240px]`,
    cardProperty: `${cardShell} featured-marquee-card--property w-[240px]`,
    cardAuction: `${cardShell} featured-marquee-card--auction w-[240px]`,
    sizes: "240px",
    body: "featured-marquee-card__body p-4",
    /** 경매 본문과 동일 높이로 맞춤 (이미지 제외) */
    bodyBright:
      "featured-marquee-card__body font-hero-gothic-noto flex h-[132px] flex-col justify-between gap-1 overflow-hidden p-4 text-white",
    title: "line-clamp-2 text-sm font-semibold text-landing-text",
    titleBright: "line-clamp-2 text-sm font-bold text-white",
    auctionTitleBright: "line-clamp-2 text-sm font-bold text-white",
    spec: "mt-1 line-clamp-1 text-[11px] font-bold text-landing-subtle",
    specBright: "line-clamp-1 text-xs font-bold text-white",
    price: "mt-2 text-left text-xs font-bold text-[#d4af37]",
    priceBright: "text-left font-extrabold text-[#4dabff]",
    priceSub: "mt-0.5 text-xs font-bold text-blue-400",
    meta: "mt-1.5 text-[11px] font-bold text-pink-400",
    metaBright: "min-w-0 flex-1 truncate text-xs font-bold text-white",
    metaDate: "shrink-0 text-[10px] font-bold text-pink-400",
    metaDateBright: "shrink-0 text-xs font-bold text-white",
    metaRow: "mt-1.5 flex items-start justify-between gap-2",
    metaRowBright: "flex items-center justify-between gap-2",
    auctionMeta: "featured-marquee-card__meta flex items-center justify-between gap-2 text-[11px] font-bold text-blue-400",
    auctionMetaBright:
      "featured-marquee-card__meta flex items-center justify-between gap-2 text-xs font-bold text-white",
    auctionAppraisalBright: "font-bold text-white",
    auctionMinBright: "font-extrabold text-[#facc15]",
    icon: "text-3xl",
  },
  md: {
    card: `${cardShell} w-[300px]`,
    cardProperty: `${cardShell} featured-marquee-card--property w-[300px]`,
    cardAuction: `${cardShell} featured-marquee-card--auction w-[300px]`,
    sizes: "300px",
    body: "featured-marquee-card__body p-5",
    bodyBright:
      "featured-marquee-card__body font-hero-gothic-noto flex h-[148px] flex-col justify-between gap-1 overflow-hidden p-5 text-white",
    title: "line-clamp-2 text-base font-semibold text-landing-text",
    titleBright: "line-clamp-2 text-base font-bold text-white",
    auctionTitleBright: "line-clamp-2 text-base font-bold text-white",
    spec: "mt-1.5 line-clamp-1 text-xs font-bold text-landing-subtle",
    specBright: "line-clamp-1 text-xs font-bold text-white",
    price: "mt-3 text-left text-sm font-bold text-[#d4af37]",
    priceBright: "text-left font-extrabold text-[#4dabff]",
    priceSub: "mt-1 text-sm font-bold text-blue-400",
    meta: "mt-2 text-xs font-bold text-pink-400",
    metaBright: "min-w-0 flex-1 truncate text-xs font-bold text-white",
    metaDate: "shrink-0 text-[11px] font-bold text-pink-400",
    metaDateBright: "shrink-0 text-xs font-bold text-white",
    metaRow: "mt-2 flex items-start justify-between gap-2",
    metaRowBright: "flex items-center justify-between gap-2",
    auctionMeta: "featured-marquee-card__meta flex items-center justify-between gap-2 text-[11px] font-bold text-blue-400",
    auctionMetaBright:
      "featured-marquee-card__meta flex items-center justify-between gap-2 text-xs font-bold text-white",
    auctionAppraisalBright: "font-bold text-white",
    auctionMinBright: "font-extrabold text-[#facc15]",
    icon: "text-4xl",
  },
} as const;

const AUCTION_PROCESS_STEPS = [
  "권리분석 의뢰",
  "현장조사 및 입찰가 제안",
  "법원동행/대리입찰",
  "낙찰 및 명도(인도)",
] as const;

function AuctionProcessFlow({ className = "" }: { className?: string }) {
  return (
    <ol
      className={`flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1 text-[10px] font-semibold leading-tight text-landing-muted sm:text-[11px] ${className}`}
      aria-label="경매 진행 절차"
    >
      {AUCTION_PROCESS_STEPS.map((step, i) => (
        <li key={step} className="inline-flex items-center gap-1">
          {i > 0 ? (
            <span className="mx-0.5 text-[#d4af37]" aria-hidden>
              →
            </span>
          ) : null}
          <span className="auction-process-chip rounded-md border border-[#d4af37]/35 bg-[#d4af37]/10 px-1.5 py-0.5 text-[#f5e6b8]">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

function appraisalRatioPercent(appraisal: number | null | undefined, min: number | null | undefined) {
  if (appraisal == null || appraisal <= 0 || min == null) return null;
  return Math.round((min / appraisal) * 100);
}

/** 가격 행: 한글·단위 14px / 숫자 15px */
function MarqueePriceText({
  segments,
  className,
  suffix,
}: {
  segments: PriceSegment[];
  className: string;
  suffix?: ReactNode;
}) {
  return (
    <p className={className}>
      {segments.map((s, i) => (
        <span
          key={`${i}-${s.text}`}
          className={s.role === "num" ? "text-[15px]" : "text-[14px]"}
        >
          {s.text}
        </span>
      ))}
      {suffix}
    </p>
  );
}

/** Gap between property marquee track and auction heading (실제 margin-bottom) */
const ROW_GAP_CLASS = {
  default: "mb-14", // 56px — 너무 타이트
  md: "mb-20", // 80px — 최소 권장
  lg: "mb-24", // 96px — 무난
  xl: "mb-[6.5rem]", // 104px — 96~112 무난 구간 중앙
  "2xl": "mb-[7.5rem]", // 120px — 여유
} as const;

/** Same visual speed for both rows (~4s per card) */
function marqueeDuration(count: number) {
  return Math.max(40, count * 4);
}

export function FeaturedPicksMarquee({
  properties,
  auctions,
  isMockup = false,
  cardSize = "md",
  rowHeadings = "accent",
  layout = "full",
  mockupNote,
  typeTone = "default",
  bodyTone = "default",
  rowGap = "default",
}: FeaturedPicksMarqueeProps) {
  const styles = sizeStyles[cardSize];
  const bright = typeTone === "bright";
  const beigeBody = bodyTone === "beige";
  const paperBody = bodyTone === "paper";
  const accentHeadings = rowHeadings === "accent";
  /** contained: 헤딩+트랙 모두 max-w-6xl / section·full: 헤딩만 max-w-6xl, 트랙은 섹션 전폭 */
  const contained = layout === "contained";
  const shellClass = "mx-auto max-w-6xl px-container-padding-mobile md:px-8";
  const propertyRowGap = contained
    ? rowGap === "default"
      ? "mb-12"
      : ROW_GAP_CLASS[rowGap]
    : ROW_GAP_CLASS[rowGap];

  const propertyHeading = accentHeadings ? (
    <div className="flex min-w-0 items-center gap-3">
      <GoldRule direction="to" />
      <h3 className="text-lg font-bold text-[#4dabff]">
        추천 매물 [{properties.length.toLocaleString("ko-KR")}건]
      </h3>
      <GoldRule direction="from" />
    </div>
  ) : (
    <h3 className="text-lg font-bold text-landing-text">
      부동산중개
      <span className="ml-2 text-sm font-normal text-landing-subtle">{properties.length}건</span>
    </h3>
  );

  const auctionHeading = accentHeadings ? (
    <div className="flex min-w-0 items-center gap-3">
      <GoldRule direction="to" />
      <h3 className="text-lg font-bold text-[#d4af37]">
        추천 경매 [{auctions.length.toLocaleString("ko-KR")}건]
      </h3>
      <GoldRule direction="from" />
    </div>
  ) : (
    <h3 className="text-lg font-bold text-landing-text">
      경매공매
      <span className="ml-2 text-sm font-normal text-landing-subtle">{auctions.length}건</span>
    </h3>
  );

  const propertyRow =
    properties.length === 0 ? (
      <p className="text-sm text-landing-subtle">등록된 매물이 없습니다.</p>
    ) : (
      <FeaturedMarqueeRow
        className={propertyRowGap}
        durationSec={marqueeDuration(properties.length)}
      >
        {properties.map((property) => (
          <PropertyMarqueeCard
            key={property.id}
            property={property}
            styles={styles}
            bright={bright}
            paperBody={paperBody}
          />
        ))}
      </FeaturedMarqueeRow>
    );

  const auctionRow =
    auctions.length === 0 ? (
      <p className="text-sm text-landing-subtle">등록된 경매가 없습니다.</p>
    ) : (
      <FeaturedMarqueeRow durationSec={marqueeDuration(auctions.length)}>
        {auctions.map((auction) => (
          <AuctionMarqueeCard
            key={auction.id}
            auction={auction}
            styles={styles}
            bright={bright}
            paperBody={paperBody}
          />
        ))}
      </FeaturedMarqueeRow>
    );

  return (
    <section
      className={`border-t border-landing-border bg-landing-section pb-16 pt-8 md:pb-24 md:pt-10${
        bright ? " marquee-type-bright" : ""
      }${beigeBody ? " marquee-body-beige" : ""}${paperBody ? " marquee-body-paper" : ""}`}
    >
      {contained ? (
        <div className={shellClass}>
          {isMockup && (
            <p className="mb-6 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-center text-xs text-[#d4af37]">
              {mockupNote ??
                "샘플 · 매물/경매 트랙이 헤더와 같은 max-w-6xl 너비로 제한됩니다."}
            </p>
          )}
          <div className="mb-5 flex items-center justify-between gap-3">
            {propertyHeading}
            <LandingCta href="/properties" variant="ghost" className="!px-4 !py-2 text-xs">
              더보기
            </LandingCta>
          </div>
          {propertyRow}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
              {auctionHeading}
              <AuctionProcessFlow />
            </div>
            <LandingCta href="/auctions" variant="ghost" className="!px-4 !py-2 text-xs shrink-0 self-end sm:self-auto">
              더보기
            </LandingCta>
          </div>
          {auctionRow}
        </div>
      ) : (
        <>
          <div className={shellClass}>
            {isMockup && (
              <p className="mb-6 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-center text-xs text-[#d4af37]">
                {mockupNote ??
                  (layout === "section"
                    ? "샘플 · 헤딩은 max-w-6xl, 마퀴 트랙만 섹션 전폭."
                    : "샘플 · 전체 매물/경매가 우측→좌측으로 흐릅니다. 호버 시 일시정지.")}
              </p>
            )}
            <div className="mb-5 flex items-center justify-between gap-3">
              {propertyHeading}
              <LandingCta href="/properties" variant="ghost" className="!px-4 !py-2 text-xs">
                더보기
              </LandingCta>
            </div>
          </div>
          {properties.length === 0 ? (
            <p className="px-container-padding-mobile text-sm text-landing-subtle md:px-8">
              등록된 매물이 없습니다.
            </p>
          ) : (
            propertyRow
          )}
          <div className={shellClass}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                {auctionHeading}
                <AuctionProcessFlow />
              </div>
              <LandingCta href="/auctions" variant="ghost" className="!px-4 !py-2 text-xs shrink-0 self-end sm:self-auto">
                더보기
              </LandingCta>
            </div>
          </div>
          {auctions.length === 0 ? (
            <p className="px-container-padding-mobile text-sm text-landing-subtle md:px-8">
              등록된 경매가 없습니다.
            </p>
          ) : (
            auctionRow
          )}
        </>
      )}
    </section>
  );
}

type CardStyles = (typeof sizeStyles)[FeaturedMarqueeCardSize];

function PropertyMarqueeCard({
  property,
  styles,
  bright = false,
  paperBody = false,
}: {
  property: Property;
  styles: CardStyles;
  bright?: boolean;
  paperBody?: boolean;
}) {
  const cover = parseImages(property.images)[0];
  const title = propertyCardTitle(property);
  const spec = propertyCardSpecLine(property);
  const price = propertyCardPriceLine(property);
  const priceSegments = propertyCardPriceSegments(property);
  const address = propertyCardAddressLine(property);
  const registered = propertyCardRegisteredDate(property);
  const dealLabel = propertyCardDealBadgeLabel(property);

  return (
    <Link href={`/properties?id=${property.id}`} className={styles.cardProperty}>
      <div className="relative aspect-[16/10] bg-landing-image">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
            sizes={styles.sizes}
          />
        ) : (
          <div className="featured-marquee-card__media-empty flex h-full items-center justify-center text-landing-faint">
            <span className={`material-symbols-outlined ${styles.icon}`}>home</span>
          </div>
        )}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-[#facc15]/35 bg-[#0e1a14] px-2.5 py-1 text-xs font-bold text-[#facc15]">
            {categoryLabel(property.category)}
          </span>
          <span className="rounded-full border border-pink-400/35 bg-[#0e1a14] px-2.5 py-1 text-xs font-bold text-pink-400">
            {dealLabel}
          </span>
        </div>
      </div>
      <div
        className={
          paperBody
            ? `${styles.body} featured-marquee-card__body flex flex-col p-0`
            : bright
              ? styles.bodyBright
              : styles.body
        }
      >
        {paperBody ? (
          <>
            <div className="featured-marquee-card__paper flex flex-col gap-1.5 px-4 pt-4 pb-3">
              <p className={bright ? styles.titleBright : styles.title}>{title}</p>
              {spec ? (
                <p className={bright ? `${styles.specBright} marquee-paper-spec` : `${styles.spec} marquee-paper-spec`}>
                  {spec}
                </p>
              ) : null}
              <div className={styles.metaRowBright}>
                <p className={bright ? styles.metaBright : `min-w-0 flex-1 ${styles.meta}`}>
                  {address}
                </p>
                {registered ? (
                  <p className={bright ? styles.metaDateBright : styles.metaDate}>{registered}</p>
                ) : null}
              </div>
              {bright ? (
                <MarqueePriceText segments={priceSegments} className={styles.priceBright} />
              ) : (
                <p className="marquee-paper-price text-left text-sm font-bold">{price}</p>
              )}
            </div>
          </>
        ) : bright ? (
          <>
            <p className={styles.titleBright}>{title}</p>
            {spec ? <p className={styles.specBright}>{spec}</p> : null}
            <div className={styles.metaRowBright}>
              <p className={styles.metaBright}>{address}</p>
              {registered ? <p className={styles.metaDateBright}>{registered}</p> : null}
            </div>
            <MarqueePriceText segments={priceSegments} className={styles.priceBright} />
          </>
        ) : (
          <>
            <p className={styles.title}>{title}</p>
            {spec ? <p className={styles.spec}>{spec}</p> : null}
            <p className={styles.price}>{price}</p>
            <div className={styles.metaRow}>
              <p className={`min-w-0 flex-1 ${styles.meta}`}>{address}</p>
              {registered ? <p className={styles.metaDate}>{registered}</p> : null}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}

function AuctionMarqueeCard({
  auction,
  styles,
  bright = false,
  paperBody = false,
}: {
  auction: Auction;
  styles: CardStyles;
  bright?: boolean;
  paperBody?: boolean;
}) {
  const cover = parseImages(auction.images)[0];
  const minPrice = auction.minPrice ?? auction.recommendedPrice;
  const location = [auction.address, auction.region].filter(Boolean).join(" · ") || auction.title;
  const ratioPct = appraisalRatioPercent(auction.appraisalPrice, minPrice);

  return (
    <Link href={`/auctions?id=${encodeURIComponent(auction.id)}`} className={styles.cardAuction}>
      <div className="relative aspect-[16/10] bg-landing-image">
        {cover ? (
          <Image
            src={cover}
            alt={auction.title}
            fill
            className="object-cover"
            sizes={styles.sizes}
          />
        ) : (
          <div className="featured-marquee-card__media-empty flex h-full items-center justify-center text-landing-faint">
            <span className={`material-symbols-outlined ${styles.icon}`}>gavel</span>
          </div>
        )}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {auction.itemType ? (
            <span className="rounded-full border border-[#facc15]/35 bg-[#0e1a14] px-2.5 py-1 text-xs font-bold text-[#facc15]">
              {auction.itemType}
            </span>
          ) : null}
          <span className="rounded-full border border-pink-400/35 bg-[#0e1a14] px-2.5 py-1 text-xs font-bold text-pink-400">
            D-{auction.dDay}
          </span>
        </div>
      </div>
      <div
        className={
          paperBody
            ? `${styles.body} featured-marquee-card__body flex flex-col gap-0 p-0`
            : bright
              ? styles.bodyBright
              : `${styles.body} featured-marquee-card__body flex flex-col gap-1.5`
        }
      >
        {paperBody ? (
          <>
            <div className="featured-marquee-card__paper flex flex-col gap-1.5 px-4 pt-4 pb-3">
              <OverflowMarquee
                text={location}
                className={bright ? styles.auctionTitleBright : styles.title}
              />
              <div className={bright ? styles.auctionMetaBright : styles.auctionMeta}>
                <span className="min-w-0 truncate">{auction.caseNumber}</span>
                {auction.saleDate ? (
                  <span className="shrink-0">매각기일 {formatDateYmd(auction.saleDate)}</span>
                ) : null}
              </div>
              {bright && auction.appraisalPrice != null ? (
                <MarqueePriceText
                  segments={auctionMoneyPriceSegments("감정가", auction.appraisalPrice)}
                  className={`${styles.auctionAppraisalBright} marquee-paper-price-label`}
                />
              ) : (
                <p
                  className={
                    bright
                      ? `${styles.auctionAppraisalBright} marquee-paper-price-label`
                      : "featured-marquee-card__price marquee-paper-price-label text-xs font-bold text-[#d4af37]"
                  }
                >
                  감정가 {formatAuctionMoney(auction.appraisalPrice)}
                </p>
              )}
              {bright && minPrice != null ? (
                <MarqueePriceText
                  segments={auctionMoneyPriceSegments("최저가", minPrice)}
                  className={`${styles.auctionMinBright} marquee-paper-price-label`}
                  suffix={
                    ratioPct != null ? (
                      <span className="ml-1 text-[15px] font-extrabold">({ratioPct}%)</span>
                    ) : null
                  }
                />
              ) : (
                <p
                  className={
                    bright
                      ? `${styles.auctionMinBright} marquee-paper-price-label`
                      : "featured-marquee-card__price-sub marquee-paper-price-label text-xs font-bold text-pink-400"
                  }
                >
                  최저가 {formatAuctionMoney(minPrice)}
                  {ratioPct != null ? (
                    <span
                      className={
                        bright
                          ? "ml-1 font-extrabold"
                          : "featured-marquee-card__ratio ml-1 font-bold text-red-500"
                      }
                    >
                      {bright ? `(${ratioPct}%)` : `감정가의 ${ratioPct}%`}
                    </span>
                  ) : null}
                </p>
              )}
            </div>
          </>
        ) : bright ? (
          <>
            <OverflowMarquee text={location} className={styles.auctionTitleBright} />
            <div className={styles.auctionMetaBright}>
              <span className="min-w-0 truncate">{auction.caseNumber}</span>
              {auction.saleDate ? (
                <span className="shrink-0">매각기일 {formatDateYmd(auction.saleDate)}</span>
              ) : null}
            </div>
            {auction.appraisalPrice != null ? (
              <MarqueePriceText
                segments={auctionMoneyPriceSegments("감정가", auction.appraisalPrice)}
                className={styles.auctionAppraisalBright}
              />
            ) : null}
            {minPrice != null ? (
              <MarqueePriceText
                segments={auctionMoneyPriceSegments("최저가", minPrice)}
                className={styles.auctionMinBright}
                suffix={
                  ratioPct != null ? (
                    <span className="ml-1 text-[15px] font-extrabold">({ratioPct}%)</span>
                  ) : null
                }
              />
            ) : null}
          </>
        ) : (
          <>
            <OverflowMarquee text={location} className={styles.title} />
            <div className={styles.auctionMeta}>
              <span className="min-w-0 truncate">{auction.caseNumber}</span>
              {auction.saleDate ? (
                <span className="shrink-0">매각기일 {formatDateYmd(auction.saleDate)}</span>
              ) : null}
            </div>
            <p className="featured-marquee-card__price text-xs font-bold text-[#d4af37]">
              감정가 {formatAuctionMoney(auction.appraisalPrice)}
            </p>
            <p className="featured-marquee-card__price-sub text-xs font-bold text-pink-400">
              최저가 {formatAuctionMoney(minPrice)}
              {ratioPct != null ? (
                <span className="featured-marquee-card__ratio ml-1 font-bold text-red-500">
                  감정가의 {ratioPct}%
                </span>
              ) : null}
            </p>
          </>
        )}
      </div>
    </Link>
  );
}
