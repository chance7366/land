import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { getLandingFeaturedData } from "@/lib/data";
import { parseImages } from "@/lib/format";

export const metadata: Metadata = {
  title: "디자인 목업 | Organic Forest (플랜트샵 느낌)",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const CATEGORIES = ["추천 매물", "아파트", "경매", "토지·상가", "전·월세"] as const;

const SERVICES = [
  {
    title: "부동산중개",
    blurb: "매매·전세·월세 추천",
    href: "/properties",
    icon: "home",
  },
  {
    title: "경매공매",
    blurb: "권리분석 · 입찰가 제안",
    href: "/auctions",
    icon: "gavel",
  },
  {
    title: "부동산소식",
    blurb: "내포·충남 시장 이슈",
    href: "/news",
    icon: "newspaper",
  },
  {
    title: "Q & A",
    blurb: "상담으로 바로 연결",
    href: "/legal",
    icon: "balance",
  },
] as const;

function formatPrice(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "가격 문의";
  if (value >= 100_000_000) {
    const eok = value / 100_000_000;
    return `${eok % 1 === 0 ? eok.toFixed(0) : eok.toFixed(1)}억`;
  }
  return `${Math.round(value / 10_000).toLocaleString("ko-KR")}만`;
}

export default async function OrganicForestMockupPage() {
  const data = await getLandingFeaturedData();
  const picks = [
    ...data.properties.slice(0, 3).map((p) => ({
      key: `p-${p.id}`,
      title: p.title,
      price: formatPrice(p.price),
      href: `/properties/${p.id}`,
      image: parseImages(p.images)[0] ?? "/images/hero-naepo.jpg",
      tag: "매물",
    })),
    ...data.auctions.slice(0, 2).map((a) => ({
      key: `a-${a.id}`,
      title: a.title,
      price: formatPrice(a.minPrice ?? a.appraisalPrice),
      href: `/auctions/${a.id}`,
      image: parseImages(a.images)[0] ?? "/images/hero-naepo.jpg",
      tag: "경매",
    })),
  ].slice(0, 4);

  while (picks.length < 4) {
    picks.push({
      key: `fallback-${picks.length}`,
      title: "내포신도시 추천 매물",
      price: "가격 문의",
      href: "/properties",
      image: "/images/hero-naepo.jpg",
      tag: "매물",
    });
  }

  return (
    <div className="organic-forest min-h-screen font-[family-name:var(--font-unifine)] antialiased">
      <style>{`
        .organic-forest {
          --of-bg: #14241c;
          --of-bg-deep: #0e1a14;
          --of-leaf: #4f8a63;
          --of-leaf-soft: rgba(79, 138, 99, 0.35);
          --of-cream: #f2f2ec;
          --of-cream-2: #eaeae3;
          --of-ink: #15241c;
          --of-muted: rgba(242, 242, 236, 0.68);
          background: var(--of-bg);
          color: #f7f7f2;
        }
        .organic-forest .of-pill {
          border: 1px solid rgba(242, 242, 236, 0.22);
          background: transparent;
          color: var(--of-muted);
        }
        .organic-forest .of-pill[data-active="true"] {
          border-color: transparent;
          background: var(--of-leaf);
          color: #fff;
        }
        .organic-forest .of-pill--on-sage {
          border-color: rgba(20, 50, 35, 0.18);
          color: #4a6354;
          background: rgba(255, 255, 255, 0.35);
        }
        .organic-forest .of-pill--on-sage[data-active="true"] {
          border-color: transparent;
          background: var(--of-leaf);
          color: #fff;
        }
        .organic-forest .of-card {
          background: var(--of-cream);
          color: var(--of-ink);
          border-radius: 1.35rem;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
        }
        .organic-forest .of-card-media {
          border-radius: 1.05rem;
          overflow: hidden;
          background: var(--of-cream-2);
        }
        .organic-forest .of-arrow {
          width: 2.35rem;
          height: 2.35rem;
          border-radius: 9999px;
          background: var(--of-ink);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .organic-forest a:hover .of-arrow {
          transform: translateX(2px);
          background: var(--of-leaf);
        }
        .organic-forest .of-cta-ghost {
          border: 1px solid rgba(255, 255, 255, 0.55);
          background: rgba(20, 36, 28, 0.45);
          backdrop-filter: blur(8px);
        }
        .organic-forest .of-cta-solid {
          background: var(--of-cream);
          color: var(--of-ink);
        }
      `}</style>

      {/* Analysis strip */}
      <div className="border-b border-white/10 bg-[var(--of-bg-deep)] px-4 py-3 text-center text-[11px] leading-relaxed text-[var(--of-muted)] md:px-8">
        <strong className="text-[#f2f2ec]">샘플 · Organic Forest</strong>
        {" — "}
        딥 포레스트 그린 + 크림 카드 대비 · 큰 라운드 · 원형 화살 CTA · 필 카테고리.
        홈에는 미적용.{" "}
        <Link href="/" className="text-[#9fd4b5] hover:underline">
          ← 홈
        </Link>
      </div>

      {/* Compact header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-container-padding-mobile py-5 md:px-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-[#7db892]" aria-hidden>
            gavel
          </span>
          <span className="text-sm font-extrabold tracking-wide text-[#f2f2ec] md:text-base">
            CHANCE
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-[var(--of-muted)] sm:flex">
          <span>매물</span>
          <span>경매</span>
          <span>소식</span>
          <span>상담</span>
        </nav>
        <Link
          href="/properties"
          className="rounded-full of-cta-ghost px-4 py-2 text-xs font-bold text-white"
        >
          매물 보기
        </Link>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-container-padding-mobile pb-14 pt-6 md:px-8 md:pb-20 md:pt-10">
          <div className="pointer-events-none absolute inset-0">
            <Image
              src="/images/hero-naepo.jpg"
              alt=""
              fill
              priority
              className="object-cover opacity-45"
              sizes="100vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(14,26,20,0.92) 0%, rgba(14,26,20,0.72) 42%, rgba(20,36,28,0.35) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9fd4b5]">
              Naepo · Chance
            </p>
            <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.12] tracking-tight text-white md:text-6xl">
              Chance Power
              <br />
              for Your Space
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--of-muted)] md:text-base">
              내포신도시 부동산·경매를 포레스트 톤으로. 어두운 대지 위에 크림 카드가
              떠 있는 대비가 핵심입니다.
            </p>
            <Link
              href="/properties"
              className="mt-8 inline-flex items-center gap-2 rounded-full of-cta-ghost px-6 py-3 text-sm font-bold text-white"
            >
              Explore Now
              <span className="material-symbols-outlined text-base" aria-hidden>
                arrow_forward
              </span>
            </Link>
          </div>
        </section>

        {/* Analysis points */}
        <section className="border-y border-white/10 bg-[var(--of-bg-deep)] px-container-padding-mobile py-8 md:px-8">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {[
              {
                t: "색 대비",
                d: "배경은 거의 블랙에 가까운 딥 그린. 카드만 본·크림(#f2f2ec)으로 ‘종이 위 사진’ 느낌.",
              },
              {
                t: "카드 구조",
                d: "큰 radius · 안쪽 패딩 · 상단 이미지 · 하단 제목/가격 · 우하단 원형 화살.",
              },
              {
                t: "여백·필",
                d: "섹션 여백을 넉넉히. 카테고리는 필 버튼, 활성만 leaf green으로 강조.",
              },
            ].map((item) => (
              <div key={item.t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-bold text-[#c8e6d2]">{item.t}</p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--of-muted)]">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories + product-style cards — band uses home Featured `bg-landing-section` (#dceee3) */}
        <section
          className="of-listings-band border-y border-[rgba(20,50,35,0.12)] px-container-padding-mobile py-12 md:px-8 md:py-16"
          style={{ backgroundColor: "#dceee3" }}
        >
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#4a6354]">
              Sample · 배경 = 홈 추천매물 섹션 landing-section (#dceee3)
            </p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#14261c] md:text-3xl">
                  Explore Our Listings
                </h2>
                <p className="mt-2 text-sm text-[#4a6354]">
                  홈 Featured 밴드와 같은 sage 배경 위에 크림 카드를 올린 샘플
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className="of-pill of-pill--on-sage shrink-0 rounded-full px-4 py-2 text-xs font-semibold"
                  data-active={i === 0}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {picks.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="of-card group flex w-[78%] shrink-0 flex-col p-3 sm:w-[46%] lg:w-auto"
                >
                  <div className="of-card-media relative aspect-[4/3]">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 70vw, 240px"
                    />
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-[var(--of-ink)]/80 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {item.tag}
                    </span>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2 px-1 pb-1">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[var(--of-ink)]">{item.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--of-ink)]/65">{item.price}</p>
                    </div>
                    <span className="of-arrow shrink-0" aria-hidden>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Mid banner */}
        <section className="px-container-padding-mobile pb-12 md:px-8 md:pb-16">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem]">
            <div className="relative min-h-[220px] md:min-h-[280px]">
              <Image
                src="/images/hero-naepo.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1152px) 100vw, 1152px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--of-bg-deep)]/88 via-[var(--of-bg)]/55 to-transparent" />
              <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-center px-6 py-10 md:min-h-[280px] md:px-12">
                <h2 className="max-w-md text-3xl font-extrabold leading-tight text-white md:text-4xl">
                  Find Your
                  <br />
                  Next Chance
                </h2>
                <Link
                  href="/auctions"
                  className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full of-cta-solid px-5 py-2.5 text-sm font-bold"
                >
                  경매 보러가기
                  <span className="material-symbols-outlined text-base" aria-hidden>
                    chevron_right
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Service cards in same language */}
        <section className="border-t border-white/10 bg-[var(--of-bg-deep)] px-container-padding-mobile py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-extrabold text-white md:text-3xl">Our Services</h2>
            <p className="mt-2 text-sm text-[var(--of-muted)]">
              히어로 서비스 카드를 같은 언어(크림 패널 + 원형 화살)로 재해석한 안
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <Link key={s.href} href={s.href} className="of-card flex flex-col p-4">
                  <div className="flex h-28 items-center justify-center rounded-[1.05rem] bg-[var(--of-cream-2)]">
                    <span
                      className="material-symbols-outlined text-4xl text-[var(--of-leaf)]"
                      aria-hidden
                    >
                      {s.icon}
                    </span>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-[var(--of-ink)]">{s.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--of-ink)]/60">{s.blurb}</p>
                    </div>
                    <span className="of-arrow shrink-0" aria-hidden>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-[var(--of-muted)]">
        Organic Forest 샘플 전용
        <div className="mt-2 flex justify-center gap-3">
          <Link href="/" className="text-[#9fd4b5] hover:underline">
            ← 홈
          </Link>
        </div>
      </footer>
    </div>
  );
}
