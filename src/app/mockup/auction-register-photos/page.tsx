import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { AuctionPhotosMockupClient } from "@/components/mockup/auction-register/AuctionPhotosMockupClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 법원 사진 자동첨부",
  robots: { index: false, follow: false },
};

export default function AuctionRegisterPhotosMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <div className="border-b border-emerald-400/30 bg-[#0c1410] px-4 py-2 text-center text-xs text-emerald-100/90">
        목업 · 8. 사진 자동첨부 · 운영 폼에 미적용 ·{" "}
        <Link
          href="/mockup/auction-register-list-details"
          className="font-bold text-emerald-300 hover:underline"
        >
          목록내역 목업 →
        </Link>
        {" · "}
        <Link
          href="/admin/auctions/new"
          className="font-bold text-emerald-300 hover:underline"
        >
          운영 등록폼 →
        </Link>
        {" · "}
        <Link href="/" className="text-amber-200/80 hover:underline">
          ← 홈
        </Link>
      </div>
      <AuctionPhotosMockupClient />
    </div>
  );
}
