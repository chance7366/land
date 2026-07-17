import { AppLink as Link } from "@/components/ui/AppLink";

type DashboardListCardProps = {
  href?: string;
  accentBorderClass?: string;
  className?: string;
  children: React.ReactNode;
};

const baseClass =
  "group block rounded-xl border border-landing-border bg-landing-surface p-4 shadow-sm transition-colors hover:border-white/20 hover:bg-landing-elevated";

export function DashboardListCard({ href, accentBorderClass = "", className = "", children }: DashboardListCardProps) {
  const classes = `${baseClass} ${accentBorderClass} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={`${classes} cursor-pointer`}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
