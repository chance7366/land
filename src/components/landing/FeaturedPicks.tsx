import type { Auction, Property } from "@prisma/client";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingCta } from "@/components/landing/LandingCta";
import { formatPropertyPrice, formatAuctionMoney, formatDateYmd, parseImages } from "@/lib/format";

type FeaturedPicksProps = {
  properties: Property[];
  auctions: Auction[];
};

const cardClass =
  "overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f1f] shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(212,175,55,0.06)] transition-colors hover:border-[#d4af37]/35 hover:bg-[#262626]";

export function FeaturedPicks({ properties, auctions }: FeaturedPicksProps) {
  return (
    <section className="border-t border-white/5 bg-[#0a0a0a] px-container-padding-mobile py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4af37] md:w-16" />
          <h2
            className="text-2xl font-semibold tracking-wide text-white md:text-3xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            추천 매물 · 경매
          </h2>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4af37] md:w-16" />
        </div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white">부동산중개</h3>
          <LandingCta href="/properties" variant="ghost" className="!px-4 !py-2 text-xs">
            더보기
          </LandingCta>
        </div>
        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const cover = parseImages(property.images)[0];
            return (
              <Link key={property.id} href={`/properties?id=${property.id}`} className={cardClass}>
                <div className="relative aspect-[16/10] bg-[#141414]">
                  {cover ? (
                    <Image src={cover} alt={property.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#525252]">
                      <span className="material-symbols-outlined text-4xl">home</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="line-clamp-2 text-base font-semibold text-white">{property.title}</p>
                  <p className="mt-3 text-sm font-bold text-[#d4af37]">{formatPropertyPrice(property)}</p>
                  <p className="mt-2 text-xs font-bold text-pink-400">{property.region}</p>
                </div>
              </Link>
            );
          })}
          {properties.length === 0 && (
            <p className="text-sm text-[#a3a3a3]">등록된 매물이 없습니다.</p>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white">경매공매</h3>
          <LandingCta href="/auctions" variant="ghost" className="!px-4 !py-2 text-xs">
            더보기
          </LandingCta>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((auction) => {
            const cover = parseImages(auction.images)[0];
            const minPrice = auction.minPrice ?? auction.recommendedPrice;
            const areaParts: string[] = [];
            if (auction.landArea != null && auction.landArea > 0) {
              areaParts.push(`토지 ${auction.landArea.toLocaleString("ko-KR")}㎡`);
            }
            if (auction.buildingArea != null && auction.buildingArea > 0) {
              areaParts.push(`건물 ${auction.buildingArea.toLocaleString("ko-KR")}㎡`);
            }
            const headline = [auction.itemType, ...areaParts].filter(Boolean).join(" · ");
            return (
              <Link key={auction.id} href={`/auctions?id=${encodeURIComponent(auction.id)}`} className={cardClass}>
                <div className="relative aspect-[16/10] bg-[#141414]">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={auction.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#525252]">
                      <span className="material-symbols-outlined text-4xl">gavel</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="line-clamp-2 text-base font-semibold text-white">
                    {headline || auction.title}
                  </p>
                  <p className="mt-3 text-sm font-bold text-[#d4af37]">
                    감정가 {formatAuctionMoney(auction.appraisalPrice)}
                  </p>
                  <p className="mt-1 text-sm font-bold text-blue-400">
                    최저가 {formatAuctionMoney(minPrice)}
                  </p>
                  <p className="mt-2 text-xs font-bold text-pink-400">
                    {auction.caseNumber}
                    {auction.saleDate ? ` · 매각기일 ${formatDateYmd(auction.saleDate)}` : ""}
                  </p>
                </div>
              </Link>
            );
          })}
          {auctions.length === 0 && (
            <p className="text-sm text-[#a3a3a3]">등록된 경매가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
