"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

type DataTableProps = {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
};

export function DataTable({ children, className = "", maxHeight = "420px" }: DataTableProps) {
  return (
    <div
      className={`data-table-wrap custom-scrollbar overflow-auto rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm ${className}`}
      style={{ maxHeight }}
    >
      <div className="data-table-inner min-w-full">{children}</div>
    </div>
  );
}

export function DataTableSortIcon({
  direction,
}: {
  direction?: "asc" | "desc" | null;
}) {
  if (direction === "asc") return <ArrowUp className="inline h-3.5 w-3.5 opacity-70" aria-hidden />;
  if (direction === "desc") return <ArrowDown className="inline h-3.5 w-3.5 opacity-70" aria-hidden />;
  return <ArrowUpDown className="inline h-3.5 w-3.5 opacity-50" aria-hidden />;
}
