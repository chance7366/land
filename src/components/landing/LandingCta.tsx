type LandingCtaProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants = {
  primary:
    "bg-gradient-to-r from-cta-from to-cta-to text-white shadow-[0_4px_14px_rgba(37,99,236,0.2)] hover:opacity-95 hover:shadow-[0_6px_20px_rgba(37,99,236,0.35)]",
  secondary:
    "border border-landing-border bg-landing-surface text-landing-text hover:border-white/20 hover:bg-landing-elevated",
  ghost:
    "border border-landing-border/60 bg-transparent text-landing-muted hover:border-white/20 hover:text-landing-text",
};

export function LandingCta({
  href,
  children,
  variant = "primary",
  className = "",
}: LandingCtaProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-xl px-12 py-3.5 text-sm font-bold transition-all ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
