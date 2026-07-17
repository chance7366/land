import { AppLink as Link } from "@/components/ui/AppLink";

type DashboardCtaProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
};

const variants = {
  primary: "bg-primary text-on-primary hover:opacity-90 hover:shadow-md",
  outline:
    "border border-outline-variant/40 bg-white text-primary hover:border-primary/30 hover:bg-primary/5",
};

export function DashboardCta({ href, children, variant = "outline", className = "" }: DashboardCtaProps) {
  return (
    <Link
      href={href}
      className={`block w-full rounded-lg py-2.5 text-center text-xs font-bold transition-all ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
