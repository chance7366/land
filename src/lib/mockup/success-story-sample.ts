import type { SuccessStoryCategory } from "@/lib/success-story";

export { SUCCESS_STORY_CATEGORIES } from "@/lib/success-story";
export type { SuccessStoryCategory } from "@/lib/success-story";

export type SuccessStorySample = {
  id: string;
  category: SuccessStoryCategory;
  title: string;
  content: string;
  authorName: string;
  authorMasked: string;
  createdAt: string;
};

export const SUCCESS_STORY_SAMPLES: SuccessStorySample[] = [
  {
    id: "ss-1",
    category: "부동산중개",
    title: "내포 아파트 매매, 끝까지 성실하게 도와주셨어요",
    content:
      "처음 상담부터 계약 날까지 연락이 빠르고 설명이 친절했습니다.\n소개해 주신 물건도 저희가 원하던 조건에 잘 맞았고, 등기·잔금까지 차질 없이 진행돼 안심이 됐습니다.\n다음에 이사할 때도 꼭 다시 부탁드리고 싶습니다.",
    authorName: "김민수",
    authorMasked: "김**",
    createdAt: "2026-07-10T09:00:00.000Z",
  },
  {
    id: "ss-2",
    category: "경매공매",
    title: "경매대리 신청 후 첫 낙찰 성공!",
    content:
      "권리분석이 어려워 망설이다 대리를 맡겼는데, 입찰 전 리스크와 예산까지 꼼꼼히 짚어주셨습니다.\n결과적으로 원하던 금액대에서 낙찰됐고, 이후 절차도 차근차근 안내해 주셔서 감사했습니다.",
    authorName: "이서연",
    authorMasked: "이**",
    createdAt: "2026-07-08T11:30:00.000Z",
  },
  {
    id: "ss-3",
    category: "부동산중개",
    title: "월세 구해 주셔서 만족합니다",
    content:
      "급한 일정에도 불구하고 여러 물건을 보여주시고, 장단점을 솔직하게 말씀해 주셨습니다.\n결국 선택한 집은 위치·관리비가 마음에 들고, 입주까지 문제없이 마무리됐습니다.",
    authorName: "박지훈",
    authorMasked: "박**",
    createdAt: "2026-07-05T14:20:00.000Z",
  },
  {
    id: "ss-4",
    category: "경매공매",
    title: "유찰 물건 낙찰, 찬스부동산 덕분에 가능했어요",
    content:
      "혼자였으면 입찰가를 잘못 잡을 뻔했습니다.\n현장 확인 포인트와 명도 관련 주의사항까지 미리 알려주신 덕분에 안전하게 낙찰받을 수 있었습니다.",
    authorName: "최유진",
    authorMasked: "최**",
    createdAt: "2026-06-28T08:15:00.000Z",
  },
  {
    id: "ss-5",
    category: "부동산중개",
    title: "친절한 응대와 꼼꼼한 중개",
    content:
      "문의할 때마다 귀찮아하지 않고 자세히 답변해 주셨고, 계약서도 항목별로 설명해 주셔서 신뢰가 갔습니다.\n주변에도 소개하고 있습니다.",
    authorName: "정하늘",
    authorMasked: "정**",
    createdAt: "2026-06-20T16:40:00.000Z",
  },
  {
    id: "ss-6",
    category: "경매공매",
    title: "공매 입찰 대행 후기",
    content:
      "일정 맞추기 어려워 대행을 요청했는데, 서류 준비부터 입찰 결과 공유까지 빠짐없이 진행해 주셨습니다.\n낙찰 후에도 인수 절차를 알기 쉽게 정리해 주셔서 큰 도움이 됐습니다.",
    authorName: "한도윤",
    authorMasked: "한**",
    createdAt: "2026-06-12T10:05:00.000Z",
  },
];
