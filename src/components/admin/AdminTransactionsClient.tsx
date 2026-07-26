"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { AdminTransactionsBrowseClient } from "@/components/admin/AdminTransactionsBrowseClient";
import { AdminTransactionsCollectClient } from "@/components/admin/AdminTransactionsCollectClient";

type TxTab = "collect" | "browse";

function parseTab(raw: string | null): TxTab {
  return raw === "collect" || raw === "sync" ? "collect" : "browse";
}

export function AdminTransactionsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = useMemo(() => parseTab(searchParams.get("tab")), [searchParams]);

  const setTab = useCallback(
    (next: TxTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "browse") params.delete("tab");
      else params.set("tab", "collect");
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="space-y-4 p-4 md:p-6">
      <header>
        <h1 className="flex items-center gap-2 font-headline-lg text-landing-text">
          <TrendingUp className="h-6 w-6 text-blue-400" aria-hidden />
          실거래가격
        </h1>
        <p className="mt-1 text-sm text-landing-muted">
          국토부 RTMS 수집과 Supabase 조회·분석을 한곳에서 관리합니다.
        </p>
      </header>

      <div className="flex gap-1 rounded-xl border border-white/10 bg-black/25 p-1">
        {(
          [
            { id: "collect" as const, label: "실거래가수집" },
            { id: "browse" as const, label: "실거래가조회" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-gradient-to-r from-[#4dabff]/35 to-[#913dff]/35 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "collect" ? (
        <AdminTransactionsCollectClient embedded />
      ) : (
        <AdminTransactionsBrowseClient embedded />
      )}
    </div>
  );
}
