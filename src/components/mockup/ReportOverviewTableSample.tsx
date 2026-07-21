/**
 * 권리분석 리포트 — 경매 개요 표 디자인 목업.
 * 운영 지침·PDF에 동일 규칙 반영됨.
 */

export function ReportOverviewTableSample() {
  return (
    <div className="min-h-screen bg-[#D8D4CE] px-4 py-10 font-[family-name:var(--font-unifine),Pretendard,Noto_Sans_KR,sans-serif] text-[#2F2F2F] print:bg-white print:p-0">
      <div className="mx-auto mb-8 max-w-[794px] rounded-2xl border border-white/40 bg-[#3D342C]/90 px-5 py-4 text-sm text-[#F5F0EA] shadow-lg backdrop-blur">
        <p className="font-bold text-white">경매 개요 표 · 디자인 목업</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[12.5px] leading-relaxed text-[#D8CFC4]">
          <li>
            소제목:{" "}
            <code className="text-[#F0C987]">### - 1) …</code> →{" "}
            <code className="text-white">### 1) …</code> (하이픈 제거 + 약 2칸 들여쓰기)
          </li>
          <li>표 4열: 사건번호·물건번호·물건종별·입찰방법 / 감정가·최저가·매각기일·진행상태</li>
          <li>
            소재지:{" "}
            <code className="text-white">소재지 : (주소)</code> 형태 <strong>1행</strong> 표기
          </li>
          <li>
            <strong className="text-[#8FDFB0]">운영 지침·PDF에 적용 완료</strong>
          </li>
        </ul>
      </div>

      <article className="relative mx-auto w-full max-w-[794px] bg-white px-10 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
        <header className="mb-8 text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#A08B78]">
            PREMIUM RIGHTS ANALYSIS
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-[#6B5344]">
            2025타경8398 권리분석 프리미엄 리포트
          </h1>
          <p className="mt-2 text-[12px] text-[#8A7A6A]">생성일시: 샘플 · 목업</p>
          <div className="mx-auto mt-4 h-px w-24 bg-[#C4B5A5]" />
        </header>

        <div className="flex items-center rounded-full bg-[#F7E8D8] px-5 py-2.5">
          <h2 className="flex-1 text-left text-[15px] font-bold text-[#3D342C]">
            1. 물건 기본 정보 및 물리적 하자 분석 (Overview)
          </h2>
        </div>

        {/* BEFORE */}
        <section className="mt-8">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#A08B78]">
            Before (현재)
          </p>
          <h3 className="text-[14px] font-bold text-[#58527E]">- 1) 경매 개요</h3>
          <div className="mt-1 h-px bg-[#79B4B7]/70" />
          <div className="mt-3 overflow-hidden rounded-xl border border-[#E6E0D8]">
            <table className="w-full border-collapse text-[12px]">
              <tbody>
                <tr className="bg-[#F3F1EE] text-[#3D342C]">
                  <th className="px-3 py-2 text-left font-bold">사건번호</th>
                  <th className="px-3 py-2 text-center font-bold">물건번호</th>
                  <th className="px-3 py-2 text-center font-bold">물건종별</th>
                </tr>
                <tr className="border-t border-[#EDE8E2]">
                  <td className="px-3 py-2">2025타경8398</td>
                  <td className="px-3 py-2 text-center">1</td>
                  <td className="px-3 py-2 text-center">아파트</td>
                </tr>
                <tr className="border-t border-[#EDE8E2] bg-[#F3F1EE] text-[#3D342C]">
                  <th className="px-3 py-2 text-left font-bold">감정가</th>
                  <th className="px-3 py-2 text-center font-bold">최저가</th>
                  <th className="px-3 py-2 text-center font-bold">입찰방법</th>
                </tr>
                <tr className="border-t border-[#EDE8E2]">
                  <td className="px-3 py-2 text-center">477,000,000원</td>
                  <td className="px-3 py-2 text-center">333,900,000원</td>
                  <td className="px-3 py-2 text-center">기일입찰</td>
                </tr>
                <tr className="border-t border-[#EDE8E2] bg-[#F3F1EE] text-[#3D342C]">
                  <th className="px-3 py-2 text-left font-bold">소재지</th>
                  <th className="px-3 py-2 text-center font-bold">매각기일</th>
                  <th className="px-3 py-2 text-center font-bold">진행상태</th>
                </tr>
                <tr className="border-t border-[#EDE8E2]">
                  <td className="px-3 py-2">대구 동구 신천동 … 105동 1층102호</td>
                  <td className="px-3 py-2 text-center">2026-08-12</td>
                  <td className="px-3 py-2 text-center">2회차 진행 (1회 유찰)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* AFTER */}
        <section className="mt-10">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#2F6B4F]">
            After (제안)
          </p>
          <h3 className="pl-[0.5em] text-[14px] font-bold text-[#58527E]">
            1) 경매 개요
          </h3>
          <div className="mt-1 h-px bg-[#79B4B7]/70" />

          <div className="mt-3 overflow-hidden rounded-xl border border-[#E6E0D8]">
            <table className="w-full table-fixed border-collapse text-[12px]">
              <colgroup>
                <col className="w-1/4" />
                <col className="w-1/4" />
                <col className="w-1/4" />
                <col className="w-1/4" />
              </colgroup>
              <tbody>
                <tr className="bg-[#F3F1EE] text-[#3D342C]">
                  <th className="px-2 py-2 text-center font-bold">사건번호</th>
                  <th className="px-2 py-2 text-center font-bold">물건번호</th>
                  <th className="px-2 py-2 text-center font-bold">물건종별</th>
                  <th className="px-2 py-2 text-center font-bold">입찰방법</th>
                </tr>
                <tr className="border-t border-[#EDE8E2] text-[#3A3A3A]">
                  <td className="px-2 py-2.5 text-center">2025타경8398</td>
                  <td className="px-2 py-2.5 text-center">1</td>
                  <td className="px-2 py-2.5 text-center">아파트</td>
                  <td className="px-2 py-2.5 text-center">기일입찰</td>
                </tr>
                <tr className="border-t border-[#EDE8E2] bg-[#F3F1EE] text-[#3D342C]">
                  <th className="px-2 py-2 text-center font-bold">감정가</th>
                  <th className="px-2 py-2 text-center font-bold">최저가</th>
                  <th className="px-2 py-2 text-center font-bold">매각기일</th>
                  <th className="px-2 py-2 text-center font-bold">진행상태</th>
                </tr>
                <tr className="border-t border-[#EDE8E2] text-[#3A3A3A]">
                  <td className="px-2 py-2.5 text-center tabular-nums">477,000,000원</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">333,900,000원</td>
                  <td className="px-2 py-2.5 text-center">2026-08-12</td>
                  <td className="px-2 py-2.5 text-center">2회차 진행 (1회 유찰)</td>
                </tr>
                {/* 소재지 — 1행 표기 */}
                <tr className="border-t border-[#EDE8E2] bg-[#FAF8F6] text-[#3A3A3A]">
                  <td colSpan={4} className="px-3 py-2.5 text-left leading-normal">
                    <span className="font-bold text-[#3D342C]">소재지</span>
                    <span className="text-[#3D342C]"> : </span>
                    대구광역시 동구 신천동 160-1 화성파크드림이스트밸리 105동 1층102호
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 pl-[0.5em] text-[12px] leading-relaxed text-[#666]">
            이하 소제목도 동일하게 들여쓰기 +{" "}
            <span className="font-semibold text-[#58527E]">2) 공부상 현황…</span>,{" "}
            <span className="font-semibold text-[#58527E]">3) 현황조사서…</span>
          </p>
        </section>

        <footer className="mt-10 border-t border-[#E5E5E5] pt-3 text-[11px] text-[#9A9A9A]">
          CHANCE · 경매 개요 표 목업 · 지침 적용됨
        </footer>
      </article>
    </div>
  );
}
