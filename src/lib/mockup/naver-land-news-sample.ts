/** 제목·요약·원문 URL이 동일 기사로 일치하는 네이버 부동산 관련 샘플 */
export type NaverLandNewsSample = {
  id: string;
  rank: number;
  title: string;
  summary: string;
  press: string;
  originUrl: string;
  imageUrl: string;
  pubDate: string;
};

export const MOCK_NAVER_LAND_NEWS: NaverLandNewsSample[] = [
  {
    id: "n1",
    rank: 1,
    title: "분양가 치솟는데 대출은 ‘바늘귀’…무주택자 내집마련 멀어지나요",
    summary:
      "최근 부동산 시장에 무슨 일이? 최근 3기 신도시인 경기 고양창릉지구에 공급되는 이…",
    press: "한겨레",
    originUrl: "https://n.news.naver.com/article/028/0002814156",
    imageUrl:
      "https://imgnews.pstatic.net/image/028/2026/07/15/0002814156_001_20260715073608655.jpg?type=w800",
    pubDate: "2026-07-15",
  },
  {
    id: "n2",
    rank: 2,
    title: "“현금 14억 있어야 된다”…청약통장 26만명 이탈, 집 사는 공식 무너졌다",
    summary:
      "서울 84㎡ 분양가 18억원대 속출…수요자 감당 한계. 대출 규제에 자금 4억원대 묶여…",
    press: "세계일보",
    originUrl: "https://n.news.naver.com/mnews/article/022/0004121844",
    imageUrl:
      "https://imgnews.pstatic.net/image/022/2026/04/19/20260419500499_20260419052211307.jpg?type=w800",
    pubDate: "2026-07-14",
  },
  {
    id: "n3",
    rank: 3,
    title: "분양가 高高행진에 대출 규제까지…청약통장 ‘무용론’ 부상하나",
    summary:
      "분양가 상승과 대출 규제가 맞물리며 청약통장 실효성에 대한 의문이 커지고 있다…",
    press: "데일리안",
    originUrl: "https://n.news.naver.com/article/119/0003072965",
    imageUrl:
      "https://imgnews.pstatic.net/image/119/2026/03/25/0003072965_001_20260325060114927.jpg?type=w800",
    pubDate: "2026-07-13",
  },
  {
    id: "n4",
    rank: 4,
    title: "18억, 16억 분양가에 허탈…청약통장 깨는 사람들",
    summary: "청약통장 5개월간 26만명 이탈…높은 분양가, 바늘구멍 당첨확률에 이탈 가속…",
    press: "SBS",
    originUrl: "https://n.news.naver.com/mnews/article/374/0000506653",
    imageUrl:
      "https://imgnews.pstatic.net/image/374/2026/04/26/0000506653_001_20260426092017348.jpg?type=w800",
    pubDate: "2026-07-12",
  },
  {
    id: "n5",
    rank: 5,
    title: "“수백대 1 바늘구멍에 쥐꼬리 이자, 그 돈으로 주식하는게”…청약통장 해지 봇물",
    summary: "분양가 급등·대출규제 겹치며 주택 청약 매력 급속도로 약화. 두 달 새 가입자 10만명 줄어…",
    press: "매일경제",
    originUrl: "https://n.news.naver.com/article/009/0005664422",
    imageUrl:
      "https://imgnews.pstatic.net/image/009/2026/04/11/0005664422_001_20260411110710593.png?type=w800",
    pubDate: "2026-07-11",
  },
  {
    id: "n6",
    rank: 6,
    title: "어렵게 당첨되고도 계약포기 속출…‘중도금 무이자’ 분양단지에 몰리는 이유",
    summary:
      "고분양가와 대출 규제 속에 금융 지원책을 제공하는 단지에 실수요 관심이 집중되고…",
    press: "매일경제",
    originUrl: "https://n.news.naver.com/article/009/0005659394",
    imageUrl:
      "https://imgnews.pstatic.net/image/009/2026/04/01/0005659394_001_20260401134906948.png?type=w800",
    pubDate: "2026-07-10",
  },
];

export function matchNaverKeywords(title: string, summary: string, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const t = `${title} ${summary}`.toLowerCase();
  return keywords.some((k) => t.includes(k.trim().toLowerCase()));
}
