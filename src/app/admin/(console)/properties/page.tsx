import { AppLink as Link } from "@/components/ui/AppLink";
import { getAllPropertiesAdmin } from "@/lib/property-service";
import { AdminPropertyList } from "@/components/admin/AdminPropertyList";
import { withDbFallback } from "@/lib/db-fallback";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const items = await withDbFallback("admin-properties", () => getAllPropertiesAdmin(), []);

  return (
    <main className="p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-landing-text">매물 관리</h1>
        </div>
        <Link
          href="/admin/properties/new"
          className="rounded-lg bg-blue-500 px-4 py-2 font-label-md text-white hover:bg-blue-400"
        >
          + 매물 등록
        </Link>
      </div>
      <AdminPropertyList items={items} />
    </main>
  );
}
