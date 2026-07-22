"use client";

import { AppLink as Link } from "@/components/ui/AppLink";
import { FeaturedMarqueeRow } from "@/components/landing/FeaturedMarqueeRow";
import { trackBrowserEvent } from "@/lib/analytics/track";
import { formatAuctionMoney, parseImages } from "@/lib/format";
import type { SerializedAuction } from "@/lib/auction-split-view";

const panel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

function CompactCard({ auction }: { auction: SerializedAuction }) {
  const cover = parseImages(auction.images)[0];
  const min = auction.minPrice ?? auction.recommendedPrice;
  return (
    <Link
      href={`/auctions/${auction.id}`}
      onClick={() =>
        trackBrowserEvent({
          eventType: "item_click",
          menuKey: "auctions",
          targetType: "auction",
          targetId: auction.id,
        })
      }
      className="featured-marquee-card group relative block w-[168px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] transition hover:border-[#d4af37]/45"
    >
      <div className="relative h-[88px] bg-black/40">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : null}
        <span className="absolute left-1.5 top-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[9px] font-bold text-[#fde68a]">
          추천
        </span>
      </div>
      <div className="space-y-0.5 p-2.5">
        <p className="line-clamp-1 text-[11px] font-bold text-white">{auction.title}</p>
        <p className="text-[12px] font-extrabold text-[#facc15]">
          최저 {formatAuctionMoney(min)}
        </p>
      </div>
    </Link>
  );
}

type Props = {
  items: SerializedAuction[];
};

/** 경매 목록 상단 — 찬스 추천 마퀴 */
export function AuctionRecommendStrip({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className={`${panel} p-4 md:p-5`}>
      <div className="relative mb-3 flex items-center justify-center">
        <h2 className="text-sm font-extrabold text-[#d4af37]">추천 경매</h2>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white/40">
          찬스 추천
        </span>
      </div>
      <p className="mb-2 text-center text-[10px] text-white/35 md:hidden">좌우로 넘겨 보세요</p>
      <FeaturedMarqueeRow
        durationSec={52}
        className="!rounded-none !py-1 [mask-image:none] [-webkit-mask-image:none]"
      >
        {items.map((a) => (
          <CompactCard key={a.id} auction={a} />
        ))}
      </FeaturedMarqueeRow>
    </section>
  );
}
