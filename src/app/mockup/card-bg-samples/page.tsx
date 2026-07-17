import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | 카드 배경 샘플",
  robots: { index: false, follow: false },
};

const SAMPLE = {
  id: "01",
  title: "흩어진 매물 정보",
  body: "지역 매물이 여러 채널에 흩어져 있어, 원하는 조건의 물건을 한곳에서 비교하기 어렵습니다.",
} as const;

const OPTIONS = [
  {
    label: "현재 (적용됨 · 1번)",
    hex: "#334155",
    className: "bg-landing-surface",
    note: "landing-surface — 메인·서브 전역 적용",
  },
  {
    label: "참고 · 소프트 미스트",
    hex: "rgba(255,255,255,0.18)",
    className: "bg-white/[0.18] backdrop-blur-sm",
    note: "밝은 글래스 (미적용)",
  },
  {
    label: "참고 · 아이스 패널",
    hex: "#e2e8f0",
    className: "bg-[#e2e8f0]",
    note: "라이트 카드 (미적용)",
    light: true,
  },
] as const;

export default function CardBgSamplesPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-landing-bg/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
              디자인 목업
            </span>
            <h1 className="text-lg font-bold">WhyChance 카드 배경 샘플</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-blue-400 hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 pb-16">
        <p className="mb-2 text-sm text-landing-muted">
          페이지 배경은 <code className="text-landing-text">#0B0F19</code> 입니다. 아래에서 카드 안쪽
          배경만 비교하세요.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {OPTIONS.map((opt) => {
            const light = "light" in opt && opt.light;
            return (
              <div key={opt.label} className="flex flex-col gap-3">
                <div>
                  <p className="text-sm font-bold text-landing-text">{opt.label}</p>
                  <p className="mt-0.5 font-mono text-xs text-landing-muted">{opt.hex}</p>
                  <p className="mt-1 text-xs text-landing-muted">{opt.note}</p>
                </div>
                <article
                  className={`rounded-2xl border p-6 ${opt.className} ${
                    light ? "border-slate-300" : "border-landing-border"
                  }`}
                >
                  <p
                    className={`mb-3 text-xs font-bold tracking-wider ${
                      light ? "text-violet-600" : "text-violet-400"
                    }`}
                  >
                    PROBLEM {SAMPLE.id}
                  </p>
                  <h3
                    className={`font-[family-name:var(--font-headline)] text-lg font-bold ${
                      light ? "text-slate-900" : "text-landing-text"
                    }`}
                  >
                    {SAMPLE.title}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      light ? "text-slate-600" : "text-landing-muted"
                    }`}
                  >
                    {SAMPLE.body}
                  </p>
                </article>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
