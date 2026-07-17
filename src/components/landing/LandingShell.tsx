export function LandingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-landing-bg font-[family-name:var(--font-unifine)] text-landing-text antialiased">
      {children}
    </div>
  );
}
