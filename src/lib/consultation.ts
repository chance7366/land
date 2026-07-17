import type { ConsultationStatus } from "@prisma/client";

export const CONSULT_STATUS_META: Record<
  ConsultationStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "접수중",
    className: "border-sky-400/40 bg-sky-500/15 text-sky-300",
  },
  PROCESSING: {
    label: "답변대기",
    className: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  },
  DONE: {
    label: "답변완료",
    className: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  },
};

export const SERVICE_CATEGORIES = [
  {
    id: "brokerage",
    title: "부동산 중개",
    icon: "home",
    desc: "매물 등록 · 구하기",
    subs: [
      { id: "list", label: "내 부동산 내놓기 (매도 / 임대)" },
      { id: "find", label: "부동산 구하기 (매수 / 임차)" },
    ],
  },
  {
    id: "auction",
    title: "경매 전문 상담",
    icon: "gavel",
    desc: "권리분석 · 입찰대행",
    subs: [
      { id: "rights", label: "권리분석 / 안전성 진단" },
      { id: "bid", label: "입찰 대행 / 경매 대리" },
    ],
  },
  {
    id: "consulting",
    title: "전문 컨설팅",
    icon: "balance",
    desc: "세무 · 법률 · 경영진단",
    subs: [
      { id: "tax", label: "부동산 관련 세무 상담" },
      { id: "legal", label: "부동산 관련 법률 상담" },
      { id: "biz", label: "기업/자산 경영진단 컨설팅" },
    ],
  },
] as const;

export function generateAccessCode(length = 6): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return "***";
  return `${digits.slice(0, 3)}-****-${digits.slice(-4)}`;
}

export function publicCaseId(id: string, createdAt: Date): string {
  const d = createdAt.toISOString().slice(0, 10).replace(/-/g, "");
  return `CS-${d}-${id.slice(-4).toUpperCase()}`;
}
