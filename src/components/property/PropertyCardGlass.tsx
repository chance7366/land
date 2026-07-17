import type { Property } from "@prisma/client";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { categoryLabel, parseImages } from "@/lib/format";
import {
  propertyCardAddressLine,
  propertyCardDealBadgeLabel,
  propertyCardPriceLine,
  propertyCardRegisteredDate,
  propertyCardSpecLine,
  propertyCardTitle,
} from "@/lib/property-card-display";

/**
 * Landing-aligned property card — 3-up grid, badge/title/spec/price/address rules.
 */
export function PropertyCardGlass({ property }: { property: Property }) {
  const cover = parseImages(property.images)[0];
  const title = propertyCardTitle(property);
  const spec = propertyCardSpecLine(property);
  const price = propertyCardPriceLine(property);
  const address = propertyCardAddressLine(property);
  const registered = propertyCardRegisteredDate(property);
  const dealLabel = propertyCardDealBadgeLabel(property);

  return (
    <Link
      href={`/properties?id=${property.id}`}
      className="group flex w-full max-w-[280px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f1f]/95 shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_0_1px_rgba(77,171,255,0.08)] backdrop-blur-sm transition-[transform,box-shadow,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-[#4dabff]/45 hover:bg-[#262626] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_28px_rgba(77,171,255,0.28)] sm:max-w-none"
    >
      <div className="relative aspect-[16/10] bg-[#141414]">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width:640px) 280px, (max-width:1024px) 33vw, 260px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#525252]">
            <span className="material-symbols-outlined text-3xl">home</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#1f1f1f] to-transparent" />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-[#facc15]/40 bg-[rgba(15,18,28,0.88)] px-2.5 py-1 text-xs font-bold text-[#facc15] shadow-[0_0_12px_rgba(250,204,21,0.2)] backdrop-blur-sm">
            {categoryLabel(property.category)}
          </span>
          <span className="rounded-full border border-pink-400/40 bg-[rgba(15,18,28,0.88)] px-2.5 py-1 text-xs font-bold text-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.2)] backdrop-blur-sm">
            {dealLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-2 text-sm font-semibold text-white">{title}</h2>
        {spec ? <p className="mt-1 line-clamp-1 text-[11px] font-bold text-[#a3a3a3]">{spec}</p> : null}
        <p className="mt-2 text-left text-xs font-bold text-[#d4af37]">{price}</p>
        <div className="mt-1.5 flex items-start justify-between gap-2">
          <p className="min-w-0 flex-1 text-[11px] font-bold leading-snug text-pink-400">{address}</p>
          {registered ? (
            <p className="shrink-0 text-[10px] font-bold text-pink-400">{registered}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
