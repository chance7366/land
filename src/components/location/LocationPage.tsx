"use client";

import { useState } from "react";
import {
  Bus,
  Car,
  Clock,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  ParkingSquare,
  Phone,
  CalendarDays,
} from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  LOCATION_DRIVE_TIPS,
  LOCATION_IMAGES,
  LOCATION_INFO,
  LOCATION_TRANSIT_TIPS,
  kakaoMapDirectionsUrl,
  naverMapDirectionsUrl,
} from "@/lib/location";

type TransitTab = "drive" | "transit";

export function LocationPage() {
  const [tab, setTab] = useState<TransitTab>("drive");
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(LOCATION_INFO.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("주소를 복사하세요", LOCATION_INFO.address);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-container-padding-mobile py-10 font-[family-name:var(--font-unifine),Outfit,sans-serif] md:px-8 md:py-14">
      <header className="mb-6">
        <p className="text-xs font-bold tracking-[0.18em] text-sky-300/80">LOCATION</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">
          찬스부동산 찾아오시는 길
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">{LOCATION_INFO.intro}</p>
      </header>

      <GlassCard className="overflow-hidden p-0">
        <div className="relative h-[300px] w-full bg-black/40 md:h-auto md:aspect-[21/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOCATION_IMAGES.map}
            alt={`${LOCATION_INFO.name} 위치 안내`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/85 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="rounded-xl border border-white/15 bg-black/55 px-3 py-2 backdrop-blur-md">
              <p className="inline-flex items-center gap-1.5 text-sm font-bold text-white">
                <MapPin className="h-4 w-4 text-sky-300" />
                {LOCATION_INFO.name}
              </p>
              <p className="mt-0.5 text-xs text-white/60">{LOCATION_INFO.addressShort}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-white/10 p-4">
          <a
            href={kakaoMapDirectionsUrl(LOCATION_INFO.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#FEE500]/40 bg-[#FEE500]/15 px-3 py-2 text-xs font-bold text-[#FEE500] hover:bg-[#FEE500]/25"
          >
            카카오맵으로 길찾기
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={naverMapDirectionsUrl(LOCATION_INFO.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25"
          >
            네이버 지도로 길찾기
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={() => void copyAddress()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "복사됨" : "주소 복사하기"}
          </button>
        </div>
      </GlassCard>

      <KakaoMapEnvNote className="mt-3" />

      <div className="mt-6 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <GlassCard className="overflow-hidden p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOCATION_IMAGES.office}
            alt="사무소 주변 전경"
            className="aspect-[16/9] h-full w-full object-cover md:aspect-auto md:min-h-[220px]"
          />
        </GlassCard>
        <GlassCard className="overflow-hidden p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOCATION_IMAGES.parking}
            alt="지하주차장"
            className="aspect-[4/3] h-full w-full object-cover md:aspect-auto md:min-h-[220px]"
          />
          <p className="border-t border-white/10 px-3 py-2 text-[11px] text-white/50">
            건물 내 지하주차장 무료 주차
          </p>
        </GlassCard>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-white">주소 · 연락처 · 안내</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<MapPin className="h-4 w-4 text-sky-300" />}
            label="주소"
            value={LOCATION_INFO.address}
          />
          <InfoCard
            icon={<Phone className="h-4 w-4 text-sky-300" />}
            label="연락처"
            value={
              <>
                <span className="block">대표 {LOCATION_INFO.phoneMain}</span>
                <span className="block">직통 {LOCATION_INFO.phoneDirect}</span>
              </>
            }
            action={
              <a
                href={`tel:${LOCATION_INFO.phoneDirect.replace(/-/g, "")}`}
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#4dabff] to-[#38bdf8] px-3 py-1.5 text-[11px] font-bold text-white"
              >
                <Phone className="h-3 w-3" />
                전화 걸기
              </a>
            }
          />
          <InfoCard
            icon={<Clock className="h-4 w-4 text-sky-300" />}
            label="운영시간"
            value={
              <>
                <span className="block">{LOCATION_INFO.hours}</span>
                <span className="mt-1 block text-[11px] font-normal text-white/50">
                  {LOCATION_INFO.hoursNote}
                </span>
              </>
            }
          />
          <InfoCard
            icon={<ParkingSquare className="h-4 w-4 text-sky-300" />}
            label="주차"
            value={LOCATION_INFO.parking}
          />
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-bold text-white">교통편 안내</h2>
          <div className="flex gap-1.5 rounded-full border border-white/10 bg-black/30 p-1">
            <TabButton active={tab === "drive"} onClick={() => setTab("drive")} icon={<Car className="h-3.5 w-3.5" />}>
              자가용
            </TabButton>
            <TabButton
              active={tab === "transit"}
              onClick={() => setTab("transit")}
              icon={<Bus className="h-3.5 w-3.5" />}
            >
              대중교통
            </TabButton>
          </div>
        </div>

        <GlassCard className="mt-4 p-5 md:p-6">
          {tab === "drive" ? (
            <ul className="space-y-4">
              {LOCATION_DRIVE_TIPS.map((tip) => (
                <li key={tip.title} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-bold text-sky-200">{tip.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{tip.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-4">
              {LOCATION_TRANSIT_TIPS.map((tip) => (
                <li key={tip.title} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-bold text-sky-200">{tip.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{tip.body}</p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </section>

      <GlassCard className="relative mt-10 overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
          <div className="hr-aurora-layer hr-aurora-sapphire absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-xl font-extrabold text-white">방문 전 예약 안내</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            권리분석 및 경매대리 1:1 깊이 있는 상담을 위해 방문 전 전화 또는 찬스상담소 게시판을 통해
            미리 예약해 주시면 더욱 상세하게 준비해 드리겠습니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/consultation"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2.5 text-sm font-bold text-white"
            >
              <CalendarDays className="h-4 w-4" />
              상담 예약하기
            </Link>
            <a
              href={`tel:${LOCATION_INFO.phoneDirect.replace(/-/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4" />
              전화 연결
            </a>
            <Link
              href="/legal"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#34d399]/40 bg-[#34d399]/10 px-4 py-2.5 text-sm font-bold text-[#6ee7b7]"
            >
              찬스상담소 바로가기
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-white/50">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold leading-relaxed text-white/90">{value}</div>
      {action}
    </GlassCard>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
        active ? "bg-sky-500/25 text-sky-100" : "text-white/50 hover:text-white"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function KakaoMapEnvNote({ className = "" }: { className?: string }) {
  return (
    <details
      className={`rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/55 ${className}`}
    >
      <summary className="cursor-pointer font-semibold text-white/70">
        카카오맵 SDK 연동 (선택) · 현재는 길찾기 링크 + 위치 이미지
      </summary>
      <div className="mt-3 space-y-2 font-mono text-[11px] leading-relaxed text-white/50">
        <p>
          1){" "}
          <a
            href="https://developers.kakao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-300 hover:underline"
          >
            Kakao Developers
          </a>
          에서 JavaScript 키 발급
        </p>
        <p>
          2) <code className="text-sky-200/90">.env</code> 에 등록:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-[11px] text-sky-100/80">{`NEXT_PUBLIC_KAKAO_MAP_KEY=발급받은_JavaScript_키`}</pre>
        <p>
          3) SDK 로드 후 마커·센터 좌표 ({LOCATION_INFO.lat}, {LOCATION_INFO.lng}) 표시
        </p>
        <p className="font-sans text-white/45">
          네이버 지도 API를 쓸 경우{" "}
          <code className="text-sky-200/90">NEXT_PUBLIC_NAVER_MAP_CLIENT_ID</code> 를 사용합니다.
        </p>
      </div>
    </details>
  );
}
