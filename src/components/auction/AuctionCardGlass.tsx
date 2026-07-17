import type { Auction } from "@prisma/client";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { OverflowMarquee } from "@/components/ui/OverflowMarquee";
import { formatAuctionMoney, formatDateYmd, parseImages } from "@/lib/format";

/**
 * Landing-aligned auction card — gold accent, address marquee, rights/memo scroll.
 */
export function AuctionCardGlass({ auction }: { auction: Auction }) {
  const cover = parseImages(auction.images)[0];
  const minPrice = auction.minPrice ?? auction.recommendedPrice;
  const location = [auction.address, auction.region].filter(Boolean).join(" · ") || auction.title;
  const rights = auction.rightsAnalysis?.trim() || "";
  const memo = auction.memo?.trim() || "";

  return (
    <Link
      href={`/auctions?id=${encodeURIComponent(auction.id)}`}
      className="group flex w-full max-w-[280px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f1f]/95 shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_0_1px_rgba(212,175,55,0.1)] backdrop-blur-sm transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-[#d4af37]/45 hover:bg-[#262626] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_28px_rgba(212,175,55,0.28)] sm:max-w-none"
    >
      <div className="relative aspect-[16/10] bg-[#141414]">
        {cover ? (
          <Image
            src={cover}
            alt={auction.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:640px) 280px, (max-width:1024px) 33vw, 260px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#525252]">
            <span className="material-symbols-outlined text-3xl">gavel</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1f1f1f] via-[#1f1f1f]/80 to-transparent" />

        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {auction.itemType ? (
            <span className="rounded-full border border-[#d4af37]/40 bg-[rgba(15,18,28,0.88)] px-2.5 py-1 text-xs font-bold text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)] backdrop-blur-sm">
              {auction.itemType}
            </span>
          ) : null}
          <span className="rounded-full border border-pink-400/40 bg-[rgba(15,18,28,0.88)] px-2.5 py-1 text-xs font-bold text-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.2)] backdrop-blur-sm">
            D-{auction.dDay}
          </span>
        </div>

        <div className="absolute right-2.5 top-2.5 max-w-[58%] space-y-1 text-right">
          <p className="inline-block rounded-full border border-[#d4af37]/40 bg-[rgba(15,18,28,0.88)] px-2.5 py-1 text-sm font-bold text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)] backdrop-blur-sm">
            감정가 {formatAuctionMoney(auction.appraisalPrice)}
          </p>
          <p className="inline-block rounded-full border border-pink-400/40 bg-[rgba(15,18,28,0.88)] px-2.5 py-1 text-sm font-bold text-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.2)] backdrop-blur-sm">
            최저가 {formatAuctionMoney(minPrice)}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <OverflowMarquee
          text={location}
          className="text-sm font-semibold text-white"
        />

        <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-blue-400">
          <span className="min-w-0 truncate">{auction.caseNumber}</span>
          {auction.saleDate ? (
            <span className="shrink-0">매각기일 {formatDateYmd(auction.saleDate)}</span>
          ) : null}
        </div>

        {rights ? (
          <OverflowMarquee text={rights} className="text-xs font-bold text-[#facc15]" />
        ) : (
          <p className="text-xs font-medium text-[#525252]">권리분석 정보 없음</p>
        )}

        {memo ? (
          <OverflowMarquee text={memo} className="text-[11px] font-bold text-pink-400" />
        ) : (
          <p className="text-[11px] font-medium text-[#525252]">메모 없음</p>
        )}
      </div>
    </Link>
  );
}
