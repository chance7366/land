/**
 * 경매물건 권리분석 리포트 — 디자인 레퍼런스 목업.
 * 색상·레이아웃은 `auction-report-design.ts` / `AUCTION_ANALYSIS_SYSTEM_PROMPT`와 동기화.
 */

const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
    <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function SectionBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-[#ECECEC] px-5 py-2.5">
      <h2 className="flex-1 text-[15px] font-bold tracking-tight text-[#3D342C]">{title}</h2>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6B5344] text-white shadow-sm">
        <SearchIcon className="h-4 w-4" />
      </span>
    </div>
  );
}

function AlertBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E8D5A8] bg-white">
      <div className="flex items-center gap-2.5 border-b border-[#F0E0B8] bg-[#FFF8E7] px-4 py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8A317] text-sm font-bold text-white">
          !
        </span>
        <p className="text-[14px] font-bold text-[#C4810A]">{title}</p>
      </div>
      <ul className="space-y-1.5 px-4 py-3 text-[13px] leading-relaxed text-[#3A3A3A]">
        {items.map((t) => (
          <li key={t} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-[#B8A080]" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PageShell({
  children,
  page,
  total,
}: {
  children: React.ReactNode;
  page: number;
  total: number;
}) {
  return (
    <article className="relative mx-auto w-full max-w-[794px] bg-white px-10 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/5 print:shadow-none print:ring-0">
      <div className="pointer-events-none absolute right-0 top-24 flex h-28 w-5 items-center justify-center rounded-l-md bg-[#EFEFEF]">
        <span
          className="text-[9px] font-medium tracking-widest text-[#9A9A9A]"
          style={{ writingMode: "vertical-rl" }}
        >
          CHANCE REPORT
        </span>
      </div>
      {children}
      <footer className="mt-10 flex items-center justify-between border-t border-[#E5E5E5] pt-3 text-[11px] text-[#9A9A9A]">
        <span>CHANCE · 권리분석 프리미엄 리포트 (목업)</span>
        <span>
          {page} / {total}
        </span>
      </footer>
    </article>
  );
}

export function RightsAnalysisReportSample() {
  return (
    <div className="min-h-screen bg-[#D8D4CE] px-4 py-10 font-[family-name:var(--font-unifine),Pretendard,Noto_Sans_KR,sans-serif] text-[#2F2F2F] print:bg-white print:p-0">
      <div className="mx-auto mb-8 max-w-[794px] rounded-2xl border border-white/40 bg-[#3D342C]/90 px-5 py-4 text-sm text-[#F5F0EA] shadow-lg backdrop-blur">
        <p className="font-bold text-white">권리분석 리포트 디자인 레퍼런스</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-[#D8CFC4]">
          본 서식은{" "}
          <strong className="text-white">운영 지침·PDF 생성에 적용</strong>되어 있습니다.
          본문 문구만 더미 샘플입니다.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {/* ── Page 1 ── */}
        <PageShell page={1} total={2}>
          <header className="mb-8 text-center">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#A08B78]">
              PREMIUM RIGHTS ANALYSIS
            </p>
            <h1 className="mt-2 text-[28px] font-extrabold tracking-tight text-[#6B5344]">
              경매물건 권리분석 리포트
            </h1>
            <p className="mt-2 text-[13px] text-[#8A7A6A]">
              샘플 · 2026타경○○○○ · 아파트 1건
            </p>
            <div className="mx-auto mt-4 h-px w-24 bg-[#C4B5A5]" />
          </header>

          <SectionBar title="1. 물건 기본 정보 및 물리적 하자 분석" />

          <div className="mt-5 overflow-hidden rounded-2xl border border-[#E6E0D8]">
            <table className="w-full border-collapse text-[12.5px]">
              <thead>
                <tr className="bg-[#F3F1EE] text-[#3D342C]">
                  <th className="px-3 py-2.5 text-left font-bold">사건번호</th>
                  <th className="px-3 py-2.5 text-center font-bold">물건번호</th>
                  <th className="px-3 py-2.5 text-center font-bold">물건종별</th>
                </tr>
              </thead>
              <tbody className="text-[#3A3A3A]">
                <tr className="border-t border-[#EDE8E2]">
                  <td className="px-3 py-2.5">2026타경○○○○</td>
                  <td className="px-3 py-2.5 text-center">1</td>
                  <td className="px-3 py-2.5 text-center">아파트</td>
                </tr>
                <tr className="border-t border-[#EDE8E2] bg-[#FAF8F6]">
                  <td className="px-3 py-2 font-bold text-[#6B5344]">감정가</td>
                  <td className="px-3 py-2 text-center font-bold text-[#6B5344]">최저가</td>
                  <td className="px-3 py-2 text-center font-bold text-[#6B5344]">입찰방법</td>
                </tr>
                <tr className="border-t border-[#EDE8E2]">
                  <td className="px-3 py-2.5 text-center">198,000,000원</td>
                  <td className="px-3 py-2.5 text-center">138,600,000원</td>
                  <td className="px-3 py-2.5 text-center">기일입찰</td>
                </tr>
                <tr className="border-t border-[#EDE8E2] bg-[#FAF8F6]">
                  <td className="px-3 py-2 font-bold text-[#6B5344]">소재지</td>
                  <td className="px-3 py-2 text-center font-bold text-[#6B5344]">매각기일</td>
                  <td className="px-3 py-2 text-center font-bold text-[#6B5344]">진행상태</td>
                </tr>
                <tr className="border-t border-[#EDE8E2]">
                  <td className="px-3 py-2.5">충남 ○○군 ○○읍</td>
                  <td className="px-3 py-2.5 text-center">2026.07.28</td>
                  <td className="px-3 py-2.5 text-center">유찰 1회</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 text-[13px] leading-relaxed">
            <p>
              <span className="mr-1.5 inline-block h-2 w-2 rounded-[2px] bg-[#2F6B4F] align-middle" />
              <strong className="text-[#2F6B4F]">공부 대조</strong>
              <span className="text-[#555]">
                {" "}
                — 건축물대장·등기부 용도 일치. 대지권 등기 정상.
              </span>
            </p>
            <p>
              <span className="mr-1.5 inline-block h-2 w-2 rounded-[2px] bg-[#2F6B4F] align-middle" />
              <strong className="text-[#2F6B4F]">현황·하자</strong>
              <span className="text-[#555]">
                {" "}
                — 점유자 거주 중. 누수·균열 특이사항 미확인(임장 권고).
              </span>
            </p>
            <p>
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#C4810A] align-middle" />
              <strong className="text-[#8A6A20]">유찰 히스토리</strong>
              <span className="text-[#555]">
                {" "}
                — 1회 유찰 후 최저가 70%. 권리 복잡도보다 가격 이슈로 추정.
              </span>
            </p>
          </div>

          <div className="mt-7">
            <SectionBar title="2. 심층 권리분석 (Risk Assessment)" />
          </div>

          <div className="mt-5 rounded-xl bg-[#F4F9F5] px-4 py-3.5 ring-1 ring-[#C5DCCB]">
            <p className="text-[13px] font-bold text-[#2F6B4F]">말소기준권리 · 인수 요약</p>
            <ul className="mt-2 space-y-1.5 text-[12.5px] text-[#3A3A3A]">
              <li className="flex gap-2">
                <span className="text-[#79B4B7]">▸</span>
                말소기준권리: 근저당권 (설정일 ○○) — 이후 권리 말소 예상
              </li>
              <li className="flex gap-2">
                <span className="text-[#79B4B7]">▸</span>
                <span>
                  <span className="font-medium text-[#A67C52]">(임차인)</span> 전입·확정일자
                  대조 결과 — 후순위 추정
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#79B4B7]">▸</span>
                낙찰자 실질 인수 예상액:{" "}
                <strong className="text-[#2F6B4F]">0원 (안전 후보)</strong>
              </li>
            </ul>
          </div>

          <div className="mt-5 grid gap-3">
            <AlertBox
              title="교차 검증 포인트"
              items={[
                "전 소유자명 ↔ 임차인명 일치 여부 재확인",
                "배당요구종기 이후 임차권등기 접수 여부",
                "선행 취하 경매 사건의 조세채권 교부청구 열람",
              ]}
            />
          </div>

          {/* process flow — teal pills from ref 4 */}
          <div className="mt-7">
            <p className="mb-3 text-[12px] font-bold text-[#58527E]">권리 점검 흐름 (샘플)</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {["등기 시계열", "임차 대항력", "배당 시뮬", "인수액", "적합성"].map((label, i) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="flex items-center gap-2 rounded-full bg-[#79B4B7] px-3 py-1.5 text-[11px] font-bold text-white">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-[10px]">
                      {i + 1}
                    </span>
                    {label}
                  </div>
                  {i < 4 && <span className="text-[#B0B0B0]">»</span>}
                </div>
              ))}
            </div>
          </div>

          {/* brown summary + arrow motif from ref 1 */}
          <div className="mt-8 flex flex-wrap items-stretch gap-3">
            <div className="min-w-[200px] flex-1 rounded-2xl bg-[#6B5344] px-5 py-4 text-white">
              <p className="text-[11px] font-semibold tracking-wide text-[#D8CFC4]">종합 분류</p>
              <ol className="mt-2 space-y-1 text-[13px] font-medium">
                <li>
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                    1
                  </span>
                  입찰 적합성: 안전
                </li>
                <li>
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                    2
                  </span>
                  실질 인수: 0원대
                </li>
                <li>
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                    3
                  </span>
                  임장 후 최종 확정
                </li>
              </ol>
            </div>
            <div className="flex items-center px-1 text-[#6B5344]" aria-hidden>
              <svg width="36" height="28" viewBox="0 0 36 28" fill="currentColor">
                <path d="M0 10h20V4l16 10-16 10v-6H0z" />
              </svg>
            </div>
            <div className="flex min-w-[140px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C4B5A5] px-4 py-3">
              <span className="text-[28px]" aria-hidden>
                ⚖
              </span>
              <p className="mt-1 text-center text-[13px] font-extrabold text-[#6B5344]">
                숨은 진주
                <br />
                후보
              </p>
            </div>
          </div>
        </PageShell>

        {/* ── Page 2 ── */}
        <PageShell page={2} total={2}>
          <div className="flex items-center rounded-lg bg-[#F0F0F0] px-4 py-2.5">
            <h2 className="flex-1 text-[15px] font-bold text-[#3D342C]">
              3~6. 입지 · 가치 · 명도 · 최종 결론
            </h2>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F6B4F] text-white">
              <SearchIcon className="h-4 w-4" />
            </span>
          </div>

          <div className="mt-6 space-y-4 text-[13px] leading-relaxed">
            <div>
              <p className="font-bold text-[#58527E]">입지·상권 (샘플)</p>
              <div className="mt-1 h-px bg-[#79B4B7]/70" />
              <ul className="mt-2 space-y-1 text-[#444]">
                <li className="flex gap-2">
                  <span className="text-[#79B4B7]">●</span>
                  학군·생활편의 양호. 단지 내 주차·관리 상태 보통.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#79B4B7]">●</span>
                  인근 실거래 대비 최저가 매력도 중간~상.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-[#58527E]">가치·수익률 (샘플)</p>
              <div className="mt-1 h-px bg-[#79B4B7]/70" />
              <ul className="mt-2 space-y-1 text-[#444]">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#58527E]" />
                  권장 관심가대: 최저가 ~ 최저가+α (상세 지침 대기 영역)
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#58527E]" />
                  예상 수익률은 임장·시세 보정 후 재산정
                </li>
              </ul>
            </div>
          </div>

          <AlertBox
            title="명도·출구 체크"
            items={[
              "점유자 협의 가능 여부 현장 확인",
              "인도명령·소송 기간·비용 시나리오 준비",
              "전매·임대·실거주 중 출구 1안 확정",
            ]}
          />

          <div className="mt-8 text-center">
            <p className="inline-flex items-center gap-2 text-[18px] font-extrabold text-[#58527E]">
              <span className="text-[20px]" aria-hidden>
                💬
              </span>
              최종 결론 Q&amp;A
            </p>
            <div className="mx-auto mt-2 h-px w-full max-w-md bg-[#79B4B7]" />
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-[14px] font-bold text-[#58527E]">Q1) 입찰해도 될까요?</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#444]">
                <span className="font-bold text-[#58527E]">A1)</span> 서류상 인수 리스크는 낮아
                보이며 <strong className="text-[#2F6B4F]">안전 후보</strong>입니다. 다만 임장·선행사건
                문건 열람 후 최종 결정하세요.
              </p>
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#58527E]">Q2) 추천 입찰가는?</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#444]">
                <span className="font-bold text-[#58527E]">A2)</span> 본 목업에서는 금액 단정을
                피합니다. 실서비스 적용 시 4·6번 지침과 연동됩니다.
              </p>
            </div>
          </div>

          {/* Q circle callout — ref 1 bottom */}
          <div className="mt-8 flex gap-3 rounded-2xl border border-[#E8D5A8] bg-[#FFF9EE] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8873A] text-lg font-black text-white shadow-sm">
              ?
            </span>
            <div className="text-[12.5px] leading-relaxed text-[#4A4038]">
              <p className="font-bold text-[#8A4B16]">전문가 한 줄</p>
              <p className="mt-1">
                법원 명세서 비고만 믿지 말고,{" "}
                <strong className="text-[#6B5344]">날짜·이름 교차검증</strong>으로
                독자 결론을 내세요. (디자인 목업용 문구)
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-[#C45A5A]">
            ※ 본 문서는 디자인 샘플이며 법적·투자 자문이 아닙니다.
          </p>
        </PageShell>
      </div>
    </div>
  );
}
