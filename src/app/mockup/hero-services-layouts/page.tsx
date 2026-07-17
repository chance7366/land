import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 안 Our Services 배치",
  robots: { index: false, follow: false },
};

const SERVICES = [
  {
    icon: "home",
    title: "부동산중개",
    description: "아파트·오피스텔·연립·다세대·단독주택·토지·상가 등 매매·전세·월세 추천해드립니다.",
    href: "/properties",
  },
  {
    icon: "gavel",
    title: "경매공매",
    description: "법원 경매, 온비드 공매 물건 권리분석과 추천입찰가격 제안해 드립니다.",
    href: "/auctions",
  },
  {
    icon: "newspaper",
    title: "부동산소식",
    description: "내포·충남 시장 이슈와 정책 소식을 빠르게 전달합니다.",
    href: "/news",
  },
  {
    icon: "balance",
    title: "Q & A",
    description: "임대차·매매·경매 관련 질문에 상담으로 바로 연결합니다.",
    href: "/legal",
  },
] as const;

function Icon({ name }: { name: string }) {
  return (
    <span className="material-symbols-outlined text-3xl text-[#d4af37]" aria-hidden>
      {name}
    </span>
  );
}

function HeroBg() {
  return (
    <>
      <Image
        src="/images/hero-naepo.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[center_35%] brightness-[1.15] contrast-[1.05]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-[#0a0a0a]/95" />
    </>
  );
}

function SampleFrame({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10">
      <div className="border-b border-white/10 bg-[#121212] px-4 py-3">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <p className="mt-1 text-xs text-[#a3a3a3]">{note}</p>
      </div>
      {children}
    </section>
  );
}

/** 1번: 히어로 하단 오버레이 카드 */
function OptionBottomOverlay() {
  return (
    <div className="relative min-h-[520px] overflow-hidden md:min-h-[560px]">
      <HeroBg />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-4 pb-8 pt-16 md:px-8 md:pt-20">
        <div className="mx-auto max-w-3xl text-center [text-shadow:0_2px_20px_rgba(0,0,0,0.85)]">
          <p className="mb-3 text-sm font-semibold text-blue-400">
            홍성·예산·서산·당진·천안·대전·세종 부동산 매매·임대와 전국 경매 물건 추천
          </p>
          <h1
            className="text-4xl font-black text-white md:text-5xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            찬스부동산 경매중개
          </h1>
        </div>

        <div className="mt-auto pt-14">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4af37]" />
            <p
              className="text-lg font-semibold text-white"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Our Services
            </p>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="rounded-2xl border border-white/10 bg-[#1f1f1f]/95 p-5 backdrop-blur-sm transition hover:border-[#d4af37]/35"
              >
                <Icon name={s.icon} />
                <h3 className="mt-3 text-base font-bold text-white">{s.title}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#a3a3a3]">
                  {s.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 2번: 타이틀 좌 / 서비스 우 스플릿 */
function OptionSplit() {
  return (
    <div className="relative min-h-[480px] overflow-hidden md:min-h-[520px]">
      <HeroBg />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:px-8 md:py-16">
        <div className="[text-shadow:0_2px_20px_rgba(0,0,0,0.85)]">
          <p className="mb-3 text-sm font-semibold text-blue-400">
            홍성·예산·서산·당진·천안·대전·세종 · 전국 경매
          </p>
          <h1
            className="text-4xl font-black leading-tight text-white md:text-5xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            찬스부동산
            <br />
            경매중개
          </h1>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[#d4af37]" />
            <p
              className="text-sm font-semibold text-white/90"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Our Services
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="rounded-2xl border border-white/10 bg-[#1f1f1f]/92 p-4 backdrop-blur-sm transition hover:border-[#d4af37]/35"
            >
              <Icon name={s.icon} />
              <h3 className="mt-2 text-sm font-bold text-white">{s.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-[#a3a3a3]">
                {s.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 3번: 컴팩트 아이콘 스트립 (설명 생략) */
function OptionCompactStrip() {
  return (
    <div className="relative min-h-[380px] overflow-hidden md:min-h-[420px]">
      <HeroBg />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-between px-4 py-14 md:min-h-[420px] md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl text-center [text-shadow:0_2px_20px_rgba(0,0,0,0.85)]">
          <p className="mb-3 text-sm font-semibold text-blue-400">
            홍성·예산·서산·당진·천안·대전·세종 부동산 매매·임대와 전국 경매 물건 추천
          </p>
          <h1
            className="text-4xl font-black text-white md:text-5xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            찬스부동산 경매중개
          </h1>
        </div>

        <div className="mt-12">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#d4af37]" />
            <p
              className="text-sm font-semibold text-white"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Our Services
            </p>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#1f1f1f]/90 px-3 py-4 text-center backdrop-blur-sm transition hover:border-[#d4af37]/40"
              >
                <Icon name={s.icon} />
                <span className="text-sm font-bold text-white">{s.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroServicesLayoutsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d4af37]">LAYOUT SAMPLES</p>
            <h1 className="text-lg font-bold">히어로 안 Our Services 배치 3안</h1>
          </div>
          <Link href="/" className="text-sm text-[#d4af37] hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 pb-16 md:px-8">
        <p className="text-sm text-[#a3a3a3]">
          Our Services를 히어로 이미지 영역 안에 넣는 배치입니다. 홈에는 아직 미적용입니다.
        </p>

        <SampleFrame
          title="1번 · 하단 오버레이 (추천)"
          note="타이틀은 위, 서비스 카드는 히어로 하단에 겹침 · 설명 유지 · 시선 흐름이 자연스러움"
        >
          <OptionBottomOverlay />
        </SampleFrame>

        <SampleFrame
          title="2번 · 좌우 스플릿"
          note="왼쪽 브랜드 카피, 오른쪽 2×2 서비스 카드 · 데스크톱에서 한 화면에 밀도 있게"
        >
          <OptionSplit />
        </SampleFrame>

        <SampleFrame
          title="3번 · 컴팩트 스트립"
          note="아이콘+제목만 · 히어로 높이 유지 · 설명은 카드 호버/서브페이지에서"
        >
          <OptionCompactStrip />
        </SampleFrame>
      </main>
    </div>
  );
}
