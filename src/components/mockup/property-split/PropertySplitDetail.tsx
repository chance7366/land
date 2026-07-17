"use client";

import { useMemo } from "react";
import type { Property } from "@prisma/client";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import {
  categoryLabel,
  parseImages,
  parseSpecs,
  parseTags,
} from "@/lib/format";
import { getCategoryGroup } from "@/lib/property-naver/categories";
import type { CategoryGroup } from "@/lib/property-naver/types";
import {
  propertyCardDealBadgeLabel,
  propertyCardPriceLine,
  propertyCardTitle,
} from "@/lib/property-card-display";
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

type SpecItem = { label: string; value: string; wide?: boolean };

function fmtArea(n: number | null | undefined): string | null {
  if (n == null || !Number.isFinite(n) || n <= 0) return null;
  return `${n}㎡`;
}

function fmtBool(v: unknown): string | null {
  if (typeof v !== "boolean") return null;
  return v ? "예" : "아니오";
}

function fmtList(v: unknown): string | null {
  if (Array.isArray(v) && v.length) return v.join(", ");
  if (typeof v === "string" && v.trim()) return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return null;
}

function push(items: SpecItem[], label: string, value: string | null | undefined, wide?: boolean) {
  if (!value) return;
  items.push({ label, value, wide });
}

function buildSpecItems(property: Property, group: CategoryGroup, specs: Record<string, unknown>): SpecItem[] {
  const items: SpecItem[] = [];
  const jibun = [property.jibunMain, property.jibunSub].filter(Boolean).join("-");
  const addressBase = [property.sido, property.sigungu, property.eupmyeondong, property.ri]
    .filter(Boolean)
    .join(" ");
  const addressLine = [addressBase || property.address, jibun].filter(Boolean).join(" ");
  const buildingLine = [
    property.buildingName,
    [property.unitDong, property.unitHo].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(" · ");
  const moveIn =
    property.moveInType === "지정일" && property.moveInDate
      ? property.moveInDate
      : property.moveInType;

  push(items, "소재지", addressLine || null, true);
  push(items, "건물/단지", buildingLine || null, true);
  push(items, "입주", moveIn);

  if (group === "APT_OFFICE" || group === "VILLA_HOUSE") {
    push(items, "공급면적", fmtArea(property.supplyArea));
    push(items, "전용면적", fmtArea(property.exclusiveArea));
    push(
      items,
      "층수",
      property.floor != null
        ? property.totalFloors
          ? `${property.floor}/${property.totalFloors}층`
          : `${property.floor}층`
        : null,
    );
    push(
      items,
      "방/욕실",
      property.rooms != null ? `${property.rooms}룸 / ${property.bathrooms ?? "-"}욕` : null,
    );
    push(items, "방향", property.direction);
    push(items, "건축물 용도", fmtList(specs.buildingUse), true);
    push(
      items,
      "관리비",
      property.maintenanceFee != null ? `월 ${property.maintenanceFee}만원` : null,
    );
    push(items, "관리비 부과", fmtList(specs.maintenanceBilling));
    push(items, "포함 항목", fmtList(specs.maintenanceIncludes), true);
    push(
      items,
      "주차",
      specs.totalParking != null
        ? `총 ${specs.totalParking}대${
            specs.parkingPerHousehold != null ? ` · 세대당 ${specs.parkingPerHousehold}` : ""
          }`
        : fmtBool(specs.parkingAvailable),
      true,
    );
    push(
      items,
      "난방",
      [specs.heatingType, specs.heatingFuel].filter(Boolean).join(" / ") || null,
    );
    push(items, "엘리베이터", fmtBool(specs.hasElevator) || fmtList(specs.elevatorType));
    push(items, "옵션", fmtList(specs.optionItems), true);
    push(items, "현관구조", fmtList(specs.entranceType));
    push(items, "내부구조", fmtList(specs.structureType));
  }

  if (group === "RETAIL_OFFICE") {
    push(items, "계약면적", fmtArea(Number(specs.contractArea) || null));
    push(items, "전용면적", fmtArea(property.exclusiveArea));
    push(
      items,
      "층수",
      property.floor != null
        ? property.totalFloors
          ? `${property.floor}/${property.totalFloors}층`
          : `${property.floor}층`
        : null,
    );
    push(items, "현재 업종", property.businessType);
    push(items, "추천 업종", fmtList(specs.recommendedBusiness), true);
    push(items, "위반건축물", fmtBool(specs.illegalBuilding));
    push(items, "위치 특성", fmtList(specs.locationTrait), true);
    push(
      items,
      "관리비",
      property.maintenanceFee != null ? `월 ${property.maintenanceFee}만원` : null,
    );
    push(items, "관리비 내역", fmtList(specs.maintenanceNote), true);
    push(
      items,
      "전력",
      specs.powerCapacityKw != null ? `${specs.powerCapacityKw} kW` : null,
    );
    push(items, "냉난방", fmtList(specs.hvacType));
    push(items, "화장실", fmtList(specs.toiletLocation));
    push(
      items,
      "주차",
      specs.totalParking != null
        ? `${specs.totalParking}대${
            specs.freeParking != null ? ` · 무료 ${specs.freeParking}` : ""
          }`
        : null,
    );
    push(items, "엘리베이터", fmtList(specs.elevatorType));
  }

  if (group === "LAND") {
    push(items, "대지면적", fmtArea(property.exclusiveArea));
    push(items, "지목", property.landCategory);
    push(items, "용도지역", property.zoning, true);
    push(items, "도로접면", fmtList(specs.roadAccess));
    push(items, "지세/형상", fmtList(specs.landShape));
    push(items, "도로 포장", fmtList(specs.roadPaved));
    push(items, "지형", fmtList(specs.terrain));
    push(items, "현재 이용", fmtList(specs.landUseStatus), true);
  }

  return items;
}

/** wide 항목은 한 줄 전체, 그 외는 2열로 묶음 */
function SpecTable({ items }: { items: SpecItem[] }) {
  const rows: SpecItem[][] = [];
  const shortBuf: SpecItem[] = [];

  const flushShort = () => {
    while (shortBuf.length) {
      rows.push(shortBuf.splice(0, 2));
    }
  };

  for (const item of items) {
    if (item.wide) {
      flushShort();
      rows.push([item]);
    } else {
      shortBuf.push(item);
      if (shortBuf.length === 2) flushShort();
    }
  }
  flushShort();

  return (
    <div className="overflow-hidden rounded-xl border border-[#a78bfa]/20 bg-[rgba(10,10,18,0.45)]">
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map((row, ri) => {
            if (row.length === 1 && row[0].wide) {
              const cell = row[0];
              return (
                <tr key={`${cell.label}-${ri}`} className="border-t border-white/10 first:border-0">
                  <th className="w-[88px] bg-[rgba(59,42,92,0.35)] px-3 py-2.5 align-top text-xs font-semibold text-[#c4b5fd]/80 sm:w-28">
                    {cell.label}
                  </th>
                  <td colSpan={3} className="px-3 py-2.5 font-semibold text-white/90">
                    {cell.value}
                  </td>
                </tr>
              );
            }
            const a = row[0];
            const b = row[1];
            return (
              <tr key={`row-${ri}`} className="border-t border-white/10 first:border-0">
                <th className="w-[88px] bg-[rgba(59,42,92,0.35)] px-3 py-2.5 align-top text-xs font-semibold text-[#c4b5fd]/80 sm:w-24">
                  {a.label}
                </th>
                <td className="w-[calc(50%-44px)] px-3 py-2.5 font-semibold text-white/90 sm:w-auto">
                  {a.value}
                </td>
                {b ? (
                  <>
                    <th className="w-[88px] bg-[rgba(59,42,92,0.35)] px-3 py-2.5 align-top text-xs font-semibold text-[#c4b5fd]/80 sm:w-24">
                      {b.label}
                    </th>
                    <td className="px-3 py-2.5 font-semibold text-white/90">{b.value}</td>
                  </>
                ) : (
                  <>
                    <th className="w-[88px] bg-[rgba(59,42,92,0.35)] px-3 py-2.5 sm:w-24" />
                    <td className="px-3 py-2.5" />
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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

  if (!property) {
    return (
      <div className={`${heroPanel} flex h-48 min-h-[192px] items-center justify-center p-5 text-sm text-white/45`}>
        목록에서 매물을 선택해 주세요
      </div>
    );
  }

  const group = getCategoryGroup(property.category);
  const title = propertyCardTitle(property);
  const deal = propertyCardDealBadgeLabel(property);
  const specItems = buildSpecItems(property, group, specs);

  return (
    <div className="space-y-4">
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

      {/* 갤러리 + 헤더 — 히어로 오로라 패널, 이미지 가로 풀블리드 */}
      <div className={`${heroPanel} overflow-hidden p-0`}>
        <div className="relative h-[180px] w-full bg-[#0a0a12] sm:h-[220px] md:h-[260px]">
          {images.length > 0 ? (
            images.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${url}-${i}`}
                src={url}
                alt={i === activeImg ? title : ""}
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
          </div>

          <p className="text-2xl font-extrabold text-[#fbbf24] md:text-[1.65rem]">
            {propertyCardPriceLine(property)}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/50">
            {property.loanStatus ? <span>융자: {property.loanStatus}</span> : null}
            {group === "RETAIL_OFFICE" && property.keyMoney != null && !property.keyMoneyHidden ? (
              <span>권리금: {property.keyMoney.toLocaleString("ko-KR")}만원</span>
            ) : null}
            {group === "RETAIL_OFFICE" && property.keyMoneyHidden ? <span>권리금: 비공개</span> : null}
            {group === "RETAIL_OFFICE" && property.vatIncluded != null ? (
              <span>VAT: {property.vatIncluded ? "포함" : "별도"}</span>
            ) : null}
          </div>

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

      <div className={`${heroPanel} p-4 md:p-5`}>
        <h3 className="mb-3 text-sm font-bold text-[#ddd6fe]">매물 정보</h3>
        <SpecTable items={specItems} />
      </div>

      <div className={`${heroPanel} p-4 md:p-5`}>
        <h3 className="mb-2 text-sm font-bold text-[#ddd6fe]">상세 설명</h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">
          {property.description}
        </p>
      </div>
    </div>
  );
}
