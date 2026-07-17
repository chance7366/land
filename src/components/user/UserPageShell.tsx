import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { UserBottomNav } from "@/components/user/UserShell";

export function UserPageShell({
  children,
  showBottomNav = false,
  maxWidthClass = "max-w-3xl",
}: {
  children: React.ReactNode;
  showBottomNav?: boolean;
  maxWidthClass?: string;
}) {
  return (
    <LandingShell>
      <LandingHeader />
      <LandingNav />
      <main className={`mx-auto ${maxWidthClass} px-4 py-8 pb-24`}>{children}</main>
      {showBottomNav ? <UserBottomNav /> : null}
    </LandingShell>
  );
}
