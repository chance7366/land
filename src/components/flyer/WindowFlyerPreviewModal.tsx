"use client";

import { useEffect, useState } from "react";
import { Download, FileDown, Printer, X } from "lucide-react";
import { WindowFlyerSheet } from "@/components/flyer/WindowFlyerSheet";
import type { WindowFlyerTemplate, WindowFlyerViewModel } from "@/lib/flyer/window-types";

type Props = {
  open: boolean;
  onClose: () => void;
  data: WindowFlyerViewModel | null;
};

const TEMPLATES: { id: WindowFlyerTemplate; label: string; hint: string }[] = [
  { id: "A", label: "Type A", hint: "갤러리 · OPEN HOUSE" },
  { id: "B", label: "Type B", hint: "컬러 블록" },
  { id: "C", label: "Type C", hint: "카드 · 리스트" },
];

export function WindowFlyerPreviewModal({ open, onClose, data }: Props) {
  const [template, setTemplate] = useState<WindowFlyerTemplate | null>(null);
  const [pptxBusy, setPptxBusy] = useState(false);
  const [pptxError, setPptxError] = useState<string | null>(null);

  useEffect(() => {
    if (open && data) {
      setTemplate(null);
      setPptxError(null);
    }
  }, [open, data?.publicPath]);

  if (!open || !data) return null;

  const active = template ?? data.template ?? "A";

  async function handlePptxDownload() {
    if (!data) return;
    const snapshot = data;
    const tpl = active;
    setPptxBusy(true);
    setPptxError(null);
    try {
      const { downloadWindowFlyerPptx } = await import("@/lib/flyer/window-flyer-pptx");
      await downloadWindowFlyerPptx(snapshot, tpl);
    } catch (e) {
      setPptxError(e instanceof Error ? e.message : "PPT 생성에 실패했습니다");
    } finally {
      setPptxBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm print:bg-white print:p-0">
      <div className="flex max-h-[96vh] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#121826] shadow-2xl print:max-h-none print:max-w-none print:rounded-none print:border-0 print:bg-white print:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 print:hidden">
          <div className="min-w-0">
            <p className="text-xs text-amber-300/90">창문전단지 · 창부착 · 보행 시인성</p>
            <p className="truncate text-sm font-bold text-white">
              {data.badge} · {data.title}
            </p>
            {pptxError ? <p className="mt-0.5 text-[11px] text-rose-300">{pptxError}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handlePptxDownload()}
              disabled={pptxBusy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-amber-500/15 px-3 py-2 text-xs font-bold text-amber-100 hover:bg-amber-500/25 disabled:opacity-50"
            >
              <FileDown className="h-3.5 w-3.5" />
              {pptxBusy ? "PPT 생성 중…" : "PPT 다운로드"}
            </button>
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

        <div className="flex flex-wrap gap-1.5 border-b border-white/10 px-4 py-2 print:hidden">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              className={`rounded-lg px-3 py-1.5 text-left text-xs transition ${
                active === t.id
                  ? "bg-gradient-to-r from-[#4dabff]/30 to-[#913dff]/30 font-bold text-white ring-1 ring-white/30"
                  : "bg-white/5 font-semibold text-slate-300 hover:bg-white/10"
              }`}
            >
              <span className="block">{t.label}</span>
              <span className="block text-[10px] opacity-70">{t.hint}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto bg-[#D8D4CE] p-4 print:overflow-visible print:bg-white print:p-0">
          <WindowFlyerSheet data={data} template={active} />
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] text-slate-600 print:hidden">
            <span className="inline-flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              인쇄 → PDF · Type {active}
            </span>
            <span className="inline-flex items-center gap-1">
              <FileDown className="h-3.5 w-3.5" />
              PPT는 선택 Type 기준 A4 1장
            </span>
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
          .window-flyer-a4,
          .window-flyer-a4 * {
            visibility: visible;
          }
          .window-flyer-a4 {
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
