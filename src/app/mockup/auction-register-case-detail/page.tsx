import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { AuctionCaseDetailMockupClient } from "@/components/mockup/auction-register/AuctionCaseDetailMockupClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 물건상세·사건내역·문건송달",
  robots: { index: false, follow: false },
};

export default function AuctionRegisterCaseDetailMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <div className="border-b border-emerald-400/30 bg-[#0c1410] px-4 py-2 text-center text-xs text-emerald-100/90">
        목업 · 3. 물건상세 (사건내역 + 문건/송달) · 운영 폼에 미적용 ·{" "}
        <Link
          href="/mockup/auction-register-status"
          className="font-bold text-emerald-300 hover:underline"
        >
          현황조사서 목업 →
        </Link>
        {" · "}
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
      <AuctionCaseDetailMockupClient />
    </div>
  );
}
