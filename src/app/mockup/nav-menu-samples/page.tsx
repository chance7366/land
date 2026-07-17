import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | 헤더-히어로 메뉴 샘플",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/properties", label: "일반중개", icon: "home" },
  { href: "/auctions", label: "경매물건", icon: "gavel" },
  { href: "/news", label: "부동산소식", icon: "newspaper" },
  { href: "/legal", label: "법률상담", icon: "balance" },
] as const;

function MaterialIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

function MiniHeader() {
  return (
    <div className="flex items-center justify-between border-b border-landing-border bg-landing-bg/90 px-4 py-3">
      <div className="flex items-center gap-2">
        <MaterialIcon name="gavel" className="text-xl text-blue-400" />
        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-sm font-bold text-transparent">
          CHANCE REAL ESTATE & AUCTION
        </span>
      </div>
      <span className="rounded-lg bg-gradient-to-r from-cta-from to-cta-to px-3 py-1.5 text-[10px] font-bold text-white">
        상담 예약
      </span>
    </div>
  );
}

function MiniHero() {
  return (
    <div className="relative h-28 overflow-hidden md:h-36">
      <Image
        src="/images/hero-naepo.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[center_35%] brightness-[1.22] contrast-[1.05] saturate-[1.02]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/20 to-[#0B0F19]/55" />
      <p className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/70">
        히어로 영역 (미리보기)
      </p>
    </div>
  );
}

function SampleFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-landing-border bg-landing-bg">
      <div className="border-b border-landing-border px-4 py-3">
        <h2 className="text-sm font-bold text-landing-text">{title}</h2>
        <p className="mt-1 text-xs text-landing-muted">{subtitle}</p>
      </div>
      <MiniHeader />
      {children}
      <MiniHero />
    </section>
  );
}

/** 1번: 텍스트 탭 + 하단 라인 */
function NavUnderline() {
  return (
    <nav
      aria-label="서비스 메뉴 샘플 1"
      className="border-b border-landing-border bg-landing-bg"
    >
      <ul className="mx-auto flex max-w-6xl items-stretch justify-center gap-1 px-2 md:gap-2 md:px-8">
        {NAV.map((item) => (
          <li key={item.href} className="flex-1 md:flex-none">
            <Link
              href={item.href}
              className="flex h-11 items-center justify-center border-b-2 border-transparent px-3 text-sm font-semibold text-landing-muted transition-colors hover:border-blue-400 hover:text-landing-text md:px-5"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** 2번: 아이콘 + 라벨 서피스 바 */
function NavIconBar() {
  return (
    <nav
      aria-label="서비스 메뉴 샘플 2"
      className="border-b border-landing-border bg-landing-surface"
    >
      <ul className="mx-auto grid max-w-6xl grid-cols-4 gap-1 px-2 py-2 md:px-8">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-landing-muted transition-colors hover:bg-landing-elevated hover:text-landing-text"
            >
              <MaterialIcon name={item.icon} className="text-xl text-blue-400" />
              <span className="text-[11px] font-semibold md:text-xs">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** 3번: 세그먼트(분할) 컨트롤 */
function NavSegmented() {
  return (
    <nav aria-label="서비스 메뉴 샘플 3" className="bg-landing-bg px-3 py-2.5 md:px-8">
      <ul className="mx-auto flex max-w-6xl overflow-hidden rounded-xl border border-landing-border bg-landing-surface">
        {NAV.map((item, i) => (
          <li key={item.href} className="flex-1">
            <Link
              href={item.href}
              className={`flex h-11 items-center justify-center px-2 text-center text-[11px] font-bold text-landing-muted transition-colors hover:bg-landing-elevated hover:text-landing-text md:text-sm ${
                i > 0 ? "border-l border-landing-border" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function NavMenuSamplesPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-landing-bg/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
              디자인 목업
            </span>
            <h1 className="text-lg font-bold">헤더 ↔ 히어로 메뉴 샘플</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-blue-400 hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 pb-16">
        <p className="text-sm text-landing-muted">
          헤더와 히어로 사이에 들어갈 서비스 메뉴 3종입니다. 각 항목은{" "}
          <code className="text-landing-text">/properties</code>,{" "}
          <code className="text-landing-text">/auctions</code>,{" "}
          <code className="text-landing-text">/news</code>,{" "}
          <code className="text-landing-text">/legal</code> 로 연결됩니다. 링크를 눌러 이동도
          확인해 보세요.
        </p>

        <SampleFrame
          title="1번 · 언더라인 탭"
          subtitle="텍스트만 · 호버 시 파란 밑줄 · 가볍고 정돈된 느낌"
        >
          <NavUnderline />
        </SampleFrame>

        <SampleFrame
          title="2번 · 아이콘 서피스 바 (추천)"
          subtitle="아이콘+라벨 · surface 배경 · 모바일에서도 구분 쉬움"
        >
          <NavIconBar />
        </SampleFrame>

        <SampleFrame
          title="3번 · 세그먼트 바"
          subtitle="한 덩어리 분할 버튼 · 앱 탭 느낌 · 폭이 균등"
        >
          <NavSegmented />
        </SampleFrame>
      </main>
    </div>
  );
}
