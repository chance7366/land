"use client";

/**
 * 창문전단지 Type A/B/C 목업 — 보행 시인성 강화 (큰 타이포)
 * 운영 미적용 · docs/A4_FLYER_GENERATION_GUIDELINES.md Part II
 */

import type { ReactNode } from "react";
import {
  Bath,
  BedDouble,
  Car,
  Check,
  Layers,
  MapPin,
  Phone,
  Printer,
  Ruler,
  Trees,
} from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { OFFICE_PROFILE } from "@/lib/office-profile";
import {
  WINDOW_MOCK_AUCTION,
  WINDOW_MOCK_COMPLEX,
  WINDOW_MOCK_LEASE,
  WINDOW_MOCK_PROPERTY,
  type WindowMockAuction,
  type WindowMockProperty,
} from "@/lib/mockup/window-flyer-sample";

const FOOTER = {
  name: OFFICE_PROFILE.name || "찬스부동산 경매중개",
  broker: OFFICE_PROFILE.brokerName || "대표 공인중개사",
  regNo: OFFICE_PROFILE.regNo || "등록번호 확인 요망",
  phone: OFFICE_PROFILE.agentPhone || OFFICE_PROFILE.brokerPhone || "문의 요망",
  address: OFFICE_PROFILE.addressShort || "충남 홍성 · 내포신도시",
  cta: "매매 · 전세 · 월세 · 경매 상담",
};

function qrSrc(path: string) {
  const url = `https://landchance.vercel.app${path || "/"}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=0&data=${encodeURIComponent(url)}`;
}

function SpecIcon({
  name,
  className = "h-7 w-7",
}: {
  name: WindowMockProperty["specs"][0]["icon"];
  className?: string;
}) {
  switch (name) {
    case "bed":
      return <BedDouble className={className} strokeWidth={2.4} />;
    case "bath":
      return <Bath className={className} strokeWidth={2.4} />;
    case "car":
      return <Car className={className} strokeWidth={2.4} />;
    case "floor":
      return <Layers className={className} strokeWidth={2.4} />;
    case "garden":
      return <Trees className={className} strokeWidth={2.4} />;
    default:
      return <Ruler className={className} strokeWidth={2.4} />;
  }
}

function A4({
  children,
  className,
  flush,
}: {
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <article
      className={`window-flyer-a4 relative mx-auto box-border flex w-[210mm] max-w-full flex-col overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.18)] print:shadow-none ${className ?? ""}`}
      style={{
        height: "297mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        padding: flush ? 0 : "9mm 10mm 0",
      }}
    >
      {children}
    </article>
  );
}

/** Footer — 전화 크게 · 상호·등록은 보조 */
function FlyerFooter({
  publicPath,
  variant,
}: {
  publicPath: string;
  variant: "dark" | "navy" | "blue" | "teal";
}) {
  const styles = {
    dark: "bg-[#1c1917] text-white",
    navy: "bg-[#0f172a] text-white",
    blue: "bg-[#3b5bdb] text-white",
    teal: "bg-[#0f766e] text-white",
  }[variant];

  return (
    <footer className={`mt-auto flex h-[42mm] shrink-0 items-center gap-3.5 px-4 ${styles}`}>
      <div className="shrink-0 rounded-lg bg-white p-1.5 shadow">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrSrc(publicPath)} alt="QR" width={64} height={64} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-extrabold leading-tight">{FOOTER.name}</p>
        <p className="mt-0.5 truncate text-[12px] font-semibold opacity-80">
          대표 {FOOTER.broker} · {FOOTER.regNo}
        </p>
        <p className="mt-2 flex items-center gap-2 text-[26px] font-black tabular-nums leading-none tracking-tight">
          <Phone className="h-6 w-6 shrink-0 opacity-95" strokeWidth={2.5} />
          {FOOTER.phone}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 truncate text-[13px] font-semibold opacity-85">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {FOOTER.address}
        </p>
      </div>
    </footer>
  );
}

/* ═══════ Type A — OPEN HOUSE · 초대형 타이포 ═══════ */
function TypeAProperty({ data }: { data: WindowMockProperty }) {
  return (
    <A4 className="bg-[#f7f4ef]">
      <header className="border-b-[3px] border-[#1c1917] pb-2">
        <h2 className="font-serif text-[52px] font-black leading-[0.95] tracking-tight text-[#1c1917]">
          {data.headline}
        </h2>
        <p className="mt-2 text-[22px] font-bold leading-snug text-slate-700">{data.tagline}</p>
      </header>

      <ul className="mt-3 space-y-2">
        {data.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-[20px] font-bold text-[#1c1917]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1c1917] text-white">
              <Check className="h-4 w-4" strokeWidth={3.5} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <div className="relative mt-3 min-h-0 flex-1">
        <div
          className="absolute inset-0 overflow-hidden bg-slate-200"
          style={{ clipPath: "polygon(0 10%, 50% 0, 100% 10%, 100% 100%, 0 100%)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.images[0]} alt="" className="h-full w-full object-cover" />
        </div>
        {/* 가격 — 멀리서도 보이게 원형 확대 */}
        <div className="absolute right-1 top-4 z-10 flex h-[118px] w-[118px] flex-col items-center justify-center rounded-full bg-[#F5C518] text-center shadow-xl ring-4 ring-white">
          <p className="text-[12px] font-black tracking-wide text-[#5c4508]">{data.badge}</p>
          <p className="px-2 text-[20px] font-black leading-[1.05] text-[#1c1917]">{data.priceHuge}</p>
        </div>
      </div>

      <p className="mt-2 flex items-center gap-2 py-2 text-[20px] font-extrabold text-[#1c1917]">
        <MapPin className="h-5 w-5 shrink-0" strokeWidth={2.5} />
        {data.location}
      </p>
      <FlyerFooter publicPath={data.publicPath} variant="dark" />
    </A4>
  );
}

function TypeAAuction({ data }: { data: WindowMockAuction }) {
  return (
    <A4 className="bg-[#f7f4ef]">
      <header className="border-b-[3px] border-[#1c1917] pb-2">
        <p className="text-[18px] font-black tracking-[0.12em] text-[#c62828]">경매</p>
        <h2 className="font-serif text-[48px] font-black leading-[0.95] text-[#1c1917]">
          {data.headline}
        </h2>
        <p className="mt-1 text-[18px] font-bold text-slate-600">{data.courtCase}</p>
      </header>
      <ul className="mt-3 space-y-2">
        {data.bullets.slice(0, 2).map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-[20px] font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1c1917] text-white">
              <Check className="h-4 w-4" strokeWidth={3.5} />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div className="relative mt-3 min-h-0 flex-1">
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: "polygon(0 10%, 50% 0, 100% 10%, 100% 100%, 0 100%)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.images[0]} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute right-1 top-4 z-10 flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full bg-[#F5C518] shadow-xl ring-4 ring-white">
          <p className="text-[13px] font-black text-[#5c4508]">할인</p>
          <p className="text-[36px] font-black leading-none text-[#1c1917]">{data.discountPct}</p>
        </div>
      </div>
      <div className="py-2">
        <p className="text-[16px] font-bold text-slate-500">감정 {data.appraisal} → 최저</p>
        <p className="text-[44px] font-black leading-none tracking-tight text-[#c62828]">
          {data.minPrice}
        </p>
        <p className="mt-1 text-[18px] font-extrabold">{data.saleDateShort}</p>
      </div>
      <FlyerFooter publicPath={data.publicPath} variant="dark" />
    </A4>
  );
}

/* ═══════ Type B — JUST LISTED · 초대형 블록 타이포 ═══════ */
function TypeBProperty({ data }: { data: WindowMockProperty }) {
  return (
    <A4 className="bg-white" flush>
      <div className="relative h-[38%] shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.images[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>

      <div className="relative z-10 -mt-10 flex shrink-0 gap-2 px-3">
        <div className="w-[52%] overflow-hidden rounded-2xl shadow-xl">
          <div className="bg-[#0d9488] px-3 py-4">
            <p className="text-[28px] font-black leading-[1.05] tracking-tight text-white">
              {data.headline}
            </p>
            <p className="mt-1 text-[16px] font-bold text-teal-50">{data.location}</p>
          </div>
          <div className="bg-[#E8B84A] px-3 py-4">
            <p className="text-[14px] font-black text-[#5c4508]">{data.badge}</p>
            <p className="text-[32px] font-black leading-[1.05] tracking-tight text-[#1c1917]">
              {data.priceHuge}
            </p>
            {data.priceNote ? (
              <p className="mt-1 text-[14px] font-bold text-[#5c4508]">{data.priceNote}</p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center rounded-2xl bg-[#0f172a] px-3 py-3 text-white shadow-xl">
          <p className="text-center text-[14px] font-black tracking-[0.15em] text-[#E8B84A]">
            FEATURES
          </p>
          <ul className="mt-2 space-y-1.5">
            {data.bullets.slice(0, 4).map((b) => (
              <li key={b} className="text-[17px] font-bold leading-snug">
                · {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col px-4">
        <div className="grid grid-cols-4 gap-2">
          {data.specs.slice(0, 4).map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-100 py-3 text-[#0f172a]"
            >
              <SpecIcon name={s.icon} className="h-8 w-8" />
              <span className="text-center text-[14px] font-extrabold leading-tight">{s.label}</span>
            </div>
          ))}
        </div>
        <FlyerFooter publicPath={data.publicPath} variant="teal" />
      </div>
    </A4>
  );
}

function TypeBAuction({ data }: { data: WindowMockAuction }) {
  return (
    <A4 className="bg-white" flush>
      <div className="relative h-[36%] shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.images[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="relative z-10 -mt-10 flex shrink-0 gap-2 px-3">
        <div className="w-[55%] overflow-hidden rounded-2xl shadow-xl">
          <div className="bg-[#0d9488] px-3 py-4">
            <p className="text-[22px] font-black text-white">{data.badge}</p>
            <p className="mt-1 text-[26px] font-black leading-tight text-white">{data.headline}</p>
          </div>
          <div className="bg-[#E8B84A] px-3 py-4">
            <p className="text-[14px] font-black text-[#5c4508]">최저가</p>
            <p className="text-[34px] font-black leading-none text-[#1c1917]">{data.minPrice}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-[#c62828] px-2 py-4 text-white shadow-xl">
          <p className="text-[16px] font-black">할인율</p>
          <p className="text-[52px] font-black leading-none">{data.discountPct}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-1 flex-col px-4">
        <p className="text-[18px] font-bold text-slate-600">{data.courtCase}</p>
        <p className="mt-1 text-[20px] font-extrabold text-slate-800">
          감정 {data.appraisal} → 최저 {data.minPrice}
        </p>
        <p className="mt-1 text-[18px] font-bold text-[#c62828]">{data.saleDateShort}</p>
        <FlyerFooter publicPath={data.publicPath} variant="navy" />
      </div>
    </A4>
  );
}

/* ═══════ Type C — 매매·전세 · 초대형 헤드·가격 ═══════ */
function TypeCProperty({ data }: { data: WindowMockProperty }) {
  return (
    <A4 className="bg-[#e8ebef]" flush>
      <div className="flex items-center justify-between bg-[#3b5bdb] px-4 py-3 text-white">
        <div>
          <p className="text-[18px] font-black">{FOOTER.name}</p>
          <p className="text-[13px] font-semibold opacity-90">{FOOTER.cta}</p>
        </div>
        <p className="text-[24px] font-black tabular-nums">{FOOTER.phone}</p>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4">
        <h2 className="text-center text-[48px] font-black leading-[1.05] tracking-tight text-[#c62828]">
          {data.badge}
        </h2>
        <p className="mx-auto mt-2 max-w-[95%] rounded-full bg-[#1e293b] px-4 py-1.5 text-center text-[18px] font-extrabold text-white">
          {data.emotionalLine}
        </p>
        <p className="mt-2 text-center text-[16px] font-bold text-slate-600">{data.tagline}</p>

        <div className="mt-3 grid h-[48mm] grid-cols-2 gap-2">
          {data.images.slice(0, 2).map((src) => (
            <div key={src} className="relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-2.5">
          {(data.priceRows ?? []).slice(0, 3).map((row, i) => (
            <div
              key={`${row.tab}-${i}`}
              className="rounded-2xl bg-white px-3.5 py-3 shadow-sm ring-1 ring-black/5"
            >
              <span className="rounded-md bg-[#1e293b] px-2.5 py-0.5 text-[14px] font-black text-white">
                {row.tab}
              </span>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="max-w-[42%] shrink-0 text-[15px] font-bold leading-snug text-slate-600">
                  {row.area}
                </span>
                <span className="min-w-[12px] flex-1 border-b-2 border-dotted border-slate-300" />
                <span className="shrink-0 text-[26px] font-black tabular-nums text-[#c62828]">
                  {row.price}
                </span>
              </div>
              {row.note ? (
                <p className="mt-1 text-[14px] font-bold text-slate-500">* {row.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <FlyerFooter publicPath={data.publicPath} variant="blue" />
    </A4>
  );
}

function TypeCAuction({ data }: { data: WindowMockAuction }) {
  return (
    <A4 className="bg-[#f1f3f5]" flush>
      <div className="bg-[#1e293b] px-4 py-2 text-right text-[14px] font-bold text-white">
        공고 {data.noticeNo}
      </div>
      <div className="flex flex-1 flex-col px-4 pt-3">
        <h2 className="text-center text-[56px] font-black leading-none text-[#c62828]">경매</h2>
        <p className="mx-auto mt-2 rounded-full bg-[#1e293b] px-5 py-1.5 text-[20px] font-extrabold text-white">
          {data.headline}
        </p>
        <p className="mt-2 text-center text-[16px] font-bold text-slate-600">{data.courtCase}</p>

        <div className="mt-3 grid h-[44mm] grid-cols-2 gap-2">
          {data.images.slice(0, 2).map((src) => (
            <div key={src} className="relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-2.5">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 ring-1 ring-black/5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-600 text-[15px] font-black text-white">
              감정
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[16px] font-bold text-slate-500">감정가</span>
                <span className="flex-1 border-b-2 border-dotted border-slate-300" />
                <span className="text-[24px] font-bold text-slate-400 line-through">
                  {data.appraisal}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 ring-1 ring-black/5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#c62828] text-[15px] font-black text-white">
              최저
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[16px] font-extrabold text-slate-700">{data.saleDateShort}</span>
                <span className="flex-1 border-b-2 border-dotted border-slate-300" />
                <span className="text-[32px] font-black text-[#c62828]">{data.minPrice}</span>
              </div>
              <p className="mt-1 text-[22px] font-black text-[#c62828]">할인 {data.discountPct} ↓</p>
            </div>
          </div>
        </div>
      </div>
      <FlyerFooter publicPath={data.publicPath} variant="navy" />
    </A4>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-center text-[11px] font-bold tracking-wide text-slate-700 print:hidden">
      {children}
    </p>
  );
}

export function WindowFlyerSample() {
  return (
    <div className="min-h-screen bg-[#c8c4bc] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-800 print:bg-white">
      <div className="mx-auto max-w-[1100px] px-4 py-6 print:hidden">
        <div className="mb-4 rounded-2xl border border-amber-400/40 bg-[#1a1205] px-4 py-3 text-amber-50">
          <p className="text-sm font-bold">창문전단지 레퍼런스 · 운영 적용됨 (Type A/B/C)</p>
          <p className="mt-1 text-[12px] leading-relaxed text-amber-100/85">
            관리자 「창문전단지」와 동일 디자인 계열. 유형·가격·전화{" "}
            <strong className="text-amber-200">초대형</strong> · Footer 완전 채움.
          </p>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"
          >
            <Printer className="h-3.5 w-3.5" />
            인쇄 / PDF 저장
          </button>
          <Link
            href="/mockup/a4-flyer"
            className="rounded-lg border border-white/50 bg-white/80 px-3 py-2 text-xs font-semibold"
          >
            광고전단지 →
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-12 px-2 pb-16 print:gap-0 print:p-0">
        <section className="w-full print:break-after-page">
          <SectionLabel>매물 · Type A (OPEN HOUSE · 가격 원형 확대)</SectionLabel>
          <TypeAProperty data={WINDOW_MOCK_PROPERTY} />
        </section>
        <section className="w-full print:break-after-page">
          <SectionLabel>매물 · Type B (JUST LISTED · 블록 타이포 확대)</SectionLabel>
          <TypeBProperty data={WINDOW_MOCK_LEASE} />
        </section>
        <section className="w-full print:break-after-page">
          <SectionLabel>매물 · Type C (매매·전세 헤드·가격 확대)</SectionLabel>
          <TypeCProperty data={WINDOW_MOCK_COMPLEX} />
        </section>
        <section className="w-full print:break-after-page">
          <SectionLabel>경매 · Type A (할인율·최저가 확대)</SectionLabel>
          <TypeAAuction data={WINDOW_MOCK_AUCTION} />
        </section>
        <section className="w-full print:break-after-page">
          <SectionLabel>경매 · Type B</SectionLabel>
          <TypeBAuction data={WINDOW_MOCK_AUCTION} />
        </section>
        <section className="w-full">
          <SectionLabel>경매 · Type C</SectionLabel>
          <TypeCAuction data={WINDOW_MOCK_AUCTION} />
        </section>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .window-flyer-a4 {
            box-shadow: none !important;
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>
    </div>
  );
}
