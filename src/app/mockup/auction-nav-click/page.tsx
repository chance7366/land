import { redirect } from "next/navigation";

/** 샘플 반영 완료 → 홈으로 */
export default function AuctionNavClickMockupRedirect() {
  redirect("/");
}
