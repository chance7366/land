"use client";

import { AppLink as Link } from "@/components/ui/AppLink";
import { trackBrowserEvent } from "@/lib/analytics/track";
import {
  categoryLabel,
  formatAreaPyeong,
  formatDateYmd,
  parseImages,
  propertyStatusLabel,
} from "@/lib/format";
import {
  propertyCardDealBadgeLabel,
  propertyCardPriceLine,
} from "@/lib/property-card-display";
import type { SerializedProperty } from "@/lib/property-split-view";

function areaLabel(p: SerializedProperty): string {
  if (p.exclusiveArea != null && p.exclusiveArea > 0) {
    return `전용 ${p.exclusiveArea}㎡ (${formatAreaPyeong(p.exclusiveArea)})`;
  }
  if (p.supplyArea != null && p.supplyArea > 0) {
    return `공급 ${p.supplyArea}㎡ (${formatAreaPyeong(p.supplyArea)})`;
  }
  const raw = p.area?.trim();
  if (raw) return raw;
  return "—";
}

function priceLines(p: SerializedProperty): { main: string; sub?: string } {
  const full = propertyCardPriceLine(p);
  if (p.type === "RENT" || p.type === "SHORT_TERM") {
    if (p.isJeonse || p.dealSubType === "JEONSE") return { main: full };
    const parts = full.split(" / ");
    if (parts.length >= 2) return { main: parts[0]!.trim(), sub: parts.slice(1).join(" / ").trim() };
  }
  return { main: full };
}

function statusTone(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "text-emerald-300";
    case "SOLD":
      return "text-amber-300";
    case "HIDDEN":
      return "text-white/45";
    default:
      return "text-white";
  }
}

function trackOpen(id: string) {
  trackBrowserEvent({
    eventType: "item_click",
    menuKey: "properties",
    targetType: "property",
    targetId: id,
  });
}

export function PropertyRegistryTable({ items }: { items: SerializedProperty[] }) {
  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-white/45">
        조건에 맞는 매물이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] border-collapse text-left text-xs text-[#cbd5e1]">
        <thead>
          <tr className="border-b border-white/10 bg-black/35 text-[11px] text-white/45">
            <th className="w-[88px] px-3 py-3 font-semibold">사진</th>
            <th className="w-[120px] px-3 py-3 font-semibold">분류/거래</th>
            <th className="min-w-[220px] px-3 py-3 font-semibold">제목 · 소재지 / 면적</th>
            <th className="w-[130px] px-3 py-3 font-semibold">가격</th>
            <th className="w-[88px] px-3 py-3 font-semibold">상태</th>
            <th className="w-[100px] px-3 py-3 font-semibold">등록일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const cover = parseImages(p.images)[0];
            const href = `/properties/${p.id}`;
            const price = priceLines(p);

            return (
              <tr
                key={p.id}
                className="border-b border-white/5 transition hover:bg-white/[0.04]"
              >
                <td className="px-3 py-2.5">
                  <Link
                    href={href}
                    onClick={() => trackOpen(p.id)}
                    className="flex h-[64px] w-[72px] items-center justify-center overflow-hidden rounded-lg bg-black/40"
                  >
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-2xl text-white/20">
                        home
                      </span>
                    )}
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <Link
                    href={href}
                    onClick={() => trackOpen(p.id)}
                    className="block space-y-0.5"
                  >
                    <p className="font-bold text-white">{categoryLabel(p.category)}</p>
                    <p className="text-[11px] font-semibold text-[#a78bfa]">
                      {propertyCardDealBadgeLabel(p)}
                    </p>
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <Link
                    href={href}
                    onClick={() => trackOpen(p.id)}
                    className="block space-y-0.5"
                  >
                    <p className="line-clamp-1 font-bold text-white">{p.title}</p>
                    <p className="line-clamp-2 font-medium text-white/75">
                      {p.address?.trim() || p.region || "—"}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-rose-400">{areaLabel(p)}</p>
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-top tabular-nums">
                  <Link
                    href={href}
                    onClick={() => trackOpen(p.id)}
                    className="block space-y-0.5"
                  >
                    <p className="font-bold text-[#60a5fa]">{price.main}</p>
                    {price.sub ? (
                      <p className="text-[11px] text-white/55">{price.sub}</p>
                    ) : null}
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <Link href={href} onClick={() => trackOpen(p.id)} className="block">
                    <p className={`font-bold ${statusTone(p.status)}`}>
                      {propertyStatusLabel(p.status)}
                    </p>
                    {p.featured ? (
                      <p className="mt-0.5 text-[11px] font-semibold text-violet-300">추천 ★</p>
                    ) : null}
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <Link href={href} onClick={() => trackOpen(p.id)} className="block">
                    <p className="tabular-nums text-white/90">{formatDateYmd(p.publishedAt)}</p>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
