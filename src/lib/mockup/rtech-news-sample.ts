/** 부동산테크 부동산뉴스 샘플 — landInfo 목록(제목·등록일) + 외부 원문(한경) */
export type RtechNewsSample = {
  id: string;
  rank: number;
  title: string;
  press: string;
  originUrl: string;
  pubDate: string;
};

/** 출처 표기 — 사용자 지정 (목록 클릭 시 한경 기사로 이동) */
export const RTECH_PRESS = "한경 집코노미";

export const MOCK_RTECH_NEWS: RtechNewsSample[] = [
  {
    id: "r1",
    rank: 1,
    title: "경유 운행 전세버스 3.9만대…유가보조금 월 25만원 지급",
    press: RTECH_PRESS,
    originUrl: "https://www.hankyung.com/article/2026071577171",
    pubDate: "2026-07-15",
  },
  {
    id: "r2",
    rank: 2,
    title: "대전 3개 구역 '노후도시 선도지구'로…크로바 4억 급등",
    press: RTECH_PRESS,
    originUrl: "https://www.hankyung.com/article/2026071574661",
    pubDate: "2026-07-15",
  },
  {
    id: "r3",
    rank: 3,
    title: '"은행 자체 감정평가는 위법"…감평사協, 금융위에 해결 촉구',
    press: RTECH_PRESS,
    originUrl: "https://www.hankyung.com/article/2026071574701",
    pubDate: "2026-07-15",
  },
  {
    id: "r4",
    rank: 4,
    title: "새 행정수도 만드는 몽골…K건설에 '러브콜'",
    press: RTECH_PRESS,
    originUrl: "https://www.hankyung.com/article/2026071574711",
    pubDate: "2026-07-15",
  },
  {
    id: "r5",
    rank: 5,
    title: "분상제 단지도 분양가 더 오른다",
    press: RTECH_PRESS,
    originUrl: "https://www.hankyung.com/article/2026071574691",
    pubDate: "2026-07-15",
  },
  {
    id: "r6",
    rank: 6,
    title: "천안 '두정역 푸르지오 그랑피크' 1438가구",
    press: RTECH_PRESS,
    originUrl: "https://www.hankyung.com/article/2026071574681",
    pubDate: "2026-07-15",
  },
];

export function matchRtechKeywords(title: string, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const t = title.toLowerCase();
  return keywords.some((k) => t.includes(k.toLowerCase()));
}
