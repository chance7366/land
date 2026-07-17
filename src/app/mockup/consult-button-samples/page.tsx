import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { ChannelShortcuts } from "@/components/landing/ChannelShortcuts";

export const metadata: Metadata = {
  title: "디자인 목업 | 상담 예약 버튼 스타일",
  robots: { index: false, follow: false },
};

function MaterialIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined select-none ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

function HeaderPreview({
  title,
  note,
  consultButton,
}: {
  title: string;
  note: string;
  consultButton: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-landing-border">
      <div className="border-b border-landing-border px-4 py-3">
        <h2 className="text-sm font-bold text-landing-text">{title}</h2>
        <p className="mt-1 text-xs text-landing-muted">{note}</p>
      </div>
      <div className="flex items-center justify-between gap-3 bg-landing-bg px-4 py-4 md:px-8">
        <div className="flex min-w-0 items-center gap-2 opacity-70">
          <MaterialIcon name="gavel" className="shrink-0 text-2xl text-blue-400" />
          <span className="truncate bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-sm font-bold text-transparent">
            CHANCE REAL ESTATE & AUCTION
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {consultButton}
          <ChannelShortcuts />
        </div>
      </div>
    </section>
  );
}

export default function ConsultButtonSamplesPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-landing-bg/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
              디자인 목업
            </span>
            <h1 className="text-lg font-bold">상담 예약 버튼 · 채널 버튼 톤 맞춤</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-blue-400 hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 pb-16">
        <p className="text-sm text-landing-muted">
          그라데이션 CTA 대신, YouTube·네이버 블로그와 같은{" "}
          <strong className="text-landing-text">테두리 + 단색/틴트 + 아이콘</strong> 스타일 3종입니다.
        </p>

        <HeaderPreview
          title="현재 (비교용)"
          note="그라데이션 CTA — 채널 버튼과 이질감이 큼"
          consultButton={
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cta-from to-cta-to px-5 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,236,0.2)] sm:text-sm"
            >
              상담 예약
            </Link>
          }
        />

        <HeaderPreview
          title="1번 · 블루 채널 버튼 (추천)"
          note="유튜브/블로그와 같은 구조 · 브랜드 블루 틴트"
          consultButton={
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-landing-border bg-blue-500/15 px-2.5 py-2.5 text-xs font-bold text-landing-text transition-colors hover:border-blue-400/50 hover:bg-blue-500/25 sm:px-3"
            >
              <MaterialIcon name="calendar_month" className="text-lg text-blue-400" />
              <span className="hidden sm:inline">상담 예약</span>
            </Link>
          }
        />

        <HeaderPreview
          title="2번 · 다크 솔리드"
          note="YouTube 버튼과 같은 검정 바탕 · 아이콘만 포인트 컬러"
          consultButton={
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-landing-border bg-[#0f0f0f] px-2.5 py-2.5 text-xs font-bold text-white transition-colors hover:border-blue-400/50 hover:bg-[#1a1a1a] sm:px-3"
            >
              <MaterialIcon name="calendar_month" className="text-lg text-blue-400" />
              <span className="hidden sm:inline">상담 예약</span>
            </Link>
          }
        />

        <HeaderPreview
          title="3번 · 바이올렛 틴트"
          note="블로그 그린과 짝을 이루는 퍼플 톤 · CTA 그라데이션의 to 컬러 활용"
          consultButton={
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-landing-border bg-violet-500/15 px-2.5 py-2.5 text-xs font-bold text-landing-text transition-colors hover:border-violet-400/50 hover:bg-violet-500/25 sm:px-3"
            >
              <MaterialIcon name="calendar_month" className="text-lg text-violet-400" />
              <span className="hidden sm:inline">상담 예약</span>
            </Link>
          }
        />
      </main>
    </div>
  );
}
