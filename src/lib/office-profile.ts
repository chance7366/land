/** 중개사무소·담당자 표기용 단일 소스 (푸터·매물 상세 sticky 공유) */

export const OFFICE_PROFILE = {
  name: "찬스부동산 경매중개",
  nameFull: "찬스부동산 경매중개 (공인중개사사무소)",
  address: "충청남도 홍성군 홍북읍 신경리 1369 (내포신도시)",
  addressShort: "충남 홍성군 홍북읍 신경리 1369",
  regNo: "44800-2024-00001",
  /** 매수신청대리 등록번호 — 확정 후 기입 */
  bidAgentRegNo: "",
  brokerName: "김영찬",
  brokerPhone: "041-633-0000",
  agentName: "담당 상담",
  agentPhone: "010-4284-7366",
  email: "kimdayn2@gmail.com",
  kakaoChannelUrl: "", // 설정 시 카카오 CTA 활성화
} as const;

export type OfficeProfile = typeof OFFICE_PROFILE;
