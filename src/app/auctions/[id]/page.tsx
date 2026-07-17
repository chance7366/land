import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuctionDetailRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/auctions?id=${encodeURIComponent(id)}`);
}
