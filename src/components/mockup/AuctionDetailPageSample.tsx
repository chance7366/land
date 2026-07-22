"use client";

/**
 * 경매물건 별도 상세 목업 — 목록에서 행 클릭 후 진입.
 * 운영 /auctions/[id] 미적용. 본문은 관리자 1~6절 구조 샘플 재사용.
 */

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuctionUserDetailAdminSectionsSample } from "@/components/mockup/AuctionUserDetailAdminSectionsSample";
import { AUCTION_SPLIT_SAMPLES } from "@/lib/mockup/auction-split-sample-data";

export function AuctionDetailPageSample() {
  const params = useSearchParams();
  const id = params.get("id");
  const sample = useMemo(
    () => AUCTION_SPLIT_SAMPLES.find((a) => a.id === id) ?? AUCTION_SPLIT_SAMPLES[0],
    [id],
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="border-b border-amber-400/30 bg-[#12100a] px-4 py-3 text-center text-xs text-amber-100/90">
        <p className="font-bold text-amber-50">
          경매물건 상세 페이지 목업 (운영 미적용 · 별도 라우트)
        </p>
        <p className="mt-1 text-[11px] text-amber-100/70">
          {sample.caseNumber} · {sample.title}
        </p>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pt-4 md:px-6">
        <Link
          href="/mockup/auction-list-redesign"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c4b5fd] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          경매목록으로
        </Link>
      </div>

      {/* 내부 샘플의 상단 목업 배너는 숨기고 상세 본문만 표시 */}
      <div className="detail-mock-body [&>div>div.border-b]:hidden">
        <AuctionUserDetailAdminSectionsSample />
      </div>
    </div>
  );
}
