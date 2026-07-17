import { redirect } from "next/navigation";

/** 샘플 → 실서비스 반영 완료 */
export default function AuctionGuideHubRedirect() {
  redirect("/auctions/process");
}
