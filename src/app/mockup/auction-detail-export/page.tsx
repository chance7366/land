import { Suspense } from "react";
import { AuctionDetailExportSample } from "@/components/mockup/AuctionDetailExportSample";

/** 경매상세 밝은 내보내기·인쇄 목업 — 운영: /auctions/[id]/export */
export default function AuctionDetailExportMockupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#D8D4CE] text-sm text-[#6B5344]">
          불러오는 중…
        </div>
      }
    >
      <AuctionDetailExportSample />
    </Suspense>
  );
}
