import type { Property } from "@prisma/client";
import { AppLink as Link } from "@/components/ui/AppLink";
import Image from "next/image";
import { PropertyBadge } from "@/components/property/PropertyBadge";
import {
  categoryLabel,
  formatPropertyPrice,
  formatPropertySummary,
  parseImages,
  parseTags,
  propertyTypeLabel,
} from "@/lib/format";
import { getCategoryUi, getDealUi } from "@/lib/property-ui";

type PropertyCardProps = {
  property: Property;
  variant?: "default" | "compact" | "featured";
};

export function PropertyCard({ property, variant = "default" }: PropertyCardProps) {
  const image = parseImages(property.images)[0];
  const tags = parseTags(property.tags);
  const summary = formatPropertySummary(property);
  const price = formatPropertyPrice(property);
  const catUi = getCategoryUi(property.category);
  const dealUi = getDealUi(property.type);

  if (variant === "featured") {
    return (
      <Link
        href={`/properties?id=${property.id}`}
        className={`property-card block overflow-hidden rounded-xl border border-landing-border border-t-4 ${catUi.borderTop} bg-landing-surface p-3 shadow-md`}
      >
        <div className="relative mb-3 overflow-hidden rounded-lg ring-2 ring-white/80">
          {image ? (
            <Image src={image} alt={property.title} width={320} height={96} className="h-24 w-full object-cover" />
          ) : (
            <PlaceholderImage category={property.category} className="h-24" iconClass="text-3xl" />
          )}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            <PropertyBadge variant="category" category={property.category} label={categoryLabel(property.category)} solid />
            <PropertyBadge variant="deal" deal={property.type} label={propertyTypeLabel(property.type)} />
          </div>
        </div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <PropertyBadge key={tag} variant="tag" label={tag} />
            ))}
          </div>
          <span className="font-caption text-outline">
            {new Date(property.publishedAt).toISOString().slice(0, 10)}
          </span>
        </div>
        <h3 className="font-card-title mb-1 text-landing-text">{property.title}</h3>
        <p className="font-caption mb-2 line-clamp-2 text-landing-muted">{summary}</p>
        <div className={`rounded-lg px-3 py-2 ${dealUi.priceStrip}`}>
          <div className={`flex items-center gap-2 font-meta-bold ${dealUi.priceText}`}>
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              payments
            </span>
            <span>{price}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/properties?id=${property.id}`}
        className={`property-card group block cursor-pointer rounded-lg border border-landing-border border-l-4 ${catUi.borderLeft} bg-landing-surface p-3 shadow-sm`}
      >
        <div className="mb-1 flex flex-wrap gap-1">
          <PropertyBadge variant="category" category={property.category} label={categoryLabel(property.category)} />
          <PropertyBadge variant="deal" deal={property.type} label={propertyTypeLabel(property.type)} />
        </div>
        <h4 className="font-card-title truncate text-landing-text transition-colors group-hover:text-blue-400">
          {property.title}
        </h4>
        <p className="font-caption mt-1 text-landing-muted">{summary}</p>
        <p className={`font-meta-bold mt-2 ${dealUi.priceText}`}>{price}</p>
      </Link>
    );
  }

  return (
    <Link
      href={`/properties?id=${property.id}`}
      className={`property-card block overflow-hidden rounded-2xl border border-landing-border border-t-4 ${catUi.borderTop} bg-landing-surface shadow-md`}
    >
      <div className="relative">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            width={640}
            height={180}
            className="h-40 w-full object-cover ring-2 ring-inset ring-white/10"
          />
        ) : (
          <PlaceholderImage category={property.category} className="h-40" iconClass="text-4xl" />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          <PropertyBadge variant="category" category={property.category} label={categoryLabel(property.category)} solid />
          <PropertyBadge variant="deal" deal={property.type} label={propertyTypeLabel(property.type)} />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <PropertyBadge key={tag} variant="tag" label={tag} />
          ))}
        </div>
        <h2 className="font-card-title text-landing-text">{property.title}</h2>
        <p className="font-caption mt-1 text-landing-muted">{summary}</p>
        <p className="font-caption mt-1 text-landing-muted">{property.buildingName || property.region}</p>
        <div className={`mt-3 rounded-lg px-3 py-2.5 ${dealUi.priceStrip}`}>
          <p className={`font-data-numeral ${dealUi.priceText}`}>{price}</p>
        </div>
      </div>
    </Link>
  );
}

function PlaceholderImage({
  category,
  className,
  iconClass,
}: {
  category: Property["category"];
  className: string;
  iconClass: string;
}) {
  const ui = getCategoryUi(category);
  return (
    <div className={`flex items-center justify-center ${ui.placeholder} ${className}`}>
      <span className={`material-symbols-outlined ${iconClass}`} aria-hidden="true">
        {ui.icon}
      </span>
    </div>
  );
}
