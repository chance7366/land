import { Suspense } from "react";
import { AuctionDetailPageSample } from "@/components/mockup/AuctionDetailPageSample";

/** 경매상세 별도 페이지 목업 — 운영 미적용 */
export default function AuctionDetailPageMockup() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-sm text-white/50">
          불러오는 중…
        </div>
      }
    >
      <AuctionDetailPageSample />
    </Suspense>
  );
}
