"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { ArrowLeft, ExternalLink, Phone, MessageSquare, Printer } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { BasicPropertyInfoPanel } from "@/components/auction/BasicPropertyInfoPanel";
import { ListDetailsPanel } from "@/components/auction/ListDetailsPanel";
import { CaseDetailSection } from "@/components/auction/CaseDetailSection";
import { StatusReportSection } from "@/components/auction/StatusReportSection";
import { formatAuctionMoney, formatDateYmd, parseImages } from "@/lib/format";
import { buildAuctionDetailSections } from "@/lib/auction-detail-sections";
import { type SerializedAuction } from "@/lib/auction-split-view";
import { useImageSlideshow } from "@/lib/use-image-slideshow";

const OFFICE_TEL = "041-633-0000";
const OFFICE_TEL_HREF = "tel:041-633-0000";
const GALLERY_PAGE_SIZE = 3;

const heroPanel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";

type Props = {
  auction: SerializedAuction | null;
  onBack?: () => void;
  showBack?: boolean;
};

function statusLabel(status: string) {
  switch (status) {
    case "ONGOING":
      return "진행중";
    case "CLOSED":
      return "종결";
    case "FAILED":
      return "유찰";
    default:
      return status;
  }
}

function safetyLabel(grade: string) {
  switch (grade) {
    case "SAFE":
      return "안전";
    case "CAUTION":
      return "주의";
    case "RISK":
      return "위험";
    default:
      return grade;
  }
}

function fmtMoney(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return formatAuctionMoney(n);
}

function FactChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value || "—"}</p>
    </div>
  );
}

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

export function AuctionSplitDetail({ auction, onBack, showBack }: Props) {
  const images = auction ? parseImages(auction.images) : [];
  const pageCount = Math.max(1, Math.ceil(images.length / GALLERY_PAGE_SIZE));
  const { activeIndex: pageIndex, setActiveIndex: setPageIndex } = useImageSlideshow(
    images.length > GALLERY_PAGE_SIZE ? pageCount : 1,
    auction?.id,
    2500,
  );
  const pageImages = images.slice(
    pageIndex * GALLERY_PAGE_SIZE,
    pageIndex * GALLERY_PAGE_SIZE + GALLERY_PAGE_SIZE,
  );

  const sections = useMemo(
    () => (auction ? buildAuctionDetailSections(auction) : null),
    [auction],
  );

  if (!auction || !sections) {
    return (
      <div className={`${heroPanel} flex h-64 flex-col items-center justify-center px-4 text-center`}>
        <span className="material-symbols-outlined mb-3 text-4xl text-white/25">gavel</span>
        <p className="text-sm font-bold text-white/70">목록에서 경매를 선택해 주세요</p>
      </div>
    );
  }

  const minPrice = auction.minPrice ?? auction.recommendedPrice;
  const minPct =
    auction.appraisalPrice > 0 && minPrice > 0
      ? Math.round((minPrice / auction.appraisalPrice) * 1000) / 10
      : null;
  const generalReportUrl = auction.generalReportUrl?.trim() || null;

  return (
    <div className="space-y-3">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c4b5fd] hover:text-white lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </button>
      ) : null}

      <div className={`${heroPanel} overflow-hidden p-0`}>
        <div className="relative h-[180px] w-full bg-[#0a0a12] sm:h-[220px] md:h-[260px]">
          {images.length > 0 ? (
            <div className="grid h-full grid-cols-3 gap-0.5">
              {Array.from({ length: GALLERY_PAGE_SIZE }, (_, slot) => {
                const url = pageImages[slot];
                return (
                  <div key={`slot-${pageIndex}-${slot}`} className="relative h-full bg-black/50">
                    {url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={slot === 0 ? auction.caseNumber : ""}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/15">
                        <span className="material-symbols-outlined text-3xl">image</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-white/25">
              <span className="material-symbols-outlined text-5xl">gavel</span>
            </div>
          )}
          {pageCount > 1 ? (
            <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {Array.from({ length: pageCount }, (_, i) => (
                <span
                  key={`dot-${i}`}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === pageIndex ? "bg-white" : "bg-white/35"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
        {images.length > 1 ? (
          <div className="flex gap-1.5 overflow-x-auto border-t border-white/10 bg-[rgba(10,10,18,0.5)] p-2">
            {images.map((url, i) => {
              const page = Math.floor(i / GALLERY_PAGE_SIZE);
              const onPage = page === pageIndex;
              return (
                <button
                  key={`${url}-${i}`}
                  type="button"
                  onClick={() => setPageIndex(page)}
                  className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border ${
                    onPage ? "border-[#a78bfa]" : "border-white/15 opacity-70"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="space-y-3 p-4 md:p-5">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full border border-[#facc15]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#facc15]">
              {auction.itemType || "경매"}
            </span>
            <span className="rounded-full border border-pink-400/40 px-2.5 py-0.5 text-[11px] font-bold text-pink-400">
              D-{auction.dDay}
            </span>
            <span className="rounded-full border border-[#a78bfa]/40 bg-[#a78bfa]/12 px-2.5 py-0.5 text-[11px] font-bold text-[#ddd6fe]">
              {statusLabel(auction.status)}
            </span>
            <span className="rounded-full border border-[#a78bfa]/40 bg-[#a78bfa]/12 px-2.5 py-0.5 text-[11px] font-bold text-[#ddd6fe]">
              {safetyLabel(auction.safetyGrade)}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
              {auction.caseNumber}
            </h2>
            <p className="mt-1 text-sm text-[#c4b5fd]/75">
              {auction.address || auction.region || auction.title}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-2xl font-extrabold text-[#fbbf24] md:text-[1.65rem]">
              감정 {fmtMoney(auction.appraisalPrice)}
            </p>
            <p className="text-xl font-extrabold text-[#fbbf24]/90 md:text-[1.35rem]">
              최저 {fmtMoney(minPrice)}
              {minPct != null ? (
                <span className="ml-2 text-sm font-bold text-white/45">({minPct}%)</span>
              ) : null}
            </p>
          </div>

          <p className="text-xs text-white/50">
            매각기일 {auction.saleDate ? formatDateYmd(auction.saleDate) : "—"}
            {auction.court ? ` · ${auction.court}` : ""}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href={`/consultation?auctionId=${encodeURIComponent(auction.id)}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2.5 text-sm font-bold text-white sm:flex-none"
            >
              <MessageSquare className="h-4 w-4" />
              1:1 경매 문의하기
            </Link>
            <a
              href={OFFICE_TEL_HREF}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#a78bfa]/35 bg-[rgba(59,42,92,0.35)] px-4 py-2.5 text-sm font-bold text-white sm:flex-none"
            >
              <Phone className="h-4 w-4" />
              전화 연결 ({OFFICE_TEL})
            </a>
            <Link
              href={`/auctions/${auction.id}/export`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#f5e6d3]/35 bg-[#6B5344]/40 px-4 py-2.5 text-sm font-bold text-[#f5e6d3] hover:bg-[#6B5344]/55"
            >
              <Printer className="h-4 w-4" />
              블로그·인쇄
            </Link>
            {generalReportUrl ? (
              <a
                href={generalReportUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-200 hover:bg-emerald-500/20"
              >
                <ExternalLink className="h-4 w-4" />
                일반리포트 보기
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <Section n={1} title="기본정보">
        <BasicPropertyInfoPanel data={sections.basic} />
      </Section>

      <Section n={2} title="기일 내역">
        {sections.schedule.length > 0 ? (
          <div className="data-table max-h-56 overflow-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs text-[#cbd5e1]">
              <thead>
                <tr className="bg-[#0B0F19]/90">
                  <th className="px-3 py-2">기일</th>
                  <th className="px-3 py-2">종류</th>
                  <th className="px-3 py-2">최저가</th>
                  <th className="px-3 py-2">결과</th>
                </tr>
              </thead>
              <tbody>
                {sections.schedule.map((row, i) => (
                  <tr key={`${row.date}-${row.kind}-${i}`} className="border-t border-white/5">
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2">{row.kind || "—"}</td>
                    <td className="px-3 py-2">
                      {row.minPrice != null ? formatAuctionMoney(row.minPrice) : "—"}
                    </td>
                    <td className="px-3 py-2">{row.result || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-white/45">등록된 기일 내역이 없습니다.</p>
        )}
      </Section>

      <Section n={3} title="목록 내역">
        <ListDetailsPanel rows={sections.listDetails} />
      </Section>

      <Section n={4} title="감정요약">
        {sections.appraisalSummary ? (
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-xs leading-relaxed text-[#cbd5e1]">
            {sections.appraisalSummary}
          </pre>
        ) : (
          <p className="text-sm text-white/45">등록된 감정요약이 없습니다.</p>
        )}
      </Section>

      <div className="[&_.glass-card]:!bg-[rgba(20,18,28,0.78)] [&_.glass-card]:!shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <CaseDetailSection n={5} data={sections.caseDetail} hideLists>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <FactChip label="전유면적" value={sections.chips.exclusiveArea} />
            <FactChip label="대지권" value={sections.chips.landRight} />
            <FactChip label="점유" value={sections.chips.possession} />
          </div>
        </CaseDetailSection>
      </div>

      <Section n={6} title="현황조사서">
        {sections.statusReport.available ? (
          <StatusReportSection bare readOnly report={sections.statusReport} />
        ) : (
          <p className="text-sm text-white/45">등록된 현황조사서가 없습니다.</p>
        )}
      </Section>
    </div>
  );
}
