import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";

export const metadata: Metadata = {
  title: "디자인 목업 | 유튜브·블로그 바로가기",
  robots: { index: false, follow: false },
};

/** 실제 URL은 적용 시 교체 */
const CHANNELS = {
  youtube: "https://www.youtube.com/@%EC%B0%AC%EC%8A%A4%EA%B2%BD%EB%A7%A4%EC%A4%91%EA%B0%9C",
  blog: "https://blog.naver.com/kimdayn",
} as const;

function MaterialIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

function SampleFrame({
  title,
  placement,
  why,
  children,
}: {
  title: string;
  placement: string;
  why: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-landing-border">
      <div className="border-b border-landing-border bg-landing-bg px-4 py-3">
        <h2 className="text-sm font-bold text-landing-text">{title}</h2>
        <p className="mt-1 text-xs text-blue-400">위치: {placement}</p>
        <p className="mt-1 text-xs text-landing-muted">{why}</p>
      </div>
      <div className="bg-[#070a12]">{children}</div>
    </section>
  );
}

function FakePageChrome({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-landing-border px-4 py-2.5 opacity-50">
        <span className="text-[10px] font-bold text-landing-muted">HEADER · 상담 예약</span>
        <span className="text-[10px] text-landing-muted">NAV · 일반중개 · 경매…</span>
      </div>
      <div className="border-b border-landing-border px-4 py-6 text-center opacity-40">
        <p className="text-[10px] text-landing-muted">… 히어로 · 본문 섹션 …</p>
      </div>
      {children}
    </div>
  );
}

/** 1번 추천: 페이지 하단 채널 푸터 */
function SampleFooterStrip() {
  return (
    <FakePageChrome>
      <div className="border-b border-landing-border px-4 py-8 text-center opacity-50">
        <p className="text-xs font-bold text-landing-text">상담 예약하기 (Final CTA)</p>
      </div>
      <footer className="border-t border-landing-border bg-landing-surface px-4 py-8">
        <p className="mb-1 text-center text-[10px] font-bold tracking-[0.2em] text-blue-400">
          CHANNELS
        </p>
        <p className="mb-5 text-center text-sm font-bold text-landing-text">
          영상·글로 먼저 살펴보세요
        </p>
        <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
          <a
            href={CHANNELS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-landing-border bg-[#0f0f0f] px-4 py-3 text-sm font-bold text-white transition-colors hover:border-red-500/50 hover:bg-[#1a1a1a]"
          >
            <MaterialIcon name="play_circle" className="text-xl text-red-500" />
            YouTube
          </a>
          <a
            href={CHANNELS.blog}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-landing-border bg-[#03c75a]/10 px-4 py-3 text-sm font-bold text-landing-text transition-colors hover:border-[#03c75a]/50 hover:bg-[#03c75a]/20"
          >
            <MaterialIcon name="article" className="text-xl text-[#03c75a]" />
            네이버 블로그
          </a>
        </div>
      </footer>
    </FakePageChrome>
  );
}

/** 2번: Final CTA 카드 안 보조 버튼 */
function SampleInsideFinalCta() {
  return (
    <FakePageChrome>
      <div className="px-4 py-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-8 text-center backdrop-blur-md">
          <h3 className="text-base font-extrabold text-landing-text">
            매물·경매·법률, 지금 바로 상담하세요
          </h3>
          <p className="mt-2 text-xs text-landing-muted">내포·홍성 전문 중개사가 도와드립니다.</p>
          <button
            type="button"
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-cta-from to-cta-to px-4 py-3 text-xs font-bold text-white"
          >
            상담 예약하기
          </button>
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-landing-border" />
            <span className="text-[10px] text-landing-muted">또는 콘텐츠 보기</span>
            <div className="h-px flex-1 bg-landing-border" />
          </div>
          <div className="mt-4 flex gap-2">
            <a
              href={CHANNELS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-landing-border bg-landing-surface px-3 py-2.5 text-xs font-semibold text-landing-text hover:bg-landing-elevated"
            >
              <MaterialIcon name="play_circle" className="text-base text-red-500" />
              YouTube
            </a>
            <a
              href={CHANNELS.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-landing-border bg-landing-surface px-3 py-2.5 text-xs font-semibold text-landing-text hover:bg-landing-elevated"
            >
              <MaterialIcon name="article" className="text-base text-[#03c75a]" />
              블로그
            </a>
          </div>
        </div>
      </div>
    </FakePageChrome>
  );
}

/** 3번: 우측 플로팅 독 */
function SampleFloatingDock() {
  return (
    <div className="relative">
      <FakePageChrome>
        <div className="border-b border-landing-border px-4 py-10 text-center opacity-40">
          <p className="text-[10px] text-landing-muted">스크롤해도 항상 보이는 우측 고정 버튼</p>
        </div>
        <div className="border-b border-landing-border px-4 py-8 text-center opacity-50">
          <p className="text-xs font-bold text-landing-text">상담 예약하기 (Final CTA)</p>
        </div>
      </FakePageChrome>
      <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
        <a
          href={CHANNELS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          title="YouTube"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-landing-border bg-landing-surface text-red-500 shadow-lg transition-transform hover:scale-105 hover:bg-landing-elevated"
        >
          <MaterialIcon name="play_circle" className="text-2xl" />
        </a>
        <a
          href={CHANNELS.blog}
          target="_blank"
          rel="noopener noreferrer"
          title="네이버 블로그"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-landing-border bg-landing-surface text-[#03c75a] shadow-lg transition-transform hover:scale-105 hover:bg-landing-elevated"
        >
          <MaterialIcon name="article" className="text-2xl" />
        </a>
      </div>
    </div>
  );
}

export default function SocialShortcutsSamplesPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-landing-bg/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
              디자인 목업
            </span>
            <h1 className="text-lg font-bold">유튜브 · 네이버블로그 바로가기</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-blue-400 hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 pb-16">
        <div className="rounded-2xl border border-blue-400/30 bg-blue-400/5 px-4 py-4 text-sm leading-relaxed text-landing-muted">
          <p className="font-bold text-landing-text">추천 위치</p>
          <p className="mt-2">
            헤더·히어로는 <strong className="text-landing-text">상담 예약</strong>과 서비스 메뉴가
            이미 있어 SNS를 넣으면 경쟁합니다. 콘텐츠 채널은{" "}
            <strong className="text-landing-text">페이지 맨 아래(Final CTA 다음 푸터)</strong>에
            두는 것이 가장 자연스럽습니다. 상담을 마친 뒤·스크롤 끝에서 채널로 이어집니다.
          </p>
        </div>

        <SampleFrame
          title="1번 · 하단 채널 푸터 (추천)"
          placement="Final CTA 바로 아래 · 페이지 끝"
          why="상담 CTA와 역할이 분리되고, 브랜드 채널을 명확히 보여 줍니다."
        >
          <SampleFooterStrip />
        </SampleFrame>

        <SampleFrame
          title="2번 · 상담 CTA 카드 안 보조 버튼"
          placement="Final CTA 카드 내부 · 상담 버튼 아래"
          why="한 화면에서 상담/콘텐츠를 같이 제안. 다만 상담이 조금 약해질 수 있음."
        >
          <SampleInsideFinalCta />
        </SampleFrame>

        <SampleFrame
          title="3번 · 우측 플로팅 독"
          placement="화면 오른쪽 고정 (전 페이지 공통 가능)"
          why="어디서든 바로 이동. 눈에 잘 띄지만 모바일에서 본문을 가릴 수 있음."
        >
          <SampleFloatingDock />
        </SampleFrame>

        <p className="text-xs text-landing-muted">
          샘플 링크는 임시 URL입니다. 적용할 때 실제 유튜브·네이버블로그 주소를 알려 주세요.
        </p>
      </main>
    </div>
  );
}
