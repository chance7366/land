import type { ReactNode } from "react";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";

export const PROFILE_QUALIFICATIONS = [
  {
    title: "공인중개사",
    year: "2024년 취득",
    desc: "부동산 거래 전반에 대한 법률적 지식과 현장 실무 능력을 갖추고 있습니다.",
  },
  {
    title: "권리분석사",
    year: "2025년 취득",
    desc: "경매·특수물건 분석에 특화되어, 복잡한 권리 관계를 명쾌하게 해석하고 리스크를 사전에 차단합니다.",
  },
  {
    title: "경영진단사",
    year: "전문 자격",
    desc: "기업·개인 자산의 가치를 종합 평가하고, 최선의 투자를 위한 전략 수립을 지원합니다.",
  },
] as const;

export const PROFILE_SERVICES = [
  {
    title: "충청지역 부동산 매매·임대 중개",
    points: [
      "내포신도시를 중심으로 충청권 전역의 상권·개발 호재·시세를 파악해 제공합니다.",
      "라이프스타일·투자 목적·예산에 맞는 토지·아파트·상가 등 맞춤 매물을 선별합니다.",
      "투명한 협상·계약 관리로 매도·매수, 임대·임차 모두가 만족하는 결과를 지향합니다.",
    ],
  },
  {
    title: "전국 경매물건 권리분석·대행",
    points: [
      "등기부등본·임대차·인수 권리 등 법률적 리스크를 정밀하게 점검합니다.",
      "낙찰 확률과 수익성을 함께 고려한 합리적 입찰가 산정을 돕습니다.",
      "법정 기일·입찰표 작성 등 복잡한 절차를 대행해 안전한 낙찰을 지원합니다.",
    ],
  },
] as const;

export const PROFILE_STRENGTHS = [
  {
    title: "믿음과 신뢰의 파트너",
    body: "모든 거래는 투명하게 진행되며, 고객님의 자산을 내 자산처럼 소중히 여깁니다.",
  },
  {
    title: "종합적인 안목",
    body: "중개사의 법률 지식과 경영진단사의 재무 감각을 결합해, 단순 거래를 넘어 투자 관점을 제공합니다.",
  },
  {
    title: "끝까지 함께하는 서비스",
    body: "계약·낙찰 이후에도 사후 관리와 상담을 지속적으로 제공합니다.",
  },
] as const;

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-white md:text-xl">
      <span
        className="h-5 w-1 rounded-full bg-gradient-to-b from-[#f9a8d4] to-[#f472b6]"
        aria-hidden
      />
      {children}
    </h2>
  );
}

function TrustPortrait() {
  return (
    <div className="relative mx-auto w-[220px] sm:w-[260px] md:mx-0 md:w-[300px]">
      <div
        className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(244,114,182,0.28),rgba(77,171,255,0.12)_45%,transparent_70%)] blur-2xl"
        aria-hidden
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <Image
          src="/images/profile-agent.png"
          alt="김영찬 공인중개사"
          fill
          priority
          sizes="300px"
          className="object-cover object-[center_18%] brightness-[1.04] contrast-[1.04] saturate-[1.05]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fbbf24]/12 via-transparent to-[#4dabff]/18 mix-blend-soft-light"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(11,15,25,0.35)_78%,rgba(11,15,25,0.88)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/55 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0B0F19]/50 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0B0F19]/40 to-transparent"
          aria-hidden
        />
      </div>
      <p className="mt-4 text-center text-sm font-bold text-white md:text-left">김영찬 공인중개사</p>
      <p className="mt-1 text-center text-xs font-semibold text-[#f9a8d4] md:text-left">
        충청권 부동산 · 전국 경매 권리분석
      </p>
    </div>
  );
}

/** 프로필 본문 — 소개·자격·서비스·연락처 */
export function ProfileIntroContent() {
  return (
    <main className="relative z-10 mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8 md:py-14">
      <section className="mb-14 grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-12">
        <TrustPortrait />
        <div>
          <p className="text-xs font-bold tracking-wide text-[#f9a8d4]">PROFILE</p>
          <h1 className="mt-2 font-[family-name:var(--font-unifine)] text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            김영찬 공인중개사
          </h1>
          <p className="mt-4 text-base font-semibold leading-relaxed text-[#fde68a] md:text-lg">
            “믿음과 실력을 기반으로, 고객님의 완벽한 부동산 파트너가 되겠습니다.”
          </p>
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/75">
            <p>
              안녕하세요. 충청남도 홍성군 내포신도시에 위치한 부동산 전문가, 공인중개사{" "}
              <strong className="text-white">김영찬</strong>입니다.
            </p>
            <p>
              저희 사무소는{" "}
              <strong className="text-white">
                충남 홍성, 예산, 서산, 당진, 천안, 아산, 세종, 대전
              </strong>{" "}
              등 충청지역 전역을 아우르며 토지·아파트·상가 등 다양한 부동산의 매매·임대 중개를
              전문으로 합니다.
            </p>
            <p>
              단순한 중개를 넘어,{" "}
              <strong className="text-white">전국 경매물건 권리분석</strong>과 안전하고 효율적인{" "}
              <strong className="text-white">입찰 대행·경매대리</strong>로 자산 가치를 극대화하는 데
              주력합니다.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/consultation"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-cta-from to-cta-to px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(147,51,234,0.35)] transition hover:brightness-110"
            >
              상담 예약하기
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionTitle>자격 및 전문성</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          {PROFILE_QUALIFICATIONS.map((q) => (
            <GlassCard key={q.title} className="p-5">
              <p className="text-xs font-bold text-[#f9a8d4]">{q.year}</p>
              <h3 className="mt-1 text-base font-bold text-white">{q.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{q.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionTitle>핵심 서비스</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {PROFILE_SERVICES.map((s) => (
            <GlassCard key={s.title} className="p-5 md:p-6">
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <ul className="mt-3 space-y-2">
                {s.points.map((p) => (
                  <li
                    key={p.slice(0, 20)}
                    className="flex gap-2 text-sm leading-relaxed text-white/70"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f472b6]" />
                    {p}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionTitle>저희만의 특별함</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          {PROFILE_STRENGTHS.map((s) => (
            <GlassCard key={s.title} className="p-5">
              <h3 className="text-sm font-bold text-[#fde68a]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{s.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section>
        <GlassCard className="p-5 md:p-7">
          <p className="text-sm leading-relaxed text-white/80">
            충청권 부동산에 대한 모든 것, 그리고 전국 경매 시장의 기회를 잡고 싶다면{" "}
            <strong className="text-white">김영찬 공인중개사</strong>와 상담하십시오. 정직과
            실력으로 성공적인 부동산 투자를 지원하겠습니다.
          </p>
          <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm text-white/70 sm:grid-cols-2">
            <p>
              <span className="font-bold text-white">주소</span>
              <br />
              충청남도 홍성군 내포신도시
            </p>
            <p>
              <span className="font-bold text-white">전화</span>
              <br />
              041-633-0000 · 010-0000-0000
            </p>
            <p>
              <span className="font-bold text-white">이메일</span>
              <br />
              kimdayn2@gmail.com
            </p>
            <p>
              <span className="font-bold text-white">상담 시간</span>
              <br />
              월–토 10:00–18:00 (예약 시 야간·주말 가능)
            </p>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
