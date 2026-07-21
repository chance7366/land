/**
 * 권리분석 리포트 — 정렬·열폭·표지 메타 조정 목업.
 * 운영 지침 / PDF에는 미적용.
 */

const TABLE_HEAD = {
  bg: "#F3F1EE",
  text: "#3D342C",
} as const;

/** 섹션(H2) 바 — 옅은 주황 */
const SECTION_BAR = {
  bg: "#F7E8D8",
  text: "#3D342C",
} as const;

function SectionBar({ title }: { title: string }) {
  return (
    <div
      className="rounded-full px-5 py-2.5 text-left"
      style={{ background: SECTION_BAR.bg }}
    >
      <h2
        className="text-[15px] font-bold tracking-tight"
        style={{ color: SECTION_BAR.text }}
      >
        {title}
      </h2>
    </div>
  );
}

function SampleTable({
  colgroup,
  headers,
  rows,
  /** 0-based: 긴 문장 열 — 좌측 정렬 + 줄바꿈 허용 */
  leftAlignCols = [],
}: {
  colgroup?: string[];
  headers: string[];
  rows: string[][];
  leftAlignCols?: number[];
}) {
  const leftSet = new Set(leftAlignCols);
  return (
    <div className="overflow-hidden rounded-xl border border-[#E6E0D8]">
      <table className="w-full table-fixed border-collapse text-[12px]">
        {colgroup ? (
          <colgroup>
            {colgroup.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
        ) : null}
        <thead>
          <tr style={{ background: TABLE_HEAD.bg, color: TABLE_HEAD.text }}>
            {headers.map((h) => (
              <th
                key={h}
                className="border border-[#E6E0D8] px-2 py-2.5 text-center font-bold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={ri % 2 === 1 ? "bg-[#FAF8F6]" : "bg-white"}
            >
              {row.map((cell, ci) => {
                const left = leftSet.has(ci);
                return (
                  <td
                    key={ci}
                    className={[
                      "border border-[#E6E0D8] px-2.5 py-2.5 align-middle text-[#3A3A3A]",
                      left
                        ? "whitespace-normal text-left leading-[1.45]"
                        : "whitespace-nowrap text-center",
                    ].join(" ")}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReportLayoutPolishSample() {
  return (
    <div className="min-h-screen bg-[#D8D4CE] px-4 py-10 font-[family-name:var(--font-unifine),Pretendard,Noto_Sans_KR,sans-serif] text-[#2F2F2F] print:bg-white print:p-0">
      <div className="mx-auto mb-6 max-w-[794px] rounded-2xl border border-white/40 bg-[#3D342C]/90 px-5 py-4 text-sm text-[#F5F0EA] shadow-lg backdrop-blur">
        <p className="font-bold text-white">리포트 레이아웃 폴리시 · 목업</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[12.5px] leading-relaxed text-[#D8CFC4]">
          <li>표 타이틀(헤더) 행 → 옅은 베이지 <code className="text-[#F0C987]">#F3F1EE</code></li>
          <li>표 본문 기본 → 가운데 / 시세 괴리율·가치 산정 논거 → 좌측</li>
          <li>섹션(H2) → 좌측 정렬 + 옅은 주황 <code className="text-[#F0C987]">#F7E8D8</code></li>
          <li>생성일시 우측상단 · AI 고지문 · 열폭 규칙</li>
          <li>
            <strong className="text-[#8FDFB0]">운영 지침·PDF에 적용 완료</strong>
          </li>
        </ul>
      </div>

      <article className="relative mx-auto w-full max-w-[794px] bg-white px-10 pb-10 pt-8 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
        <p className="absolute right-10 top-5 text-[10.5px] text-[#8A7A6A]">
          생성일시 : 2026. 7. 22. 오전 6:39:47
        </p>

        <header className="mb-8 pt-4 text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#A08B78]">
            PREMIUM RIGHTS ANALYSIS
          </p>
          <div className="mx-auto mt-2 h-px w-16 bg-[#C4B5A5]" />
          <h1 className="mt-3 text-[26px] font-extrabold tracking-tight text-[#6B5344]">
            2025타경8398 권리분석 프리미엄 리포트
          </h1>
          <p className="mx-auto mt-3 max-w-[34em] text-[12px] leading-relaxed text-[#8A7A6A]">
            본 보고서는 찬스부동산의 경매물건 정보에 기반한 AI로 생성한 보고서 입니다.
          </p>
        </header>

        <SectionBar title="1. 물건 기본 정보 및 물리적 하자 분석 (Overview)" />
        <p className="mt-2 text-[11px] text-[#9A9A9A]">
          ↑ 섹션 제목 좌측 정렬 · 배경 옅은 주황 (이하 H2 동일)
        </p>

        <div className="mt-4">
          <SectionBar title="3. 적정 가치 평가" />
        </div>

        <h3 className="mt-6 pl-[0.5em] text-[14px] font-bold text-[#58527E]">
          2) 매물 호가 분석 (Npay부동산)
        </h3>
        <div className="mt-1 h-px bg-[#79B4B7]/70" />
        <div className="mt-3">
          <SampleTable
            headers={["구분", "최저 호가", "최고 호가", "비고"]}
            rows={[
              ["매매", "4억 5,000만", "5억 2,000만", "1층·저층 중심"],
              ["전세", "2억 8,000만", "3억 2,000만", "동일 면적대"],
            ]}
          />
        </div>

        <h3 className="mt-7 pl-[0.5em] text-[14px] font-bold text-[#58527E]">
          3) 실거래가 추이 분석
        </h3>
        <div className="mt-1 h-px bg-[#79B4B7]/70" />
        <div className="mt-3">
          <SampleTable
            headers={["거래 일자", "동/층", "거래 금액", "시장 추이"]}
            rows={[
              ["2026-03-12", "105/13", "4억 4,800만", "직전 대비 ↓"],
              ["2025-11-08", "103/8", "4억 7,200만", "보합"],
            ]}
          />
        </div>

        <h3 className="mt-7 pl-[0.5em] text-[14px] font-bold text-[#58527E]">
          시세 밴드 · 괴리율
        </h3>
        <div className="mt-1 h-px bg-[#79B4B7]/70" />
        <p className="mt-2 text-[11px] text-[#888]">
          금액 1~3열 가운데 · 시세 괴리율 분석 본문 좌측 정렬(2행)
        </p>
        <div className="mt-2">
          <SampleTable
            colgroup={["18%", "18%", "18%", "46%"]}
            headers={["하위 평균가", "일반 평균가", "상위 평균가", "시세 괴리율 분석"]}
            leftAlignCols={[3]}
            rows={[
              [
                "4억 6,000만",
                "4억 9,500만",
                "5억 3,000만",
                "일반 시세(4.95억)는 최근 13층 실거래(4.48억) 대비 후행 지표(고평가)로 판단됨",
              ],
            ]}
          />
        </div>

        <h3 className="mt-7 pl-[0.5em] text-[14px] font-bold text-[#58527E]">
          5) 3단계 적정 가치 평가
        </h3>
        <div className="mt-1 h-px bg-[#79B4B7]/70" />
        <p className="mt-2 text-[11px] text-[#888]">
          구분·평가금액 가운데 · 가치 산정 핵심 논거 좌측 정렬(길면 2줄)
        </p>
        <div className="mt-2">
          <SampleTable
            colgroup={["12%", "18%", "70%"]}
            headers={["구분", "평가 금액", "가치 산정 핵심 논거"]}
            leftAlignCols={[2]}
            rows={[
              [
                "상한가",
                "4억 5,000만원",
                "Npay 1층 최저 호가를 상한 앵커로 두고, 저층 프리미엄 부재를 반영한 상단 밴드",
              ],
              [
                "적정시세",
                "4억 2,500만원",
                "최근 중층 실거래에 1층 감가 약 5%를 적용한 중심 추정가",
              ],
              [
                "하한가",
                "4억 500만원",
                "경매 유동성·명도 리스크를 감안한 방어적 하단 (추가 5% 할인)",
              ],
            ]}
          />
        </div>

        <footer className="mt-10 border-t border-[#E5E5E5] pt-3 text-[11px] text-[#9A9A9A]">
          CHANCE · 레이아웃 폴리시 목업 · 지침 적용됨
        </footer>
      </article>
    </div>
  );
}
