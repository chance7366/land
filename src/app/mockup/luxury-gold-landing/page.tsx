import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | 럭셔리 골드 랜딩",
  robots: { index: false, follow: false },
};

const YOUTUBE =
  "https://www.youtube.com/@%EC%B0%AC%EC%8A%A4%EA%B2%BD%EB%A7%A4%EC%A4%91%EA%B0%9C";
const BLOG = "https://blog.naver.com/kimdayn";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/properties", label: "일반중개" },
  { href: "/auctions", label: "경매물건" },
  { href: "/news", label: "부동산소식" },
  { href: "/legal", label: "법률상담" },
] as const;

const SERVICES = [
  {
    icon: "home",
    title: "일반중개",
    body: "아파트·오피스텔·상가·토지 등 지역 매물을 한곳에서 비교합니다.",
  },
  {
    icon: "gavel",
    title: "경매물건",
    body: "일정·감정가·권리분석 중심으로 진행 중 경매를 안내합니다.",
  },
  {
    icon: "newspaper",
    title: "부동산소식",
    body: "내포·충남 시장 이슈와 정책 소식을 빠르게 전달합니다.",
  },
  {
    icon: "balance",
    title: "법률상담",
    body: "임대차·매매·경매 관련 질문에 상담으로 바로 연결합니다.",
  },
] as const;

const PROJECTS = [
  { title: "일반중개", sub: "내포신도시 추천 매물", src: "/images/hero-naepo.jpg" },
  { title: "경매물건", sub: "권리분석 기반 추천", src: "/images/hero-naepo.jpg" },
  { title: "현지 전문", sub: "충남·세종·대전", src: "/images/hero-naepo.jpg" },
] as const;

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden>
      {name}
    </span>
  );
}

function GoldButton({
  href,
  children,
  className = "",
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#f2d06b] px-6 py-3 text-sm font-semibold text-[#0a0a0a] shadow-[0_0_24px_rgba(212,175,55,0.35)] transition hover:brightness-110 ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export default function LuxuryGoldLandingMockupPage() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white antialiased"
      style={{
        fontFamily: '"Montserrat", "Noto Sans KR", system-ui, sans-serif',
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap"
      />

      {/* Analysis banner */}
      <div className="border-b border-[#d4af37]/25 bg-[#121212] px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d4af37]">DESIGN ANALYSIS → SAMPLE</p>
            <h1 className="mt-1 text-lg font-semibold">럭셔리 다크 + 골드 톤 · CHANCE 랜딩 샘플</h1>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-[#a3a3a3]">
              참고 이미지: 블랙 배경 · 골드 그라데이션 CTA · 세리프 헤드라인 · 카드 골드 글로우 ·
              풀블리드 히어로. 아래는 찬스부동산 콘텐츠로 같은 언어를 적용한 미리보기입니다. (홈에는
              아직 미적용)
            </p>
          </div>
          <Link href="/" className="text-sm text-[#d4af37] hover:underline">
            ← 현재 홈으로
          </Link>
        </div>
      </div>

      {/* —— Sample landing —— */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Icon name="gavel" className="text-2xl text-[#d4af37]" />
            <span
              className="text-sm font-semibold tracking-wide text-white md:text-base"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              CHANCE REAL ESTATE & AUCTION
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium tracking-wide text-[#cfcfcf] transition hover:text-[#d4af37]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={YOUTUBE}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg border border-[#d4af37]/40 px-3 py-2 text-xs font-semibold text-[#d4af37] sm:inline-flex"
            >
              YouTube
            </a>
            <a
              href={BLOG}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg border border-[#d4af37]/40 px-3 py-2 text-xs font-semibold text-[#d4af37] md:inline-flex"
            >
              Blog
            </a>
            <GoldButton href="/consultation" className="!px-4 !py-2 !text-xs">
              상담 예약
            </GoldButton>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] overflow-hidden md:min-h-[78vh]">
          <Image
            src="/images/hero-naepo.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] brightness-[0.55] contrast-[1.05]"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />

          <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-4 py-20 md:min-h-[78vh] md:px-8">
            <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#d4af37] md:text-sm">
              충남 · 세종 · 대전 · 내포신도시
            </p>
            <h2
              className="max-w-3xl text-4xl font-semibold leading-[1.15] text-white md:text-6xl"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              경매와 중개,
              <br />
              믿을 수 있는 한곳에서
            </h2>
            <p className="mt-5 max-w-xl text-sm text-[#d4d4d4] md:text-base">
              권리분석 · 입찰 · 매매 · 전세 · 임대 — 현지 전문이 끝까지 함께합니다
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <GoldButton href="/properties">
                매물 살펴보기 <span aria-hidden>→</span>
              </GoldButton>
              <a
                href={YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm font-medium text-white"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37] text-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.35)]">
                  <Icon name="play_arrow" className="text-2xl" />
                </span>
                채널 보기
              </a>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37] md:w-20" />
              <h3
                className="text-2xl font-semibold text-white md:text-3xl"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
              >
                Our Services
              </h3>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37] md:w-20" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <article
                  key={s.title}
                  className="rounded-2xl border border-white/10 bg-[#141414] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_28px_rgba(212,175,55,0.08)]"
                >
                  <Icon name={s.icon} className="mb-4 text-3xl text-[#d4af37]" />
                  <h4 className="text-base font-bold text-white">{s.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#a3a3a3]">{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="border-t border-white/5 px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <h3
              className="mb-10 text-center text-2xl font-semibold text-white md:text-3xl"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              Featured
            </h3>
            <div className="grid gap-5 md:grid-cols-3">
              {PROJECTS.map((p) => (
                <Link
                  key={p.title}
                  href="/properties"
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-lg font-semibold text-white">{p.title}</p>
                    <p className="mt-1 text-sm text-[#d4af37]">{p.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-t border-white/5 px-4 py-16 md:px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
            {[
              { icon: "location_on", value: "내포·홍성", label: "현지 밀착 중개" },
              { icon: "gavel", value: "경매+", label: "권리분석부터 입찰까지" },
              { icon: "handshake", value: "원스톱", label: "중개·소식·법률 연결" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <Icon name={stat.icon} className="mb-3 text-3xl text-[#d4af37]" />
                <p
                  className="text-3xl font-semibold text-white"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[#a3a3a3]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-24 pt-10 text-center md:px-8">
          <GoldButton href="/consultation" className="!px-10 !py-4 !text-base">
            상담 시작하기
          </GoldButton>
          <p
            className="mt-6 text-2xl text-[#d4af37] md:text-3xl"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Chance to Own Your Next Home
          </p>
        </section>
      </main>
    </div>
  );
}
