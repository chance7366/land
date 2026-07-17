import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { PropertyRegisterSampleClient } from "@/components/mockup/property-register/PropertyRegisterSampleClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 매물 등록",
  robots: { index: false, follow: false },
};

export default function PropertyRegisterMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg font-[family-name:var(--font-unifine),Outfit,sans-serif] text-landing-text">
      <div className="border-b border-emerald-400/30 bg-[#0c1410] px-4 py-2 text-center text-xs text-emerald-100/90">
        목업 · 프로덕션 적용 완료 ·{" "}
        <Link href="/admin/properties/new" className="font-bold text-emerald-300 hover:underline">
          관리자 등록 →
        </Link>
        {" · "}
        <Link href="/" className="text-amber-200/80 hover:underline">
          ← 홈
        </Link>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#d4bfff]/80">MOCKUP</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white">매물 등록</h1>
        <p className="mt-2 text-sm text-slate-400">
          프로덕션(`/admin/properties/new`)과 동일 UI입니다. 이 페이지의 저장은 샘플이라 DB에 반영되지 않습니다.
        </p>
        <div className="mt-6">
          <PropertyRegisterSampleClient />
        </div>
      </main>
    </div>
  );
}
