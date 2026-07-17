"use client";

import { useSearchParams } from "next/navigation";
import { AUCTION_SPLIT_SAMPLES } from "@/lib/mockup/auction-split-sample-data";
import { AuctionSplitBoard } from "./AuctionSplitBoard";

const panelClass =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

export function AuctionSplitSampleClient() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");

  return (
    <div className="mx-auto max-w-[1400px] px-container-padding-mobile py-4 md:px-6 md:py-5">
      <div
        className={`${panelClass} mb-4 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5`}
      >
        <p className="text-xs text-white/65">
          <span className="font-bold text-[#c4b5fd]">샘플</span>
          {" · "}헤더·CTA 개편 · 사건번호/소재지/감정·최저가/매각기일
        </p>
        <p className="text-[11px] text-white/40">프로덕션 적용됨 · /auctions</p>
      </div>

      <AuctionSplitBoard
        items={AUCTION_SPLIT_SAMPLES}
        initialId={initialId}
        totalCount={AUCTION_SPLIT_SAMPLES.length}
      />
    </div>
  );
}
