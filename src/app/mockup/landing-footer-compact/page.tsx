import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { LandingFooterCompactSample } from "./LandingFooterCompactSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 푸터 컴팩트",
  robots: { index: false, follow: false },
};

/**
 * Sample: representative under brand (bold white), white bold labels,
 * fax removed, reduced vertical padding.
 */
export default function LandingFooterCompactMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-white/10 bg-[#0e1a14] px-4 py-2 text-center text-xs text-[#c8e6d2]">
        샘플 · 대표자→상호 아래(흰 굵게) · 라벨 흰 굵게 · 팩스 삭제 · 높이 축소 · 홈 미적용.{" "}
        <Link href="/" className="text-[#9fd4b5] hover:underline">
          ← 홈
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <main className="min-h-[40vh] px-container-padding-mobile py-10 md:px-8">
        <h1 className="text-lg font-bold text-landing-text">푸터 컴팩트 샘플</h1>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-landing-muted">
          <li>대표자: 상호 바로 아래 · 굵은 흰색</li>
          <li>주소·등록번호·전화·핸드폰·이메일 라벨: 굵은 흰색</li>
          <li>팩스 행 삭제</li>
          <li>패딩/간격 축소로 높이 최소화</li>
        </ul>
      </main>
      <LandingFooterCompactSample />
    </LandingShell>
  );
}
