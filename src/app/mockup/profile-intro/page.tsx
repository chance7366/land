import { redirect } from "next/navigation";

/** 샘플 반영 완료 → /profile */
export default function ProfileIntroMockupRedirect() {
  redirect("/profile");
}
