"use client";

import { Layers, MapPin, Search } from "lucide-react";
import {
  formatWon,
  type AuctionBasicInfoView,
} from "@/lib/auction-basic-info";

type Props = {
  data: AuctionBasicInfoView;
  /** 목업 등에서 수집 위치 힌트 표시 */
  showSourceHint?: boolean;
};

/** 법원 「물건기본정보」 표 서식 (Unifine) */
export function BasicPropertyInfoPanel({ data, showSourceHint = false }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2 w-2 rounded-sm bg-[#4dabff]" />
        <h3 className="text-sm font-bold text-sky-200">물건기본정보</h3>
        {showSourceHint && (
          <span className="ml-auto text-[10px] text-slate-600">
            wq_uuid_876 · gen_lstSt · wq_uuid_933
          </span>
        )}
      </div>

      <table className="w-full border-collapse text-left text-xs text-[#cbd5e1]">
        <tbody>
          <tr className="border-b border-white/10">
            <Th>사건번호</Th>
            <Td>
              <span className="inline-flex flex-wrap items-center gap-2">
                {data.caseNumber || "—"}
                {data.electronic && (
                  <span className="rounded-full bg-[#3b82f6] px-2 py-0.5 text-[10px] font-bold text-white">
                    전자
                  </span>
                )}
              </span>
            </Td>
            <Th>물건번호</Th>
            <Td>{data.itemNo != null && data.itemNo > 0 ? data.itemNo : "—"}</Td>
            <Th>물건종류</Th>
            <Td>{data.itemType || "—"}</Td>
          </tr>

          <tr className="border-b border-white/10">
            <Th>감정평가액</Th>
            <Td>{formatWon(data.appraisalPrice)}</Td>
            <Th className="leading-tight">
              최저매각가격
              <br />
              <span className="font-normal text-slate-500">(매수신청보증금)</span>
            </Th>
            <Td>
              {formatWon(data.minPrice)}
              <span className="text-slate-400">
                {" "}
                / ({formatWon(data.bidDeposit)})
              </span>
            </Td>
            <Th>입찰방법</Th>
            <Td>{data.bidMethod || "—"}</Td>
          </tr>

          <tr className="border-b border-white/10">
            <Th>매각기일</Th>
            <Td colSpan={5}>{data.saleDateLabel || "—"}</Td>
          </tr>

          <tr className="border-b border-white/10">
            <Th className="align-top">물건비고</Th>
            <Td colSpan={5} className="whitespace-pre-wrap leading-relaxed">
              {data.remarks || "—"}
            </Td>
          </tr>

          {data.locations.length === 0 ? (
            <tr className="border-b border-white/10">
              <Th className="align-top">목록 소재지</Th>
              <Td colSpan={5} className="text-slate-500">
                —
              </Td>
            </tr>
          ) : (
            data.locations.map((loc) => (
              <tr key={loc.no} className="border-b border-white/10">
                <Th className="align-top">목록{loc.no} 소재지</Th>
                <Td colSpan={5}>
                  <p>
                    {loc.kindLabel ? (
                      <span className="text-slate-400">{loc.kindLabel} </span>
                    ) : null}
                    {loc.address || "—"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <LocBtn icon={<Search className="h-3 w-3" />} label="등기기록 열람" />
                    <LocBtn icon={<MapPin className="h-3 w-3" />} label="전자지도 보기" />
                    <LocBtn
                      icon={<Layers className="h-3 w-3" />}
                      label="씨리얼(토지이용계획)"
                    />
                  </div>
                </Td>
              </tr>
            ))
          )}

          <tr className="border-b border-white/10">
            <Th>담당</Th>
            <Td colSpan={5}>{data.dept || "—"}</Td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border-t-2 border-white/15 text-left text-xs text-[#cbd5e1]">
        <tbody>
          <tr className="border-b border-white/10">
            <Th>사건접수</Th>
            <Td>{data.receivedAt || "—"}</Td>
            <Th>경매개시일</Th>
            <Td>{data.startedAt || "—"}</Td>
          </tr>
          <tr>
            <Th>배당요구종기</Th>
            <Td>{data.dividendDeadline || "—"}</Td>
            <Th>청구금액</Th>
            <Td>{formatWon(data.claimAmount)}</Td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`w-[7.5rem] whitespace-nowrap bg-white/[0.06] px-3 py-2.5 text-center text-[11px] font-medium text-slate-400 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  colSpan,
  className = "",
}: {
  children: React.ReactNode;
  colSpan?: number;
  className?: string;
}) {
  return (
    <td
      colSpan={colSpan}
      className={`bg-black/20 px-3 py-2.5 text-sm text-slate-100 ${className}`}
    >
      {children}
    </td>
  );
}

function LocBtn({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-300 transition hover:border-[#4dabff]/40 hover:text-white"
    >
      {icon}
      {label}
    </button>
  );
}
