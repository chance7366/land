/** Q&A 게시판 샘플 목 데이터 */

export type QaStatus = "PENDING" | "REVIEWING" | "ANSWERED";

export const QA_STATUS_META: Record<
  QaStatus,
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

export type MockQaPost = {
  id: number;
  category: string;
  title: string;
  body: string;
  author: string;
  isSecret: boolean;
  password?: string;
  status: QaStatus;
  createdAt: string;
  answer?: {
    body: string;
    answeredAt: string;
    suggestConsult?: boolean;
  };
};

export const MOCK_QA_POSTS: MockQaPost[] = [
  {
    id: 13,
    category: "부동산 중개",
    title: "내포신도시 아파트 전세 시세 문의",
    body: "홍북읍 일대 전용 84㎡ 전세 시세와 입주 가능 매물이 있는지 궁금합니다.",
    author: "김**",
    isSecret: false,
    status: "ANSWERED",
    createdAt: "2026-07-12",
    answer: {
      body: "최근 거래 기준으로 해당 평형대 전세는 약 1.8억~2.2억 구간에서 형성되고 있습니다. 희망 조건(층·방향·입주시기)을 알려주시면 맞춤 매물을 추려 드리겠습니다.",
      answeredAt: "2026-07-12",
      suggestConsult: true,
    },
  },
  {
    id: 12,
    category: "경매/권리분석",
    title: "2025타경12345 권리분석 가능 여부",
    body: "임차인 보증금 인수 위험이 있는지 1차 검토 부탁드립니다.",
    author: "이**",
    isSecret: true,
    password: "1234",
    status: "REVIEWING",
    createdAt: "2026-07-14",
  },
  {
    id: 11,
    category: "세무/법률",
    title: "상가 양도소득세 기초 문의",
    body: "보유 5년 상가 매도 예정인데 기본 세율·공제 구조만 알고 싶습니다.",
    author: "박**",
    isSecret: false,
    status: "ANSWERED",
    createdAt: "2026-07-10",
    answer: {
      body: "서면 정보만으로는 개별 공제·필요경비 산정이 어려워 기초 안내만 가능합니다. 자세한 세무 검토는 상담예약을 이용해 주세요.",
      answeredAt: "2026-07-11",
      suggestConsult: true,
    },
  },
  {
    id: 10,
    category: "경매/권리분석",
    title: "입찰대행 수수료와 절차가 궁금합니다",
    body: "지방 법원 입찰 대행 시 진행 절차와 대략적인 비용을 알고 싶습니다.",
    author: "최**",
    isSecret: false,
    status: "PENDING",
    createdAt: "2026-07-15",
  },
  {
    id: 9,
    category: "기타",
    title: "비밀글] 개인 자산 관련 문의입니다.",
    body: "개인 자산 배분과 관련된 비공개 문의입니다.",
    author: "정**",
    isSecret: true,
    password: "5678",
    status: "PENDING",
    createdAt: "2026-07-13",
  },
];

export const ANSWER_FOOTER =
  "전문가 안내: 본 답변은 서면 제출 정보에 기반한 기본 안내입니다. 정확한 권리관계 확인, 현장 조사, 세무·법률 상세 컨설팅이 필요하신 경우 방문/전화/출장 상담예약을 이용해 주시면 더욱 상세히 도와드리겠습니다.";
