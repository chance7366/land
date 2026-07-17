import { AppLink as Link } from "@/components/ui/AppLink";

export default function AdminAuctionNotFound() {
  return (
    <main className="p-10">
      <h1 className="font-headline-lg text-landing-text">경매를 찾을 수 없습니다</h1>
      <p className="mt-3 text-sm text-landing-muted">삭제되었거나 잘못된 주소입니다.</p>
      <Link href="/admin/auctions" className="mt-6 inline-block text-sm text-blue-400 hover:underline">
        ← 경매 목록으로
      </Link>
    </main>
  );
}
