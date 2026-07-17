import { AppLink as Link } from "@/components/ui/AppLink";
import { getAllAuctionsAdmin } from "@/lib/auction-service";
import { AdminAuctionList } from "@/components/admin/AdminAuctionList";
import { withDbFallback } from "@/lib/db-fallback";

export const dynamic = "force-dynamic";

export default async function AdminAuctionsPage() {
  const items = await withDbFallback("admin-auctions", () => getAllAuctionsAdmin(), []);

  return (
    <main className="p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-landing-text">경매 관리</h1>
        </div>
        <Link
          href="/admin/auctions/new"
          className="rounded-lg bg-blue-500 px-4 py-2 font-label-md text-white hover:bg-blue-400"
        >
          + 경매 자동등록
        </Link>
      </div>
      <AdminAuctionList items={items} />
    </main>
  );
}
