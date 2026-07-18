import { getLandingHomeData } from "@/lib/data";
import { HomeBelowHero } from "@/components/landing/HomeBelowHero";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";
import { UserBottomNav } from "@/components/user/UserShell";

export { dynamic } from "@/lib/page-config";

export default async function HomePage() {
  const data = await getLandingHomeData();

  return (
    <LandingShell>
      <AnalyticsPageView menuKey="home" />
      <LandingHeader />
      <LandingNav />
      <main>
        <LandingHero />
        <HomeBelowHero
          properties={data.properties}
          auctions={data.auctions}
          newsFeed={data.newsFeed}
          legalQuestions={data.legalQuestions}
          successStories={data.successStories}
        />
      </main>
      <div className="pb-24 md:pb-0">
        <LandingFooter />
      </div>
      <UserBottomNav />
    </LandingShell>
  );
}
