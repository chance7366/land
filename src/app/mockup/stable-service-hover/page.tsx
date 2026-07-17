import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { StableHoverDemo } from "./StableHoverDemo";

export const metadata: Metadata = {
  title: "디자인 목업 | 서비스 카드 레이아웃 고정 호버",
  robots: { index: false, follow: false },
};

export default function StableServiceHoverMockupPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d4af37]">STABLE HOVER MOCKUP</p>
            <h1 className="text-lg font-bold">카드 확대 시 화면 밀림 방지</h1>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/mockup/neon-service-cards" className="text-white/50 hover:text-white">
              이전 네온 목업
            </Link>
            <Link href="/" className="text-[#d4af37] hover:underline">
              ← 홈으로
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 pb-16 md:px-8">
        <div className="mb-8 space-y-2 text-sm leading-relaxed text-[#a3a3a3]">
          <p>
            <span className="text-white">문제:</span> 호버 시「바로가기」가 DOM에 추가되며 카드 높이가
            늘어 히어로·페이지가 아래로 밀림.
          </p>
          <p>
            <span className="text-white">수정:</span> 카드 슬롯 높이 고정 · 확대는{" "}
            <code className="text-[#d4af37]">scale</code>만 사용 ·「바로가기」는 항상 자리 확보 후
            opacity · Our Services 블록을 위로 약간 이동.
          </p>
        </div>

        <StableHoverDemo />

        <div className="mt-8 rounded-xl border border-white/10 bg-[#121212] p-4 text-xs text-[#a3a3a3]">
          카드 위에 마우스를 빠르게 옮겨 보세요. 아래 여백·페이지 스크롤이 흔들리지 않아야 합니다.
        </div>
      </main>
    </div>
  );
}
