import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { AuctionStatusReportMockupClient } from "@/components/mockup/auction-register/AuctionStatusReportMockupClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 현황조사서 입력서식",
  robots: { index: false, follow: false },
};

export default function AuctionRegisterStatusMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <div className="border-b border-emerald-400/30 bg-[#0c1410] px-4 py-2 text-center text-xs text-emerald-100/90">
        목업 · 4. 현황조사서 입력서식 (진입 시 샘플 채움) ·{" "}
        <Link
          href="/mockup/auction-register-autofill"
          className="font-bold text-emerald-300 hover:underline"
        >
          전체 자동등록 폼 →
        </Link>
        {" · "}
        <Link href="/" className="text-amber-200/80 hover:underline">
          ← 홈
        </Link>
      </div>
      <AuctionStatusReportMockupClient />
    </div>
  );
}
