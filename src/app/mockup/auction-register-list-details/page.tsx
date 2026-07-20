import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { AuctionListDetailsMockupClient } from "@/components/mockup/auction-register/AuctionListDetailsMockupClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 목록내역",
  robots: { index: false, follow: false },
};

export default function AuctionRegisterListDetailsMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <div className="border-b border-emerald-400/30 bg-[#0c1410] px-4 py-2 text-center text-xs text-emerald-100/90">
        목업 · 3. 목록 내역 · 운영 폼에 미적용 ·{" "}
        <Link
          href="/mockup/auction-register-basic-info"
          className="font-bold text-emerald-300 hover:underline"
        >
          기본정보 목업 →
        </Link>
        {" · "}
        <Link
          href="/mockup/auction-register-case-detail"
          className="font-bold text-emerald-300 hover:underline"
        >
          물건상세 목업 →
        </Link>
        {" · "}
        <Link href="/" className="text-amber-200/80 hover:underline">
          ← 홈
        </Link>
      </div>
      <AuctionListDetailsMockupClient />
    </div>
  );
}
