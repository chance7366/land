"use client";

import { useMemo, type ReactNode } from "react";
import type { Property } from "@prisma/client";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { categoryLabel, parseImages, parseTags } from "@/lib/format";
import {
  propertyCardDealBadgeLabel,
  propertyCardPriceLine,
} from "@/lib/property-card-display";
import { buildPropertyDetailSections } from "@/lib/property-detail-sections";
import { PropertyKvTable } from "@/components/property/PropertyKvTable";
import { useImageSlideshow } from "@/lib/use-image-slideshow";

const OFFICE_TEL = "041-633-0000";
const OFFICE_TEL_HREF = "tel:041-633-0000";

/** 메인 히어로(바이올렛 오로라) 패널 톤 */
const heroPanel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

type Props = {
  property: Property | null;
  onBack?: () => void;
  showBack?: boolean;
};

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={`${heroPanel} p-4 md:p-5`}>
      <h3 className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2 text-sm font-bold text-white">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#a78bfa]/20 text-[10px] text-[#ddd6fe]">
          {n}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function PropertySplitDetail({ property, onBack, showBack }: Props) {
  const images = useMemo(
    () => (property ? parseImages(property.images) : []),
    [property],
  );
  const { activeIndex: activeImg, setActiveIndex: setActiveImg } = useImageSlideshow(
    images.length,
    property?.id,
    1500,
  );
  const tags = useMemo(() => (property ? parseTags(property.tags) : []), [property]);
  const sections = useMemo(
    () => (property ? buildPropertyDetailSections(property) : null),
    [property],
  );

  if (!property || !sections) {
    return (
      <div className={`${heroPanel} flex h-48 min-h-[192px] items-center justify-center p-5 text-sm text-white/45`}>
        목록에서 매물을 선택해 주세요
      </div>
    );
  }

  const deal = propertyCardDealBadgeLabel(property);

  return (
    <div className="space-y-3">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </button>
      ) : null}

      <div className={`${heroPanel} overflow-hidden p-0`}>
        <div className="relative h-[180px] w-full bg-[#0a0a12] sm:h-[220px] md:h-[260px]">
          {images.length > 0 ? (
            images.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${url}-${i}`}
                src={url}
                alt={i === activeImg ? property.title : ""}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  i === activeImg ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-white/25">이미지 없음</div>
          )}
        </div>
        {images.length > 1 ? (
          <div className="flex gap-1.5 overflow-x-auto border-t border-white/10 bg-[rgba(10,10,18,0.5)] p-2">
            {images.slice(0, 5).map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border ${
                  i === activeImg ? "border-[#a78bfa]" : "border-white/15 opacity-70"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="space-y-3 p-4 md:p-5">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full border border-[#facc15]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#facc15]">
              {categoryLabel(property.category)}
            </span>
            <span className="rounded-full border border-pink-400/40 px-2.5 py-0.5 text-[11px] font-bold text-pink-400">
              {deal}
            </span>
            {property.featured ? (
              <span className="rounded-full border border-[#a78bfa]/40 bg-[#a78bfa]/12 px-2.5 py-0.5 text-[11px] font-bold text-[#ddd6fe]">
                추천
              </span>
            ) : null}
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#a78bfa]/40 bg-[#a78bfa]/12 px-2.5 py-0.5 text-[11px] font-bold text-[#ddd6fe]"
              >
                {t}
              </span>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
              {property.title}
            </h2>
            {property.featureSummary ? (
              <p className="mt-1 text-sm text-[#c4b5fd]/75">{property.featureSummary}</p>
            ) : null}
            {property.address ? (
              <p className="mt-1 text-xs text-white/45">{property.address}</p>
            ) : null}
          </div>

          <p className="text-2xl font-extrabold text-[#fbbf24] md:text-[1.65rem]">
            {propertyCardPriceLine(property)}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href={`/consultation?propertyId=${property.id}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2.5 text-sm font-bold text-white sm:flex-none"
            >
              <MessageSquare className="h-4 w-4" />
              1:1 매물 문의하기
            </Link>
            <a
              href={OFFICE_TEL_HREF}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#a78bfa]/35 bg-[rgba(59,42,92,0.35)] px-4 py-2.5 text-sm font-bold text-white sm:flex-none"
            >
              <Phone className="h-4 w-4" />
              전화 연결 ({OFFICE_TEL})
            </a>
          </div>
        </div>
      </div>

      <Section n={1} title="기본정보 · 거래조건">
        <PropertyKvTable rows={sections.basic} />
      </Section>

      <Section n={2} title="매물 상세 · 면적">
        <PropertyKvTable rows={sections.detail} />
      </Section>

      <Section n={3} title="시설 · 옵션">
        <PropertyKvTable rows={sections.facilities} />
      </Section>

      <section className={`${heroPanel} p-4 md:p-5`}>
        <h3 className="mb-2 text-sm font-bold text-[#ddd6fe]">상세 설명</h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">
          {property.description}
        </p>
      </section>
    </div>
  );
}
