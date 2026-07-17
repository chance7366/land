import { AppLink as Link } from "@/components/ui/AppLink";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default function AdminPropertyNewPage() {
  return (
    <main className="p-6 md:p-10">
      <Link href="/admin/properties" className="text-sm text-blue-400 hover:underline">
        ← 매물 목록
      </Link>
      <h1 className="mt-4 font-headline-lg text-landing-text">매물 등록</h1>
      <p className="mt-2 text-sm text-landing-muted">
        카테고리·거래유형을 선택한 뒤 저장합니다. 수정은 목록에서 해당 매물을 선택하세요.
      </p>
      <div className="mt-6">
        <PropertyForm />
      </div>
    </main>
  );
}
