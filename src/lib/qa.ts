import type { LegalQuestionStatus } from "@prisma/client";

export const QA_STATUS_META: Record<
  LegalQuestionStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "접수중",
    className: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  },
  REVIEWING: {
    label: "검토중",
    className: "border-sky-400/40 bg-sky-500/15 text-sky-300",
  },
  ANSWERED: {
    label: "답변완료",
    className: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  },
};

export const QA_CATEGORIES = [
  "전체",
  "부동산 중개",
  "경매/권리분석",
  "세무/법률",
  "기타",
] as const;

export const ANSWER_FOOTER =
  "전문가 안내: 본 답변은 서면 제출 정보에 기반한 기본 안내입니다. 정확한 권리관계 확인, 현장 조사, 세무·법률 상세 컨설팅이 필요하신 경우 방문/전화/출장 상담예약을 이용해 주시면 더욱 상세히 도와드리겠습니다.";

export function maskAuthor(name: string): string {
  const t = name.trim();
  if (!t) return "**";
  return `${t[0]}**`;
}

export function displayQaTitle(question: string, ..._flags: boolean[]): string {
  void _flags;
  return question;
}

export function consultHrefFromQaCategory(category?: string) {
  if (!category || category === "전체") return "/consultation";
  return `/consultation?from=qa&category=${encodeURIComponent(category)}`;
}

export function formatQaDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
