"use client";

import { Download, Printer, X } from "lucide-react";
import { FlyerSheet } from "@/components/flyer/FlyerSheet";
import type { FlyerViewModel } from "@/lib/flyer/types";

type Props = {
  open: boolean;
  onClose: () => void;
  data: FlyerViewModel | null;
};

export function FlyerPreviewModal({ open, onClose, data }: Props) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm print:bg-white print:p-0">
      <div className="flex max-h-[96vh] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#121826] shadow-2xl print:max-h-none print:max-w-none print:rounded-none print:border-0 print:bg-white print:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 print:hidden">
          <div className="min-w-0">
            <p className="text-xs text-slate-400">A4 광고전단지 미리보기</p>
            <p className="truncate text-sm font-bold text-white">{data.title}</p>
            {data.missingLabels.length > 0 ? (
              <p className="mt-0.5 text-[11px] text-amber-300">
                법정 미비 · {data.missingLabels.slice(0, 6).join(", ")}
                {data.missingLabels.length > 6 ? " 외" : ""}
              </p>
            ) : (
              <p className="mt-0.5 text-[11px] text-emerald-300">필수 항목 대체로 채워짐</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-3 py-2 text-xs font-bold text-white"
            >
              <Printer className="h-3.5 w-3.5" />
              인쇄 / PDF 저장
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flyer-preview-scroll flex-1 overflow-auto bg-[#D8D4CE] p-4 print:overflow-visible print:bg-white print:p-0">
          <FlyerSheet data={data} />
          <p className="mt-3 flex items-center justify-center gap-1 text-center text-[11px] text-slate-600 print:hidden">
            <Download className="h-3.5 w-3.5" />
            인쇄 대화상자에서 「PDF로 저장」을 선택하세요
          </p>
        </div>
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
          body * {
            visibility: hidden;
          }
          .flyer-a4,
          .flyer-a4 * {
            visibility: visible;
          }
          .flyer-a4 {
            position: absolute;
            left: 0;
            top: 0;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
