"use client";

import type { AuctionListDetailRow } from "@/lib/auction-list-details";

type Props = {
  rows: AuctionListDetailRow[];
  /** 목업 등에서 수집 위치 힌트 표시 */
  showSourceHint?: boolean;
};

/** 법원 「목록내역」 표 서식 (Unifine) — 1건·다건 공통 */
export function ListDetailsPanel({ rows, showSourceHint = false }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2 w-2 rounded-sm bg-[#4dabff]" />
        <h3 className="text-sm font-bold text-sky-200">목록내역</h3>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-400">
          {rows.length}건
        </span>
        {showSourceHint && (
          <span className="ml-auto text-[10px] text-slate-600">
            #mf_wfm_mainFrame_grp_lstDtsLimtMin
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-xs text-[#cbd5e1]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.06]">
              <th className="w-20 px-3 py-2.5 text-center text-[11px] font-medium text-slate-400">
                목록번호
              </th>
              <th className="w-24 px-3 py-2.5 text-center text-[11px] font-medium text-slate-400">
                목록구분
              </th>
              <th className="px-3 py-2.5 text-center text-[11px] font-medium text-slate-400">
                상세내역
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="bg-black/20 px-3 py-8 text-center text-sm text-slate-500"
                >
                  목록내역이 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={`${r.no}-${r.listKind}`} className="border-b border-white/10 last:border-b-0">
                  <td className="bg-black/20 px-3 py-3 text-center align-top text-sm text-slate-100">
                    {r.no}
                  </td>
                  <td className="bg-black/20 px-3 py-3 text-center align-top text-sm text-slate-100">
                    {r.listKind || "—"}
                  </td>
                  <td className="bg-black/20 px-3 py-3 align-top text-sm leading-relaxed whitespace-pre-wrap text-slate-100">
                    {r.detail || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
