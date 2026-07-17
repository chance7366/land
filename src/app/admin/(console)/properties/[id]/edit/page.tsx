import { AppLink as Link } from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const dynamic = "force-dynamic";

export default async function AdminPropertyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await withDbFallback(
    "admin-property-edit",
    () => prisma.property.findUnique({ where: { id } }),
    null,
  );
  if (!property) notFound();

  return (
    <main className="p-6 md:p-10">
      <Link href="/admin/properties" className="text-sm text-blue-400 hover:underline">
        ← 매물 목록
      </Link>
      <h1 className="mt-4 font-headline-lg text-landing-text">매물 수정</h1>
      <p className="mt-2 text-sm text-landing-muted">
        기존 매물 정보를 불러왔습니다. 수정 후 저장하세요.
      </p>
      <div className="mt-6">
        <PropertyForm initial={property} />
      </div>
    </main>
  );
}
