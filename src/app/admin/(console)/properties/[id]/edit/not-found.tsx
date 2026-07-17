import { AppLink as Link } from "@/components/ui/AppLink";

export default function AdminPropertyNotFound() {
  return (
    <main className="p-10">
      <h1 className="font-headline-lg text-primary">매물을 찾을 수 없습니다</h1>
      <p className="mt-3 text-sm text-landing-muted">
        삭제되었거나 목록이 오래된 상태일 수 있습니다. 매물 목록을 새로고침한 뒤 다시 시도하세요.
      </p>
      <Link
        href="/admin/properties"
        className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm text-on-primary"
      >
        매물 목록으로
      </Link>
    </main>
  );
}
