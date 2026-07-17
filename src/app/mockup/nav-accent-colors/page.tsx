import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";

export const metadata: Metadata = {
  title: "디자인 목업 | 내비 서비스 액센트 색",
  robots: { index: false, follow: false },
};

export default function NavAccentMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-center text-xs text-[#d4af37]">
        샘플 · 메뉴 호버/활성 색 = 히어로 서비스 카드 액센트. 「← 홈으로」는 승인 시 목록 페이지에서 제거.
      </div>

      <section className="border-b border-white/10">
        <p className="bg-white/5 px-4 py-2 text-center text-[11px] text-landing-muted">
          A. 홈 내비 — 각 메뉴에 마우스를 올려 색상 확인
        </p>
        <LandingHeader />
        <LandingNav />
        <div className="mx-auto max-w-6xl px-container-padding-mobile py-8 md:px-8">
          <ul className="space-y-1 text-xs text-landing-muted">
            <li>
              부동산중개 <span className="text-[#4dabff]">#4dabff</span>
            </li>
            <li>
              경매공매 <span className="text-[#d4af37]">#d4af37</span>
            </li>
            <li>
              부동산소식 <span className="text-[#d450ff]">#d450ff</span>
            </li>
            <li>
              Q & A <span className="text-[#34d399]">#34d399</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <p className="bg-white/5 px-4 py-2 text-center text-[11px] text-landing-muted">
          B. 서브페이지 예시 — 동일 액센트 + 맨 앞 「홈」 (활성: 부동산중개)
        </p>
        {/* Force subpage-looking path via client would need pathname; show static demo strip */}
        <LandingHeader />
        <nav aria-label="서비스 메뉴 (샘플)" className="border-b border-landing-border bg-landing-bg">
          <ul className="mx-auto flex max-w-6xl items-stretch justify-center gap-1 px-container-padding-mobile md:gap-2 md:px-8">
            {(
              [
                { href: "/", label: "홈", accent: "#f97316", active: false },
                { href: "/properties", label: "부동산중개", accent: "#4dabff", active: true },
                { href: "/auctions", label: "경매공매", accent: "#d4af37", active: false },
                { href: "/news", label: "부동산소식", accent: "#d450ff", active: false },
                { href: "/legal", label: "Q & A", accent: "#34d399", active: false },
              ] as const
            ).map((item) => (
              <li key={item.href} className="flex-1 md:flex-none">
                <Link
                  href={item.href}
                  style={{ ["--nav-accent" as string]: item.accent }}
                  className={`flex h-11 items-center justify-center border-b-2 px-3 text-sm font-semibold transition-colors md:px-5 ${
                    item.active
                      ? "border-[color:var(--nav-accent)] text-[color:var(--nav-accent)]"
                      : "border-transparent text-landing-muted hover:border-[color:var(--nav-accent)] hover:text-[color:var(--nav-accent)]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-xs text-landing-muted line-through opacity-50">← 홈으로 (제거 예정)</p>
          <h1 className="mt-4 text-xl font-bold text-[#4dabff]">일반중개</h1>
          <p className="mt-2 text-sm text-landing-muted">
            승인 시 목록 페이지의 「← 홈으로」 링크를 삭제하고, 위 액센트 내비가 홈·서브 모두에 적용됩니다.
          </p>
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
