import { Suspense } from "react";
import { AdminTransactionsClient } from "@/components/admin/AdminTransactionsClient";

export const dynamic = "force-dynamic";

export default function AdminTransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-landing-muted">실거래가격 불러오는 중…</div>
      }
    >
      <AdminTransactionsClient />
    </Suspense>
  );
}
