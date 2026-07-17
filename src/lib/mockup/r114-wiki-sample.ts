/** 부동산114 위키 샘플 — 카테고리별 제목·한줄요약·날짜 */

export type R114WikiCategoryId =
  | "all"
  | "sale"
  | "rent"
  | "finance"
  | "subscription"
  | "tax"
  | "auction"
  | "policy"
  | "redevelopment"
  | "commercial"
  | "lifestyle";

export type R114WikiCategory = {
  id: R114WikiCategoryId;
  label: string;
  listUrl: string;
  /** lucide 아이콘 이름 키 — UI에서 매핑 */
  iconKey:
    | "grid"
    | "home"
    | "key"
    | "wallet"
    | "clipboard"
    | "receipt"
    | "gavel"
    | "landmark"
    | "buildings"
    | "store"
    | "mapPin";
  /** 연한 타일 배경 / 아이콘 색 (첨부 팔레트) */
  tileClass: string;
  iconClass: string;
};

export const R114_WIKI_CATEGORIES: R114WikiCategory[] = [
  {
    id: "all",
    label: "전체",
    listUrl: "https://r114.com/trends/wiki/all",
    iconKey: "grid",
    tileClass: "bg-white/10 ring-1 ring-white/25",
    iconClass: "text-white",
  },
  {
    id: "sale",
    label: "매매",
    listUrl: "https://r114.com/trends/wiki/sale",
    iconKey: "home",
    tileClass: "bg-[#fce7f3]/90",
    iconClass: "text-[#db2777]",
  },
  {
    id: "rent",
    label: "전월세",
    listUrl: "https://r114.com/trends/wiki/rent",
    iconKey: "key",
    tileClass: "bg-[#ffedd5]/90",
    iconClass: "text-[#ea580c]",
  },
  {
    id: "finance",
    label: "금융",
    listUrl: "https://r114.com/trends/wiki/finance",
    iconKey: "wallet",
    tileClass: "bg-[#ccfbf1]/90",
    iconClass: "text-[#0d9488]",
  },
  {
    id: "subscription",
    label: "청약",
    listUrl: "https://r114.com/trends/wiki/subscription",
    iconKey: "clipboard",
    tileClass: "bg-[#dbeafe]/90",
    iconClass: "text-[#2563eb]",
  },
  {
    id: "tax",
    label: "세금",
    listUrl: "https://r114.com/trends/wiki/tax",
    iconKey: "receipt",
    tileClass: "bg-[#ede9fe]/90",
    iconClass: "text-[#7c3aed]",
  },
  {
    id: "auction",
    label: "경매",
    listUrl: "https://r114.com/trends/wiki/auction",
    iconKey: "gavel",
    tileClass: "bg-[#fef3c7]/90",
    iconClass: "text-[#b45309]",
  },
  {
    id: "policy",
    label: "제도",
    listUrl: "https://r114.com/trends/wiki/policy",
    iconKey: "landmark",
    tileClass: "bg-[#e0e7ff]/90",
    iconClass: "text-[#1e3a8a]",
  },
  {
    id: "redevelopment",
    label: "정비사업",
    listUrl: "https://r114.com/trends/wiki/redevelopment",
    iconKey: "buildings",
    tileClass: "bg-[#ccfbf1]/90",
    iconClass: "text-[#0f766e]",
  },
  {
    id: "commercial",
    label: "상업용",
    listUrl: "https://r114.com/trends/wiki/commercial",
    iconKey: "store",
    tileClass: "bg-[#fce7f3]/90",
    iconClass: "text-[#c026d3]",
  },
  {
    id: "lifestyle",
    label: "생활정보",
    listUrl: "https://r114.com/trends/wiki/lifestyle",
    iconKey: "mapPin",
    tileClass: "bg-[#ecfccb]/90",
    iconClass: "text-[#65a30d]",
  },
];

export type R114WikiSample = {
  id: string;
  category: Exclude<R114WikiCategoryId, "all">;
  title: string;
  summary: string;
  pubDate: string;
  originUrl: string;
};

function row(
  id: string,
  category: Exclude<R114WikiCategoryId, "all">,
  title: string,
  summary: string,
  pubDate: string,
  originUrl: string,
): R114WikiSample {
  return { id, category, title, summary, pubDate, originUrl };
}

/** 실제 r114 위키 제목·요약·원문 URL (카테고리/{uuid}) */
export const MOCK_R114_WIKI: R114WikiSample[] = [
  row(
    "r114-sale-1",
    "sale",
    "주택구입부담지수(K-HAI)",
    "중위가구소득 대비 주택담보대출 원리금 상환에 필요한 소득의 비율을 계산한 지수로, 한국주택금융공사에서 매 분기 발표하는 한국형 지표입니다.",
    "2026-07-01",
    "https://r114.com/trends/wiki/sale/3904a6fa-284b-801f-998e-d65660e04aa3",
  ),
  row(
    "r114-sale-2",
    "sale",
    "서울 집값의 중심축: 한강벨트 입지와 미래 가치",
    "강남에만 국한되던 부촌(富村)의 영역이 강북 한강변의 재개발·재건축을 통해 한강 양안을 따라 거대한 '띠(Belt)' 모양으로 확장되면서 등장한 용어입니다.",
    "2026-07-01",
    "https://r114.com/trends/wiki/sale/38f4a6fa-284b-8024-8443-f744e78a6ce6",
  ),
  row(
    "r114-sale-3",
    "sale",
    "서울 아파트 지도의 핵심: 마용성·노도강·금관구",
    "서울의 주요 입지를 가격대와 지리적 특징에 따라 크게 세 개의 그룹으로 묶어 부르는 용어입니다.",
    "2026-06-30",
    "https://r114.com/trends/wiki/sale/38f4a6fa-284b-80ec-b2f3-e1fba47f2c48",
  ),
  row(
    "r114-rent-1",
    "rent",
    "시세 80%로 최장 20년 거주! 서울시 장기전세주택(미리내집)",
    "'미리내집(장기전세2)'은 오직 '신혼부부'의 주거 안정과 출산 장려에 초점을 맞추어 혜택과 소득 기준을 파격적으로 완화한 버전입니다.",
    "2026-07-14",
    "https://r114.com/trends/wiki/rent/39d4a6fa-284b-8085-9756-f7a1eb0f3b1d",
  ),
  row(
    "r114-rent-2",
    "rent",
    "청춘을 위한 도심 속 주거 징검다리, 행복주택",
    "대학생·청년·신혼부부 등 젊은 층의 주거 안정을 위해 지하철역 근처나 대학교, 산업단지 주변 등 교통이 편리한 곳에 지어 공급하는 저렴한 공공임대주택입니다.",
    "2026-07-07",
    "https://r114.com/trends/wiki/rent/3964a6fa-284b-8054-ae4e-c63296f01d4b",
  ),
  row(
    "r114-rent-3",
    "rent",
    "전 세계 유일! 왜 한국에만 '전세' 제도가 존재할까?",
    "1970년대 한강의 기적 시기, 시골에서 서울로 사람들이 대거 몰려들면서 주택 부족 현상이 심화되었습니다. 이때 집을 지어 팔려는 사람(공급자)과 서울에 집을 구하려는 사람(수요자) 간의 이해관계가 맞아 떨어지며 전세 제도가 급격히 팽창했습니다.",
    "2026-06-26",
    "https://r114.com/trends/wiki/rent/38b4a6fa-284b-80af-bd22-dfee36bab299",
  ),
  row(
    "r114-finance-1",
    "finance",
    "\"주담대 한도 반토막\" KB국민은행 6억 ➔ 3억 전격 축소",
    "가파르게 치솟는 가계대출 총량을 선제적으로 조이고 관리하기 위한 자체 '초강수' 관리 카드입니다.",
    "2026-07-10",
    "https://r114.com/trends/wiki/finance/3994a6fa-284b-8037-b2ed-ca0e435e1fde",
  ),
  row(
    "r114-finance-2",
    "finance",
    "“중기청 대출이 끝났다고요?\" 2026년 완전히 개편된 '청년 버팀목 전세대출'",
    "청년 버팀목 전세대출을 신청할 때 '중소기업 재직 우대금리'를 고스란히 적용받아 초저금리로 이용할 수 있습니다. 기존 중기청 대출은 사라졌지만, 그 혜택은 청년 버팀목 대출의 우대 조건 속으로 그대로 흡수되었습니다.",
    "2026-06-24",
    "https://r114.com/trends/wiki/finance/3884a6fa-284b-80c9-9254-e0262192654d",
  ),
  row(
    "r114-finance-3",
    "finance",
    "이사 갈 때 필수! 우체국 '주거이전 우편물 전송서비스'",
    "예전 주소로 발송된 우편물을 새로 이사한 주소로 알아서 다시 보내주는(전송) 서비스입니다. 일일이 카드사나 은행 사이트에 들어가 주소를 바꾸지 않아도, 이 서비스를 신청해 두면 우체국에서 알아서 새 주소지로 우편물을 배달해 줍니다.",
    "2026-06-24",
    "https://r114.com/trends/wiki/finance/3884a6fa-284b-804a-bbeb-daf2b34068a2",
  ),
  row(
    "r114-subscription-1",
    "subscription",
    "평당 6천만원 시대 개막: 서울 분양가 상승세와 노량진 뉴타운의 현주소",
    "지속적인 건설 공사비 원가 상승과 서울 도심 내 '신축 아파트 선호 현상'이 결합한 결과입니다.",
    "2026-07-13",
    "https://r114.com/trends/wiki/subscription/39c4a6fa-284b-80c7-9465-f6d68e164269",
  ),
  row(
    "r114-subscription-2",
    "subscription",
    "'깜깜이 분양'의 실체",
    "건설사나 시행사가 아파트 분양을 진행할 때 신문 광고, 견본주택(모델하우스) 개관 등 일반적인 홍보 활동을 의도적으로 생략하거나 최소화하여 대중 모르게 청약 일정을 넘겨버리는 변칙 분양 기법입니다.",
    "2026-07-01",
    "https://r114.com/trends/wiki/subscription/3904a6fa-284b-800e-bb8e-c8d7f3f6047c",
  ),
  row(
    "r114-subscription-3",
    "subscription",
    "청약 통장으로 내 집 마련하는 지름길, 일반분양",
    "재건축·재개발(정비사업)이나 신도시 개발 시, 조합원이나 원주민에게 돌아가고 남은 아파트를 일반 대중(무주택자 등)에게 공개 청약 방식으로 매각하는 물량입니다.",
    "2026-06-30",
    "https://r114.com/trends/wiki/subscription/38f4a6fa-284b-8046-8cac-c4a6c9bab629",
  ),
  row(
    "r114-tax-1",
    "tax",
    "등록임대주택 제도",
    "사설 전·월세 시장의 급격한 임대료 인상을 통제하고, 세입자들이 이사 걱정 없이 장기간 안정적으로 거주할 수 있는 환경을 만들기 위해 도입되었습니다.",
    "2026-07-01",
    "https://r114.com/trends/wiki/tax/3904a6fa-284b-803c-a4cd-e67a21342986",
  ),
  row(
    "r114-tax-2",
    "tax",
    "내 세금의 기준: 공시가격 현실화 계획과 폐지 논란",
    "공시가격이 실제 거래되는 시세보다 너무 낮아 형평성에 어긋난다는 지적에 따라, 이를 시세의 90% 수준까지 매년 단계적으로 올리려 했던 로드맵입니다.",
    "2026-06-30",
    "https://r114.com/trends/wiki/tax/38f4a6fa-284b-801c-bc82-ff4767e4b742",
  ),
  row(
    "r114-tax-3",
    "tax",
    "빌딩 로비에 비싼 조각상을 두는 진짜 이유",
    "우리나라 『문화예술진흥법 제9조』에 명시된 \"건축물 미술작품 제도\" 때문입니다. 일정한 규모 이상의 대형 건축물을 신축하거나 증축할 때, 건축주가 상생과 도시 미관 개선을 위해 건축 비용의 일정 비율(보통 1% 이하, 공동주택은 0.1%, 일반 상가는 0.5%~0.7%) 범위 안에서 의무적으로 미술작품을 설치하도록 규정하고 있습니다. 1995년부터 의무 제도로 완전히 자리 잡았습니다.",
    "2026-06-25",
    "https://r114.com/trends/wiki/tax/38a4a6fa-284b-8081-b868-fa58670d0511",
  ),
  row(
    "r114-auction-1",
    "auction",
    "낙찰대금은 누가 먼저 가져갈까? 배당 순위 절대 공식 8단계",
    "법으로 정해진 8가지 순위에 따라 엄격하게 배당(돈을 나눔)됩니다. 앞 순위가 자신의 몫을 100% 다 챙겨간 후에야 남는 돈을 다음 순위로 넘겨주는 방식입니다.",
    "2026-06-25",
    "https://r114.com/trends/wiki/auction/3894a6fa-284b-804e-a263-faae78cda905",
  ),
  row(
    "r114-auction-2",
    "auction",
    "집이 다 지어지지도 않았는데 경매가 가능한가요? (미등기 신축 주택 경매)",
    "민사집행법 제81조(첨부서류) 예외 규정 덕분에 가능합니다. 일반적으로 경매를 신청하려면 등기부등본을 제출해야 합니다. 하지만 아직 보존등기가 되지 않은 신축 건물의 경우, 법은 채권자를 보호하기 위해 예외를 둡니다.",
    "2026-06-24",
    "https://r114.com/trends/wiki/auction/3894a6fa-284b-804c-9142-c0c18575c445",
  ),
  row(
    "r114-auction-3",
    "auction",
    "내 돈을 지키는 운명의 선: 말소기준권리 6가지 후보",
    "경매 낙찰자가 '인수해야 하는 빚(권리)'이 있는지 판가름하는 절대적 기준선입니다.",
    "2026-06-24",
    "https://r114.com/trends/wiki/auction/3894a6fa-284b-801b-86f1-e5e686b26815",
  ),
  row(
    "r114-policy-1",
    "policy",
    "\"옵션비 꼼수 인상 끝!\" 민간임대주택 관리비·사용료 신고 의무화",
    "임대료 인상 상한선(5%) 규제를 무력화하기 위해 관리비나 옵션비 명목으로 돈을 더 얹어 받던 임대사업자들의 우회 인상 편법을 방지하기 위함입니다.",
    "2026-07-13",
    "https://r114.com/trends/wiki/policy/39c4a6fa-284b-80c0-8759-c1799f3034ee",
  ),
  row(
    "r114-policy-2",
    "policy",
    "국토의 지도를 다시 그리다: '5극 3특' 균형발전 전략",
    "수도권 집중과 지방 소멸 위기를 극복하기 위해 전국을 5대 초광역 경제생활권(5극)과 3대 특별자치도(3특)의 메가 거점으로 재편하여 자생적 성장 구조를 만드는 국가균형발전 전략입니다.",
    "2026-07-13",
    "https://r114.com/trends/wiki/policy/39c4a6fa-284b-809e-ad7e-d08276d39601",
  ),
  row(
    "r114-policy-3",
    "policy",
    "대한민국 경제와 부동산의 새 심장 '반도체벨트'",
    "정부와 대기업이 주도하여 경기 남부 일대에 세계 최대 규모의 반도체 생산·연구 생태계를 조성하는 국가 핵심 전략 산업 구역입니다.",
    "2026-07-13",
    "https://r114.com/trends/wiki/policy/39c4a6fa-284b-8067-a5ad-e6e15d7dd828",
  ),
  row(
    "r114-redevelopment-1",
    "redevelopment",
    "단군 이래 최대 개발: 용산국제업무지구",
    "서울 용산역 일대 옛 정비창 부지를 아시아·태평양 비즈니스 중심지로 육성하기 위해 추진되는 51조 원 규모의 초고층 융복합 도시개발 사업입니다.",
    "2026-07-10",
    "https://r114.com/trends/wiki/redevelopment/3994a6fa-284b-80fe-9880-f16ec318c74a",
  ),
  row(
    "r114-redevelopment-2",
    "redevelopment",
    "따로 살던 이웃이 한 가족으로, 통합재건축이란?",
    "정부가 발표한 '노후계획도시 정비 특별법'의 핵심 성공 공식이 바로 통합재건축이기 때문입니다.",
    "2026-06-30",
    "https://r114.com/trends/wiki/redevelopment/38f4a6fa-284b-80d9-80b6-c6ae00ca57b3",
  ),
  row(
    "r114-redevelopment-3",
    "redevelopment",
    "지은 지 30년 지나면 프리패스? 재건축 가능 연한과 패스트트랙",
    "아파트의 '사용검사일(준공일)'로부터 정확히 30년이 경과하면 연한을 충족하게 됩니다.",
    "2026-06-30",
    "https://r114.com/trends/wiki/redevelopment/38e4a6fa-284b-8052-9bb8-fbcc52e777a6",
  ),
  row(
    "r114-commercial-1",
    "commercial",
    "상가임대차보호법이란?",
    "상가 건물을 빌려 장사하는 소상공인과 임차인들이 억울하게 쫓겨나거나 전세금을 떼이지 않도록 보호하는 특별법입니다.",
    "2026-07-01",
    "https://r114.com/trends/wiki/commercial/38f4a6fa-284b-80ce-9fae-c615dfefea1e",
  ),
  row(
    "r114-commercial-2",
    "commercial",
    "반쪽짜리 주택, 준주택",
    "건축법상으로는 상업용·업무용 시설이지만, 실질적으로 주거 생활이 가능한 시설을 주택법에서 인정해 주는 개념입니다.",
    "2026-06-30",
    "https://r114.com/trends/wiki/commercial/38f4a6fa-284b-80ec-ba7e-e278dca998f2",
  ),
  row(
    "r114-commercial-3",
    "commercial",
    "불타버린 상가, 화재보험 가입은 건물주와 임차인 중 누가 해야 할까?",
    "임차인 역시 자신을 보호할 화재보험이 반드시 필요합니다.",
    "2026-06-25",
    "https://r114.com/trends/wiki/commercial/38a4a6fa-284b-800e-9161-e5a08e0eeac5",
  ),
  row(
    "r114-lifestyle-1",
    "lifestyle",
    "\"계약 끝난 집\" 광고 늦게 내렸다고 과태료 250만원?",
    "계약이 완료된 매물 광고를 지우지 않았을 때, '단순 실수'의 경우 처벌을 유예해 주는 제도가 신설되었습니다.",
    "2026-07-13",
    "https://r114.com/trends/wiki/lifestyle/39c4a6fa-284b-8049-b104-f3985dbe3e9d",
  ),
  row(
    "r114-lifestyle-2",
    "lifestyle",
    "수도권 30분 생활권의 현실화, GTX 노선별 개통 상황과 향후 전망",
    "GTX(수도권광역급행철도)의 노선별 개통 현황과 개통 예정일을 정리했습니다. GTX-A, GTX-B, GTX-C 추진 현황과 GTX-D·E·F 계획, 부동산 영향까지 한눈에 확인하세요.",
    "2026-07-01",
    "https://r114.com/trends/wiki/lifestyle/3904a6fa-284b-8060-adf9-ce5bc48f4cdd",
  ),
  row(
    "r114-lifestyle-3",
    "lifestyle",
    "초고령화 시대의 주거 형태, 실버타운",
    "'입주자의 건강 상태'와 '비용 부담 주체'가 근본적으로 다릅니다. 많은 분들이 실버타운과 요양원, 요양병원을 혼동합니다. 이 둘은 법적 정의부터 서비스 목적까지 완전히 다른 시설입니다.",
    "2026-06-30",
    "https://r114.com/trends/wiki/lifestyle/38f4a6fa-284b-8081-94c3-fe9e61373e61",
  ),
];

export function getR114WikiCategory(id: R114WikiCategoryId): R114WikiCategory {
  return R114_WIKI_CATEGORIES.find((c) => c.id === id) ?? R114_WIKI_CATEGORIES[0];
}

export function getR114WikiById(id: string): R114WikiSample | undefined {
  return MOCK_R114_WIKI.find((row) => row.id === id);
}

export function matchR114Keywords(
  title: string,
  summary: string,
  keywords: string[],
): boolean {
  if (keywords.length === 0) return true;
  const hay = `${title} ${summary}`.toLowerCase();
  return keywords.some((k) => hay.includes(k.toLowerCase()));
}

export function filterR114Wiki(
  category: R114WikiCategoryId,
  keywords: string[],
): R114WikiSample[] {
  return MOCK_R114_WIKI.filter((row) => {
    if (category !== "all" && row.category !== category) return false;
    return matchR114Keywords(row.title, row.summary, keywords);
  }).sort((a, b) => b.pubDate.localeCompare(a.pubDate));
}
