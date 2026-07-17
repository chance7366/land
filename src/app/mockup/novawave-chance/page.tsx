import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | NovaWave 스타일 3종",
  robots: { index: false, follow: false },
};

const SAMPLES = [
  {
    href: "/mockup/novawave-chance/dark",
    title: "1번 · Dark Tech",
    tone: "다크 + 네온 블루",
    desc: "동일 레이아웃을 다크로. 경매·전문성 강조에 맞는 테크 톤.",
  },
  {
    href: "/mockup/novawave-chance/content",
    title: "2번 · Content First",
    tone: "유튜브 · 블로그 중심",
    desc: "히어로에 채널 CTA, 하단에 영상/글 카드 그리드. 콘텐츠 유입에 최적화.",
  },
] as const;

export default function NovaWaveChanceHubPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#2E5BFF]">DESIGN ANALYSIS</p>
            <h1 className="mt-2 text-2xl font-bold">NovaWave 스타일 → CHANCE 목업</h1>
          </div>
          <Link href="/" className="text-sm text-[#7aa2ff] hover:underline">
            ← 홈으로
          </Link>
        </div>

        <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/70">
          <p className="font-semibold text-white">참고 이미지 핵심</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>화이트 베이스 + 비비드 블루(`#2E5BFF`) 하이라이트</li>
            <li>좌측 카피 / 우측 비주얼 스플릿 히어로 + 통계 바</li>
            <li>비대칭 포트폴리오 카드 그리드 (블루·다크·라이트 혼합)</li>
            <li>둥근 버튼(블랙 primary) · 산세리프 · 넓은 여백</li>
          </ul>
          <p className="mt-3">
            아래 3종은 찬스부동산 메뉴·상담·유튜브·블로그 URL을 넣은 미리보기입니다. (홈 미적용)
          </p>
        </div>

        <div className="grid gap-4">
          {SAMPLES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-2xl border border-white/10 bg-[#121826] p-5 transition hover:border-[#2E5BFF]/50 hover:bg-[#161d2e]"
            >
              <p className="text-lg font-bold text-white">{s.title}</p>
              <p className="mt-1 text-xs font-semibold text-[#7aa2ff]">{s.tone}</p>
              <p className="mt-2 text-sm text-white/65">{s.desc}</p>
              <p className="mt-3 text-sm font-semibold text-[#2E5BFF]">샘플 열기 →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
