import { DashboardCta } from "@/components/ui/DashboardCta";
import { DashboardListCard } from "@/components/ui/DashboardListCard";
import { DashboardPanel } from "@/components/ui/DashboardPanel";
import { DashboardSectionHeader } from "@/components/ui/DashboardSectionHeader";
import { DASHBOARD_SECTION_BORDERS } from "@/lib/property-ui";
import {
  MOCK_AUCTION,
  MOCK_AUCTION_LIST,
  MOCK_COUNTS,
  MOCK_LEGAL,
  MOCK_LEGAL_LIST,
  MOCK_NEWS,
  MOCK_NEWS_LIST,
  MOCK_PROPERTY,
  MOCK_PROPERTY_LIST,
} from "./mock-data";

function MockBadge({ label, variant = "neutral" }: { label: string; variant?: "neutral" | "primary" | "error" }) {
  const styles = {
    neutral: "bg-surface-container-high text-on-surface-variant",
    primary: "bg-primary/10 text-primary",
    error: "bg-error-container text-on-error-container",
  };
  return (
    <span className={`rounded px-2 py-0.5 font-caption font-bold ${styles[variant]}`}>{label}</span>
  );
}

function ColumnShell({ id, title, count, children }: { id: string; title: string; count: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex min-w-[260px] flex-1 flex-col gap-4">
      <DashboardSectionHeader title={title} count={count} id={`${id}-heading`} />
      {children}
    </section>
  );
}

/** 현재(Before) — 경매 다크 패널, CTA variant 혼재 */
export function LegacyDashboardColumns() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <ColumnShell id="properties" title="일반중개" count={`${MOCK_COUNTS.properties}건`}>
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.properties} className="bg-surface-container-low">
          <DashboardListCard accentBorderClass="border-l-4 border-l-primary">
            <div className="mb-2 flex flex-wrap gap-1">
              {MOCK_PROPERTY.badges.map((b) => (
                <MockBadge key={b} label={b} variant={b === "즉시입주" ? "error" : "primary"} />
              ))}
            </div>
            <h3 className="font-card-title">{MOCK_PROPERTY.title}</h3>
            <p className="font-caption mt-1 text-on-surface-variant">{MOCK_PROPERTY.summary}</p>
            <p className="font-meta-bold mt-2 text-primary">{MOCK_PROPERTY.price}</p>
          </DashboardListCard>
          <div className="space-y-3">
            {MOCK_PROPERTY_LIST.map((item) => (
              <DashboardListCard key={item.title}>
                <div className="mb-1 flex gap-1">
                  {item.badges.map((b) => (
                    <MockBadge key={b} label={b} variant="primary" />
                  ))}
                </div>
                <h4 className="font-card-title">{item.title}</h4>
                <p className="font-meta-bold mt-1 text-primary">{item.price}</p>
              </DashboardListCard>
            ))}
          </div>
          <div className="flex-1" />
          <DashboardCta href="#" variant="outline">
            전체 매물 보기
          </DashboardCta>
        </DashboardPanel>
      </ColumnShell>

      <ColumnShell id="auctions" title="경매물건추천" count={`${MOCK_COUNTS.auctions}건`}>
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.auctions} className="bg-primary">
          <div className="rounded-xl border border-on-primary-container/20 bg-primary-container p-3">
            <div className="mb-2 flex justify-between">
              <span className="font-caption text-on-primary-container">{MOCK_AUCTION.caseNumber}</span>
              <span className="font-caption font-bold text-secondary-fixed">안전</span>
            </div>
            <h3 className="font-card-title mb-3 text-white">{MOCK_AUCTION.title}</h3>
            <span className="block w-full rounded-lg bg-white py-2 text-center font-caption font-bold text-primary">
              분석 리포트
            </span>
          </div>
          {MOCK_AUCTION_LIST.map((item) => (
            <div key={item.title} className="border-b border-on-primary-container/20 pb-3">
              <div className="flex justify-between">
                <h4 className="font-card-title text-white">{item.title}</h4>
                <span className="font-meta-bold text-on-primary-container">D-{item.dDay}</span>
              </div>
              <p className="font-caption mt-1 text-on-primary-container">{item.description}</p>
            </div>
          ))}
          <div className="flex-1" />
          <span className="block w-full rounded-lg bg-white py-2.5 text-center text-xs font-bold text-primary">
            경매 물건 리스트
          </span>
        </DashboardPanel>
      </ColumnShell>

      <ColumnShell id="news" title="부동산소식" count={`${MOCK_COUNTS.news}건`}>
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.news} className="bg-surface-container-low">
          <DashboardListCard>
            <h3 className="font-card-title">{MOCK_NEWS.title}</h3>
            <p className="font-caption mt-1 text-outline">{MOCK_NEWS.date}</p>
            <p className="font-caption mt-2 text-on-surface-variant">{MOCK_NEWS.summary}</p>
          </DashboardListCard>
          {MOCK_NEWS_LIST.map((item) => (
            <DashboardListCard key={item.title}>
              <h4 className="font-card-title">{item.title}</h4>
              <p className="font-caption mt-1 text-outline">{item.summary}</p>
            </DashboardListCard>
          ))}
          <div className="flex-1" />
          <DashboardCta href="#" variant="outline">
            뉴스룸 바로가기
          </DashboardCta>
        </DashboardPanel>
      </ColumnShell>

      <ColumnShell id="legal" title="법률상담" count="Q&A">
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.legal} className="bg-surface-container-low">
          <DashboardListCard>
            <div className="mb-2 flex gap-2">
              <MockBadge label={MOCK_LEGAL.category} variant="primary" />
              <MockBadge label="답변완료" variant="primary" />
            </div>
            <h3 className="font-card-title">{MOCK_LEGAL.question}</h3>
          </DashboardListCard>
          {MOCK_LEGAL_LIST.map((item) => (
            <DashboardListCard key={item.question}>
              <h4 className="font-card-title">{item.question}</h4>
              <p className="font-caption mt-1 text-outline">답변 대기 중</p>
            </DashboardListCard>
          ))}
          <div className="flex-1" />
          <div className="rounded-xl bg-primary p-4 text-center">
            <p className="font-caption mb-3 font-bold text-on-primary">변호사/세무사 1:1 맞춤 상담</p>
            <span className="block rounded-lg bg-secondary py-2.5 text-xs font-bold text-on-secondary">상담 신청하기</span>
          </div>
        </DashboardPanel>
      </ColumnShell>
    </div>
  );
}

/** 제안(After) — Unified Light Panel */
export function UnifiedDashboardColumns() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <ColumnShell id="properties-after" title="일반중개" count={`${MOCK_COUNTS.properties}건`}>
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.properties} className="bg-surface-container-low">
          <DashboardListCard accentBorderClass="border-l-4 border-l-primary">
            <div className="mb-2 flex flex-wrap gap-1">
              {MOCK_PROPERTY.badges.map((b) => (
                <MockBadge key={b} label={b} variant={b === "즉시입주" ? "error" : "primary"} />
              ))}
            </div>
            <h3 className="font-card-title">{MOCK_PROPERTY.title}</h3>
            <p className="font-caption mt-1 text-on-surface-variant">{MOCK_PROPERTY.summary}</p>
            <p className="font-meta-bold mt-2 text-primary">{MOCK_PROPERTY.price}</p>
          </DashboardListCard>
          <div className="space-y-3">
            {MOCK_PROPERTY_LIST.map((item) => (
              <DashboardListCard key={item.title}>
                <div className="mb-1 flex gap-1">
                  {item.badges.map((b) => (
                    <MockBadge key={b} label={b} variant="primary" />
                  ))}
                </div>
                <h4 className="font-card-title group-hover:text-primary">{item.title}</h4>
                <p className="font-meta-bold mt-1 text-primary">{item.price}</p>
              </DashboardListCard>
            ))}
          </div>
          <div className="flex-1" />
          <DashboardCta href="#" variant="outline">
            전체 매물 보기
          </DashboardCta>
        </DashboardPanel>
      </ColumnShell>

      <ColumnShell id="auctions-after" title="경매물건추천" count={`${MOCK_COUNTS.auctions}건`}>
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.auctions} className="bg-surface-container-low">
          <DashboardListCard accentBorderClass="border-l-4 border-l-primary-container">
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className="font-caption text-on-surface-variant">{MOCK_AUCTION.caseNumber}</span>
              <span className="font-caption font-bold text-secondary-fixed">안전</span>
            </div>
            <span className="mb-2 inline-block rounded bg-error-container px-2 py-0.5 font-caption font-bold text-on-error-container">
              진행중
            </span>
            <h3 className="font-card-title">{MOCK_AUCTION.title}</h3>
            <p className="font-caption mt-1 text-on-surface-variant">{MOCK_AUCTION.description}</p>
            <div className="mt-3">
              <DashboardCta href="#" variant="outline" className="py-2">
                분석 리포트
              </DashboardCta>
            </div>
          </DashboardListCard>
          {MOCK_AUCTION_LIST.map((item) => (
            <DashboardListCard key={item.title} href="#">
              <div className="flex justify-between gap-2">
                <h4 className="font-card-title group-hover:text-primary">{item.title}</h4>
                <span className="font-meta-bold shrink-0 text-primary">D-{item.dDay}</span>
              </div>
              <p className="font-caption mt-1 text-on-surface-variant">{item.description}</p>
            </DashboardListCard>
          ))}
          <div className="flex-1" />
          <DashboardCta href="#" variant="outline">
            경매 물건 리스트
          </DashboardCta>
        </DashboardPanel>
      </ColumnShell>

      <ColumnShell id="news-after" title="부동산소식" count={`${MOCK_COUNTS.news}건`}>
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.news} className="bg-surface-container-low">
          <DashboardListCard href="#">
            <h3 className="font-card-title group-hover:text-primary">{MOCK_NEWS.title}</h3>
            <p className="font-caption mt-1 text-outline">{MOCK_NEWS.date}</p>
            <p className="font-caption mt-2 text-on-surface-variant">{MOCK_NEWS.summary}</p>
          </DashboardListCard>
          {MOCK_NEWS_LIST.map((item) => (
            <DashboardListCard key={item.title} href="#">
              <h4 className="font-card-title group-hover:text-primary">{item.title}</h4>
              <p className="font-caption mt-1 text-outline">{item.summary}</p>
            </DashboardListCard>
          ))}
          <div className="flex-1" />
          <DashboardCta href="#" variant="outline">
            뉴스룸 바로가기
          </DashboardCta>
        </DashboardPanel>
      </ColumnShell>

      <ColumnShell id="legal-after" title="법률상담" count="Q&A">
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.legal} className="bg-surface-container-low">
          <DashboardListCard>
            <div className="mb-2 flex gap-2">
              <MockBadge label={MOCK_LEGAL.category} variant="primary" />
              <MockBadge label="답변완료" variant="primary" />
            </div>
            <h3 className="font-card-title">{MOCK_LEGAL.question}</h3>
            <div className="mt-3 rounded-lg border-l-2 border-primary bg-surface-container-lowest p-3">
              <p className="font-caption font-medium text-primary">찬스 법률자문단 답변</p>
              <p className="font-caption mt-1 text-on-surface-variant">{MOCK_LEGAL.answer}</p>
            </div>
          </DashboardListCard>
          {MOCK_LEGAL_LIST.map((item) => (
            <DashboardListCard key={item.question} href="#">
              <h4 className="font-card-title group-hover:text-primary">{item.question}</h4>
              <p className="font-caption mt-1 text-outline">답변 대기 중</p>
            </DashboardListCard>
          ))}
          <div className="flex-1" />
          <div className="rounded-xl border border-primary/15 bg-primary-container/10 p-4 text-center">
            <p className="font-caption mb-3 font-bold text-primary">변호사/세무사 1:1 맞춤 상담</p>
            <DashboardCta href="#" variant="primary">
              상담 신청하기
            </DashboardCta>
          </div>
        </DashboardPanel>
      </ColumnShell>
    </div>
  );
}

export function ColorTokenLegend() {
  const tokens = [
    { name: "primary", hex: "#031635", use: "제목, Primary CTA, 매매", swatch: "bg-primary" },
    { name: "primary-container", hex: "#1a2b4b", use: "경매 accent border, 임대", swatch: "bg-primary-container" },
    { name: "inverse-primary", hex: "#b6c6ef", use: "소식 accent border", swatch: "bg-inverse-primary" },
    { name: "surface-container-low", hex: "#f3f4f5", use: "4열 패널 공통 배경", swatch: "bg-surface-container-low" },
    { name: "secondary-fixed", hex: "#bcf0ae", use: "경매 '안전' 텍스트만", swatch: "bg-secondary-fixed" },
    { name: "error-container", hex: "#ffdad6", use: "진행중, 급매 태그", swatch: "bg-error-container" },
  ];

  return (
    <div className="mt-10 rounded-2xl border border-outline-variant/30 bg-white p-6">
      <h2 className="font-section-title text-primary">색상 토큰 레전드</h2>
      <p className="font-caption mt-1 text-on-surface-variant">Brand 2색(네이vy+블루) + Semantic만 사용</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tokens.map((t) => (
          <div key={t.name} className="flex items-start gap-3 rounded-lg border border-outline-variant/20 p-3">
            <div className={`h-10 w-10 shrink-0 rounded-lg ${t.swatch}`} />
            <div>
              <p className="font-card-title">{t.name}</p>
              <p className="font-caption text-outline">{t.hex}</p>
              <p className="font-caption mt-1 text-on-surface-variant">{t.use}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
