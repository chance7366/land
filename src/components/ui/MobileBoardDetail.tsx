"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  backLabel?: string;
  accentClassName?: string;
  children: React.ReactNode;
};

/** 모바일 게시판 상세 — body portal로 전체 화면 (부모 overflow/transform 영향 없음) */
export function MobileBoardDetail({
  open,
  onClose,
  backLabel = "목록으로",
  accentClassName = "text-sky-300",
  children,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-landing-bg lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div className="shrink-0 border-b border-white/10 bg-landing-bg/95 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={onClose}
          className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-bold ${accentClassName}`}
        >
          ← {backLabel}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(6rem,env(safe-area-inset-bottom))] pt-3">
        {children}
      </div>
    </div>,
    document.body,
  );
}
