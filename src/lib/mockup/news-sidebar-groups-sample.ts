import {
  Building,
  Building2,
  ChartColumn,
  Home,
  Landmark,
  LayoutDashboard,
  MapPinned,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

export type NewsGroupId = "estate" | "region";

export type NewsSidebarSourceKey =
  | "all"
  | "naver"
  | "molit"
  | "chungnam"
  | "hongseong"
  | "yesan"
  | "rtech"
  | "r114";

export type NewsSidebarSourceId = Exclude<NewsSidebarSourceKey, "all">;

export type NewsGroupSampleItem = {
  id: string;
  source: NewsSidebarSourceId;
  sourceName: string;
  title: string;
  summary: string;
  press: string;
  originUrl: string;
  pubDate: string;
  imageUrl?: string | null;
};

export type NewsSidebarItem = {
  key: NewsSidebarSourceKey;
  label: string;
  icon: LucideIcon;
};

export type NewsSidebarGroup = {
  id: NewsGroupId;
  label: string;
  sources: NewsSidebarSourceId[];
  items: NewsSidebarItem[];
};

const badgeClass: Record<NewsSidebarSourceId, string> = {
  naver: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  molit: "border-sky-400/40 bg-sky-500/15 text-sky-300",
  chungnam: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  hongseong: "border-orange-400/40 bg-orange-500/15 text-orange-300",
  yesan: "border-lime-400/40 bg-lime-500/15 text-lime-300",
  rtech: "border-violet-400/40 bg-violet-500/15 text-violet-300",
  r114: "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-300",
};

const shortLabel: Record<NewsSidebarSourceId, string> = {
  naver: "네이버",
  molit: "국토부",
  chungnam: "충남",
  hongseong: "홍성",
  yesan: "예산",
  rtech: "R-TECH",
  r114: "R114",
};

export function getGroupedSourceBadge(source: NewsSidebarSourceId) {
  return { badgeClass: badgeClass[source], shortLabel: shortLabel[source] };
}

/** 사이드바 그룹 — 각 그룹의 ‘전체’는 해당 그룹 합계만 */
export const NEWS_SIDEBAR_GROUPS: NewsSidebarGroup[] = [
  {
    id: "estate",
    label: "부동산소식",
    sources: ["r114", "naver", "rtech", "molit"],
    items: [
      { key: "all", label: "전체", icon: LayoutDashboard },
      { key: "r114", label: "부동산114", icon: Building },
      { key: "naver", label: "네이버뉴스", icon: Newspaper },
      { key: "rtech", label: "부동산테크", icon: ChartColumn },
      { key: "molit", label: "국토교통부", icon: Landmark },
    ],
  },
  {
    id: "region",
    label: "지역소식",
    sources: ["chungnam", "hongseong", "yesan"],
    items: [
      { key: "all", label: "전체", icon: LayoutDashboard },
      { key: "chungnam", label: "충남도청", icon: Building2 },
      { key: "hongseong", label: "홍성군청", icon: Home },
      { key: "yesan", label: "예산군청", icon: MapPinned },
    ],
  },
];

export const NEWS_GROUP_PAGE_SIZE = 20;

/** 샘플 목록 — 그룹 UI 확인용 (예산군청 신설 포함) */
export const MOCK_GROUPED_NEWS_ITEMS: NewsGroupSampleItem[] = (
  [
  {
    id: "r4-1",
    source: "r114",
    sourceName: "부동산114",
    title: "미리내집(장기전세2), 신혼부부 주거·출산 지원에 초점",
    summary: "장기전세2는 신혼부부 주거 안정과 출산 장려에 초점을 맞춘 혜택 구조를 안내합니다.",
    press: "청약",
    originUrl: "https://r114.com/trends/wiki/subscription/sample-1",
    pubDate: "2026-07-15",
  },
  {
    id: "nv-1",
    source: "naver",
    sourceName: "네이버뉴스",
    title: "분양가 치솟는데 대출은 ‘바늘구멍’…무주택자 내집마련 멀어지나요",
    summary: "최근 3기 신도시 공급과 대출 규제 속에서 실수요자 부담이 커지고 있습니다.",
    press: "한겨레",
    originUrl: "https://n.news.naver.com/article/028/0002814156",
    pubDate: "2026-07-15",
    imageUrl:
      "https://imgnews.pstatic.net/image/011/2026/07/16/0004642100_001_20260716060410114.jpg?type=nf142_103",
  },
  {
    id: "rt-1",
    source: "rtech",
    sourceName: "부동산테크",
    title: "경유 운행 전세버스 3.9만대…유가보조금 월 25만원 지급",
    summary: "전세버스 유가보조금 지원 확대 방안이 논의되며 운송·물류 업계 관심이 커졌습니다.",
    press: "한경 집코노미",
    originUrl: "https://www.hankyung.com/article/2026071577171",
    pubDate: "2026-07-15",
  },
  {
    id: "mo-1",
    source: "molit",
    sourceName: "국토교통부",
    title: "‘주택 공급에 전사적 역량 집중’, ‘국가 균형 성장에 LH 핵심 역할’ 강조",
    summary: "국토교통부가 주택 공급과 균형 성장을 위한 LH 역할을 강조했습니다.",
    press: "국토교통부",
    originUrl: "https://www.molit.go.kr/USR/NEWS/m_71/dtl.jsp?id=95092200",
    pubDate: "2026-07-14",
  },
  {
    id: "nv-2",
    source: "naver",
    sourceName: "네이버뉴스",
    title: "내포신도시 아파트 매매가, 전분기 대비 소폭 상승",
    summary: "충남 내포신도시 중소형 아파트 실거래가가 전분기 대비 소폭 올랐습니다.",
    press: "연합뉴스",
    originUrl: "https://example.com/news/naver/naepo-price",
    pubDate: "2026-07-14",
    imageUrl:
      "https://imgnews.pstatic.net/image/011/2026/07/15/0004642020_001_20260715201610214.jpg?type=nf142_103",
  },
  {
    id: "r4-2",
    source: "r114",
    sourceName: "부동산114",
    title: "7월 전국 아파트 매매·전세 시세 리포트",
    summary: "전국 아파트 매매·전세 시세를 권역별로 정리한 7월 리포트입니다.",
    press: "매매",
    originUrl: "https://r114.com/trends/wiki/sale/sample-2",
    pubDate: "2026-07-13",
  },
  {
    id: "rt-2",
    source: "rtech",
    sourceName: "부동산테크",
    title: "대전 3개 구역 '노후도시 선도지구'로…크로바 4억 급등",
    summary: "대전 노후도시 선도지구 지정 기대에 인근 단지 시세가 움직였습니다.",
    press: "한경 집코노미",
    originUrl: "https://www.hankyung.com/article/2026071574661",
    pubDate: "2026-07-13",
  },
  {
    id: "mo-2",
    source: "molit",
    sourceName: "국토교통부",
    title: "[보도자료] 전세사기 피해 예방을 위한 임차인 보호 강화",
    summary: "임차인 보호와 전세사기 예방을 위한 제도 개선 방향을 발표했습니다.",
    press: "주택정책과",
    originUrl: "https://www.molit.go.kr/USR/NEWS/m_71/dtl.jsp?id=95092190",
    pubDate: "2026-07-11",
  },
  {
    id: "cn-1",
    source: "chungnam",
    sourceName: "충남도청",
    title: "세종 「세종 우미 린 센터파크」 장애인 기관추천 특별공급 변경알림",
    summary:
      "세종 「세종 우미 린 센터파크」 장애인 기관추천 특별공급 변경사항을 안내하오니, 참고하시기 바랍니다.",
    press: "장애인복지과",
    originUrl:
      "https://www.chungnam.go.kr/cnportal/bbs/B0000134/view.do?nttId=2180210&menuNo=5100288",
    pubDate: "2026-07-13",
  },
  {
    id: "hs-1",
    source: "hongseong",
    sourceName: "홍성군청",
    title: "2026년 다목적 농업장비(운반기) 지원사업 추가 신청 알림",
    summary:
      "농작업 효율성 향상을 위한 다목적 농업장비(운반기) 지원사업 신청을 다음과 같이 알려드립니다.",
    press: "농업정책과",
    originUrl:
      "https://www.hongseong.go.kr/bbs/BBSMSTR_000000000841/view.do?nttId=B000000281701Wp1aC2",
    pubDate: "2026-07-15",
  },
  {
    id: "hs-2",
    source: "hongseong",
    sourceName: "홍성군청",
    title: "광천읍 원도심 빈집 재개발사업 폐공동주택 철거공사에 따른 자재 반출 공고(2차)",
    summary:
      "홍성군에서 추진하는 「광천읍 원도심 빈집 재개발사업」과 관련하여 철거 예정인 폐공동주택 자재 반출을 공고합니다.",
    press: "혁신전략담당관",
    originUrl:
      "https://www.hongseong.go.kr/prog/saeolGosi/kor/sub03_0204/GOSI_ALL/view.do?notAncmtMgtNo=45035",
    pubDate: "2026-07-14",
  },
  {
    id: "cn-2",
    source: "chungnam",
    sourceName: "충남도청",
    title: "2026년 제2회 충청남도 건설기술심의위원회 설계심의분과 소위원회 위원명단 공개",
    summary:
      "'서천특화시장 재건축사업' 설계시공일괄입찰 설계심의분과 소위원회 심의위원 명단을 붙임과 같이 공개합니다.",
    press: "건설정책과",
    originUrl:
      "https://www.chungnam.go.kr/cnportal/bbs/B0000134/view.do?nttId=2180375&menuNo=5100288",
    pubDate: "2026-07-15",
  },
  {
    id: "ys-1",
    source: "yesan",
    sourceName: "예산군청",
    title: "예산군 공공임대주택 입주자 모집 안내",
    summary:
      "군민 주거 안정을 위한 공공임대주택 입주자를 다음과 같이 모집하오니 관심 있는 군민께서는 신청해 주시기 바랍니다.",
    press: "건축과",
    originUrl: "https://www.yesan.go.kr/kor/sub03_01_01.do",
    pubDate: "2026-07-15",
  },
  {
    id: "ys-2",
    source: "yesan",
    sourceName: "예산군청",
    title: "예산읍 도시재생 뉴딜사업 주민공청회 개최 알림",
    summary:
      "예산읍 도시재생 뉴딜사업 추진을 위한 주민공청회를 개최하오니 많은 참여 부탁드립니다.",
    press: "도시재생과",
    originUrl: "https://www.yesan.go.kr/kor/sub03_02_01.do",
    pubDate: "2026-07-14",
  },
  {
    id: "ys-3",
    source: "yesan",
    sourceName: "예산군청",
    title: "2026년 농촌주택 개량사업 추가 신청 접수",
    summary:
      "농촌지역 주거환경 개선을 위한 농촌주택 개량사업 추가 신청을 접수합니다.",
    press: "농촌개발과",
    originUrl: "https://www.yesan.go.kr/kor/sub04_01_01.do",
    pubDate: "2026-07-12",
  },
  {
    id: "ys-4",
    source: "yesan",
    sourceName: "예산군청",
    title: "군청 앞 공영주차장 확장공사에 따른 교통통제 안내",
    summary:
      "공영주차장 확장공사로 인해 일부 차로가 통제되오니 우회해 주시기 바랍니다.",
    press: "건설교통과",
    originUrl: "https://www.yesan.go.kr/kor/sub03_03_01.do",
    pubDate: "2026-07-10",
  },
  {
    id: "ys-5",
    source: "yesan",
    sourceName: "예산군청",
    title: "예산군 빈집 정비 및 활용 지원사업 안내",
    summary:
      "방치 빈집 정비와 활용을 지원하는 사업 안내를 붙임과 같이 공고합니다.",
    press: "건축과",
    originUrl: "https://www.yesan.go.kr/kor/sub03_01_02.do",
    pubDate: "2026-07-08",
  },
  {
    id: "cn-3",
    source: "chungnam",
    sourceName: "충남도청",
    title: "충남도, 내포신도시 광역교통망 확충 계획 발표",
    summary: "내포신도시 광역교통망 확충 중장기 계획을 발표했습니다.",
    press: "교통정책과",
    originUrl: "https://www.chungnam.go.kr/cnportal/bbs/B0000488/list.do",
    pubDate: "2026-07-07",
  },
  // 동일 등록일 섞임 확인용 (그룹 전체 정렬 샘플)
  {
    id: "nv-3",
    source: "naver",
    sourceName: "네이버뉴스",
    title: "강남 신축 거래 멈췄다… 대단지 1년간 매매 급감",
    summary: "강남권 신축 아파트 거래가 주춤하며 관망세가 이어지고 있습니다.",
    press: "파이낸셜뉴스",
    originUrl: "https://example.com/news/naver/gangnam",
    pubDate: "2026-07-15",
    imageUrl:
      "https://imgnews.pstatic.net/image/014/2026/07/15/0005548743_001_20260715183223294.jpg?type=nf142_103",
  },
  {
    id: "mo-3",
    source: "molit",
    sourceName: "국토교통부",
    title: "부동산정책, 국민의 목소리를 듣습니다.",
    summary: "부동산 제도 개선을 위한 국민 의견 수렴을 안내합니다.",
    press: "부동산제도기획과",
    originUrl: "https://www.molit.go.kr/USR/NEWS/m_71/dtl.jsp?id=95092180",
    pubDate: "2026-07-15",
  },
  {
    id: "ys-6",
    source: "yesan",
    sourceName: "예산군청",
    title: "예산군 여름철 폭염 대비 무더위 쉼터 운영 안내",
    summary: "폭염 취약계층 보호를 위한 무더위 쉼터 운영 장소를 안내합니다.",
    press: "주민복지과",
    originUrl: "https://www.yesan.go.kr/kor/sub05_01_01.do",
    pubDate: "2026-07-15",
  },
  {
    id: "hs-3",
    source: "hongseong",
    sourceName: "홍성군청",
    title: "홍성군 여름철 물놀이 안전수칙 안내",
    summary: "군민 안전을 위한 물놀이 안전수칙과 주의사항을 안내합니다.",
    press: "안전총괄과",
    originUrl:
      "https://www.hongseong.go.kr/bbs/BBSMSTR_000000000841/view.do?nttId=sample-safety",
    pubDate: "2026-07-15",
  },
  {
    id: "r4-3",
    source: "r114",
    sourceName: "부동산114",
    title: "지방 중소도시 미분양 해소 속도, 권역별 차이",
    summary: "권역별로 미분양 해소 속도에 온도 차가 나타나고 있습니다.",
    press: "매매",
    originUrl: "https://r114.com/trends/wiki/sale/sample-3",
    pubDate: "2026-07-14",
  },
  {
    id: "rt-3",
    source: "rtech",
    sourceName: "부동산테크",
    title: "은행 자체감정 분쟁 늘어…감정평가 신뢰성 논란",
    summary: "금융권 자체감정과 관련한 분쟁이 늘며 신뢰성 논의가 이어집니다.",
    press: "한경 집코노미",
    originUrl: "https://www.hankyung.com/article/20260714sample",
    pubDate: "2026-07-14",
  },
] as NewsGroupSampleItem[]
).slice().sort((a, b) => (a.pubDate < b.pubDate ? 1 : a.pubDate > b.pubDate ? -1 : 0));

export function filterGroupedNewsItems(
  items: NewsGroupSampleItem[],
  groupId: NewsGroupId,
  source: NewsSidebarSourceKey,
) {
  const group = NEWS_SIDEBAR_GROUPS.find((g) => g.id === groupId)!;
  if (source === "all") {
    return items.filter((row) => group.sources.includes(row.source));
  }
  if (!group.sources.includes(source as NewsSidebarSourceId)) {
    return [];
  }
  return items.filter((row) => row.source === source);
}

/** 그룹 전체: 등록일 최신순, 동일 등록일은 랜덤 — 공용 구현 재사용 */
export { sortGroupAllByDateThenRandom } from "@/lib/news-feed";

export function countGroupedNews(
  items: NewsGroupSampleItem[],
  groupId: NewsGroupId,
  source: NewsSidebarSourceKey,
) {
  return filterGroupedNewsItems(items, groupId, source).length;
}
