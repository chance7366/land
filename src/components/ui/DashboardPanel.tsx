export function DashboardPanel({
  borderClass,
  className = "",
  children,
}: {
  borderClass: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex min-h-[560px] flex-1 flex-col gap-4 rounded-2xl border-t-4 p-4 shadow-md md:min-h-[640px] ${borderClass} ${className}`}
    >
      {children}
    </div>
  );
}
