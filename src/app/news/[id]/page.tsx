import { redirect } from "next/navigation";

/** 피드형 /news로 통합 — 상세는 원문 링크로 이동 */
export default function NewsDetailRedirect() {
  redirect("/news");
}
