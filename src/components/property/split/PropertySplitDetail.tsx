"use client";

import { useMemo, type ReactNode } from "react";
import type { Property } from "@prisma/client";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Calculator,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
} from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { categoryLabel, parseImages, parseSpecs, parseTags } from "@/lib/format";
import {
  formatManwonWithUnit,
  propertyCardDealBadgeLabel,
  propertyCardPriceLine,
} from "@/lib/property-card-display";
import {
  buildFacilitySection,
  buildLegalComplianceRows,
  buildPropertyDetailSections,
} from "@/lib/property-detail-sections";
import {
  fixedMaintenanceSumWon,
  formatBreakdownAmount,
  MAINTENANCE_BREAKDOWN_KEYS,
  needsMaintenanceBreakdown,
  parseMaintenanceBreakdown,
  parseMaintenanceMode,
} from "@/lib/property-maintenance";
import { OFFICE_PROFILE } from "@/lib/office-profile";
import { kakaoMapDirectionsUrl } from "@/lib/location";
import { PropertyKvTable } from "@/components/property/PropertyKvTable";
import { useImageSlideshow } from "@/lib/use-image-slideshow";

const heroPanel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

type Props = {
  property: Property | null;
  onBack?: () => void;
  showBack?: boolean;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={`${heroPanel} p-4 md:p-5`}>
      <h3 className="mb-3 border-b border-white/10 pb-2 text-sm font-bold text-white">{title}</h3>
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
  const specs = useMemo(
    () => (property ? parseSpecs(property.specs) : {}),
    [property],
  );
  const sections = useMemo(
    () => (property ? buildPropertyDetailSections(property) : null),
    [property],
  );
  const legalRows = useMemo(
    () => (property ? buildLegalComplianceRows(property) : []),
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
  const maintMode = parseMaintenanceMode(specs);
  const breakdown = parseMaintenanceBreakdown(specs);
  const showMaintCard = needsMaintenanceBreakdown(maintMode, property.maintenanceFee);
  const fixedSum = fixedMaintenanceSumWon(breakdown);
  const illegal = specs.illegalBuilding === true || specs.illegalBuilding === "true";
  const badges = [
    "확인매물",
    "2025 법적명시 준수",
    illegal ? "위반건축물" : "위반건축물 해당 없음",
  ];
  const agentName = String(specs.listingAgentName || OFFICE_PROFILE.agentName);
  const agentPhone = String(specs.listingAgentPhone || OFFICE_PROFILE.agentPhone);
  const mapAddress = property.address || OFFICE_PROFILE.addressShort;
  const optionItems = Array.isArray(specs.optionItems)
    ? (specs.optionItems as string[])
    : [];
  const facilityExtra = buildFacilitySection(property);

  const mainImg = images[activeImg] || images[0];
  const thumbs = images.length > 1 ? images.slice(0, 5) : images;

  return (
    <div className="space-y-3 pb-20 lg:pb-0">
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

      {/* Hero gallery */}
      <div className={`${heroPanel} overflow-hidden p-0`}>
        <div className="grid gap-0.5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="relative h-[200px] bg-[#0a0a12] md:h-[280px]">
            {mainImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainImg} alt={property.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-white/25">이미지 없음</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-0.5">
            {(thumbs.length > 1 ? thumbs.slice(1, 5) : [null, null, null, null]).map((url, i) => (
              <button
                key={url ? `${url}-${i}` : `empty-${i}`}
                type="button"
                disabled={!url}
                onClick={() => url && setActiveImg(images.indexOf(url))}
                className="relative flex h-[99px] items-center justify-center overflow-hidden bg-[#12101a] md:h-[139px]"
              >
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] text-white/20">—</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,65%)_minmax(260px,35%)] lg:items-start">
        <div className="space-y-3">
          <section className={`${heroPanel} p-4 md:p-5`}>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {badges.map((b) => (
                <span
                  key={b}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                    b.includes("위반건축물") && illegal
                      ? "border-rose-400/40 bg-rose-500/10 text-rose-100"
                      : "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
                  }`}
                >
                  <BadgeCheck className="h-3 w-3" />
                  {b}
                </span>
              ))}
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
            <h2 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
              {property.title}
            </h2>
            {property.featureSummary ? (
              <p className="mt-1 text-sm text-[#c4b5fd]/75">{property.featureSummary}</p>
            ) : null}
            <p className="mt-3 text-2xl font-extrabold text-[#fbbf24] md:text-[1.65rem]">
              {propertyCardPriceLine(property)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["가격", propertyCardPriceLine(property)],
                [
                  "전용면적",
                  property.exclusiveArea ? `${property.exclusiveArea}㎡` : "—",
                ],
                [
                  "층수",
                  property.floor != null
                    ? property.totalFloors
                      ? `${property.floor}/${property.totalFloors}층`
                      : `${property.floor}층`
                    : "—",
                ],
                ["방향", property.direction || "—"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-xl border border-white/10 bg-[rgba(10,10,18,0.45)] px-3 py-2.5 text-center"
                >
                  <p className="text-[10px] font-semibold text-white/40">{k}</p>
                  <p className="mt-0.5 text-sm font-bold text-white">{v}</p>
                </div>
              ))}
            </div>
          </section>

          <Section title="법적 규격 상세 정보">
            <PropertyKvTable rows={legalRows} />
          </Section>

          {showMaintCard ? (
            <Section title="관리비 세부 내역">
              <p className="mb-3 text-[11px] text-white/40">
                정액 관리비 월{" "}
                {property.maintenanceFee != null
                  ? formatManwonWithUnit(property.maintenanceFee)
                  : "—"}{" "}
                (10만원 이상 · 7대 비목)
              </p>
              <div className="overflow-hidden rounded-xl border border-[#a78bfa]/20">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-[rgba(59,42,92,0.35)] text-xs text-[#c4b5fd]/80">
                      <th className="px-3 py-2 font-semibold">비목</th>
                      <th className="px-3 py-2 font-semibold">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MAINTENANCE_BREAKDOWN_KEYS.map((m) => (
                      <tr key={m.key} className="border-t border-white/10">
                        <td className="px-3 py-2 text-white/85">{m.label}</td>
                        <td className="px-3 py-2 font-semibold text-white">
                          {formatBreakdownAmount(breakdown[m.key])}
                        </td>
                      </tr>
                    ))}
                    {fixedSum > 0 ? (
                      <tr className="border-t border-[#a78bfa]/30 bg-[#a78bfa]/10">
                        <td className="px-3 py-2.5 font-bold text-[#ddd6fe]">합계(정액 항목)</td>
                        <td className="px-3 py-2.5 font-extrabold text-[#fbbf24]">
                          월 {fixedSum.toLocaleString("ko-KR")}원
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              {typeof specs.maintenanceBreakdownReason === "string" &&
              specs.maintenanceBreakdownReason ? (
                <p className="mt-2 text-[11px] text-amber-100/70">
                  미고지 사유: {specs.maintenanceBreakdownReason}
                </p>
              ) : null}
              <p className="mt-2 text-[11px] leading-relaxed text-white/40">
                실비 항목은 사용량에 따라 별도 부과되며 계절에 따라 변동될 수 있습니다.
              </p>
            </Section>
          ) : null}

          <section className={`${heroPanel} overflow-hidden p-0`}>
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#c4b5fd]" />
                <h3 className="text-sm font-bold text-white">지도 · 위치</h3>
              </div>
              <a
                href={kakaoMapDirectionsUrl(mapAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#c4b5fd] hover:text-white"
              >
                카카오맵에서 보기
              </a>
            </div>
            <div className="flex h-[160px] flex-col items-center justify-center bg-[#0a0a12] px-4 text-center">
              <p className="text-sm text-white/50">{mapAddress}</p>
              <p className="mt-1 text-[11px] text-white/30">지도 SDK 연동 전 · 외부 지도로 이동</p>
            </div>
          </section>

          <Section title="시설 · 옵션">
            {optionItems.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {optionItems.map((o) => (
                  <span
                    key={o}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/70"
                  >
                    {o}
                  </span>
                ))}
              </div>
            ) : null}
            <PropertyKvTable rows={facilityExtra} />
          </Section>

          <section className={`${heroPanel} p-4 md:p-5`}>
            <h3 className="mb-2 text-sm font-bold text-[#ddd6fe]">상세 설명</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">
              {property.description}
            </p>
          </section>
        </div>

        {/* Sticky sidebar */}
        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <div className={`${heroPanel} p-4`}>
            <p className="text-[11px] font-semibold text-white/40">핵심 조건</p>
            <p className="mt-1 text-xl font-extrabold text-[#fbbf24]">
              {propertyCardPriceLine(property)}
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-white/65">
              {property.exclusiveArea ? <li>전용 {property.exclusiveArea}㎡</li> : null}
              {property.floor != null ? (
                <li>
                  {property.totalFloors
                    ? `${property.floor}/${property.totalFloors}층`
                    : `${property.floor}층`}
                  {property.direction ? ` · ${property.direction}` : ""}
                </li>
              ) : null}
              {property.moveInType ? <li>{property.moveInType}</li> : null}
            </ul>
          </div>

          <div className={`${heroPanel} p-4`}>
            <p className="mb-2 text-xs font-bold text-[#ddd6fe]">중개사무소 · 담당자</p>
            <p className="text-sm font-bold text-white">{OFFICE_PROFILE.name}</p>
            <p className="mt-1 text-[11px] text-white/45">등록번호 {OFFICE_PROFILE.regNo}</p>
            <p className="text-[11px] text-white/45">{OFFICE_PROFILE.addressShort}</p>
            <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3 text-xs">
              <p>
                <span className="text-white/40">개업 </span>
                <span className="font-semibold text-white">{OFFICE_PROFILE.brokerName}</span>
                <span className="text-white/50"> · {OFFICE_PROFILE.brokerPhone}</span>
              </p>
              <p>
                <span className="text-white/40">소속 </span>
                <span className="font-semibold text-white">{agentName}</span>
                <span className="text-white/50"> · {agentPhone}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <a
              href={`tel:${OFFICE_PROFILE.brokerPhone.replace(/-/g, "")}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-3 text-sm font-bold text-white"
            >
              <Phone className="h-4 w-4" />
              전화 문의하기
            </a>
            <Link
              href={`/consultation?propertyId=${property.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/90"
            >
              <MessageSquare className="h-4 w-4" />
              1:1 매물 문의
            </Link>
            {OFFICE_PROFILE.kakaoChannelUrl ? (
              <a
                href={OFFICE_PROFILE.kakaoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FEE500]/40 bg-[#FEE500]/15 px-4 py-2.5 text-sm font-bold text-[#FEE500]"
              >
                <MessageCircle className="h-4 w-4" />
                카카오톡 상담
              </a>
            ) : null}
            <Link
              href={`/consultation?propertyId=${property.id}&method=visit`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/85"
            >
              <Calendar className="h-4 w-4" />
              현장 방문 예약
            </Link>
          </div>

          {(property.type === "SALE" || property.type === "PRE_SALE") && property.price > 0 ? (
            <div className={`${heroPanel} p-4`}>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-white">
                <Calculator className="h-3.5 w-3.5 text-[#c4b5fd]" />
                대출 · 세금 단순 추정
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>추정 대출 (LTV 70%)</span>
                  <span className="font-bold text-white">
                    약 {formatManwonWithUnit(Math.round(property.price * 0.7))}
                  </span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>취득세 단순 추정(1.1%)</span>
                  <span className="font-bold text-white">
                    약 {formatManwonWithUnit(Math.round(property.price * 0.011))}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-white/30">
                참고용 시뮬레이션이며 확정 견적이 아닙니다.
              </p>
            </div>
          ) : null}
        </aside>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#0B0F19]/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <a
            href={`tel:${OFFICE_PROFILE.brokerPhone.replace(/-/g, "")}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] py-2.5 text-sm font-bold text-white"
          >
            <Phone className="h-4 w-4" />
            전화
          </a>
          <Link
            href={`/consultation?propertyId=${property.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/15 py-2.5 text-sm font-bold text-white"
          >
            <MessageSquare className="h-4 w-4" />
            문의
          </Link>
        </div>
      </div>
    </div>
  );
}
