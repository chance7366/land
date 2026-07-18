"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { MobileNavSheet } from "@/components/landing/MobileNavSheet";

export function LandingHeaderMenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-landing-text transition hover:border-white/30 hover:bg-white/10 md:hidden"
        aria-label="전체 메뉴 열기"
      >
        <Menu className="h-5 w-5" />
      </button>
      <MobileNavSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
