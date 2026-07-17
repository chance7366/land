"use client";

import type { ComponentType } from "react";
import {
  Building2,
  CheckSquare,
  Gavel,
  Grid2X2,
  Home,
  KeyRound,
  Landmark,
  MapPin,
  Receipt,
  Store,
  Wallet,
  type LucideProps,
} from "lucide-react";
import {
  R114_WIKI_CATEGORIES,
  type R114WikiCategoryId,
} from "@/lib/news-feed";

const ICON_BY_ID: Record<
  R114WikiCategoryId,
  { Icon: ComponentType<LucideProps>; tileClass: string; iconClass: string }
> = {
  all: { Icon: Grid2X2, tileClass: "bg-white/10 ring-1 ring-white/25", iconClass: "text-white" },
  sale: { Icon: Home, tileClass: "bg-[#fce7f3]/90", iconClass: "text-[#db2777]" },
  rent: { Icon: KeyRound, tileClass: "bg-[#ffedd5]/90", iconClass: "text-[#ea580c]" },
  finance: { Icon: Wallet, tileClass: "bg-[#ccfbf1]/90", iconClass: "text-[#0d9488]" },
  subscription: {
    Icon: CheckSquare,
    tileClass: "bg-[#dbeafe]/90",
    iconClass: "text-[#2563eb]",
  },
  tax: { Icon: Receipt, tileClass: "bg-[#ede9fe]/90", iconClass: "text-[#7c3aed]" },
  auction: { Icon: Gavel, tileClass: "bg-[#fef3c7]/90", iconClass: "text-[#b45309]" },
  policy: { Icon: Landmark, tileClass: "bg-[#e0e7ff]/90", iconClass: "text-[#1e3a8a]" },
  redevelopment: {
    Icon: Building2,
    tileClass: "bg-[#ccfbf1]/90",
    iconClass: "text-[#0f766e]",
  },
  commercial: { Icon: Store, tileClass: "bg-[#fce7f3]/90", iconClass: "text-[#c026d3]" },
  lifestyle: { Icon: MapPin, tileClass: "bg-[#ecfccb]/90", iconClass: "text-[#65a30d]" },
};

type Props = {
  active: R114WikiCategoryId;
  onSelect: (id: R114WikiCategoryId) => void;
};

/** 부동산114 위키 카테고리 아이콘 바 */
export function R114WikiCategoryBar({ active, onSelect }: Props) {
  return (
    <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className="flex min-w-max gap-2 sm:gap-2.5"
        role="tablist"
        aria-label="부동산114 위키 카테고리"
      >
        {R114_WIKI_CATEGORIES.map((cat) => {
          const { Icon, tileClass, iconClass } = ICON_BY_ID[cat.id];
          const isActive = cat.id === active;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(cat.id)}
              className={`flex w-[4.5rem] flex-col items-center gap-1.5 rounded-xl px-1 py-2 transition sm:w-[5rem] ${
                isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${tileClass} ${
                  isActive && cat.id === "all" ? "ring-2 ring-white" : ""
                } ${isActive && cat.id !== "all" ? "ring-2 ring-[#d450ff]/60" : ""}`}
              >
                <Icon
                  className={`h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem] ${iconClass}`}
                  strokeWidth={1.75}
                />
              </span>
              <span
                className={`text-[11px] font-bold leading-tight ${
                  isActive ? "text-white" : "text-white/55"
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
