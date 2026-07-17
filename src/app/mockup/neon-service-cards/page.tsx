import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { NeonServiceCardsDemo } from "./NeonServiceCardsDemo";

export const metadata: Metadata = {
  title: "디자인 목업 | 서비스 카드 네온 호버",
  robots: { index: false, follow: false },
};

export default function NeonServiceCardsMockupPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d4af37]">NEON HOVER MOCKUP</p>
            <h1 className="text-lg font-bold">Our Services 카드 · Unifine 스타일 호버</h1>
          </div>
          <Link href="/" className="text-sm text-[#d4af37] hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 pb-16 md:px-8">
        <p className="mb-8 text-sm leading-relaxed text-[#a3a3a3]">
          UNIFINE 영상 분석 반영: 카드별 accent 색 · 호버 시 보더/글로우/리프트 · 다른 카드 디밍 ·
          커서 리플. 카드 위에 마우스를 올려 보세요. (홈 미적용)
        </p>
        <NeonServiceCardsDemo />
      </main>
    </div>
  );
}
