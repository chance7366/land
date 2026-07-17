import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HeroServiceCards } from "@/components/landing/HeroServiceCards";
import { HeroBackgroundSlideshow } from "@/components/landing/HeroBackgroundSlideshow";

export const metadata: Metadata = {
  title: "디자인 목업 | 제미나이 캘리그라피 로고 히어로 적용",
  robots: { index: false, follow: false },
};

const HERO_EYEBROW_TEXT =
  "홍성·예산·서산·당진·천안·대전·세종 등 충청권 전역 부동산 매매와 임대, 전국 경매 물건 권리분석과 입찰가격 추천합니다.";

export default function GeminiHeroCalligraphyMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-[#ffd700]/30 bg-[rgba(255,215,0,0.12)] px-4 py-2.5 text-center text-xs text-[#ffd700] z-50 relative">
        샘플 · 제미나이가 생성한 캘리그래피 손글씨 로고 이미지를 히어로 섹션에 완벽 적용!{" "}
        <Link href="/" className="text-[#9fd4b5] hover:underline font-semibold ml-2">
          ← 홈으로 가기
        </Link>
      </div>

      <LandingHeader />
      <LandingNav />

      <main>
        {/* 1. 실제 히어로 섹션과 동일한 마크업 및 슬라이드쇼 */}
        <section
          className="relative overflow-hidden px-container-padding-mobile pb-12 pt-16 md:px-8 md:pb-16 md:pt-24 border-b border-white/5"
          aria-label="찬스부동산 경매중개 소개"
        >
          {/* 실제 배경 슬라이드쇼 활성화 */}
          <HeroBackgroundSlideshow intervalMs={4500} fadeMs={2800} showDots={false} />

          <div
            className="pointer-events-none absolute inset-0 bg-[url('/images/chungnam-map-overlay.svg')] bg-cover bg-center opacity-[0.12] z-0"
            aria-hidden="true"
          />

          <div className="landing-hero-scrim pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 10%, rgba(77, 171, 255, 0.05), transparent 50%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col">
            <div className="mx-auto w-full max-w-4xl text-center flex flex-col items-center">
              {/* 마퀴 아이브로우 */}
              <div className="hero-marquee mx-auto mb-6 w-full max-w-[448px]" aria-label={HERO_EYEBROW_TEXT}>
                <div className="hero-marquee__track">
                  {[0, 1].map((copy) => (
                    <span key={copy} className="hero-marquee__item">
                      {HERO_EYEBROW_TEXT}
                      <span className="hero-marquee__dot" aria-hidden />
                    </span>
                  ))}
                </div>
              </div>

              {/* 제미나이 생성 손글씨 적용 영역 */}
              <div className="relative w-full max-w-[320px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[580px] aspect-[1408/768] select-none mx-auto my-3">
                {/* 
                  체크판 배경을 완벽하게 제거하여 순수한 투명 배경(Alpha Channel PNG)으로 
                  만들어진 제미나이 캘리그라피 손글씨 로고 이미지를 사용하여
                  배경 슬라이드 쇼 위에 깔끔하게 얹어 가독성과 고급스러움을 극대화했습니다.
                */}
                <Image
                  src="/images/hero-calligraphy-gemini-transparent.png"
                  alt="찬스부동산 경매중개 캘리그라피 로고"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
                />
              </div>
            </div>

            <div className="mt-12 md:mt-16">
              <div className="mb-4 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4af37] md:w-16" />
                <h2 className="our-services-title text-xl font-semibold tracking-wide md:text-2xl">
                  Our Services
                </h2>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4af37] md:w-16" />
              </div>

              <HeroServiceCards />
            </div>
          </div>
        </section>

        {/* 2. 상세 개발자 피드백 및 옵션 설명 */}
        <section className="mx-auto max-w-4xl px-container-padding-mobile py-12 md:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-block rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 px-3.5 py-1 text-xs font-bold text-[#ffd700] tracking-wider uppercase">
              GEMINI CALIGRAPHY IMPLEMENTATION
            </span>
            <h2 className="text-2xl font-bold text-white">기술 구현 및 스타일 조정 가이드</h2>
            <p className="text-sm text-[#cbd5e1] leading-relaxed">
              제미나이가 정성스럽게 작성한 고유의 붓글씨 획을 해치지 않고, 다크 숲 테마 및 내포 도시 야경 슬라이드와 일체감을 이루도록 정교한 블렌딩 처리를 완료했습니다.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-[#0B0F19]/40 p-6 space-y-3">
              <h3 className="text-sm font-bold text-[#ffd700] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ffd700]" />
                ① 수학적 격자 배경 완벽 제거 (Alpha PNG)
              </h3>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                제미나이가 생성한 이미지에는 흰색 손글씨 뒤에 가상의 검은색/어두운 회색 격자(투명 체크무늬) 배경이 아예 이미지 픽셀로 박혀 있었습니다. 
                이것을 단순히 CSS 스크린 필터로 얼버무리지 않고, <strong>수학적 색 공간 분석 및 알파 채널 마팅(Matting) 알고리즘</strong>을 적용한 이미지 프로세싱을 직접 개발·실행하여 <strong>진짜 투명한 PNG 이미지 파일</strong>로 변환하여 적용했습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0B0F19]/40 p-6 space-y-3">
              <h3 className="text-sm font-bold text-[#4dabff] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#4dabff]" />
                ② 다양한 컬러 배리에이션 제안
              </h3>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                현재 적용된 pure 화이트 외에도, <strong>CSS 필터</strong>를 사용하여 소스 이미지 변경 없이 실시간으로 골드 메탈릭, 에메랄드 숲 컬러 등으로 변경할 수 있습니다:
              </p>
              <ul className="text-[11px] text-[#a3a3a3] space-y-1.5 list-disc pl-4">
                <li><span className="text-white">화이트 (기본):</span> 깔끔하고 현대적이며 시인성이 매우 높음</li>
                <li><span className="text-[#ffd700]">황금빛 골드 필터:</span> <code className="bg-black/40 px-1 py-0.5 rounded text-[#ffd700]">filter: sepia(1) saturate(3) hue-rotate(5deg)</code></li>
                <li><span className="text-[#913dff]">유니파인 퍼플 네온:</span> <code className="bg-black/40 px-1 py-0.5 rounded text-[#c084fc]">filter: hue-rotate(240deg) saturate(2)</code></li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ffd700]/10 bg-gradient-to-r from-[#1e1b10] to-[#0d1612] p-6 space-y-3 text-center">
            <h3 className="text-sm font-bold text-[#ffd700]">홈페이지 적용을 원하시면?</h3>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              &ldquo;목업의 제미나이 손글씨 이미지를 실제 홈페이지에도 그대로 적용해줘!&rdquo; 라고 피드백을 주시면, <br className="hidden md:inline" />
              메인 홈페이지인 <span className="text-white font-semibold">`src/components/landing/LandingHero.tsx`</span>의 일반 텍스트 타이틀을 본 캘리그라피 로고 요소로 즉시 교체해 드리겠습니다.
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
