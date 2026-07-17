/** 홍성군청 샘플 — 공지사항(공지 배지 제외) + 공고/고시, 사진 없음 */
export type HongseongNewsSample = {
  id: string;
  rank: number;
  category: "notice" | "gosi";
  title: string;
  summary: string;
  press: string;
  originUrl: string;
  pubDate: string;
};

export const MOCK_HONGSEONG_NEWS: HongseongNewsSample[] = [
  {
    id: "h1",
    rank: 1,
    category: "notice",
    title: "구조안전 위험시설물 주민공지",
    summary:
      "삽교천(국가)에 위치한 제2종시설물 정밀안전점검 결과에 따라 위험등급인 배수통문에 대하여 구조안전 위험시설물임을 공지하오니 해당시설물에 대한 접근을 자제하여 주시기 바랍니다.",
    press: "건설과",
    originUrl:
      "https://www.hongseong.go.kr/bbs/BBSMSTR_000000000841/view.do?nttId=B000000281709Nw1wP9",
    pubDate: "2026-07-15",
  },
  {
    id: "h2",
    rank: 2,
    category: "notice",
    title: "2026년 다목적 농업장비(운반기) 지원사업 추가 신청 알림",
    summary:
      "농작업 효율성 향상을 위한 다목적 농업장비(운반기) 지원사업 신청을 다음과 같이 알려드리니, 사업참여 희망 농업인께서는 주소지 읍면 행정복지센터 산업팀에 신청하여 주시기 바랍니다.",
    press: "농업정책과",
    originUrl:
      "https://www.hongseong.go.kr/bbs/BBSMSTR_000000000841/view.do?nttId=B000000281701Wp1aC2",
    pubDate: "2026-07-15",
  },
  {
    id: "h3",
    rank: 3,
    category: "notice",
    title: "2026년 주요농산물 가격안정 지원사업(참깨, 들깨) 신청 알림",
    summary:
      "1. 가격변동이 큰 농산물의 최소 소득안정망 구축을 위해 추진하는 「2026년 주요농산물 가격안정 지원사업」 신청을 다음과 같이 알려드리니,",
    press: "농업정책과",
    originUrl:
      "https://www.hongseong.go.kr/bbs/BBSMSTR_000000000841/view.do?nttId=B000000281669Ra9uZ4",
    pubDate: "2026-07-14",
  },
  {
    id: "h4",
    rank: 4,
    category: "gosi",
    title: "결성면 교항리 취약지역 생활여건 개조사업 시행계획 변경(2차) 승인 고시",
    summary:
      "농어촌정비법 제61조에 따라「결성면 교항리 취약지역 생활여건 개조사업」시행계획 변경(2차)을 다음과 같이 고시합니다.",
    press: "농업정책과",
    originUrl:
      "https://www.hongseong.go.kr/prog/saeolGosi/kor/sub03_0204/GOSI_ALL/view.do?notAncmtMgtNo=44977",
    pubDate: "2026-07-15",
  },
  {
    id: "h5",
    rank: 5,
    category: "gosi",
    title: "광천읍 원도심 빈집 재개발사업 폐공동주택 철거공사에 따른 자재 반출 공고(2차)",
    summary:
      "홍성군에서 추진하는 「광천읍 원도심 빈집 재개발사업」과 관련하여 철거 예정인 폐공동주택 내부 및 사업부지 내 장기간 적치되어 있는 자재 및 동산 등에 대하여 다음과 같이 자진 반출 공고(2차)합니다.",
    press: "혁신전략담당관",
    originUrl:
      "https://www.hongseong.go.kr/prog/saeolGosi/kor/sub03_0204/GOSI_ALL/view.do?notAncmtMgtNo=45035",
    pubDate: "2026-07-15",
  },
  {
    id: "h6",
    rank: 6,
    category: "gosi",
    title: "무단방치 자동차 자진처리 안내 및 강제견인 예고문 공시송달 공고(2026-40, -43)",
    summary:
      "홍성군 관내 무단방치 된 자동차에 대하여 「자동차관리법」 제26조 및 같은 법 시행령 제6조의 규정에 의거 자진처리 안내문을 송달하고자 하였으나, 폐문부재, 장기폐문 등의 사유로「행정절차법」 제14조 제4항에 따라 다음과 같이 공고하오니,",
    press: "교통과",
    originUrl:
      "https://www.hongseong.go.kr/prog/saeolGosi/kor/sub03_0204/GOSI_ALL/view.do?notAncmtMgtNo=45028",
    pubDate: "2026-07-15",
  },
];

export function matchHongseongKeywords(
  title: string,
  summary: string,
  keywords: string[],
): boolean {
  if (keywords.length === 0) return true;
  const t = `${title} ${summary}`.toLowerCase();
  return keywords.some((k) => t.includes(k.trim().toLowerCase()));
}
