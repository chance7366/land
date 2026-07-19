"use client";

import { useState } from "react";
import {
  FileText,
  FolderOpen,
  Users,
  Building2,
  ScrollText,
  Send,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataTable } from "@/components/ui/DataTable";
import {
  formatWon,
  type CaseDetail,
} from "@/lib/auction-case-detail";

type TabId = "case" | "docs";

function SubHead({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h3 className="mb-3 flex items-center gap-2 border-b border-sky-400/25 pb-2 text-sm font-bold text-sky-200">
      {icon}
      {children}
    </h3>
  );
}

function Kv({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-slate-500">{label}</dt>
      <dd className="mt-0.5 break-words text-sm text-slate-100">
        {value || <span className="text-slate-600">—</span>}
      </dd>
    </div>
  );
}

function EmptyRow({
  colSpan,
  label = "검색결과가 없습니다",
}: {
  colSpan: number;
  label?: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-6 text-center text-slate-500">
        {label}
      </td>
    </tr>
  );
}

type Props = {
  n?: number;
  data: CaseDetail;
  /** 등록용 요약 입력란 (전유면적·점유 등) */
  children?: React.ReactNode;
};

/** 3. 물건상세 — 법원 사건상세조회(사건내역 + 문건/송달내역) */
export function CaseDetailSection({ n = 3, data, children }: Props) {
  const [tab, setTab] = useState<TabId>("case");

  return (
    <GlassCard className="p-5 md:p-6">
      <div className="mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4dabff] to-[#913dff] text-xs font-extrabold text-white">
          {n}
        </span>
        <div>
          <h2 className="text-base font-bold text-white">물건상세</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            법원 사건상세조회 · 사건내역 + 문건/송달내역 (기일내역 제외)
            {data.available ? "" : " · 불러오기 후 채워집니다"}
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
        {(
          [
            { id: "case" as const, label: "사건내역" },
            { id: "docs" as const, label: "문건/송달내역" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition md:flex-none md:px-5 ${
              tab === t.id
                ? "bg-gradient-to-r from-[#4dabff]/25 to-[#913dff]/25 text-white ring-1 ring-white/15"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
        <span className="hidden items-center px-3 text-[10px] text-slate-600 md:flex">
          기일내역은 섹션 2
        </span>
      </div>

      {tab === "case" ? (
        <div className="space-y-6">
          <section>
            <SubHead icon={<FileText className="h-4 w-4" />}>사건기본내역</SubHead>
            <dl className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 lg:grid-cols-3">
              <Kv label="사건번호" value={data.basic.caseNumber} />
              <Kv label="사건명" value={data.basic.caseName} />
              <Kv label="관할법원" value={data.court} />
              <Kv label="접수일자" value={data.basic.receivedAt} />
              <Kv label="개시결정일자" value={data.basic.startedAt} />
              <Kv label="담당계" value={data.basic.dept} />
              <Kv label="청구금액" value={formatWon(data.basic.claimAmount)} />
              <Kv label="사건항고/정지여부" value={data.basic.appealStay} />
              <Kv label="종국결과" value={data.basic.finalResult} />
              <Kv label="종국일자" value={data.basic.finalDate} />
            </dl>
          </section>

          <section>
            <SubHead icon={<ScrollText className="h-4 w-4" />}>배당요구종기내역</SubHead>
            <DataTable maxHeight="220px">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#0B0F19]/90">
                    <th className="px-3 py-2">목록번호</th>
                    <th className="px-3 py-2">소재지</th>
                    <th className="px-3 py-2 whitespace-nowrap">배당요구종기일</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dividendDeadlines.length === 0 ? (
                    <EmptyRow colSpan={3} />
                  ) : (
                    data.dividendDeadlines.map((r) => (
                      <tr key={r.listNo} className="border-t border-white/5">
                        <td className="px-3 py-2">{r.listNo}</td>
                        <td className="px-3 py-2">{r.address}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{r.deadline}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </DataTable>
          </section>

          <section>
            <SubHead>항고내역</SubHead>
            <DataTable maxHeight="160px">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#0B0F19]/90">
                    <th className="px-3 py-2">법원</th>
                    <th className="px-3 py-2">사건번호</th>
                    <th className="px-3 py-2">구분</th>
                    <th className="px-3 py-2">접수일</th>
                    <th className="px-3 py-2">결과</th>
                  </tr>
                </thead>
                <tbody>
                  {data.appeals.length === 0 ? (
                    <EmptyRow colSpan={5} />
                  ) : (
                    data.appeals.map((r, i) => (
                      <tr key={`${r.caseNumber}-${i}`} className="border-t border-white/5">
                        <td className="px-3 py-2">{r.court}</td>
                        <td className="px-3 py-2">{r.caseNumber}</td>
                        <td className="px-3 py-2">{r.kind}</td>
                        <td className="px-3 py-2">{r.filedAt}</td>
                        <td className="px-3 py-2">{r.result || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </DataTable>
          </section>

          <section>
            <SubHead>관련사건내역</SubHead>
            <DataTable maxHeight="180px">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#0B0F19]/90">
                    <th className="px-3 py-2">법원</th>
                    <th className="px-3 py-2">사건번호</th>
                    <th className="px-3 py-2">사건구분</th>
                  </tr>
                </thead>
                <tbody>
                  {data.relatedCases.length === 0 ? (
                    <EmptyRow colSpan={3} />
                  ) : (
                    data.relatedCases.map((r) => (
                      <tr key={r.caseNumber} className="border-t border-white/5">
                        <td className="px-3 py-2">{r.court}</td>
                        <td className="px-3 py-2">{r.caseNumber}</td>
                        <td className="px-3 py-2">{r.kind}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </DataTable>
          </section>

          <section>
            <SubHead icon={<Building2 className="h-4 w-4" />}>
              물건내역 · 물건번호 {data.item.itemNo}
            </SubHead>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Kv label="물건용도" value={data.item.itemType} />
                <Kv label="감정평가액" value={formatWon(data.item.appraisalPrice)} />
                <Kv label="최저매각가격" value={formatWon(data.item.minPrice)} />
                <Kv label="매수신청보증금" value={formatWon(data.item.bidDeposit)} />
                <Kv label="물건상태" value={data.item.status} />
                <Kv label="기일정보" value={data.item.saleDateLabel} />
                <Kv label="최근입찰결과" value={data.item.recentResult} />
                <div className="sm:col-span-2 lg:col-span-3">
                  <Kv label="물건비고" value={data.item.remarks} />
                </div>
              </dl>
            </div>
          </section>

          <section>
            <SubHead>목록내역</SubHead>
            <DataTable maxHeight="200px">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#0B0F19]/90">
                    <th className="px-3 py-2">목록</th>
                    <th className="px-3 py-2">구분</th>
                    <th className="px-3 py-2">소재지</th>
                    <th className="px-3 py-2">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lists.length === 0 ? (
                    <EmptyRow colSpan={4} />
                  ) : (
                    data.lists.map((r) => (
                      <tr key={r.no} className="border-t border-white/5">
                        <td className="px-3 py-2">{r.no}</td>
                        <td className="px-3 py-2">{r.listKind}</td>
                        <td className="px-3 py-2">{r.address}</td>
                        <td className="px-3 py-2 text-slate-400">{r.detail || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </DataTable>
          </section>

          <section>
            <SubHead icon={<Users className="h-4 w-4" />}>당사자내역</SubHead>
            <DataTable maxHeight="260px">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#0B0F19]/90">
                    <th className="px-3 py-2 w-14">번호</th>
                    <th className="px-3 py-2">당사자구분</th>
                    <th className="px-3 py-2">성명</th>
                  </tr>
                </thead>
                <tbody>
                  {data.parties.length === 0 ? (
                    <EmptyRow colSpan={3} />
                  ) : (
                    data.parties.map((r) => (
                      <tr key={r.no} className="border-t border-white/5">
                        <td className="px-3 py-2">{r.no}</td>
                        <td className="px-3 py-2">{r.role}</td>
                        <td className="px-3 py-2">{r.name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </DataTable>
          </section>
        </div>
      ) : (
        <div className="space-y-6">
          <section>
            <SubHead icon={<FolderOpen className="h-4 w-4" />}>문건처리내역</SubHead>
            <DataTable maxHeight="320px">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#0B0F19]/90">
                    <th className="px-3 py-2 whitespace-nowrap">접수일</th>
                    <th className="px-3 py-2">접수내역</th>
                    <th className="px-3 py-2 w-24">결과</th>
                  </tr>
                </thead>
                <tbody>
                  {data.docProcess.length === 0 ? (
                    <EmptyRow colSpan={3} />
                  ) : (
                    data.docProcess.map((r, i) => (
                      <tr key={`${r.receivedAt}-${i}`} className="border-t border-white/5">
                        <td className="px-3 py-2 whitespace-nowrap align-top">
                          {r.receivedAt}
                        </td>
                        <td className="px-3 py-2 leading-relaxed">{r.detail}</td>
                        <td className="px-3 py-2 align-top text-slate-500">
                          {r.result || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </DataTable>
            <p className="mt-1 text-right text-[11px] text-slate-500">
              {data.docProcess.length}건
            </p>
          </section>

          <section>
            <SubHead icon={<Send className="h-4 w-4" />}>송달내역</SubHead>
            <DataTable maxHeight="360px">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#0B0F19]/90">
                    <th className="px-3 py-2 whitespace-nowrap">송달일</th>
                    <th className="px-3 py-2">송달내역</th>
                    <th className="px-3 py-2 whitespace-nowrap">송달결과</th>
                  </tr>
                </thead>
                <tbody>
                  {data.services.length === 0 ? (
                    <EmptyRow colSpan={3} />
                  ) : (
                    data.services.map((r, i) => (
                      <tr key={`${r.servedAt}-${i}`} className="border-t border-white/5">
                        <td className="px-3 py-2 whitespace-nowrap align-top">{r.servedAt}</td>
                        <td className="px-3 py-2 leading-relaxed">{r.detail}</td>
                        <td className="px-3 py-2 whitespace-nowrap align-top">
                          {r.result || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </DataTable>
            <p className="mt-1 text-right text-[11px] text-slate-500">
              {data.services.length}건
            </p>
          </section>
        </div>
      )}

      {children ? (
        <div className="mt-8 border-t border-white/10 pt-5">
          <SubHead>등록용 요약 필드</SubHead>
          <p className="mb-3 text-[11px] text-slate-500">
            위 법원 원문과 별도로, 물건 카드·검색에 쓰는 요약 입력란입니다.
          </p>
          {children}
        </div>
      ) : null}
    </GlassCard>
  );
}
