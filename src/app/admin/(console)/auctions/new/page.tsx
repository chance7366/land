import { AppLink as Link } from "@/components/ui/AppLink";
import { AuctionForm } from "@/components/admin/AuctionForm";

export default function AdminAuctionNewPage() {
  return (
    <main className="p-6 md:p-10">
      <Link href="/admin/auctions" className="text-sm text-blue-400 hover:underline">
        ← 경매 목록
      </Link>
      <h1 className="mt-4 font-headline-lg text-landing-text">경매물건 자동등록</h1>
      <p className="mt-2 text-sm text-landing-muted">
        관할법원·사건번호로 불러온 뒤 저장합니다. 수정은 목록에서 해당 물건을 선택하세요.
      </p>
      <div className="mt-6">
        <AuctionForm />
      </div>
    </main>
  );
}
