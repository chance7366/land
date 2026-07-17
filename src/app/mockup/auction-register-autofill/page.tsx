import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { AuctionForm } from "@/components/admin/AuctionForm";

export const metadata: Metadata = {
  title: "디자인 목업 | 경매물건 자동등록",
  robots: { index: false, follow: false },
};

export default function AuctionRegisterAutofillMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg font-[family-name:var(--font-unifine),Outfit,sans-serif] text-landing-text">
      <div className="border-b border-emerald-400/30 bg-[#0c1410] px-4 py-2 text-center text-xs text-emerald-100/90">
        목업 · 프로덕션과 동일 UI ·{" "}
        <Link href="/admin/auctions/new" className="font-bold text-emerald-300 hover:underline">
          관리자 등록 →
        </Link>
        {" · "}
        <Link href="/" className="text-amber-200/80 hover:underline">
          ← 홈
        </Link>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#d4bfff]/80">MOCKUP</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white">경매물건 자동등록</h1>
        <p className="mt-2 text-sm text-slate-400">
          물건번호는 있을 때만 입력 · 공란이면 관할법원 + 연도 + 숫자만으로 불러오기
        </p>
        <p className="mt-1 text-xs text-slate-500">
          캐시에 없어도 「불러오기」 시 법원경매 사이트에서 실시간 조회합니다.
        </p>
        <div className="mt-6">
          <AuctionForm />
        </div>
      </main>
    </div>
  );
}
