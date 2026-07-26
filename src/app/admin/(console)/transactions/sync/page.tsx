import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** 구 경로 → 실거래가격 수집 탭 */
export default function AdminTransactionsSyncRedirectPage() {
  redirect("/admin/transactions?tab=collect");
}
