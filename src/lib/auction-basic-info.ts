/** 법원 「물건기본정보」 표시용 뷰모델 */

export type BasicInfoListLocation = {
  no: number;
  kindLabel: string;
  address: string;
};

export type AuctionBasicInfoView = {
  electronic?: boolean;
  caseNumber: string;
  itemNo: number | null;
  itemType: string;
  appraisalPrice: number;
  minPrice: number;
  bidDeposit: number;
  bidMethod: string;
  saleDateLabel: string;
  remarks: string;
  locations: BasicInfoListLocation[];
  dept: string;
  receivedAt: string;
  startedAt: string;
  dividendDeadline: string;
  claimAmount: number;
};

export function formatWon(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n) || n <= 0) return "—";
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}

export function emptyBasicInfoView(): AuctionBasicInfoView {
  return {
    electronic: false,
    caseNumber: "",
    itemNo: null,
    itemType: "",
    appraisalPrice: 0,
    minPrice: 0,
    bidDeposit: 0,
    bidMethod: "기일입찰",
    saleDateLabel: "",
    remarks: "",
    locations: [],
    dept: "",
    receivedAt: "",
    startedAt: "",
    dividendDeadline: "",
    claimAmount: 0,
  };
}
