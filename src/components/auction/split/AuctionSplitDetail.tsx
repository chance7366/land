"use client";

import type { ReactNode } from "react";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { formatAuctionMoney, formatDateYmd, parseImages } from "@/lib/format";
import {
  extractRightsTag,
  parseScheduleFromRights,
  type SerializedAuction,
} from "@/lib/auction-split-view";
import { useImageSlideshow } from "@/lib/use-image-slideshow";

const OFFICE_TEL = "041-633-0000";
const OFFICE_TEL_HREF = "tel:041-633-0000";

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

function fmtArea(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n) || n <= 0) return "—";
  return `${n.toLocaleString("ko-KR")}㎡`;
}

function fmtMoney(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return formatAuctionMoney(n);
}

function Fact({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className={`mt-1 whitespace-pre-wrap text-sm font-semibold ${accent ?? "text-white"}`}>
        {value || "—"}
      </p>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
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
  const { activeIndex, setActiveIndex } = useImageSlideshow(images.length, auction?.id, 1500);

  if (!auction) {
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

  const possession = extractRightsTag(auction.rightsAnalysis, "점유");
  const lease = extractRightsTag(auction.rightsAnalysis, "임차");
  const assumeRights = extractRightsTag(auction.rightsAnalysis, "매수인 인수 권리");
  const saleShare = extractRightsTag(auction.rightsAnalysis, "매각지분");
  const remarks =
    extractRightsTag(auction.rightsAnalysis, "물건비고") || auction.memo?.trim() || null;
  const appraisalSummary =
    extractRightsTag(auction.rightsAnalysis, "감정요약") || auction.description?.trim() || null;
  const schedule = parseScheduleFromRights(auction.rightsAnalysis);

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
            images.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${url}-${i}`}
                src={url}
                alt={i === activeIndex ? auction.caseNumber : ""}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  i === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-white/25">
              <span className="material-symbols-outlined text-5xl">gavel</span>
            </div>
          )}
        </div>
        {images.length > 1 ? (
          <div className="flex gap-1.5 overflow-x-auto border-t border-white/10 bg-[rgba(10,10,18,0.5)] p-2">
            {images.slice(0, 5).map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border ${
                  i === activeIndex ? "border-[#a78bfa]" : "border-white/15 opacity-70"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
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
          </div>
        </div>
      </div>

      <Section n={1} title="기본정보">
        <div className="grid gap-2 sm:grid-cols-2">
          <Fact label="사건번호" value={auction.caseNumber} accent="text-[#c4b5fd]" />
          <Fact label="물건번호" value={String(auction.itemNo ?? 1)} />
          <Fact label="경매종류" value={auction.auctionType ?? "—"} />
          <Fact label="물건종류" value={auction.itemType ?? "—"} />
          <Fact label="경매대상" value={auction.auctionTarget ?? "—"} />
          <Fact label="관할법원" value={auction.court ?? "—"} />
          <Fact label="소재지" value={auction.address || auction.region || "—"} />
          <Fact label="지역" value={auction.region ?? "—"} />
          <Fact label="상태" value={statusLabel(auction.status)} />
          <Fact label="안전등급" value={safetyLabel(auction.safetyGrade)} />
          <div className="sm:col-span-2">
            <Fact label="제목" value={auction.title} />
          </div>
        </div>
      </Section>

      <Section n={2} title="가격 · 기일">
        <div className="grid gap-2 sm:grid-cols-2">
          <Fact
            label="감정가"
            value={fmtMoney(auction.appraisalPrice)}
            accent="text-blue-400"
          />
          <Fact
            label="최저가"
            value={`${fmtMoney(minPrice)}${minPct != null ? ` (${minPct}%)` : ""}`}
            accent="text-[#d4af37]"
          />
          <Fact label="입찰보증금" value={fmtMoney(auction.bidDeposit)} />
          <Fact label="청구금액" value={fmtMoney(auction.claimAmount)} />
          <Fact label="입찰방법" value={auction.bidMethod ?? "—"} />
          <Fact
            label="매각기일"
            value={auction.saleDate ? formatDateYmd(auction.saleDate) : "—"}
            accent="text-pink-300"
          />
        </div>

        {schedule.length > 0 ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-black/30 text-white/45">
                  <th className="px-3 py-2 font-semibold">기일</th>
                  <th className="px-3 py-2 font-semibold">종류</th>
                  <th className="px-3 py-2 font-semibold">최저가</th>
                  <th className="px-3 py-2 font-semibold">결과</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, i) => (
                  <tr key={`${row.date}-${i}`} className="border-b border-white/5 text-white/80">
                    <td className="px-3 py-2 tabular-nums">{row.date}</td>
                    <td className="px-3 py-2">{row.kind}</td>
                    <td className="px-3 py-2 tabular-nums">{row.minPriceLabel}</td>
                    <td className="px-3 py-2">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Section>

      <Section n={3} title="물건상세">
        <div className="grid gap-2 sm:grid-cols-2">
          <Fact label="토지면적" value={fmtArea(auction.landArea)} />
          <Fact label="건물/전유면적" value={fmtArea(auction.buildingArea)} />
          {saleShare ? <Fact label="매각지분" value={saleShare} /> : null}
          <Fact label="점유" value={possession ?? "—"} />
          <Fact label="임차관계" value={lease ?? "—"} />
          <div className="sm:col-span-2">
            <Fact label="매수인 인수 권리" value={assumeRights ?? "—"} />
          </div>
          {remarks ? (
            <div className="sm:col-span-2">
              <Fact label="물건비고" value={remarks} />
            </div>
          ) : null}
          {appraisalSummary ? (
            <div className="sm:col-span-2">
              <Fact label="감정요약" value={appraisalSummary} />
            </div>
          ) : null}
        </div>
      </Section>
    </div>
  );
}
