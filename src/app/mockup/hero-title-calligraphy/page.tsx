import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 캘리그라피 타이틀 5종",
  robots: { index: false, follow: false },
};

const TITLE = "찬스부동산 경매중개";
const EYEBROW = "홍성·예산·서산·당진·천안·대전·세종 부동산 매매·임대와 전국 경매 물건 추천";

function CalligraphyFrame({
  n,
  name,
  fontFamilyClass,
  effectClass,
  note,
  colorDesc,
}: {
  n: number;
  name: string;
  fontFamilyClass: string;
  effectClass: string;
  note: string;
  colorDesc: string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19]/60 backdrop-blur-md">
      <div className="border-b border-white/10 bg-[#121622] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#4dabff]">
            {n}안 · {name}
          </h2>
          <p className="mt-1 text-xs text-[#a3a3a3]">폰트: {note} / 효과: {colorDesc}</p>
        </div>
        <span className="rounded-full bg-[#1b4d3e]/30 px-3 py-1 text-xs font-bold text-[#c8e6d2] border border-[#1b4d3e]/50">
          샘플 {n}
        </span>
      </div>
      <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden px-4 py-16">
        {/* Background slide simulator */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-naepo.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover object-[center_35%] brightness-[0.65] contrast-[1.05]"
            aria-hidden
          />
          {/* Theme/Forest overlay scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E1A14]/75 via-[#0B0F19]/85 to-[#0B0F19]" />
        </div>

        <div className="relative z-10 w-full max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold tracking-wider text-[#d4af37]/80 md:text-sm drop-shadow-md">
            {EYEBROW}
          </p>
          <h1 className={`${fontFamilyClass} ${effectClass} select-none`}>
            {TITLE}
          </h1>
        </div>
      </div>
    </section>
  );
}

export default function CalligraphyTitleSamplesPage() {
  return (
    <LandingShell>
      {/* 
        Google Fonts are loaded via runtime @import to bypass build-time network constraints (ETIMEDOUT) 
        and provide instant styling for all 5 handwriting fonts.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=East+Sea+Dokdo&family=Gamja+Flower&family=Nanum+Brush+Script&family=Nanum+Pen+Script&family=Yeon+Sung&display=swap');

        .font-brush { font-family: 'Nanum Brush Script', cursive; }
        .font-dokdo { font-family: 'East Sea Dokdo', cursive; }
        .font-yeonsung { font-family: 'Yeon Sung', cursive; }
        .font-pen { font-family: 'Nanum Pen Script', cursive; }
        .font-gamja { font-family: 'Gamja Flower', cursive; }

        /* 1안: 골드 압출 붓글씨 (Nanum Brush Script) */
        .calli-1 {
          font-size: clamp(2.4rem, 6.5vw, 4.2rem);
          line-height: 1.2;
          letter-spacing: 0.05em;
          background: linear-gradient(180deg, #fff6c8, #ffd700 30%, #d4af37 65%, #b8860b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 1px 0 #9a7209)
            drop-shadow(0 2px 0 #7a5a08)
            drop-shadow(0 3px 0 #5c4406)
            drop-shadow(0 5px 12px rgba(0, 0, 0, 0.85));
        }

        /* 2안: 네온 크롬 독도체 (East Sea Dokdo) */
        .calli-2 {
          font-size: clamp(2.5rem, 7vw, 4.5rem);
          line-height: 1.1;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, #ffffff 0%, #d4bfff 45%, #913dff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 0 10px rgba(145, 61, 255, 0.4))
            drop-shadow(0 2px 0 #3d1b66)
            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.9));
        }

        /* 3안: 브론즈 골드 품격체 (Yeon Sung) */
        .calli-3 {
          font-size: clamp(2.2rem, 5.8vw, 3.8rem);
          line-height: 1.25;
          letter-spacing: 0.02em;
          background: linear-gradient(180deg, #fff3d1 0%, #e8bc51 40%, #c59325 80%, #7e5c06 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 2px 0 #5c4103)
            drop-shadow(0 4px 10px rgba(0, 0, 0, 0.75));
        }

        /* 4안: 에메랄드 그린 손글씨 (Nanum Pen Script) */
        .calli-4 {
          font-size: clamp(2.3rem, 6.2vw, 4.0rem);
          line-height: 1.2;
          letter-spacing: 0.04em;
          background: linear-gradient(135deg, #ffffff 0%, #a3e635 50%, #15803d 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 0 12px rgba(163, 230, 53, 0.35))
            drop-shadow(0 2px 0 #14532d)
            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8));
        }

        /* 5안: 펄 화이트 감자꽃 (Gamja Flower) */
        .calli-5 {
          font-size: clamp(2.0rem, 5.2vw, 3.4rem);
          line-height: 1.3;
          letter-spacing: 0.03em;
          background: linear-gradient(180deg, #ffffff 0%, #f4f2eb 40%, #d8d3c5 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter:
            drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))
            drop-shadow(0 2px 0 #4a4a4a)
            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8));
        }
      `}</style>

      <div className="border-b border-[#d4bfff]/30 bg-[rgba(212,191,255,0.12)] px-4 py-2.5 text-center text-xs text-[#d4bfff]">
        샘플 · 히어로 메인 타이틀 「찬스부동산 경매중개」 캘리그라피 손글씨 5종 비교 · 홈 미적용.{" "}
        <Link href="/" className="text-[#9fd4b5] hover:underline font-semibold ml-2">
          ← 홈으로 가기
        </Link>
      </div>

      <LandingHeader />
      <LandingNav />

      <main className="mx-auto max-w-5xl px-container-padding-mobile py-10 pb-20 md:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="inline-block rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 px-3.5 py-1 text-xs font-bold text-[#d4af37] tracking-wider uppercase">
            CALLIGRAPHY TYPOGRAPHY
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            손글씨 캘리그라피 타이틀 5안
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-[#cbd5e1] leading-relaxed">
            히어로 백그라운드 슬라이드와 유니파인 다크 숲 테마에 가장 어울리도록 조정한 5가지 손글씨 캘리그라피 스타일입니다. 강인한 붓글씨부터 세련되고 우아한 흘림체까지 자유롭게 비교해 보세요.
          </p>
        </div>

        <div className="space-y-8">
          <CalligraphyFrame
            n={1}
            name="웅장한 황금 붓글씨 (추천)"
            fontFamilyClass="font-brush"
            effectClass="calli-1"
            note="나눔손글씨 붓 (Nanum Brush Script)"
            colorDesc="압출 입체 황금 그라데이션 + 골드 섀도우"
          />

          <CalligraphyFrame
            n={2}
            name="예술적 독도체"
            fontFamilyClass="font-dokdo"
            effectClass="calli-2"
            note="독도체 (East Sea Dokdo)"
            colorDesc="유니파인 네온 퍼플-화이트 크롬 그라데이션"
          />

          <CalligraphyFrame
            n={3}
            name="우아한 고전 품격체"
            fontFamilyClass="font-yeonsung"
            effectClass="calli-3"
            note="연성체 (Yeon Sung)"
            colorDesc="은은하고 묵직한 브론즈 골드 베벨 섀도우"
          />

          <CalligraphyFrame
            n={4}
            name="자연스러운 숲속 펜글씨"
            fontFamilyClass="font-pen"
            effectClass="calli-4"
            note="나눔손글씨 펜 (Nanum Pen Script)"
            colorDesc="에메랄드 그린-화이트 숲 테마 글로우"
          />

          <CalligraphyFrame
            n={5}
            name="단정하고 편안한 손글씨"
            fontFamilyClass="font-gamja"
            effectClass="calli-5"
            note="감자꽃체 (Gamja Flower)"
            colorDesc="깨끗한 펄 화이트 광택 + 소프트 다크 입체감"
          />
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0a0a0a]/80 p-6 md:p-8 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#d4af37]" />
            캘리그라피 서체별 매력과 추천 이유
          </h3>
          <ul className="grid gap-4 md:grid-cols-2 text-xs text-[#cbd5e1] leading-relaxed">
            <li className="space-y-1">
              <strong className="text-white">1안 (나눔붓글씨):</strong> 힘이 넘치는 정통 붓글씨체로, 법원 경매와 종합 부동산 중개의 신뢰감 및 엄숙한 무게감을 완벽하게 소화합니다. 입체 황금 메탈릭과의 매칭이 최고입니다.
            </li>
            <li className="space-y-1">
              <strong className="text-white">2안 (독도체):</strong> 캘리그래피 고유의 획이 극대화된 스타일입니다. 강렬하고 아티스틱하며, 유니파인 디자인 시스템의 퍼플 네온과 가장 힙하게 어우러집니다.
            </li>
            <li className="space-y-1">
              <strong className="text-white">3안 (연성체):</strong> 흘림체 느낌이 나면서도 가독성이 높고 품위가 있어, 고급스럽고 진정성 있는 브랜드 이미지를 표현하기 좋습니다.
            </li>
            <li className="space-y-1">
              <strong className="text-white">4안 (나눔펜글씨):</strong> 펜의 자연스러운 날렵함과 에메랄드 그린 숲 테마가 만나 신선하고 개성적인 인상을 주며 젊은 감각의 중개 느낌을 줍니다.
            </li>
            <li className="space-y-1">
              <strong className="text-white">5안 (감자꽃체):</strong> 아기자기하고 정감이 넘치는 무드로, 찬스부동산의 친근한 상담과 문턱 낮은 경매 컨설팅을 모티브로 편안함을 줍니다.
            </li>
          </ul>
        </div>
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
