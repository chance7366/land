import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";

export const metadata: Metadata = {
  title: "디자인 목업 | 헤더 링크·서브페이지 내비",
  robots: { index: false, follow: false },
};

export default function HeaderNavLinksMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-center text-xs text-[#d4af37]">
        샘플 · 망치=관리자 / 브랜드명=홈 · 서브페이지에도 상단 내비 표시. 승인 시 적용.
      </div>

      <section className="border-b border-white/10">
        <p className="bg-white/5 px-4 py-2 text-center text-[11px] text-landing-muted">
          A. 홈과 동일 헤더 — 망치·브랜드에 마우스 올려 툴팁 확인
        </p>
        <LandingHeader />
        <LandingNav />
        <div className="mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8">
          <p className="text-sm text-landing-muted">
            망치 아이콘 → <span className="text-blue-400">/admin</span> · 브랜드명 →{" "}
            <span className="text-blue-400">/</span>
          </p>
        </div>
      </section>

      <section>
        <p className="bg-white/5 px-4 py-2 text-center text-[11px] text-landing-muted">
          B. 서브페이지 예시 — 헤더 + 내비가 함께 유지 (예: 부동산중개 목록)
        </p>
        <LandingHeader />
        <LandingNav />
        <main className="mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8">
          <h1 className="text-xl font-bold text-landing-text">부동산중개</h1>
          <p className="mt-2 text-sm text-landing-muted">
            승인 후 `/properties`, `/auctions` 등 서브페이지에도 이 상단 내비가 표시됩니다.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {["매물 카드 A", "매물 카드 B", "매물 카드 C"].map((label) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-[#1f1f1f] px-4 py-8 text-center text-sm text-landing-muted"
              >
                {label}
              </div>
            ))}
          </div>
        </main>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-[#737373]">
        <Link href="/" className="text-[#d4af37] hover:underline">
          ← 홈
        </Link>
      </footer>
    </LandingShell>
  );
}
