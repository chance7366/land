import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { MarqueeCardBrightSamples } from "./MarqueeCardBrightSamples";

export const metadata: Metadata = {
  title: "디자인 목업 | 마퀴 본문 흐림 배경 5종",
  robots: { index: false, follow: false },
};

export default function MarqueeCardBrightMockupPage() {
  return (
    <LandingShell>
      <style>{`
        /* 안→밖 밝음 (센터 하이라이트) */
        .mb-body-in-mist {
          background:
            radial-gradient(ellipse 90% 80% at 50% 35%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.1) 42%, rgba(255,255,255,0.03) 70%, transparent 100%),
            linear-gradient(180deg, rgba(40,48,64,0.55) 0%, rgba(22,26,36,0.75) 100%);
          border-top: 1px solid rgba(255,255,255,0.16);
        }
        .mb-body-in-rose {
          background:
            radial-gradient(ellipse 85% 75% at 50% 30%, rgba(255,190,200,0.38) 0%, rgba(251,113,133,0.14) 45%, transparent 72%),
            linear-gradient(180deg, rgba(55,28,36,0.5) 0%, rgba(28,16,22,0.7) 100%);
          border-top: 1px solid rgba(251,113,133,0.3);
        }
        .mb-body-in-sapphire {
          background:
            radial-gradient(ellipse 85% 75% at 50% 30%, rgba(186,230,253,0.4) 0%, rgba(96,165,250,0.16) 45%, transparent 72%),
            linear-gradient(180deg, rgba(24,40,64,0.55) 0%, rgba(14,20,34,0.75) 100%);
          border-top: 1px solid rgba(96,165,250,0.32);
        }

        /* 밖→안 밝음 (림 라이트) */
        .mb-body-out-frost {
          background:
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(18,24,36,0.35) 0%, transparent 55%),
            linear-gradient(160deg, rgba(220,235,255,0.32) 0%, rgba(160,190,230,0.12) 35%, rgba(30,40,58,0.65) 100%);
          border-top: 1px solid rgba(180,210,255,0.28);
          box-shadow: inset 0 0 40px rgba(160,200,255,0.12);
        }
        .mb-body-out-champagne {
          background:
            radial-gradient(ellipse 65% 55% at 50% 45%, rgba(245,235,210,0.55) 0%, transparent 60%),
            linear-gradient(180deg, #f7f1e4 0%, #ebe0c8 40%, #dccfad 100%);
          border-top: 1px solid rgba(200,170,110,0.35);
          box-shadow: inset 0 0 36px rgba(255,255,255,0.45);
        }
      `}</style>

      <LandingHeader />
      <LandingNav />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10 md:px-6">
        <header className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4dabff]">
            Mockup · Body samples only
          </p>
          <h1 className="text-2xl font-bold text-white">
            본문 흐림 배경 5종 + 호버 A형(적용)
          </h1>
          <p className="max-w-2xl text-sm text-[#a3a3a3]">
            호버 A형은 홈에 반영했습니다. 본문 배경은 아래에서 고른 뒤 적용해 주세요.
          </p>
          <p className="text-xs text-[#737373]">
            <Link href="/" className="text-[#4dabff] underline-offset-2 hover:underline">
              홈에서 호버 확인
            </Link>
          </p>
        </header>

        <MarqueeCardBrightSamples />

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] text-[#a3a3a3]">
          본문 배경 <strong className="text-white">1~5안</strong> 중 원하는 번호를 알려주시면
          추천매물·추천경매에 적용합니다.
        </section>
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
