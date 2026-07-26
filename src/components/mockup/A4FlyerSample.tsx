"use client";

import type { ReactNode } from "react";
import { Printer } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { OFFICE_PROFILE } from "@/lib/office-profile";
import {
  FLYER_PALETTE,
  FLYER_SAMPLE_AUCTION,
  FLYER_SAMPLE_PROPERTY,
  type FlyerSampleAuction,
  type FlyerSampleProperty,
} from "@/lib/mockup/a4-flyer-sample";

/** 지침: top 16mm · L/R 13.5mm · bottom 12mm */
const FLYER_PAD = "16mm 13.5mm 12mm";

function qrSrc(path: string) {
  const url = `https://landchance.vercel.app${path}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=96x96&margin=0&data=${encodeURIComponent(url)}`;
}

function SpecTable({ pairs }: { pairs: [string, string][] }) {
  return (
    <div className="grid w-full shrink-0 grid-cols-2 gap-px overflow-hidden rounded-md border border-black/10 bg-black/10">
      {pairs.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[92px_1fr] bg-white text-[12.5px] leading-snug">
          <div className="bg-slate-100 px-2 py-1.5 font-bold text-slate-700">{k}</div>
          <div className="break-words px-2 py-1.5 font-medium text-slate-900">{v}</div>
        </div>
      ))}
    </div>
  );
}

/** 1행 × 3장 정사각형 */
function PhotoRow({ images, emptyHint }: { images: string[]; emptyHint: string }) {
  const three = [0, 1, 2].map((i) => images[i] ?? null);
  return (
    <div className="grid w-full shrink-0 grid-cols-3 gap-1.5">
      {three.map((src, i) => (
        <div
          key={i}
          className="relative aspect-square max-h-[52mm] overflow-hidden rounded-sm border border-slate-200 bg-slate-100"
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center p-1 text-center text-[11px] leading-tight text-slate-400">
              {i === 0 ? emptyHint : "사진 없음"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LegalFooter({
  primary,
  lines,
  disclaimer,
}: {
  primary: string;
  lines: [string, string][];
  disclaimer?: string;
}) {
  return (
    <footer
      className="mt-2 shrink-0 rounded-md px-2.5 py-2 text-[8px] leading-snug text-white"
      style={{ background: primary }}
    >
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {lines.map(([label, value]) => (
          <p key={label} className="min-w-0">
            <span className="opacity-75">{label} </span>
            <span className="font-semibold opacity-95">{value}</span>
          </p>
        ))}
      </div>
      {disclaimer ? (
        <p className="mt-1.5 border-t border-white/20 pt-1 text-[7.5px] text-amber-200/95 col-span-2">
          {disclaimer}
        </p>
      ) : null}
    </footer>
  );
}

function A4Shell({ children, id }: { children: ReactNode; id: string }) {
  return (
    <article
      id={id}
      className="flyer-a4 relative mx-auto box-border flex w-[210mm] max-w-full flex-col bg-white text-slate-900 shadow-[0_12px_40px_rgba(0,0,0,0.18)] print:shadow-none"
      style={{
        height: "297mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        padding: FLYER_PAD,
        overflow: "hidden",
      }}
    >
      {children}
    </article>
  );
}

function PropertyFlyer({ data }: { data: FlyerSampleProperty }) {
  const pal = FLYER_PALETTE[data.kind];
  return (
    <A4Shell id="flyer-property">
      <header
        className="mb-2 shrink-0 rounded-md px-3 py-2.5 text-white"
        style={{ background: `linear-gradient(135deg, ${pal.primary}, ${pal.primary}dd)` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span
              className="mb-1.5 inline-block rounded px-2.5 py-1 text-[18px] font-extrabold leading-none tracking-wide"
              style={{ background: pal.accent }}
            >
              {data.dealLabel}
            </span>
            <h2 className="text-[17px] font-extrabold leading-snug tracking-tight">{data.title}</h2>
            <p className="mt-1 text-[12.5px] font-medium text-white/90">{data.subtitle}</p>
            <p className="mt-1.5 text-[16px] font-extrabold" style={{ color: "#FDBA74" }}>
              {data.priceLine}
            </p>
          </div>
          <div className="shrink-0 rounded bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc(data.publicPath)} alt="QR" width={68} height={68} />
            <p className="mt-0.5 text-center text-[8px] font-semibold text-slate-500">상세보기</p>
          </div>
        </div>
      </header>

      <PhotoRow images={data.images} emptyHint="등록 사진 없음" />

      <section className="mt-2 shrink-0">
        <h3 className="mb-1.5 text-[14px] font-extrabold" style={{ color: pal.primary }}>
          핵심 정보
        </h3>
        <SpecTable
          pairs={[
            ["소재지", data.address],
            ["종류", data.categoryLabel],
            ["전용면적", data.exclusiveArea],
            ["공급면적", data.supplyOrContractArea],
            ["층수", data.floorLine],
            ["방/욕실", data.roomsBaths],
            ["방향", data.direction],
            ["사용승인", data.approvalDate],
            ["주차", data.parking],
            ["입주", data.moveIn],
            ["관리비", data.maintenance],
            ["위반건축물", data.illegalBuilding],
          ]}
        />
      </section>

      <section
        className="mt-2 shrink-0 rounded-md px-2.5 py-2"
        style={{ background: pal.soft }}
      >
        <h3 className="mb-1 text-[14px] font-extrabold" style={{ color: pal.primary }}>
          특장점 · 입지
        </h3>
        <p className="line-clamp-3 text-[12.5px] font-medium leading-snug text-slate-800">
          {data.insight}
        </p>
      </section>

      <div className="mt-auto pt-2">
        <LegalFooter
          primary={pal.primary}
          lines={[
            ["상호", OFFICE_PROFILE.nameFull],
            ["대표", OFFICE_PROFILE.brokerName],
            ["등록번호", OFFICE_PROFILE.regNo],
            ["소재지", OFFICE_PROFILE.addressShort],
            ["전화", OFFICE_PROFILE.brokerPhone],
            ["상담", OFFICE_PROFILE.agentPhone],
          ]}
        />
      </div>
    </A4Shell>
  );
}

function AuctionFlyer({ data }: { data: FlyerSampleAuction }) {
  const pal = FLYER_PALETTE.AUCTION;
  return (
    <A4Shell id="flyer-auction">
      <header
        className="mb-2 shrink-0 rounded-md px-3 py-2.5 text-white"
        style={{ background: `linear-gradient(135deg, ${pal.primary}, #1e293b)` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span
              className="mb-1.5 inline-block rounded px-2.5 py-1 text-[18px] font-extrabold leading-none tracking-wide text-white"
              style={{ background: pal.accent }}
            >
              법원 경매
            </span>
            <h2 className="text-[16px] font-extrabold leading-snug tracking-tight">{data.title}</h2>
            <p className="mt-1 text-[12.5px] font-medium text-white/90">{data.subtitle}</p>
            <p className="mt-1 text-[12.5px] font-semibold text-amber-200">
              {data.court} · {data.caseNumber} · 물건 {data.itemNo}
            </p>
            <p className="mt-1.5 text-[16px] font-extrabold text-amber-300">
              최저 {data.minPrice}{" "}
              <span className="text-[12px] font-bold text-amber-100/90">({data.discountLabel})</span>
            </p>
          </div>
          <div className="shrink-0 rounded bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc(data.publicPath)} alt="QR" width={68} height={68} />
            <p className="mt-0.5 text-center text-[8px] font-semibold text-slate-500">상세보기</p>
          </div>
        </div>
      </header>

      <PhotoRow images={data.images} emptyHint="경매 사진 없음" />

      <section className="mt-2 shrink-0">
        <h3 className="mb-1.5 text-[14px] font-extrabold text-slate-900">핵심 정보</h3>
        <SpecTable
          pairs={[
            ["관할법원", data.court],
            ["사건번호", data.caseNumber],
            ["물건번호", data.itemNo],
            ["소재지", data.address],
            ["용도", data.usage],
            ["면적", data.areaLine],
            ["감정평가액", data.appraisal],
            ["최저매각가격", data.minPrice],
            ["입찰보증금", data.bidDeposit],
            ["매각기일", data.saleDate],
            ["권리요약", data.rightsSummary],
            ["비고", "법원 공부 변동 가능"],
          ]}
        />
      </section>

      <section className="mt-2 shrink-0 rounded-md px-2.5 py-2" style={{ background: pal.soft }}>
        <h3 className="mb-1 text-[14px] font-extrabold text-slate-900">전문가 포인트</h3>
        <p className="line-clamp-3 text-[12.5px] font-medium leading-snug text-slate-800">
          {data.insight}
        </p>
      </section>

      <div className="mt-auto pt-2">
        <LegalFooter
          primary="#0F172A"
          lines={[
            ["상호", OFFICE_PROFILE.name],
            ["대표", OFFICE_PROFILE.brokerName],
            ["사무소등록", OFFICE_PROFILE.regNo],
            ["매수신청대리", "(프로필 확정 후 표기)"],
            ["소재지", OFFICE_PROFILE.addressShort],
            ["전화", `${OFFICE_PROFILE.brokerPhone} / ${OFFICE_PROFILE.agentPhone}`],
          ]}
          disclaimer="※ 본 자료는 참고용이며 법원 공부 변동에 따라 매각 조건이 달라질 수 있습니다."
        />
      </div>
    </A4Shell>
  );
}

export function A4FlyerSample() {
  return (
    <div className="min-h-screen bg-[#D8D4CE] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-800 print:bg-white">
      <div className="mx-auto max-w-[1100px] px-4 py-6 print:hidden">
        <div className="mb-4 rounded-2xl border border-amber-500/40 bg-[#1a1408] px-4 py-3 text-amber-50">
          <p className="text-sm font-bold">A4 전단지 미리보기 · 목업 (운영 미적용)</p>
          <p className="mt-1 text-[11px] text-amber-100/80">
            시니어 가독성 · 뱃지×2 · 핵심정보·Insight 확대 · Footer 2열 · 지침{" "}
            <code className="text-amber-200">docs/A4_FLYER_GENERATION_GUIDELINES.md</code>
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
            href="/mockup/a4-flyer/admin-ux"
            className="rounded-lg border border-orange-400/50 bg-orange-500/15 px-3 py-2 text-xs font-semibold text-orange-950"
          >
            버튼 위치 · 보기 UX 목업 →
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-10 px-2 pb-16 print:gap-0 print:p-0">
        <section className="w-full print:break-after-page">
          <p className="mb-2 text-center text-[11px] font-semibold text-slate-600 print:hidden">
            {FLYER_SAMPLE_PROPERTY.sourceLabel} · {FLYER_SAMPLE_PROPERTY.title}
          </p>
          <PropertyFlyer data={FLYER_SAMPLE_PROPERTY} />
        </section>
        <section className="w-full">
          <p className="mb-2 text-center text-[11px] font-semibold text-slate-600 print:hidden">
            {FLYER_SAMPLE_AUCTION.sourceLabel} · {FLYER_SAMPLE_AUCTION.caseNumber}
          </p>
          <AuctionFlyer data={FLYER_SAMPLE_AUCTION} />
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
          .flyer-a4 {
            box-shadow: none !important;
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>
    </div>
  );
}
