import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";

export const metadata: Metadata = {
  title: "디자인 목업 | 마퀴 카드 흰 글씨 · 폰트",
  robots: { index: false, follow: false },
};

const FONT_SAMPLES = [
  {
    id: "noto-sans",
    name: "1안 · Noto Sans KR",
    utility: "font-hero-gothic-noto",
    note: "추천 · 가독성·중립 · 모바일 한글에 가장 무난",
    recommend: true,
  },
  {
    id: "gothic-a1",
    name: "2안 · 고딕 A1",
    utility: "font-hero-gothic-a1",
    note: "모던·또렷 · 테크 느낌",
    recommend: false,
  },
  {
    id: "blackhan",
    name: "3안 · Black Han Sans",
    utility: "font-hero-gothic-blackhan",
    note: "초굵은 임팩트 · 본문 전체엔 다소 강함",
    recommend: false,
  },
  {
    id: "gowun",
    name: "4안 · 고운바탕",
    utility: "font-hero-serif-gowun",
    note: "세리프 · 차분·신뢰 · 가격 강조와 톤이 다름",
    recommend: false,
  },
  {
    id: "outfit",
    name: "5안 · Outfit (현행)",
    utility: "",
    note: "현재 상속 폰트 · 한글은 OS 대체 글꼴",
    recommend: false,
  },
] as const;

function PropertyBody({ fontClass }: { fontClass: string }) {
  return (
    <div
      className={`featured-marquee-card__body flex h-[132px] flex-col justify-between gap-1 overflow-hidden p-4 text-white ${fontClass}`}
    >
      <p className="line-clamp-2 text-sm font-bold">내포 센트럴 오피스텔</p>
      <p className="line-clamp-1 text-xs font-bold text-white/90">
        공급 55㎡ · 전용 42㎡ · 16/22층 · 남동향
      </p>
      <div className="flex items-center justify-between gap-2 text-xs font-bold text-white/85">
        <p className="min-w-0 flex-1 truncate">충청남도 홍성군 홍북읍</p>
        <p className="shrink-0">2026.07.11</p>
      </div>
      <p className="text-left text-[15px] font-extrabold text-white">매매가 3억 2,900만원</p>
    </div>
  );
}

function AuctionBody({ fontClass }: { fontClass: string }) {
  return (
    <div
      className={`featured-marquee-card__body flex h-[132px] flex-col justify-between gap-1 overflow-hidden p-4 text-white ${fontClass}`}
    >
      <p className="line-clamp-2 text-sm font-bold">
        충청남도 홍성군 홍북읍 신경리 88 · 내포신도시
      </p>
      <div className="flex items-center justify-between gap-2 text-xs font-bold text-white/90">
        <span className="min-w-0 truncate">2024타경51207</span>
        <span className="shrink-0">매각기일 2026-08-05</span>
      </div>
      <p className="text-xs font-bold text-white/85">감정가 310,000,000원</p>
      <p className="text-[15px] font-extrabold text-white">
        최저가 217,000,000원
        <span className="ml-1">(70%)</span>
      </p>
    </div>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <article className="w-[240px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-landing-card shadow-[0_8px_28px_rgba(0,0,0,0.4)]">
      <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#2a3344] to-[#151a24] text-[11px] text-white/35">
        이미지
      </div>
      {children}
    </article>
  );
}

export default function MarqueeWhiteFontMockupPage() {
  return (
    <LandingShell>
      <LandingHeader />
      <LandingNav />

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6">
        <header className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4dabff]">
            Mockup · Not applied to home
          </p>
          <h1 className="text-2xl font-bold text-white">
            마퀴 카드 · 전체 흰색 + 폰트 추천
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#a3a3a3]">
            색 계층을 없애고 본문을 흰색으로 통일했습니다. 가격·최저가만 15px extrabold,
            나머지는 기존 크기·bold입니다. 계층은 크기·굵기로만 구분합니다.
          </p>
          <p className="text-xs text-[#737373]">
            <Link href="/" className="text-[#4dabff] underline-offset-2 hover:underline">
              홈으로
            </Link>
          </p>
        </header>

        <section className="rounded-2xl border border-[#4dabff]/25 bg-[#4dabff]/08 p-5 text-[13px] text-[#cbd5e1]">
          <p className="font-bold text-white">폰트 추천</p>
          <p className="mt-2">
            <strong className="text-[#93c5fd]">1안 Noto Sans KR</strong>을 권장합니다.
            한글 본문 가독성이 가장 안정적이고, 이미 프로젝트에 로드되어 있습니다.
            2안 고딕 A1은 조금 더 날카롭고, 5안 Outfit은 한글이 흐릿해 보일 수 있습니다.
          </p>
        </section>

        {FONT_SAMPLES.map((font) => (
          <section
            key={font.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19]/80"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-3">
              <div>
                <h2 className="text-sm font-bold text-[#4dabff]">{font.name}</h2>
                <p className="text-[11px] text-[#a3a3a3]">{font.note}</p>
                {font.utility ? (
                  <p className="mt-0.5 font-mono text-[10px] text-[#737373]">
                    {font.utility}
                  </p>
                ) : (
                  <p className="mt-0.5 font-mono text-[10px] text-[#737373]">
                    var(--font-unifine) · Outfit
                  </p>
                )}
              </div>
              {font.recommend ? (
                <span className="rounded-full border border-[#4dabff]/40 bg-[#4dabff]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#93c5fd]">
                  추천
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-center gap-6 bg-[radial-gradient(ellipse_at_50%_0%,#1a1220_0%,#0a0809_70%)] px-4 py-8">
              <div className="space-y-2">
                <p className="text-center text-[10px] font-bold text-[#60a5fa]">매물</p>
                <CardShell>
                  <PropertyBody fontClass={font.utility} />
                </CardShell>
              </div>
              <div className="space-y-2">
                <p className="text-center text-[10px] font-bold text-[#facc15]">경매</p>
                <CardShell>
                  <AuctionBody fontClass={font.utility} />
                </CardShell>
              </div>
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] text-[#a3a3a3]">
          원하는 폰트 안(1~5)을 알려주시면 홈 마퀴에{" "}
          <strong className="text-white">전체 흰색 + 선택 폰트</strong>로 적용합니다.
        </section>
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
