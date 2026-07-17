/** 충남도청 최근소식 샘플 — 공지 행 제외, view.do 상세와 제목·요약(첫 줄) 일치 */
export type ChungnamNewsSample = {
  id: string;
  rank: number;
  title: string;
  summary: string;
  press: string;
  originUrl: string;
  pubDate: string;
};

export const MOCK_CHUNGNAM_NEWS: ChungnamNewsSample[] = [
  {
    id: "c1",
    rank: 1,
    title: "충남 해수욕장 방사능 검사 결과 보고서(2026년 7월 2주)",
    summary: "충남 해수욕장 방사능 측정 결과지를 붙임과 같이 게재합니다.",
    press: "해양정책과",
    originUrl:
      "https://www.chungnam.go.kr/cnportal/bbs/B0000400/view.do?nttId=2180268&menuNo=5100288&pageUnit=10&pageIndex=1",
    pubDate: "2026-07-14",
  },
  {
    id: "c2",
    rank: 2,
    title: "세종 「세종 우미 린 센터파크」 장애인 기관추천 특별공급 변경알림(신청일정)",
    summary: "세종 「세종 우미 린 센터파크」 장애인 기관추천 특별공급 신청일정이 변경되어 안내합니다.",
    press: "장애인복지과",
    originUrl:
      "https://www.chungnam.go.kr/cnportal/bbs/B0000134/view.do?nttId=2180210&menuNo=5100288&pageUnit=10&pageIndex=1",
    pubDate: "2026-07-13",
  },
  {
    id: "c3",
    rank: 3,
    title: "2026년 돼지 반출입 제한 조치 조정 알림('26.7.2.~)",
    summary:
      "1. 가축전염병 예방법 제4조(가축방역심의회), 동물방역위생과-9576(2026.3.19.)호와 관련됩니다.",
    press: "동물방역위생과",
    originUrl:
      "https://www.chungnam.go.kr/cnportal/bbs/B0000239/view.do?nttId=2180122&menuNo=5100288&pageUnit=10&pageIndex=1",
    pubDate: "2026-07-10",
  },
  {
    id: "c4",
    rank: 4,
    title: "한눈에 보는 건설산업 불법행위 예방가이드",
    summary: "건설산업 불법행위 예방을 위한 안내 자료를 붙임과 같이 게재합니다.",
    press: "건설정책과",
    originUrl:
      "https://www.chungnam.go.kr/cnportal/bbs/B0000134/view.do?nttId=2180056&menuNo=5100288&pageUnit=10&pageIndex=1",
    pubDate: "2026-07-09",
  },
  {
    id: "c5",
    rank: 5,
    title: "2026년 상반기 확정배출량명세(수질) 제출 안내",
    summary: "2026년 상반기 확정배출량명세(수질) 제출 안내를 첨부와 같이 알려 드립니다.",
    press: "환경관리과",
    originUrl:
      "https://www.chungnam.go.kr/cnportal/bbs/B0000243/view.do?nttId=2179932&menuNo=5100288&pageUnit=10&pageIndex=1",
    pubDate: "2026-07-07",
  },
  {
    id: "c6",
    rank: 6,
    title: "2026년 상반기 확정배출량명세(대기) 제출 안내",
    summary: "2026년 상반기 확정배출량명세(대기) 제출 안내를 첨부와 같이 알려드립니다.",
    press: "환경관리과",
    originUrl:
      "https://www.chungnam.go.kr/cnportal/bbs/B0000243/view.do?nttId=2179931&menuNo=5100288&pageUnit=10&pageIndex=1",
    pubDate: "2026-07-07",
  },
];

export function matchChungnamKeywords(
  title: string,
  summary: string,
  keywords: string[],
): boolean {
  if (keywords.length === 0) return true;
  const t = `${title} ${summary}`.toLowerCase();
  return keywords.some((k) => t.includes(k.trim().toLowerCase()));
}
