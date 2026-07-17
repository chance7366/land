import { AppLink as Link } from "@/components/ui/AppLink";
import type { Property } from "@prisma/client";
import { PropertyBadge } from "@/components/property/PropertyBadge";
import {
  categoryLabel,
  formatPropertyPrice,
  getCategorySpecItems,
  getCommonSpecItems,
  parseTags,
  propertyTypeLabel,
} from "@/lib/format";
import { getCategoryUi, getDealUi } from "@/lib/property-ui";

export function PropertyDetailSpecs({ property }: { property: Property }) {
  const common = getCommonSpecItems(property);
  const extra = getCategorySpecItems(property);
  const tags = parseTags(property.tags);
  const catUi = getCategoryUi(property.category);
  const dealUi = getDealUi(property.type);

  return (
    <div className="space-y-6">
      <div
        className={`overflow-hidden rounded-xl border border-landing-border border-t-4 ${catUi.borderTop} bg-landing-surface p-4`}
      >
        <div className="mb-3 flex flex-wrap gap-2">
          <PropertyBadge
            variant="category"
            category={property.category}
            label={categoryLabel(property.category)}
            size="md"
          />
          <PropertyBadge variant="deal" deal={property.type} label={propertyTypeLabel(property.type)} size="md" />
          {tags.map((tag) => (
            <PropertyBadge key={tag} variant="tag" label={tag} size="md" />
          ))}
        </div>
        <div className={`rounded-lg px-4 py-3 ${dealUi.priceStrip}`}>
          <p className={`font-data-numeral ${dealUi.priceText}`}>{formatPropertyPrice(property)}</p>
        </div>
      </div>

      {common.length > 0 && (
        <section>
          <h2 className="font-section-title mb-3 text-landing-text">핵심 정보</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {common.map((item) => (
              <SpecCell key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </section>
      )}

      {extra.length > 0 && (
        <section>
          <h2 className="font-section-title mb-3 text-landing-text">
            {categoryLabel(property.category)} 상세
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {extra.map((item) => (
              <SpecCell key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-section-title mb-3 text-landing-text">위치</h2>
        <div className="rounded-xl border border-landing-border bg-landing-surface p-4">
          <p className="font-medium text-landing-text">{property.address}</p>
          <p className="mt-1 text-sm text-landing-muted">{property.region}</p>
        </div>
      </section>

      <section>
        <h2 className="font-section-title mb-3 text-landing-text">상세 ?�명</h2>
        <p className="font-caption leading-relaxed text-landing-muted">{property.description}</p>
      </section>

      <Link
        href={`/consultation?propertyId=${property.id}`}
        className="block rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-4 text-center font-bold text-white shadow-[0_4px_14px_rgba(37,99,236,0.2)] transition-all hover:opacity-95"
      >
        이 매물 상담 신청
      </Link>
    </div>
  );
}

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-landing-border bg-landing-elevated p-3">
      <p className="font-caption text-landing-muted">{label}</p>
      <p className="font-card-title mt-1 text-landing-text">{value}</p>
    </div>
  );
}
