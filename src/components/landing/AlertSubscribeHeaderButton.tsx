"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { AlertSubscribeModal } from "@/components/subscription/AlertSubscribeModal";
import type { SubscriptionType } from "@/lib/subscription";

type Props = {
  defaultType?: SubscriptionType | null;
};

/** Header alert button — amber tint, placed left of consult */
export function AlertSubscribeHeaderButton({ defaultType = null }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-1 rounded-lg border border-amber-400/35 bg-amber-500/15 px-2 py-2 text-[11px] font-bold text-landing-text transition-colors hover:border-amber-400/55 hover:bg-amber-500/25 sm:px-2.5"
      >
        <Bell className="h-4 w-4 shrink-0 text-amber-300" aria-hidden />
        <span className="hidden sm:inline">맞춤 알림</span>
      </button>
      <AlertSubscribeModal open={open} onClose={() => setOpen(false)} defaultType={defaultType} />
    </>
  );
}
