import type { Auction, LegalQuestion, News, Property } from "@prisma/client";
import { PropertyCard } from "@/components/property/PropertyCard";
import { DashboardCta } from "@/components/ui/DashboardCta";
import { DashboardListCard } from "@/components/ui/DashboardListCard";
import { DashboardPanel } from "@/components/ui/DashboardPanel";
import { DashboardSectionHeader } from "@/components/ui/DashboardSectionHeader";
import { DASHBOARD_SECTION_BORDERS } from "@/lib/property-ui";

type HomeData = {
  properties: Property[];
  auctions: Auction[];
  news: News[];
  legalQuestions: LegalQuestion[];
  counts: { properties: number; auctions: number; news: number; legal: number };
};

export function UserDashboard({ data }: { data: HomeData }) {
  const featuredProperty = data.properties.find((p) => p.featured) ?? data.properties[0];
  const featuredAuction = data.auctions[0];
  const featuredNews = data.news[0];
  const featuredLegal = data.legalQuestions.find((q) => q.status === "ANSWERED") ?? data.legalQuestions[0];

  return (
    <>
      <section
        id="properties"
        className="flex h-full w-[300px] shrink-0 snap-start flex-col gap-4 md:w-auto md:min-w-0"
      >
        <DashboardSectionHeader title="일반중개" count={`${data.counts.properties}건`} id="properties-heading" />
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.properties} className="bg-surface-container-low">
          {featuredProperty && <PropertyCard property={featuredProperty} variant="featured" />}
          <div className="space-y-3 px-1">
            {data.properties
              .filter((item) => item.id !== featuredProperty?.id)
              .slice(0, 10)
              .map((item) => (
                <PropertyCard key={item.id} property={item} variant="compact" />
              ))}
          </div>
          <div className="flex-1" />
          <DashboardCta href="/properties" variant="outline">
            전체 매물 보기
          </DashboardCta>
        </DashboardPanel>
      </section>

      <section id="auctions" className="flex h-full w-[300px] shrink-0 snap-start flex-col gap-4 md:w-auto md:min-w-0">
        <DashboardSectionHeader title="경매물건추천" count={`${data.counts.auctions}건`} id="auctions-heading" />
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.auctions} className="bg-surface-container-low">
          {featuredAuction && (
            <DashboardListCard href={`/auctions?id=${encodeURIComponent(featuredAuction.id)}`} accentBorderClass="border-l-4 border-l-primary-container">
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="font-caption text-on-surface-variant">{featuredAuction.caseNumber}</span>
                <span className="font-caption font-bold text-secondary-fixed">안전</span>
              </div>
              <span className="mb-2 inline-block rounded bg-error-container px-2 py-0.5 font-caption font-bold text-on-error-container">
                진행중
              </span>
              <h3 className="font-card-title">{featuredAuction.title}</h3>
              <p className="font-caption mt-1 text-on-surface-variant">{featuredAuction.description}</p>
              <div className="mt-3">
                <DashboardCta href={`/auctions?id=${encodeURIComponent(featuredAuction.id)}`} variant="outline" className="py-2">
                  분석 리포트
                </DashboardCta>
              </div>
            </DashboardListCard>
          )}
          <div className="space-y-3 px-1 max-h-[420px] overflow-y-auto custom-scrollbar">
            {data.auctions.slice(1, 11).map((item) => (
              <DashboardListCard key={item.id} href={`/auctions?id=${encodeURIComponent(item.id)}`}>
                <div className="flex justify-between gap-2">
                  <h4 className="font-card-title truncate group-hover:text-primary">{item.title}</h4>
                  <span className="font-meta-bold shrink-0 text-primary">D-{item.dDay}</span>
                </div>
                <p className="font-caption mt-1 text-on-surface-variant">{item.description}</p>
              </DashboardListCard>
            ))}
          </div>
          <div className="flex-1" />
          <DashboardCta href="/auctions" variant="outline">
            경매 물건 리스트
          </DashboardCta>
        </DashboardPanel>
      </section>

      <section id="news" className="flex h-full w-[300px] shrink-0 snap-start flex-col gap-4 md:w-auto md:min-w-0">
        <DashboardSectionHeader title="부동산소식" count={`${data.counts.news}건`} id="news-heading" />
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.news} className="bg-surface-container-low">
          {featuredNews && (
            <DashboardListCard href={`/news/${featuredNews.id}`}>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    newspaper
                  </span>
                </div>
                <div>
                  <h3 className="font-card-title group-hover:text-primary">{featuredNews.title}</h3>
                  <p className="font-caption text-outline">
                    {new Date(featuredNews.publishedAt).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
              <p className="font-caption leading-relaxed text-on-surface-variant">{featuredNews.summary}</p>
            </DashboardListCard>
          )}
          <div className="space-y-3 px-1 max-h-[420px] overflow-y-auto custom-scrollbar">
            {data.news.slice(1, 11).map((item) => (
              <DashboardListCard key={item.id} href={`/news/${item.id}`}>
                <h4 className="font-card-title group-hover:text-primary">{item.title}</h4>
                <p className="font-caption mt-1 text-outline">{item.summary}</p>
              </DashboardListCard>
            ))}
          </div>
          <div className="flex-1" />
          <DashboardCta href="/news" variant="outline">
            뉴스룸 바로가기
          </DashboardCta>
        </DashboardPanel>
      </section>

      <section id="legal" className="flex h-full w-[300px] shrink-0 snap-start flex-col gap-4 md:w-auto md:min-w-0">
        <DashboardSectionHeader title="법률상담" count={`${data.counts.legal}건`} id="legal-heading" />
        <DashboardPanel borderClass={DASHBOARD_SECTION_BORDERS.legal} className="bg-surface-container-low">
          {featuredLegal && (
            <DashboardListCard>
              <div className="mb-3 flex gap-2">
                <span className="rounded bg-primary/10 px-2 py-0.5 font-caption font-bold text-primary">
                  {featuredLegal.category}
                </span>
                {featuredLegal.status === "ANSWERED" && (
                  <span className="rounded bg-primary/10 px-2 py-0.5 font-caption font-bold text-primary">
                    답변완료
                  </span>
                )}
              </div>
              <h3 className="font-card-title mb-2">{featuredLegal.question}</h3>
              {featuredLegal.answer && (
                <div className="rounded-lg border-l-2 border-primary bg-surface-container-lowest p-3">
                  <p className="font-caption mb-1 font-medium text-primary">찬스 법률자문단 답변</p>
                  <p className="font-caption line-clamp-2 text-on-surface-variant">{featuredLegal.answer}</p>
                </div>
              )}
            </DashboardListCard>
          )}
          <div className="mt-2 space-y-3 px-1 max-h-[320px] overflow-y-auto custom-scrollbar">
            {data.legalQuestions
              .filter((q) => q.id !== featuredLegal?.id)
              .slice(0, 10)
              .map((item) => (
                <DashboardListCard key={item.id} href={`/legal/${item.id}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">Q</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-card-title group-hover:text-primary">{item.question}</h4>
                      <p className="font-caption mt-0.5 text-outline">
                        {item.status === "ANSWERED" ? "답변 완료" : "답변 대기 중"}
                      </p>
                    </div>
                  </div>
                </DashboardListCard>
              ))}
          </div>
          <div className="flex-1" />
          <DashboardCta href="/legal" variant="outline">
            찬스상담소 전체 보기
          </DashboardCta>
          <div className="rounded-xl border border-primary/15 bg-primary-container/10 p-4 text-center">
            <p className="font-caption mb-3 font-bold text-primary">변호사/세무사 1:1 맞춤 상담</p>
            <DashboardCta href="/consultation" variant="primary">
              상담 신청하기
            </DashboardCta>
          </div>
        </DashboardPanel>
      </section>
    </>
  );
}
