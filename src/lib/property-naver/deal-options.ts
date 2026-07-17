export const DEAL_TYPE_OPTIONS = [
  { value: "SALE", label: "매매" },
  { value: "RENT", label: "전세/월세" },
  { value: "SHORT_TERM", label: "단기임대" },
  { value: "PRE_SALE", label: "분양권" },
] as const;

export const DEAL_SUBTYPE_OPTIONS = [
  { value: "JEONSE", label: "전세" },
  { value: "MONTHLY", label: "월세" },
] as const;

export const LOAN_STATUS_OPTIONS = ["없음", "시세 30% 이하", "시세 30% 초과"] as const;

export const MOVE_IN_TYPE_OPTIONS = ["즉시입주", "협의가능", "지정일"] as const;

export const OWNER_RELATION_OPTIONS = ["본인", "대리인"] as const;

export const DIRECTION_OPTIONS = ["동향", "서향", "남향", "북향", "남동향", "남서향", "북동향", "북서향"] as const;

export const DIRECTION_BASIS_OPTIONS = ["거실", "안방"] as const;

export const STRUCTURE_TYPE_OPTIONS = ["계단식", "복도식", "복층형", "기타"] as const;

export const MAINTENANCE_INCLUDE_OPTIONS = [
  "수도",
  "전기",
  "가스",
  "인터넷",
  "TV",
  "청소비",
  "승강기",
] as const;

export const MAINTENANCE_BILLING_OPTIONS = ["정액", "실비", "미정"] as const;

export const ENTRANCE_TYPE_OPTIONS = ["계단식", "복도식", "복합식"] as const;

export const HEATING_TYPE_OPTIONS = ["개별난방", "중앙난방", "지역난방", "기타"] as const;

export const HEATING_FUEL_OPTIONS = ["도시가스", "전기", "기름", "기타"] as const;

export const BUILDING_USE_OPTIONS = [
  "다세대",
  "연립",
  "단독",
  "다가구",
  "근린생활시설",
  "업무시설",
  "기타",
] as const;

export const OPTION_ITEM_OPTIONS = [
  "에어컨",
  "세탁기",
  "냉장고",
  "가스레인지",
  "인덕션",
  "옷장",
  "신발장",
  "침대",
  "책상",
] as const;

export const LOCATION_TRAIT_OPTIONS = [
  "1층 전면",
  "엘리베이터 앞",
  "코너 상가",
  "내부",
  "기타",
] as const;

export const TOILET_LOCATION_OPTIONS = ["내부", "외부", "남녀구분"] as const;

export const LAND_CATEGORY_OPTIONS = [
  "대",
  "전",
  "답",
  "과수원",
  "임야",
  "잡종지",
  "공장용지",
  "기타",
] as const;

export const ZONING_OPTIONS = [
  "제1종전용주거지역",
  "제2종전용주거지역",
  "제1종일반주거지역",
  "제2종일반주거지역",
  "제3종일반주거지역",
  "준주거지역",
  "중심상업지역",
  "일반상업지역",
  "근린상업지역",
  "유통상업지역",
  "전용공업지역",
  "일반공업지역",
  "준공업지역",
  "보전녹지지역",
  "생산녹지지역",
  "자연녹지지역",
  "계획관리지역",
  "생산관리지역",
  "보전관리지역",
  "농림지역",
  "자연환경보전지역",
  "기타",
] as const;

export const ROAD_ACCESS_OPTIONS = ["맹지", "2m 미만", "4m 접", "6m 접", "8m 이상"] as const;

export const ROAD_PAVED_OPTIONS = ["포장", "비포장"] as const;

export const TERRAIN_OPTIONS = ["평지", "완경사", "급경사"] as const;

export const LAND_SHAPE_OPTIONS = ["정방형", "부정형", "자루형", "세장형", "기타"] as const;

export const LAND_USE_STATUS_OPTIONS = ["건부지", "나대지", "전·답 경작 중", "임야", "기타"] as const;

export const HVAC_OPTIONS = ["천장형", "스탠드형", "벽걸이", "없음", "기타"] as const;

export const ELEVATOR_TYPE_OPTIONS = ["승객용", "화물용", "겸용", "없음"] as const;
