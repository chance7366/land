import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { HeroLiftReadableDemo } from "./HeroLiftReadableDemo";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 상향 + 카드 가독성",
  robots: { index: false, follow: false },
};

export default function HeroLiftReadableMockupPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d4af37]">LIFT + READABLE</p>
            <h1 className="text-lg font-bold">타이틀 상향 · 카드 글자 가독성</h1>
          </div>
          <Link href="/" className="text-sm text-[#d4af37] hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 pb-16 md:px-8">
        <ul className="mb-8 list-disc space-y-1 pl-5 text-sm text-[#a3a3a3]">
          <li>
            <span className="text-white">높이:</span> 최소 높이·mt-auto 제거 → 콘텐츠 높이만
            (홈과 동일 패딩)
          </li>
          <li>
            <span className="text-white">간격:</span> 타이틀 ↔ Our Services ={" "}
            <code className="text-[#d4af37]">mt-10 / md:mt-14</code> (당초 수준)
          </li>
          <li>
            <span className="text-white">글자:</span> 제목 흰색 · 본문 #cbd5e1 · accent는
            아이콘·보더·CTA만
          </li>
        </ul>

        <HeroLiftReadableDemo />
      </main>
    </div>
  );
}
