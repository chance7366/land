/** 매물 고도화 목업 공유 샘플 (등록 위저드 · 고객 상세 전환) — 운영 미적용 */

export type MaintItem = {
  key: string;
  label: string;
  amount: number | null; // 원, null=실비
  note?: string;
};

export const COMPLIANCE_PROPERTY_SAMPLE = {
  id: "cmp-apt-1",
  title: "내포신도시 호반베르디움 84A",
  featureSummary: "남향 · 고층 · 학군·편의시설 인접",
  description:
    "내포신도시 중심 생활권 아파트입니다. 남향 고층으로 채광이 좋으며, 단지 내 커뮤니티와 인근 초등학교·대형마트 접근이 편리합니다.\n\n내부 상태는 입주 청소 완료 상태이며, 즉시 입주 가능합니다.",
  category: "아파트",
  categoryGroup: "아파트/오피스텔",
  dealType: "매매",
  priceLabel: "3억 2,500만원",
  exclusiveArea: 84.92,
  supplyArea: 110.45,
  floor: 15,
  totalFloors: 25,
  floorDisplay: "15층 / 25층",
  direction: "남향",
  directionBasis: "거실 창문 기준",
  rooms: 3,
  bathrooms: 2,
  address: "충남 홍성군 홍북읍 신경리 1680",
  buildingName: "호반베르디움",
  unitDong: "101동",
  unitHo: "1502호",
  locationLine: "충남 홍성군 홍북읍 신경리 1680 · 101동 15층",
  buildingUse: "공동주택 (아파트)",
  useApprovalDate: "2019-05-20",
  parkingTotal: 320,
  parkingPerHousehold: 1.2,
  parkingActual: 320,
  illegalBuilding: false,
  unregistered: false,
  moveIn: "즉시입주",
  loanStatus: "가능 (상담)",
  manageCode: "매물_00000012",
  tags: ["즉시입주", "남향", "학군"],
  maintenanceMode: "FIXED" as const,
  maintenanceTotal: 115000,
  maintenance: [
    { key: "general", label: "일반(공용)관리비", amount: 80000, note: "청소·경비·승강기" },
    { key: "water", label: "수도료", amount: 20000, note: "정액" },
    { key: "electric", label: "전기료", amount: null, note: "실비 별도" },
    { key: "gas", label: "가스사용료", amount: null, note: "실비 별도" },
    { key: "heating", label: "난방비", amount: null, note: "개별난방 · 실비" },
    { key: "internet", label: "인터넷 사용료", amount: 10000, note: "단체계약" },
    { key: "tv", label: "TV 사용료", amount: 5000, note: "단체계약" },
  ] satisfies MaintItem[],
  options: ["엘리베이터", "현관보안", "빌트인 가스레인지", "붙박이장", "시스템에어컨"],
  badges: ["확인매물", "2025 법적명시 준수", "위반건축물 해당 없음"],
  office: {
    name: "찬스공인중개사사무소",
    regNo: "44800-2024-00001",
    address: "충남 홍성군 홍북읍 신경리 OO",
    brokerName: "김대표",
    brokerPhone: "041-633-0000",
    agentName: "이담당",
    agentPhone: "010-4284-7366",
  },
};

export const REGISTER_WIZARD_STEPS = [
  { id: 1, title: "기본정보", sub: "분류 · 주소" },
  { id: 2, title: "상세정보", sub: "면적 · 층 · 방향" },
  { id: 3, title: "가격/관리비", sub: "거래가 · 7비목" },
  { id: 4, title: "법적검증", sub: "위반 · 담당" },
  { id: 5, title: "미디어", sub: "사진 · 설명" },
] as const;

export const LEGAL_CHECKLIST_SAMPLE = [
  { id: "addr", label: "소재지(지번·동·층)", ok: true },
  { id: "area", label: "전용면적(㎡)", ok: true },
  { id: "price", label: "거래형태별 단일 가격", ok: true },
  { id: "maint", label: "정액 관리비 7대 비목", ok: true },
  { id: "dir", label: "방향 + 기준점", ok: true },
  { id: "park", label: "총/세대당/실사용 주차", ok: true },
  { id: "approve", label: "사용승인일", ok: true },
  { id: "illegal", label: "위반건축물 여부", ok: true },
  { id: "unreg", label: "미등기 여부", ok: false },
  { id: "agent", label: "중개사·소속 병기", ok: true },
];
