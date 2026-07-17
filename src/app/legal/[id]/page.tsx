import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LegalDetailRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/legal?id=${encodeURIComponent(id)}`);
}
