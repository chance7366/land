export function DashboardSectionHeader({ title, count, id }: { title: string; count: string; id: string }) {
  return (
    <div className="flex items-center justify-between px-2">
      <h2 id={id} className="flex items-center gap-2 font-section-title text-primary">
        {title}{" "}
        <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-caption font-normal text-on-surface-variant">
          {count}
        </span>
      </h2>
      <span className="material-symbols-outlined cursor-pointer text-outline" aria-hidden="true">
        more_horiz
      </span>
    </div>
  );
}
