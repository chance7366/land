import type { Metadata } from "next";
import { AdminNpayClient } from "@/components/admin/AdminNpayClient";

export const metadata: Metadata = {
  title: "Npay매물수집 | 관리자",
  robots: { index: false, follow: false },
};

export default function AdminNpayPage() {
  return <AdminNpayClient />;
}
