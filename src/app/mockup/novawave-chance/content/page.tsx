import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "목업 3 | Content First",
  robots: { index: false, follow: false },
};

const YT = "https://www.youtube.com/@%EC%B0%AC%EC%8A%A4%EA%B2%BD%EB%A7%A4%EC%A4%91%EA%B0%9C";
const BLOG = "https://blog.naver.com/kimdayn";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function ContentFirstMockup() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#1a1a1a] antialiased">
      <div className="border-b border-[#dbe4ff] bg-white px-4 py-2 text-center text-xs text-[#2E5BFF]">
        목업 3 · Content First (유튜브·블로그) ·{" "}
        <Link href="/mockup/novawave-chance" className="underline">
          목록
        </Link>
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between bg-white/80 px-4 py-4 backdrop-blur md:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E5BFF] text-sm text-white">
            C
          </span>
          CHANCE
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={YT}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-xl border border-[#eee] bg-white px-3 py-2 text-xs font-bold sm:inline-flex"
          >
            YouTube
          </a>
          <a
            href={BLOG}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-xl border border-[#eee] bg-white px-3 py-2 text-xs font-bold sm:inline-flex"
          >
            Blog
          </a>
          <Link
            href="/consultation"
            className="rounded-xl bg-[#111] px-4 py-2.5 text-sm font-semibold text-white"
          >
            상담 예약
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <div className="grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="rounded-full bg-[#e8efff] px-3 py-1 text-[11px] font-bold text-[#2E5BFF]">
                WATCH · READ · CONSULT
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
                영상과 글로 먼저 보고,
                <br />
                <span className="text-[#2E5BFF]">필요할 때 상담</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm text-[#666] md:text-base">
                찬스경매중개 유튜브와 네이버 블로그에서 시장·경매 이야기를 확인한 뒤, 매물·상담으로
                이어가세요.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={YT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ff0000] px-5 py-3 text-sm font-bold text-white"
                >
                  <Icon name="play_circle" className="text-xl" />
                  YouTube 바로가기
                </a>
                <a
                  href={BLOG}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#03c75a] px-5 py-3 text-sm font-bold text-white"
                >
                  <Icon name="article" className="text-xl" />
                  네이버 블로그
                </a>
              </div>
            </div>

            <a
              href={YT}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-video overflow-hidden rounded-[24px] shadow-xl shadow-blue-500/15 ring-1 ring-[#2E5BFF]/20"
            >
              <Image
                src="/images/hero-naepo.jpg"
                alt="찬스경매중개 유튜브"
                fill
                className="object-cover transition group-hover:scale-105"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#ff0000] shadow-lg">
                  <Icon name="play_arrow" className="text-4xl" />
                </span>
              </div>
              <p className="absolute bottom-4 left-4 text-sm font-bold text-white">
                Featured · 찬스경매중개 채널
              </p>
            </a>
          </div>
        </section>

        <section className="bg-white px-4 py-14 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-[#2E5BFF]">LATEST CONTENT</p>
                <h2 className="mt-2 text-3xl font-extrabold">
                  최신 <span className="text-[#2E5BFF]">콘텐츠</span>
                </h2>
              </div>
              <Link href="/news" className="rounded-xl bg-[#111] px-4 py-2.5 text-sm font-semibold text-white">
                부동산소식 더보기 →
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <a
                href={YT}
                target="_blank"
                rel="noopener noreferrer"
                className="overflow-hidden rounded-2xl bg-[#2E5BFF] p-5 text-white"
              >
                <Icon name="smart_display" className="text-3xl" />
                <p className="mt-6 text-lg font-bold">유튜브 영상</p>
                <p className="mt-2 text-sm text-white/80">경매·중개 해설 콘텐츠</p>
              </a>
              <a
                href={BLOG}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-[#eee] bg-[#f7f9fc] p-5"
              >
                <Icon name="edit_note" className="text-3xl text-[#03c75a]" />
                <p className="mt-6 text-lg font-bold">네이버 블로그</p>
                <p className="mt-2 text-sm text-[#666]">이집저집~내집 이땅저땅~내땅</p>
              </a>
              <Link href="/news" className="rounded-2xl border border-[#eee] bg-white p-5 shadow-sm">
                <Icon name="newspaper" className="text-3xl text-[#2E5BFF]" />
                <p className="mt-6 text-lg font-bold">사이트 소식</p>
                <p className="mt-2 text-sm text-[#666]">내포·충남 부동산 이슈</p>
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-4">
              {[
                ["/properties", "home", "일반중개"],
                ["/auctions", "gavel", "경매물건"],
                ["/legal", "balance", "법률상담"],
                ["/consultation", "calendar_month", "상담 예약"],
              ].map(([href, icon, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-xl border border-[#e8eefc] bg-[#f7f9fc] px-4 py-3 text-sm font-semibold"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8efff] text-[#2E5BFF]">
                    <Icon name={icon} className="text-xl" />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
