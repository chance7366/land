import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { AdminNewsHealthSampleClient } from "@/components/mockup/AdminNewsHealthSampleClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 부동산 소식 수집 모니터",
  robots: { index: false, follow: false },
};

export default function AdminNewsHealthMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg font-[family-name:var(--font-unifine),Outfit,sans-serif] text-landing-text">
      <div className="border-b border-emerald-400/30 bg-[#0c1410] px-4 py-2 text-center text-xs text-emerald-100/90">
        목업 · 프로덕션 적용 완료 ·{" "}
        <Link href="/admin/news" className="font-bold text-emerald-300 hover:underline">
          관리자 모니터 →
        </Link>
        {" · "}
        <Link href="/news" className="text-sky-300/90 hover:underline">
          사용자 소식 →
        </Link>
        {" · "}
        <Link href="/" className="text-amber-200/80 hover:underline">
          ← 홈
        </Link>
      </div>
      <AdminNewsHealthSampleClient />
    </div>
  );
}
