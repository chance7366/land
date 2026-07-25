"use client";

/**
 * 사용자 매물 상세 재구성 목업
 * — 경매 상세와 유사: 히어로 + §1~3
 * — 운영 적용: /properties/[id]
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, MessageSquare, Phone } from "lucide-react";
import { PropertyKvTable } from "@/components/property/PropertyKvTable";
import { getPropertyDetailSample } from "@/lib/mockup/property-detail-sample";

const OFFICE_TEL = "041-633-0000";
const heroPanel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={`${heroPanel} p-4 md:p-5`}>
      <h3 className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2 text-sm font-bold text-white">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#a78bfa]/20 text-[10px] text-[#ddd6fe]">
          {n}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function PropertyDetailRedesignSample() {
  const params = useSearchParams();
  const sample = getPropertyDetailSample(params.get("id"));

  return (
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="border-b border-emerald-400/30 bg-[#0a1210] px-4 py-3 text-center text-xs text-emerald-100/90">
        <p className="font-bold text-emerald-50">매물 상세 재구성 목업 — 운영 적용됨</p>
        <p className="mt-1 text-[11px] text-emerald-100/70">
          실제 페이지: /properties/[id] · §1~3 · 2·3·4열 KV
        </p>
      </div>

      <div className="relative overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1400px] space-y-3 px-4 py-5 md:px-6">
          <Link
            href="/mockup/property-list-redesign"
            className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#c4b5fd] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            목록 목업으로
          </Link>

          <div className={`${heroPanel} overflow-hidden p-0`}>
            <div className="relative flex h-[180px] w-full items-center justify-center bg-[#0a0a12] sm:h-[220px] md:h-[260px]">
              {sample.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sample.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-5xl text-white/20">home</span>
              )}
            </div>

            <div className="space-y-3 p-4 md:p-5">
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full border border-[#facc15]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#facc15]">
                  {sample.category}
                </span>
                <span className="rounded-full border border-pink-400/40 px-2.5 py-0.5 text-[11px] font-bold text-pink-400">
                  {sample.dealSubType || sample.dealType}
                </span>
                {sample.featured ? (
                  <span className="rounded-full border border-[#a78bfa]/40 bg-[#a78bfa]/12 px-2.5 py-0.5 text-[11px] font-bold text-[#ddd6fe]">
                    추천
                  </span>
                ) : null}
                {sample.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#a78bfa]/40 bg-[#a78bfa]/12 px-2.5 py-0.5 text-[11px] font-bold text-[#ddd6fe]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
                  {sample.title}
                </h2>
                <p className="mt-1 text-sm text-[#c4b5fd]/75">{sample.featureSummary}</p>
                <p className="mt-1 text-xs text-white/45">{sample.address}</p>
              </div>

              <div>
                <p className="text-2xl font-extrabold text-[#fbbf24] md:text-[1.65rem]">
                  {sample.priceLabel}
                </p>
                {sample.priceSub ? (
                  <p className="mt-0.5 text-sm font-semibold text-white/55">{sample.priceSub}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2.5 text-sm font-bold text-white sm:flex-none">
                  <MessageSquare className="h-4 w-4" />
                  1:1 매물 문의하기
                </span>
                <a
                  href={`tel:${OFFICE_TEL.replace(/-/g, "")}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#a78bfa]/35 bg-[rgba(59,42,92,0.35)] px-4 py-2.5 text-sm font-bold text-white sm:flex-none"
                >
                  <Phone className="h-4 w-4" />
                  전화 연결 ({OFFICE_TEL})
                </a>
              </div>
            </div>
          </div>

          <Section n={1} title="기본정보 · 거래조건">
            <PropertyKvTable rows={sample.basic} />
          </Section>

          <Section n={2} title="매물 상세 · 면적">
            <PropertyKvTable rows={sample.detail} />
          </Section>

          <Section n={3} title="시설 · 옵션">
            <PropertyKvTable rows={sample.facilities} />
          </Section>

          <section className={`${heroPanel} p-4 md:p-5`}>
            <h3 className="mb-2 text-sm font-bold text-[#ddd6fe]">상세 설명</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">
              {sample.description}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
