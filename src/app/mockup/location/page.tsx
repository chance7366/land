import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LocationPage } from "@/components/location/LocationPage";

export const metadata: Metadata = {
  title: "디자인 목업 | 찾아오시는 길",
  robots: { index: false, follow: false },
};

export default function LocationMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg font-[family-name:var(--font-unifine),Outfit,sans-serif] text-landing-text">
      <div className="border-b border-emerald-400/30 bg-[#0c1410] px-4 py-2 text-center text-xs text-emerald-100/90">
        목업 · 프로덕션 적용 완료 ·{" "}
        <Link href="/location" className="font-bold text-emerald-300 hover:underline">
          찾아오시는 길 →
        </Link>
        {" · "}
        <Link href="/" className="text-amber-200/80 hover:underline">
          ← 홈
        </Link>
      </div>
      <LocationPage />
    </div>
  );
}
