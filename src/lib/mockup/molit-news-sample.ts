/** 국토부 주택·토지 보도자료 샘플 — 목록 행 클릭 상세(dtl.jsp?id=…)와 제목·요약 일치 */
export type MolitNewsSample = {
  id: string;
  rank: number;
  title: string;
  summary: string;
  press: string;
  originUrl: string;
  pubDate: string;
};

const DTL = "https://www.molit.go.kr/USR/NEWS/m_71/dtl.jsp?lcmspage=1&id=";

export const MOCK_MOLIT_NEWS: MolitNewsSample[] = [
  {
    id: "m1",
    rank: 1,
    title: "분양가상한제 기본형건축비 비정기 고시",
    summary:
      "3월 1일 정기 고시 이후의 고강도 철근 가격 변동(약 18.6% 상승) 반영 기본형건축비 0.77% 상승(222만 원/㎡→223만 7천 원/㎡)",
    press: "주택정책과",
    originUrl: `${DTL}95092223`,
    pubDate: "2026-07-15",
  },
  {
    id: "m2",
    rank: 2,
    title: "[장관동정] 김윤덕 장관, 한국토지주택공사 신임 사장에 임명장 전수",
    summary: "‘주택 공급에 전사적 역량 집중’, ‘국가 균형 성장에 LH 핵심 역할’ 강조",
    press: "토지정책과",
    originUrl: `${DTL}95092225`,
    pubDate: "2026-07-14",
  },
  {
    id: "m3",
    rank: 3,
    title: "부동산정책, 국민의 목소리를 듣습니다.",
    summary:
      "7월 14일부터 16일까지 공급·금융·세제 분야별 토론회 개최 7월 14일부터 온라인 의견수렴 창구 운영, 누구나 의견 제출 가능",
    press: "부동산제도기획과",
    originUrl: `${DTL}95092224`,
    pubDate: "2026-07-14",
  },
  {
    id: "m4",
    rank: 4,
    title: "전세 계약 전 ‘위험신호’ 민간플랫폼서도 한눈에…, 정부-민간, 연계구축 첫걸음",
    summary: "안심전세앱 9월 서비스 개편 후 2027년 민간 외부 연계 확대 본격 추진",
    press: "주택임대차기획팀",
    originUrl: `${DTL}95092221`,
    pubDate: "2026-07-14",
  },
  {
    id: "m5",
    rank: 5,
    title: "민간임대주택 관리비 투명성 제고 「민간임대주택법 하위법령」 개정안 입법예고",
    summary:
      "임대차계약 신고 대상에 관리비 및 사용료 추가, 표준임대차계약서 개정 100호 이상 임대단지 임대료 증액비율 조례 제정권 시·도 부여",
    press: "민간임대정책과",
    originUrl: `${DTL}95092216`,
    pubDate: "2026-07-13",
  },
  {
    id: "m6",
    rank: 6,
    title: "[장관동정] 김윤덕 장관, “좋은 집 더 빠르게 공급하도록 모듈러 기술 키울 것”",
    summary: "10일 오전 군산 모듈러 제작 공장 찾아 업계 소통, 주택 공급 기반 강화",
    press: "주택건설운영과",
    originUrl: `${DTL}95092211`,
    pubDate: "2026-07-10",
  },
];

export function matchMolitKeywords(
  title: string,
  summary: string,
  keywords: string[],
): boolean {
  if (keywords.length === 0) return true;
  const t = `${title} ${summary}`.toLowerCase();
  return keywords.some((k) => t.includes(k.trim().toLowerCase()));
}
