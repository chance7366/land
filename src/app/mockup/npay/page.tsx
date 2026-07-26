import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { NpaySample } from "@/components/mockup/NpaySample";

export const metadata: Metadata = {
  title: "디자인 목업 | Npay 매물·단지 수집",
  robots: { index: false, follow: false },
};

/** Npay 수집 목업 — 관리자 운영 적용 전 UI 검증 */
export default function NpayMockupPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-landing-text">
      <div className="relative z-20 border-b border-violet-400/35 bg-[#120c1a]/95 px-4 py-2 text-center text-xs text-violet-100/90 backdrop-blur-md">
        목업 · 전국지역 · 매물유형 17종 · 수집필드 미리보기 · 운영 적용됨{" "}
        <span className="font-semibold text-sky-300/90">/admin/npay</span>
        {" · "}
        <Link href="/admin/npay" className="text-white/60 hover:underline">
          관리자(플레이스홀더)
        </Link>
        {" · "}
        <Link href="/" className="text-white/60 hover:underline">
          ← 홈
        </Link>
      </div>
      <NpaySample />
    </div>
  );
}
