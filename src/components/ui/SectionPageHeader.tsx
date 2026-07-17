type SectionPageHeaderProps = {
  title: string;
  description?: string;
  count?: string;
  borderClass: string;
};

export function SectionPageHeader({ title, description, count, borderClass }: SectionPageHeaderProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-landing-border border-t-4 bg-landing-surface p-5 ${borderClass}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-headline-lg text-landing-text">{title}</h1>
          {description && <p className="mt-2 text-landing-muted">{description}</p>}
        </div>
        {count && (
          <span className="rounded-full bg-cta-from/15 px-4 py-1.5 font-caption font-bold text-blue-400">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}
