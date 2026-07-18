import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { AdminCustomersMockup } from "@/components/mockup/AdminCustomersMockup";

export const metadata: Metadata = {
  title: "디자인 목업 | 관리자 고객관리 CRM",
  robots: { index: false, follow: false },
};

export default function AdminCustomersMockupPage() {
  return (
    <div className="min-h-screen bg-[#0a0809] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-landing-text">
      <div className="relative z-20 border-b border-violet-400/35 bg-[#120c1a]/95 px-4 py-2 text-center text-xs text-violet-100/90 backdrop-blur-md">
        목업 · 샘플 UI ·{" "}
        <Link href="/admin/customers" className="font-semibold text-sky-300/90 hover:underline">
          라이브 `/admin/customers` 적용됨 →
        </Link>
        {" · "}
        <Link href="/" className="text-white/60 hover:underline">
          ← 홈
        </Link>
      </div>
      <AdminCustomersMockup />
    </div>
  );
}
