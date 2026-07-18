/** 고객관리 CRM 목업용 샘플 (프로덕션 미연동) */

export type MockCustomer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  currentAddress: string;
  profileImage: string | null;
  /** 복수 접촉 경로 가능 */
  contactChannels: ("visit" | "phone" | "email" | "web")[];
  hasTraded: boolean;
  isSubscribed: boolean;
  pipelineStage: "new" | "touring" | "contracting" | "closed" | "dormant";
  budgetRange: string;
  needsLoan: boolean;
  purpose: "invest" | "reside";
  moveUrgency: "high" | "mid" | "low";
  moveDate: string | null;
  familyMembers: string;
  preferredBrand: string;
  decisionMaker: string;
  inquiryDetails: string;
  requestNotes: string;
  specialNotes: string;
  lastContactAt: string;
  interactionCount: number;
};

export const MOCK_CUSTOMERS: MockCustomer[] = [
  {
    id: "m1",
    name: "김영수",
    phone: "010-1111-2201",
    email: "kim.ys@example.com",
    currentAddress: "충남 홍성군 홍북읍 신경리",
    profileImage: null,
    contactChannels: ["visit", "phone"],
    hasTraded: false,
    isSubscribed: true,
    pipelineStage: "touring",
    budgetRange: "현금 3억 + 대출 2억",
    needsLoan: true,
    purpose: "reside",
    moveUrgency: "high",
    moveDate: "2026-08-05",
    familyMembers: "부부 + 초등 자녀 1 (학군 중요)",
    preferredBrand: "센트럴자이 1단지 · 로얄층",
    decisionMaker: "배우자(아내) 최종 결정",
    inquiryDetails: "홍북읍 84㎡ 매매, 학군·주차·일조 우선",
    requestNotes: "이사 일정에 맞춰 잔금일 조율 필요",
    specialNotes: "주말 오후만 현장 가능 · 성향 신중",
    lastContactAt: "2026-07-15",
    interactionCount: 4,
  },
  {
    id: "m2",
    name: "이미경",
    phone: "010-2222-3302",
    email: "lee.mk@example.com",
    currentAddress: "대전 유성구 봉명동",
    profileImage: null,
    contactChannels: ["phone"],
    hasTraded: true,
    isSubscribed: false,
    pipelineStage: "contracting",
    budgetRange: "가용 5억 (대출 없음)",
    needsLoan: false,
    purpose: "invest",
    moveUrgency: "mid",
    moveDate: "2026-09-01",
    familyMembers: "본인",
    preferredBrand: "내포 택지·수익형 소형",
    decisionMaker: "본인",
    inquiryDetails: "갭투자 가능한 소형 아파트·상가",
    requestNotes: "수익률 연 4% 이상 희망",
    specialNotes: "2024 전세 거래 이력 · 기존 고객",
    lastContactAt: "2026-07-13",
    interactionCount: 6,
  },
  {
    id: "m3",
    name: "박준호",
    phone: "010-3333-4403",
    email: "",
    currentAddress: "충남 예산군 예산읍",
    profileImage: null,
    contactChannels: ["web", "email"],
    hasTraded: false,
    isSubscribed: true,
    pipelineStage: "new",
    budgetRange: "전세 2.5억",
    needsLoan: false,
    purpose: "reside",
    moveUrgency: "low",
    moveDate: "2026-10-16",
    familyMembers: "부부",
    preferredBrand: "",
    decisionMaker: "공동 명의 검토",
    inquiryDetails: "웹사이트 통해 전세 문의",
    requestNotes: "좋은 물건 나오면 천천히",
    specialNotes: "맞춤알림 키워드: 예산·홍성 전세",
    lastContactAt: "2026-07-17",
    interactionCount: 1,
  },
  {
    id: "m4",
    name: "최서연",
    phone: "010-4444-5504",
    email: "choi.sy@example.com",
    currentAddress: "서울 송파구 (지방 이주 검토)",
    profileImage: null,
    contactChannels: ["email", "phone"],
    hasTraded: false,
    isSubscribed: false,
    pipelineStage: "touring",
    budgetRange: "매매 4억대",
    needsLoan: true,
    purpose: "reside",
    moveUrgency: "high",
    moveDate: "2026-07-30",
    familyMembers: "부부 + 중학생 1",
    preferredBrand: "반도유보라 마크에디션",
    decisionMaker: "본인",
    inquiryDetails: "학군·일조 좋은 중형 아파트",
    requestNotes: "한 달 내 계약 희망",
    specialNotes: "메일로 물건지 요약 요청함",
    lastContactAt: "2026-07-16",
    interactionCount: 3,
  },
  {
    id: "m5",
    name: "정하늘",
    phone: "010-5555-6605",
    email: "jung.hn@example.com",
    currentAddress: "충남 서산시 동문동",
    profileImage: null,
    contactChannels: ["phone", "visit"],
    hasTraded: true,
    isSubscribed: true,
    pipelineStage: "dormant",
    budgetRange: "경매 낙찰가 관심",
    needsLoan: true,
    purpose: "invest",
    moveUrgency: "low",
    moveDate: null,
    familyMembers: "본인",
    preferredBrand: "",
    decisionMaker: "본인",
    inquiryDetails: "경매 권리분석 상담 이력",
    requestNotes: "급매·경매만 알림",
    specialNotes: "최근 3개월 연락 없음",
    lastContactAt: "2026-06-08",
    interactionCount: 5,
  },
];

export const CONTACT_LABELS: Record<string, string> = {
  visit: "방문상담",
  phone: "전화상담",
  email: "메일상담",
  web: "웹사이트",
};

export const PURPOSE_LABELS: Record<string, string> = {
  invest: "투자",
  reside: "실거주",
};

export const URGENCY_LABELS: Record<string, string> = {
  high: "상",
  mid: "중",
  low: "하",
};

export const STAGE_LABELS: Record<string, string> = {
  new: "신규 접수",
  touring: "매물 투어",
  contracting: "계약 조율",
  closed: "계약 완료",
  dormant: "휴면",
};
