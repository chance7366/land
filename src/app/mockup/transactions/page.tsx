import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { TransactionsSample } from "@/components/mockup/TransactionsSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 실거래가분석",
  robots: { index: false, follow: false },
};

/** 실거래가 목업 — 관리자 운영 적용 전 UI 검증 */
export default function TransactionsMockupPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-landing-text">
      <div className="relative z-20 border-b border-violet-400/35 bg-[#120c1a]/95 px-4 py-2 text-center text-xs text-violet-100/90 backdrop-blur-md">
        목업 · 수집/조회 분리 · 운영 미적용 · 예정{" "}
        <span className="font-semibold text-sky-300/90">
          /admin/transactions/sync · /admin/transactions
        </span>
        {" · "}
        <Link href="/admin" className="text-white/60 hover:underline">
          관리자
        </Link>
        {" · "}
        <Link href="/" className="text-white/60 hover:underline">
          ← 홈
        </Link>
      </div>
      <TransactionsSample />
    </div>
  );
}
