"use client";

import { Camera, ClipboardList } from "lucide-react";
import type { StatusLeaseRow, StatusReport } from "@/lib/mockup/auction-court-fixtures";
import { GlassCard } from "@/components/ui/GlassCard";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#4dabff]/50 focus:ring-1 focus:ring-[#4dabff]/30";
const autoClass = `${inputClass} border-emerald-400/35 bg-emerald-500/[0.07]`;

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-xs text-slate-400 ${className}`}>
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 border-b border-sky-400/25 pb-2 text-sm font-bold text-sky-200">
      {children}
    </h3>
  );
}

export function emptyLeaseRow(no = 1): StatusLeaseRow {
  return {
    no,
    address: "",
    leaseCountLabel: "",
    occupant: "",
    partyType: "",
    occupyPart: "",
    usage: "",
    occupyPeriod: "",
    deposit: "",
    rent: "",
    moveInDate: "",
    fixedDate: "",
    leaseEtc: "",
  };
}

export function emptyStatusReport(): StatusReport {
  return {
    available: false,
    court: "",
    ordRound: "1",
    caseLabel: "",
    surveyedAt: "",
    photoCount: 0,
    photoLabel: "",
    possessionAddress: "",
    possessionRelation: "",
    possessionEtc: "",
    leases: [emptyLeaseRow(1)],
  };
}

type Props = {
  n?: number;
  title?: string;
  report: StatusReport;
  autoFilled?: boolean;
  onChange: (next: StatusReport) => void;
  /** true면 섹션 번호 헤더(GlassCard 래핑) 없이 서식만 */
  bare?: boolean;
};

/** 법원 현황조사서 팝업과 동일한 입력 서식 — 항상 필드 구조 노출 */
export function StatusReportSection({
  n = 6,
  title = "현황조사서",
  report,
  autoFilled = false,
  onChange,
  bare = false,
}: Props) {
  const cls = autoFilled ? autoClass : inputClass;
  const leases = report.leases.length ? report.leases : [emptyLeaseRow(1)];
  const lease = leases[0];

  function patch(partial: Partial<StatusReport>) {
    onChange({ ...report, available: true, leases, ...partial });
  }

  function patchLease(partial: Partial<StatusLeaseRow>) {
    const nextLeases = leases.map((row, i) => (i === 0 ? { ...row, ...partial } : row));
    onChange({ ...report, available: true, leases: nextLeases });
  }

  const body = (
    <div className="space-y-6">
      {/* 팝업 상단 메타 */}
      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-3">
        <Field label="법원">
          <input
            className={cls}
            value={report.court}
            onChange={(e) => patch({ court: e.target.value })}
            placeholder="홍성지원"
          />
        </Field>
        <Field label="명령회차">
          <div className="flex items-center gap-2">
            <input
              className={`${cls} max-w-[6rem]`}
              value={report.ordRound}
              onChange={(e) => patch({ ordRound: e.target.value })}
              placeholder="1"
            />
            <span className="text-sm text-slate-400">회</span>
          </div>
        </Field>
        <Field label="중복병합사건">
          <input className={inputClass} value="" readOnly placeholder="해당없음" />
        </Field>
      </div>

      {/* 기본정보 — 사건번호·조사일시 1행 */}
      <div>
        <SubHead>
          <ClipboardList className="h-4 w-4" />
          기본정보
        </SubHead>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm text-[#cbd5e1]">
            <tbody>
              <tr>
                <th className="w-24 whitespace-nowrap bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-400">
                  사건번호
                </th>
                <td className="px-3 py-2">
                  <input
                    className={cls}
                    value={report.caseLabel}
                    onChange={(e) => patch({ caseLabel: e.target.value })}
                    placeholder="2026타경15044 부동산강제경매"
                  />
                </td>
                <th className="w-24 whitespace-nowrap border-l border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-400">
                  조사일시
                </th>
                <td className="w-[38%] px-3 py-2">
                  <input
                    className={cls}
                    value={report.surveyedAt}
                    onChange={(e) => patch({ surveyedAt: e.target.value })}
                    placeholder="2026년02월02일13시50분"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 부동산임대차정보 */}
      <div>
        <SubHead>부동산임대차정보</SubHead>
        <div className="overflow-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[560px] text-left text-xs text-[#cbd5e1]">
            <thead>
              <tr className="bg-white/[0.04]">
                <th className="px-3 py-2">번호</th>
                <th className="px-3 py-2">소재지</th>
                <th className="w-28 px-3 py-2">임대차관계</th>
              </tr>
            </thead>
            <tbody>
              {leases.map((row, idx) => (
                <tr key={row.no} className="border-t border-white/5">
                  <td className="px-3 py-2 align-top">{row.no}</td>
                  <td className="px-3 py-2">
                    <input
                      className={cls}
                      value={row.address}
                      onChange={(e) => {
                        const next = leases.map((r, i) =>
                          i === idx ? { ...r, address: e.target.value } : r,
                        );
                        onChange({ ...report, available: true, leases: next });
                      }}
                      placeholder="소재지"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className={cls}
                      value={row.leaseCountLabel}
                      onChange={(e) => {
                        const next = leases.map((r, i) =>
                          i === idx ? { ...r, leaseCountLabel: e.target.value } : r,
                        );
                        onChange({ ...report, available: true, leases: next });
                      }}
                      placeholder="1명"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 사진정보 */}
      <div>
        <SubHead>
          <Camera className="h-4 w-4" />
          사진정보
        </SubHead>
        <div className="flex flex-wrap items-center gap-3">
          <input
            className={`${cls} max-w-xs`}
            value={report.photoLabel}
            onChange={(e) =>
              patch({
                photoLabel: e.target.value,
                photoCount: Number((e.target.value.match(/\d+/) || [])[0] || 0),
              })
            }
            placeholder="전경도 4건"
          />
          <button
            type="button"
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-slate-300 hover:border-[#4dabff]/40"
            onClick={() => alert("샘플: 전경도 사진보기 (프로덕션 연동 예정)")}
          >
            사진보기
          </button>
        </div>
      </div>

      {/* 점유관계 */}
      <div>
        <SubHead>부동산의 현황 및 점유관계 조사서</SubHead>
        <p className="mb-2 text-[11px] font-semibold text-slate-500">1. 부동산의 점유관계</p>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm text-[#cbd5e1]">
            <tbody>
              <tr className="border-b border-white/5">
                <th className="w-28 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-400">
                  소재지
                </th>
                <td className="px-3 py-2">
                  <input
                    className={cls}
                    value={report.possessionAddress}
                    onChange={(e) => patch({ possessionAddress: e.target.value })}
                    placeholder="1. … 103동 5층501호"
                  />
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-slate-400">
                  점유관계
                </th>
                <td className="px-3 py-2">
                  <input
                    className={cls}
                    value={report.possessionRelation}
                    onChange={(e) => patch({ possessionRelation: e.target.value })}
                    placeholder="임차인(별지)점유"
                  />
                </td>
              </tr>
              <tr>
                <th className="bg-white/[0.04] px-3 py-2.5 align-top text-xs font-semibold text-slate-400">
                  기타
                </th>
                <td className="px-3 py-2">
                  <textarea
                    className={`${cls} min-h-[110px] whitespace-pre-wrap`}
                    value={report.possessionEtc}
                    onChange={(e) => patch({ possessionEtc: e.target.value })}
                    placeholder="- 임차인 배우자 통화 내용…"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 임대차관계 조사서 */}
      <div>
        <SubHead>임대차관계 조사서</SubHead>
        <p className="mb-2 text-[11px] font-semibold text-slate-500">
          1. 임차 목적물의 용도 및 임대차 계약 등의 내용
        </p>
        <p className="mb-3 rounded-lg border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-xs text-sky-100">
          [소재지] {lease.no}. {lease.address || "—"}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              ["점유인", "occupant", "이은희"],
              ["당사자구분", "partyType", "임차인"],
              ["점유부분", "occupyPart", ""],
              ["용도", "usage", "주거"],
              ["점유기간", "occupyPeriod", "2024.06.17. ~ 2026.06.17."],
              ["보증(전세)금", "deposit", "5,000,000"],
              ["차임", "rent", "550,000"],
              ["전입일자", "moveInDate", "2024.06.21."],
              ["확정일자", "fixedDate", ""],
            ] as const
          ).map(([label, key, ph]) => (
            <Field key={key} label={label}>
              <input
                className={cls}
                value={lease[key]}
                onChange={(e) => patchLease({ [key]: e.target.value })}
                placeholder={ph}
              />
            </Field>
          ))}
        </div>
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold text-slate-500">2. 기타</p>
          <textarea
            className={`${cls} min-h-[110px] whitespace-pre-wrap`}
            value={lease.leaseEtc}
            onChange={(e) => patchLease({ leaseEtc: e.target.value })}
            placeholder="- 월세 계약서·전입세대열람 비고…"
          />
        </div>
      </div>
    </div>
  );

  if (bare) return body;

  return (
    <GlassCard className="p-5 md:p-6">
      <div className="mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4dabff] to-[#913dff] text-xs font-extrabold text-white">
          {n}
        </span>
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            법원 현황조사서 팝업 서식 · 입력 필드 구성 샘플
          </p>
        </div>
      </div>
      {body}
    </GlassCard>
  );
}
