"use client";

import { ExternalLink } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import {
  auctionAreaLabel,
  auctionStatusDisplay,
  formatAuctionPriceLine,
} from "@/lib/auction-list-display";
import { trackBrowserEvent } from "@/lib/analytics/track";
import { formatDateYmd, parseImages } from "@/lib/format";
import type { SerializedAuction } from "@/lib/auction-split-view";

type Props = {
  items: SerializedAuction[];
};

function trackOpen(id: string) {
  trackBrowserEvent({
    eventType: "item_click",
    menuKey: "auctions",
    targetType: "auction",
    targetId: id,
  });
}

export function AuctionRegistryTable({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-white/45">
        조건에 맞는 경매가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] border-collapse text-left text-xs text-[#cbd5e1]">
        <thead>
          <tr className="border-b border-white/10 bg-black/35 text-[11px] text-white/45">
            <th className="w-[88px] px-3 py-3 font-semibold">사진</th>
            <th className="w-[140px] px-3 py-3 font-semibold">용도/사건</th>
            <th className="min-w-[200px] px-3 py-3 font-semibold">소재지 / 면적</th>
            <th className="w-[120px] px-3 py-3 font-semibold">감정/최저가</th>
            <th className="w-[96px] px-3 py-3 font-semibold">현재상태</th>
            <th className="w-[110px] px-3 py-3 font-semibold">매각기일</th>
            <th className="w-[100px] px-3 py-3 font-semibold">분석보고서</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => {
            const cover = parseImages(a.images)[0];
            const min = a.minPrice ?? a.recommendedPrice;
            const st = auctionStatusDisplay({
              status: a.status,
              rightsAnalysis: a.rightsAnalysis,
              appraisalPrice: a.appraisalPrice,
              minPrice: min,
            });
            const href = `/auctions/${a.id}`;
            const report = a.generalReportUrl?.trim() || null;

            return (
              <tr
                key={a.id}
                className="border-b border-white/5 transition hover:bg-white/[0.04]"
              >
                <td className="px-3 py-2.5">
                  <Link
                    href={href}
                    onClick={() => trackOpen(a.id)}
                    className="block h-[64px] w-[72px] overflow-hidden rounded-lg bg-black/40"
                  >
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-white/20">
                        <span className="material-symbols-outlined text-2xl">gavel</span>
                      </span>
                    )}
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <Link href={href} onClick={() => trackOpen(a.id)} className="block space-y-0.5">
                    <p className="font-bold text-white">{a.itemType || "경매"}</p>
                    <p className="tabular-nums text-white/80">{a.caseNumber}</p>
                    <p className="text-[11px] text-white/40">{a.court || "—"}</p>
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <Link href={href} onClick={() => trackOpen(a.id)} className="block space-y-1">
                    <p className="line-clamp-2 font-medium text-white/90">
                      {a.address || a.region || "—"}
                    </p>
                    <p className="text-[11px] font-bold text-rose-400">
                      {auctionAreaLabel({
                        landArea: a.landArea,
                        buildingArea: a.buildingArea,
                      })}
                    </p>
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-top tabular-nums">
                  <Link href={href} onClick={() => trackOpen(a.id)} className="block space-y-0.5">
                    <p className="font-bold text-white">
                      {formatAuctionPriceLine(a.appraisalPrice)}
                    </p>
                    <p className="font-bold text-[#60a5fa]">{formatAuctionPriceLine(min)}</p>
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <Link href={href} onClick={() => trackOpen(a.id)} className="block">
                    <p className="font-bold text-white">{st.main}</p>
                    {st.sub ? (
                      <p className="text-[11px] font-semibold text-[#60a5fa]">{st.sub}</p>
                    ) : null}
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <Link href={href} onClick={() => trackOpen(a.id)} className="block space-y-0.5">
                    <p className="tabular-nums text-white/90">
                      {a.saleDate ? formatDateYmd(a.saleDate) : "—"}
                    </p>
                    <p className="text-[11px] text-white/45">
                      입찰 <span className="font-bold text-rose-400">{a.dDay}</span>일전
                    </p>
                  </Link>
                </td>
                <td className="px-3 py-2.5 align-middle">
                  {report ? (
                    <a
                      href={report}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-[#d450ff]/35 bg-[#d450ff]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#e9d5ff] hover:bg-[#d450ff]/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      보기
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  ) : (
                    <span className="text-[11px] text-white/35">준비중</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
