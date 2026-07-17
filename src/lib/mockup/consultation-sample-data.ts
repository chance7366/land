/** 상담예약 샘플용 목 데이터·상태 라벨 */

export type ConsultStatus = "RECEIVED" | "AWAITING" | "DONE";

export const CONSULT_STATUS_LABEL: Record<
  ConsultStatus,
  { label: string; className: string }
> = {
  RECEIVED: {
    label: "접수중",
    className: "border-sky-400/40 bg-sky-500/15 text-sky-300",
  },
  AWAITING: {
    label: "답변대기",
    className: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  },
  DONE: {
    label: "답변완료",
    className: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  },
};

export type MockConsult = {
  id: string;
  password: string;
  clientName: string;
  phone: string;
  category: string;
  subType: string;
  method: string;
  preferredAt: string;
  detail: string;
  status: ConsultStatus;
  createdAt: string;
  reply?: { body: string; repliedAt: string; adminName: string };
};

export const MOCK_CONSULTS: MockConsult[] = [
  {
    id: "CS-20260715-001",
    password: "a1b2c3",
    clientName: "홍길동",
    phone: "010-1234-5678",
    category: "경매 전문 상담",
    subType: "권리분석 / 안전성 진단",
    method: "전화 상담",
    preferredAt: "2026-07-18 14:00",
    detail:
      "사건번호 2025타경12345 권리분석 부탁드립니다. 임차인 보증금 인수 여부 확인이 필요합니다.",
    status: "DONE",
    createdAt: "2026-07-14 09:20",
    reply: {
      body: "등기부등본·현황조사보고서 기준으로 1순위 근저당과 소액임차인 대항요건을 검토했습니다. 인수 위험은 낮고, 입찰가 상한은 감정가의 72% 내외를 권고드립니다. 자세한 내용은 전화로 안내드리겠습니다.",
      repliedAt: "2026-07-14 16:40",
      adminName: "김영찬 공인중개사",
    },
  },
  {
    id: "CS-20260715-002",
    password: "x9y8z7",
    clientName: "김민수",
    phone: "010-9876-5432",
    category: "부동산 중개",
    subType: "부동산 구하기 (매수 / 임차)",
    method: "방문 상담",
    preferredAt: "2026-07-20 11:00",
    detail: "내포신도시 아파트 매수 희망. 예산 3억~3.5억, 3개월 이내 입주.",
    status: "AWAITING",
    createdAt: "2026-07-15 08:05",
  },
  {
    id: "CS-20260715-003",
    password: "p4q5r6",
    clientName: "이서연",
    phone: "010-5555-1212",
    category: "전문 컨설팅",
    subType: "부동산 관련 세무 상담",
    method: "전화 상담",
    preferredAt: "2026-07-19 15:30",
    detail: "상가 양도소득세 문의드립니다.",
    status: "RECEIVED",
    createdAt: "2026-07-15 10:12",
  },
];

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
