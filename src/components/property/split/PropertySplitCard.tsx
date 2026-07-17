"use client";

import type { Property } from "@prisma/client";
import { categoryLabel, parseImages } from "@/lib/format";
import {
  propertyCardAddressLine,
  propertyCardDealBadgeLabel,
  propertyCardPriceLine,
  propertyCardRegisteredDate,
  propertyCardSpecLine,
  propertyCardTitle,
} from "@/lib/property-card-display";

type Props = {
  property: Property;
  selected?: boolean;
  onSelect: () => void;
};

/** 좌측 2열 — 컴팩트·균일 카드 (히어로 오로라 톤) */
export function PropertySplitCard({ property, selected, onSelect }: Props) {
  const cover = parseImages(property.images)[0];
  const title = propertyCardTitle(property);
  const spec = propertyCardSpecLine(property);
  const price = propertyCardPriceLine(property);
  const address = propertyCardAddressLine(property);
  const registered = propertyCardRegisteredDate(property);
  const dealLabel = propertyCardDealBadgeLabel(property);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border text-left backdrop-blur-md transition duration-200 ${
        selected
          ? "border-[#a78bfa]/70 bg-[rgba(59,42,92,0.55)] shadow-[0_0_0_1px_rgba(167,139,250,0.35),0_8px_28px_rgba(77,171,255,0.18)]"
          : "border-white/10 bg-[rgba(20,18,28,0.72)] hover:border-[#60a5fa]/35 hover:bg-[rgba(30,58,95,0.35)]"
      }`}
    >
      <div className="relative h-[72px] w-full shrink-0 overflow-hidden bg-[#0a0a12] sm:h-[80px]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/25">
            <span className="material-symbols-outlined text-xl">home</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#14121c] to-transparent" />
        <div className="absolute left-1 top-1 flex flex-wrap gap-0.5">
          <span className="rounded-full border border-[#facc15]/40 bg-[rgba(10,10,18,0.85)] px-1.5 py-0.5 text-[9px] font-bold text-[#facc15]">
            {categoryLabel(property.category)}
          </span>
          <span className="rounded-full border border-pink-400/40 bg-[rgba(10,10,18,0.85)] px-1.5 py-0.5 text-[9px] font-bold text-pink-400">
            {dealLabel}
          </span>
        </div>
      </div>

      <div className="flex h-[96px] flex-col px-2 py-2 sm:h-[100px]">
        <h3 className="line-clamp-1 text-[11px] font-bold text-white">{title || "\u00a0"}</h3>
        <p className="mt-0.5 line-clamp-1 text-[9px] font-semibold text-[#c4b5fd]/70">
          {spec || "\u00a0"}
        </p>
        <p className="mt-1 line-clamp-1 text-[11px] font-bold text-[#fbbf24]">
          {price || "\u00a0"}
        </p>
        <div className="mt-auto flex items-end justify-between gap-1">
          <p className="min-w-0 flex-1 line-clamp-1 text-[9px] font-bold text-[#f9a8d4]">
            {address || "\u00a0"}
          </p>
          <p className="shrink-0 text-[8px] font-bold text-[#f9a8d4]/80">
            {registered || "\u00a0"}
          </p>
        </div>
      </div>
    </button>
  );
}
