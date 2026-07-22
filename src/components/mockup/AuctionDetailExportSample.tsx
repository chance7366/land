"use client";

/**
 * 경매상세 밝은 내보내기·인쇄 목업
 * — 운영: /auctions/[id]/export
 */

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Copy, Printer } from "lucide-react";
import { AUCTION_SPLIT_SAMPLES } from "@/lib/mockup/auction-split-sample-data";
import { formatAreaPyeong, formatAuctionMoney, formatDateYmd } from "@/lib/format";

function SectionBar({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-full bg-[#F7E8D8] px-4 py-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B5344] text-[11px] font-bold text-white">
        {n}
      </span>
      <h2 className="text-[15px] font-bold text-[#3D342C]">{title}</h2>
    </div>
  );
}

export function AuctionDetailExportSample() {
  const params = useSearchParams();
  const id = params.get("id");
  const sample = useMemo(
    () => AUCTION_SPLIT_SAMPLES.find((a) => a.id === id) ?? AUCTION_SPLIT_SAMPLES[0],
    [id],
  );
  const [copied, setCopied] = useState(false);

  const areaLine = useMemo(() => {
    if (sample.exclusiveArea != null && sample.exclusiveArea > 0) {
      return `전유 ${sample.exclusiveArea}㎡ (${formatAreaPyeong(sample.exclusiveArea)})`;
    }
    if (sample.landArea != null && sample.buildingArea != null) {
      return `토지 ${sample.landArea}㎡ · 건물 ${sample.buildingArea}㎡`;
    }
    if (sample.landArea != null) {
      return `토지 ${sample.landArea}㎡ (${formatAreaPyeong(sample.landArea)})`;
    }
    return "—";
  }, [sample]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleCopy = useCallback(async () => {
    const el = document.getElementById("export-article");
    if (!el) return;
    try {
      const html = el.innerHTML;
      const text = el.innerText;
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // selection fallback
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      document.execCommand("copy");
      sel?.removeAllRanges();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const cover = sample.images[0];
  const imgs = sample.images.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#D8D4CE] font-[family-name:var(--font-unifine),Pretendard,Noto_Sans_KR,sans-serif] text-[#2F2F2F] print:bg-white print:p-0">
      {/* 목업 배너 — 인쇄 시 숨김 */}
      <div className="border-b border-amber-400/40 bg-[#12100a] px-4 py-3 text-center text-xs text-amber-100/90 print:hidden">
        <p className="font-bold text-amber-50">
          경매상세 밝은 내보내기·인쇄 목업 → 운영 /auctions/[id]/export
        </p>
        <p className="mt-1 text-[11px] text-amber-100/70">
          인쇄(PDF) · 블로그용 복사 · 흰 배경 A4형 문서
        </p>
      </div>

      {/* 툴바 — 인쇄 시 숨김 */}
      <div className="mx-auto flex max-w-[794px] flex-wrap items-center justify-between gap-3 px-4 py-4 print:hidden">
        <Link
          href="/mockup/auction-detail-page"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3D342C]/80 hover:text-[#3D342C]"
        >
          <ArrowLeft className="h-4 w-4" />
          상세 목업으로
        </Link>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#6B5344]/25 bg-white px-4 py-2.5 text-sm font-bold text-[#3D342C] shadow-sm hover:bg-[#F7E8D8]"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "복사됨" : "블로그용 복사"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#6B5344] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#5a4638]"
          >
            <Printer className="h-4 w-4" />
            인쇄 / PDF
          </button>
        </div>
      </div>

      <article
        id="export-article"
        className="relative mx-auto mb-12 w-full max-w-[794px] bg-white px-8 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/5 sm:px-10 print:mb-0 print:max-w-none print:px-0 print:py-0 print:shadow-none print:ring-0"
      >
        <header className="mb-8 border-b border-[#E5E5E5] pb-6 text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#A08B78]">
            CHANCE · 경매물건 안내
          </p>
          <h1 className="mt-2 text-[22px] font-extrabold tracking-tight text-[#6B5344] sm:text-[26px]">
            {sample.caseNumber}
            {sample.itemNo > 1 ? ` (${sample.itemNo})` : ""}
          </h1>
          <p className="mt-2 text-[14px] text-[#555]">{sample.title}</p>
          <p className="mt-1 text-[13px] text-[#8A7A6A]">
            {sample.address || sample.region}
            {sample.court ? ` · ${sample.court}` : ""}
          </p>
        </header>

        {/* 사진 3장 */}
        <div className="mb-8 grid grid-cols-3 gap-1.5">
          {Array.from({ length: 3 }, (_, i) => {
            const url = imgs[i] ?? cover;
            return (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-lg bg-[#F3F1EE]">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* 핵심 요약 */}
        <div className="mb-8 grid gap-2 rounded-xl border border-[#E6E0D8] bg-[#FAF8F6] p-4 sm:grid-cols-2">
          <p className="text-[13px]">
            <span className="text-[#A08B78]">물건종별</span>{" "}
            <strong className="text-[#3D342C]">{sample.itemType}</strong>
          </p>
          <p className="text-[13px]">
            <span className="text-[#A08B78]">매각기일</span>{" "}
            <strong className="text-[#3D342C]">{formatDateYmd(sample.saleDate)}</strong>
            <span className="ml-1 text-[#C45A5A]">(D-{sample.dDay})</span>
          </p>
          <p className="text-[13px]">
            <span className="text-[#A08B78]">감정가</span>{" "}
            <strong className="text-[#3D342C]">{formatAuctionMoney(sample.appraisalPrice)}</strong>
          </p>
          <p className="text-[13px]">
            <span className="text-[#A08B78]">최저가</span>{" "}
            <strong className="text-[#6B5344]">{formatAuctionMoney(sample.minPrice)}</strong>
          </p>
          <p className="text-[13px] sm:col-span-2">
            <span className="text-[#A08B78]">면적</span>{" "}
            <strong className="text-[#3D342C]">{areaLine}</strong>
          </p>
        </div>

        <SectionBar n={1} title="기본정보" />
        <table className="mb-8 w-full border-collapse text-left text-[12.5px]">
          <tbody>
            {[
              ["사건번호", sample.caseNumber],
              ["물건번호", String(sample.itemNo)],
              ["법원", sample.court],
              ["입찰방법", sample.bidMethod],
              ["소재지", sample.address || sample.region],
              ["면적", areaLine],
            ].map(([k, v]) => (
              <tr key={k} className="border-b border-[#E6E0D8]">
                <th className="w-[28%] bg-[#F3F1EE] px-3 py-2 font-semibold text-[#6B5344]">
                  {k}
                </th>
                <td className="px-3 py-2 text-[#2F2F2F]">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <SectionBar n={2} title="기일 내역" />
        {sample.schedule.length > 0 ? (
          <table className="mb-8 w-full border-collapse text-left text-[12px]">
            <thead>
              <tr className="bg-[#F3F1EE] text-[#6B5344]">
                <th className="px-3 py-2 font-semibold">기일</th>
                <th className="px-3 py-2 font-semibold">종류</th>
                <th className="px-3 py-2 font-semibold">최저가</th>
                <th className="px-3 py-2 font-semibold">결과</th>
              </tr>
            </thead>
            <tbody>
              {sample.schedule.map((row, i) => (
                <tr key={`${row.date}-${i}`} className="border-b border-[#E6E0D8]">
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
        ) : (
          <p className="mb-8 text-[13px] text-[#888]">등록된 기일 내역이 없습니다.</p>
        )}

        <SectionBar n={3} title="목록 내역" />
        <ul className="mb-8 space-y-1.5 text-[13px] leading-relaxed text-[#3A3A3A]">
          {sample.parcels.length > 0 ? (
            sample.parcels.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-[#B8A080]" />
                <span>
                  {p.listKind || "목록"} · {p.address || "—"}
                  {p.detail ? ` (${p.detail})` : ""}
                </span>
              </li>
            ))
          ) : (
            <li className="text-[#888]">등록된 목록 내역이 없습니다.</li>
          )}
        </ul>

        <SectionBar n={4} title="감정요약" />
        <pre className="mb-8 whitespace-pre-wrap rounded-xl border border-[#E6E0D8] bg-[#FAF8F6] px-4 py-3 text-[12.5px] leading-relaxed text-[#3A3A3A]">
          {sample.appraisalSummary?.trim() || "등록된 감정요약이 없습니다."}
        </pre>

        <SectionBar n={5} title="사건상세" />
        <div className="mb-8 space-y-2 text-[13px] leading-relaxed text-[#3A3A3A]">
          <p>
            <span className="text-[#A08B78]">점유</span> · {sample.possessionNote || "확인 필요"}
          </p>
          <p>
            <span className="text-[#A08B78]">임차</span> · {sample.leaseNote || "확인 필요"}
          </p>
          <p>
            <span className="text-[#A08B78]">매수인 인수</span> ·{" "}
            {sample.assumeRightsNote || "확인 필요"}
          </p>
          {sample.remarks ? (
            <p className="rounded-lg border border-[#E8D5A8] bg-[#FFF8E7] px-3 py-2 text-[12.5px]">
              <strong className="text-[#C4810A]">비고</strong> · {sample.remarks}
            </p>
          ) : null}
        </div>

        <SectionBar n={6} title="현황조사서" />
        <p className="mb-6 text-[13px] leading-relaxed text-[#3A3A3A]">
          현황조사서 요약은 운영 연동 시 본문에 표시됩니다. (목업: 점유·임차 메모 위 참고)
        </p>

        <footer className="mt-10 border-t border-[#E5E5E5] pt-4 text-center text-[11px] text-[#9A9A9A]">
          <p>찬스부동산 · 경매물건 안내 (목업)</p>
          <p className="mt-1">본 안내는 참고용이며 법적·투자 자문이 아닙니다.</p>
        </footer>
      </article>
    </div>
  );
}
