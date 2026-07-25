import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

/** 구 스텁 → 상세 재구성 목업으로 연결 */
export default async function PropertyDetailPageMockupRedirect({ searchParams }: PageProps) {
  const { id } = await searchParams;
  const q = id ? `?id=${encodeURIComponent(id)}` : "";
  redirect(`/mockup/property-detail-redesign${q}`);
}
