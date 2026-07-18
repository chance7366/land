import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { AdminVisualDashboardSample } from "@/components/mockup/AdminVisualDashboardSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 관리자 시각 대시보드",
  robots: { index: false, follow: false },
};

export default function AdminVisualDashboardMockupPage() {
  return (
    <div className="min-h-screen bg-[#0a0809] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-landing-text">
      <div className="relative z-20 border-b border-violet-400/35 bg-[#120c1a]/95 px-4 py-2 text-center text-xs text-violet-100/90 backdrop-blur-md">
        목업 · 샘플 데이터 ·{" "}
        <Link href="/admin" className="font-semibold text-sky-300/90 hover:underline">
          라이브 `/admin` 적용됨 →
        </Link>
        {" · "}
        <Link href="/" className="text-white/60 hover:underline">
          ← 홈
        </Link>
      </div>
      <AdminVisualDashboardSample />
    </div>
  );
}
