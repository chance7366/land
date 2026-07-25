"use client";

import { Fragment } from "react";
import type { PropertyKvRow } from "@/lib/property-detail-sections";

export type { PropertyKvRow };

/** 긴 값은 전폭, 짧은 값은 섹션 평균 길이에 따라 2·3·4열 */
function isWideKv(row: PropertyKvRow): boolean {
  return (
    row.value.length >= 28 ||
    /소재지|주소|건물\/단지|기타|설명|입주 조건|포함 항목|추천 업종|위치 특성|관리비 내역|용도지역|현재 이용|건축물 용도/.test(
      row.label,
    )
  );
}

function pickColumnCount(shorts: PropertyKvRow[]): 2 | 3 | 4 {
  if (shorts.length === 0) return 2;
  const avg =
    shorts.reduce((sum, r) => sum + Math.max(r.label.length, r.value.length), 0) /
    shorts.length;
  if (avg >= 12) return 2;
  if (avg >= 9) return 3;
  return 4;
}

function packKvRows(
  rows: PropertyKvRow[],
): { wide?: PropertyKvRow; cells?: PropertyKvRow[]; cols: number }[] {
  const shorts = rows.filter((r) => !isWideKv(r));
  const cols = pickColumnCount(shorts);
  const out: { wide?: PropertyKvRow; cells?: PropertyKvRow[]; cols: number }[] = [];
  let buf: PropertyKvRow[] = [];

  const flush = () => {
    if (!buf.length) return;
    out.push({ cells: buf, cols });
    buf = [];
  };

  for (const row of rows) {
    if (isWideKv(row)) {
      flush();
      out.push({ wide: row, cols: 1 });
      continue;
    }
    buf.push(row);
    if (buf.length >= cols) flush();
  }
  flush();
  return out;
}

export function PropertyKvTable({ rows }: { rows: PropertyKvRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-white/40">등록된 항목이 없습니다.</p>;
  }

  const packed = packKvRows(rows);
  const maxCols = Math.max(2, ...packed.map((p) => p.cols));
  const totalCells = maxCols * 2;

  return (
    <div className="overflow-x-auto rounded-xl border border-[#a78bfa]/20 bg-[rgba(10,10,18,0.45)]">
      <table className="w-full min-w-[520px] table-fixed text-left text-sm">
        <tbody>
          {packed.map((pack, ri) => {
            if (pack.wide) {
              return (
                <tr key={`wide-${pack.wide.label}-${ri}`} className="border-t border-white/10 first:border-0">
                  <th className="w-[7.5rem] bg-[rgba(59,42,92,0.35)] px-3 py-2.5 align-top text-xs font-semibold text-[#c4b5fd]/80">
                    {pack.wide.label}
                  </th>
                  <td colSpan={totalCells - 1} className="px-3 py-2.5 font-semibold text-white/90">
                    {pack.wide.value}
                  </td>
                </tr>
              );
            }

            const cells = pack.cells ?? [];
            const emptySlots = pack.cols - cells.length;
            return (
              <tr key={`row-${ri}`} className="border-t border-white/10 first:border-0">
                {cells.map((cell) => (
                  <Fragment key={cell.label}>
                    <th className="w-[6.5rem] bg-[rgba(59,42,92,0.35)] px-2.5 py-2.5 align-top text-xs font-semibold text-[#c4b5fd]/80 sm:px-3">
                      {cell.label}
                    </th>
                    <td className="px-2.5 py-2.5 font-semibold text-white/90 sm:px-3">{cell.value}</td>
                  </Fragment>
                ))}
                {emptySlots > 0
                  ? Array.from({ length: emptySlots }).map((_, i) => (
                      <Fragment key={`pad-${ri}-${i}`}>
                        <th className="bg-[rgba(59,42,92,0.2)]" />
                        <td />
                      </Fragment>
                    ))
                  : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
