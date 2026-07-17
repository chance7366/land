"use client";

import type { Property } from "@prisma/client";
import { PropertySplitCard } from "./PropertySplitCard";

type Props = {
  items: Property[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function PropertySplitList({ items, selectedId, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-white/45">
        조건에 맞는 매물이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid auto-rows-fr grid-cols-2 gap-2.5 md:gap-3">
      {items.map((p) => (
        <div key={p.id} className="min-w-0">
          <PropertySplitCard
            property={p}
            selected={selectedId === p.id}
            onSelect={() => onSelect(p.id)}
          />
        </div>
      ))}
    </div>
  );
}
