"use client";

import { OFFICE_PROFILE } from "@/lib/office-profile";
import { flyerQrSrc } from "@/lib/flyer/site-url";
import type { FlyerKind, FlyerViewModel } from "@/lib/flyer/types";

const FLYER_PAD = "16mm 13.5mm 12mm";

const PALETTE: Record<FlyerKind, { primary: string; accent: string; soft: string }> = {
  SALE: { primary: "#1E3A8A", accent: "#EA580C", soft: "#EFF6FF" },
  LEASE: { primary: "#065F46", accent: "#0D9488", soft: "#ECFDF5" },
  AUCTION: { primary: "#0F172A", accent: "#D97706", soft: "#FFFBEB" },
};

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

function PhotoRow({ images }: { images: string[] }) {
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
            <div className="flex h-full items-center justify-center p-1 text-center text-[11px] text-slate-400">
              {i === 0 ? "사진 없음" : "—"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LegalFooter({
  kind,
  disclaimer,
}: {
  kind: FlyerKind;
  disclaimer?: string;
}) {
  const primary = PALETTE[kind].primary;
  const bidNo = OFFICE_PROFILE.bidAgentRegNo?.trim() || "(등록번호 확인 후 표기)";
  const lines: [string, string][] =
    kind === "AUCTION"
      ? [
          ["상호", OFFICE_PROFILE.name],
          ["대표", OFFICE_PROFILE.brokerName],
          ["사무소등록", OFFICE_PROFILE.regNo],
          ["매수신청대리", bidNo],
          ["소재지", OFFICE_PROFILE.addressShort],
          ["전화", `${OFFICE_PROFILE.brokerPhone} / ${OFFICE_PROFILE.agentPhone}`],
        ]
      : [
          ["상호", OFFICE_PROFILE.nameFull],
          ["대표", OFFICE_PROFILE.brokerName],
          ["등록번호", OFFICE_PROFILE.regNo],
          ["소재지", OFFICE_PROFILE.addressShort],
          ["전화", OFFICE_PROFILE.brokerPhone],
          ["상담", OFFICE_PROFILE.agentPhone],
        ];

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
        <p className="mt-1.5 border-t border-white/20 pt-1 text-[7.5px] text-amber-200/95">
          {disclaimer}
        </p>
      ) : null}
    </footer>
  );
}

export function FlyerSheet({
  data,
  id = "flyer-sheet",
}: {
  data: FlyerViewModel;
  id?: string;
}) {
  const pal = PALETTE[data.kind];
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
      <header
        className="mb-2 shrink-0 rounded-md px-3 py-2.5 text-white"
        style={{
          background:
            data.kind === "AUCTION"
              ? `linear-gradient(135deg, ${pal.primary}, #1e293b)`
              : `linear-gradient(135deg, ${pal.primary}, ${pal.primary}dd)`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span
              className="mb-1.5 inline-block rounded px-2.5 py-1 text-[18px] font-extrabold leading-none tracking-wide text-white"
              style={{ background: pal.accent }}
            >
              {data.badge}
            </span>
            <h2 className="text-[16px] font-extrabold leading-snug tracking-tight sm:text-[17px]">
              {data.title}
            </h2>
            {data.subtitle ? (
              <p className="mt-1 text-[12.5px] font-medium text-white/90">{data.subtitle}</p>
            ) : null}
            {data.metaLine ? (
              <p className="mt-1 text-[12.5px] font-semibold text-amber-200">{data.metaLine}</p>
            ) : null}
            <p
              className="mt-1.5 text-[16px] font-extrabold"
              style={{ color: data.kind === "AUCTION" ? "#FCD34D" : "#FDBA74" }}
            >
              {data.priceLine}
            </p>
          </div>
          <div className="shrink-0 rounded bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={flyerQrSrc(data.publicPath)} alt="QR" width={68} height={68} />
            <p className="mt-0.5 text-center text-[8px] font-semibold text-slate-500">상세보기</p>
          </div>
        </div>
      </header>

      <PhotoRow images={data.images} />

      <section className="mt-2 shrink-0">
        <h3
          className="mb-1.5 text-[14px] font-extrabold"
          style={{ color: data.kind === "AUCTION" ? "#0F172A" : pal.primary }}
        >
          핵심 정보
        </h3>
        <SpecTable pairs={data.specs} />
      </section>

      <section className="mt-2 shrink-0 rounded-md px-2.5 py-2" style={{ background: pal.soft }}>
        <h3
          className="mb-1 text-[14px] font-extrabold"
          style={{ color: data.kind === "AUCTION" ? "#0F172A" : pal.primary }}
        >
          {data.insightTitle}
        </h3>
        <p className="line-clamp-3 text-[12.5px] font-medium leading-snug text-slate-800">
          {data.insight}
        </p>
      </section>

      <div className="mt-auto pt-2">
        <LegalFooter kind={data.kind} disclaimer={data.footerDisclaimer} />
      </div>
    </article>
  );
}
