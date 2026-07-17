type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
};

export function GlassCard({ children, className = "", as: Tag = "div" }: GlassCardProps) {
  return (
    <Tag
      className={`glass-card rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.24)] backdrop-blur-md ${className}`}
    >
      {children}
    </Tag>
  );
}
