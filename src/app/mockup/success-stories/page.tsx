import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { SuccessStoryBoardSampleClient } from "@/components/mockup/SuccessStoryBoardSampleClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 성공스토리",
  robots: { index: false, follow: false },
};

export default function SuccessStoriesMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg font-[family-name:var(--font-unifine),Outfit,sans-serif] text-landing-text">
      <div className="border-b border-emerald-400/30 bg-[#0c1410] px-4 py-2 text-center text-xs text-emerald-100/90">
        목업 · 프로덕션 적용 완료 ·{" "}
        <Link href="/success-stories" className="font-bold text-emerald-300 hover:underline">
          성공스토리 →
        </Link>
        {" · "}
        <Link href="/legal" className="text-amber-200/80 hover:underline">
          찬스상담소 →
        </Link>
        {" · "}
        <Link href="/" className="text-slate-300/80 hover:underline">
          ← 홈
        </Link>
      </div>
      <SuccessStoryBoardSampleClient />
    </div>
  );
}
