import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "목업 2 | Dark Tech",
  robots: { index: false, follow: false },
};

const YT = "https://www.youtube.com/@%EC%B0%AC%EC%8A%A4%EA%B2%BD%EB%A7%A4%EC%A4%91%EA%B0%9C";
const BLOG = "https://blog.naver.com/kimdayn";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function DarkTechMockup() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white antialiased">
      <div className="border-b border-white/10 bg-[#0d1424] px-4 py-2 text-center text-xs text-[#7aa2ff]">
        목업 2 · Dark Tech ·{" "}
        <Link href="/mockup/novawave-chance" className="underline">
          목록
        </Link>
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E5BFF] text-sm">
            C
          </span>
          CHANCE
        </Link>
        <nav className="hidden gap-5 text-sm text-white/60 md:flex">
          <Link href="/properties" className="hover:text-white">
            일반중개
          </Link>
          <Link href="/auctions" className="hover:text-white">
            경매물건
          </Link>
          <Link href="/news" className="hover:text-white">
            소식
          </Link>
          <Link href="/legal" className="hover:text-white">
            법률
          </Link>
        </nav>
        <Link
          href="/consultation"
          className="rounded-xl bg-[#2E5BFF] px-4 py-2.5 text-sm font-semibold shadow-[0_0_24px_rgba(46,91,255,0.45)]"
        >
          상담 예약 →
        </Link>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-8">
          <div>
            <span className="rounded-full border border-[#2E5BFF]/40 bg-[#2E5BFF]/10 px-3 py-1 text-[11px] font-bold tracking-wide text-[#7aa2ff]">
              AUCTION · BROKERAGE PLATFORM
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
              데이터로 보는
              <br />
              <span className="bg-gradient-to-r from-[#2E5BFF] to-[#8eb0ff] bg-clip-text text-transparent">
                경매 · 중개 인사이트
              </span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/55 md:text-base">
              일정·감정가·권리이슈를 정리해, 입찰 전 판단을 빠르게 돕습니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/auctions"
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#070b14]"
              >
                경매 탐색 →
              </Link>
              <Link
                href="/properties"
                className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white"
              >
                일반중개
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-center sm:text-left">
              {[
                ["D-Day", "경매 일정"],
                ["분석", "권리 체크"],
                ["상담", "즉시 연결"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="text-lg font-bold text-[#7aa2ff]">{v}</p>
                  <p className="text-xs text-white/45">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-[#2E5BFF]/30 bg-[#10182a] p-3 shadow-[0_0_60px_rgba(46,91,255,0.2)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/hero-naepo.jpg"
                alt=""
                fill
                className="object-cover brightness-75"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2E5BFF]/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-black/40 p-4 backdrop-blur-md">
                <p className="text-sm font-bold">Local Deals · Clear Process</p>
                <p className="mt-1 text-xs text-white/70">내포신도시 중심 현지 네트워크</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 px-4 py-16 md:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-bold tracking-[0.2em] text-[#2E5BFF]">SELECTED WORK</p>
            <h2 className="mt-2 text-3xl font-extrabold">
              고객이 찾는 <span className="text-[#2E5BFF]">핵심 메뉴</span>
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Link
                href="/auctions"
                className="rounded-2xl bg-[#2E5BFF] p-6 shadow-[0_0_40px_rgba(46,91,255,0.35)]"
              >
                <Icon name="gavel" className="text-3xl" />
                <p className="mt-4 text-xl font-bold">경매물건</p>
                <p className="mt-2 text-sm text-white/80">진행 중 경매 · 감정가</p>
              </Link>
              <Link href="/properties" className="rounded-2xl bg-[#121a2c] p-6 ring-1 ring-white/10">
                <Icon name="home" className="text-3xl text-[#7aa2ff]" />
                <p className="mt-4 text-xl font-bold">일반중개</p>
                <p className="mt-2 text-sm text-white/55">매매 · 전세 · 임대</p>
              </Link>
              <Link href="/legal" className="rounded-2xl bg-[#0e1524] p-6 ring-1 ring-white/10">
                <Icon name="balance" className="text-3xl text-[#7aa2ff]" />
                <p className="mt-4 text-xl font-bold">법률상담</p>
                <p className="mt-2 text-sm text-white/55">Q&A · 상담 신청</p>
              </Link>
            </div>
            <div className="mt-8 flex gap-3">
              <a
                href={YT}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#2E5BFF]/40 px-4 py-2.5 text-sm text-[#7aa2ff]"
              >
                YouTube
              </a>
              <a
                href={BLOG}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/70"
              >
                Blog
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
