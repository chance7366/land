"use client";

import type { SerializedAuction } from "@/lib/auction-split-view";
import { AuctionSplitCard } from "./AuctionSplitCard";

type Props = {
  items: SerializedAuction[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function AuctionSplitList({ items, selectedId, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-white/45">
        조건에 맞는 경매가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid auto-rows-fr grid-cols-2 gap-2.5 md:gap-3">
      {items.map((a) => (
        <div key={a.id} className="min-w-0">
          <AuctionSplitCard
            auction={a}
            selected={selectedId === a.id}
            onSelect={() => onSelect(a.id)}
          />
        </div>
      ))}
    </div>
  );
}
