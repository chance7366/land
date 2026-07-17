"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PropertyCategory } from "@prisma/client";
import { navigateTo } from "@/lib/navigate";
import {
  type FilterDealValue,
  type FilterSortValue,
  type PropertyFilterSelection,
} from "@/components/property/PropertyFilterDropdownBar";
import { PropertyFilterPillsBar } from "@/components/property/PropertyFilterPillsBar";

type Props = {
  regions: string[];
};

function parseCsv(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function selectionFromParams(searchParams: URLSearchParams): PropertyFilterSelection {
  const sortRaw = searchParams.get("sort") as FilterSortValue | null;
  return {
    categories: parseCsv(searchParams.get("category")) as PropertyCategory[],
    deals: parseCsv(searchParams.get("deal")) as FilterDealValue[],
    regions: parseCsv(searchParams.get("region")),
    sort: sortRaw === "price_asc" || sortRaw === "price_desc" ? sortRaw : "latest",
  };
}

function hrefForSelection(
  pathname: string,
  current: URLSearchParams,
  next: PropertyFilterSelection,
) {
  const params = new URLSearchParams(current.toString());
  if (next.categories.length) params.set("category", next.categories.join(","));
  else params.delete("category");
  if (next.deals.length) params.set("deal", next.deals.join(","));
  else params.delete("deal");
  if (next.regions.length) params.set("region", next.regions.join(","));
  else params.delete("region");
  if (next.sort && next.sort !== "latest") params.set("sort", next.sort);
  else params.delete("sort");
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function PropertyFiltersDropdownConnected({ regions }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const [draft, setDraft] = useState(() => selectionFromParams(searchParams));
  const draftRef = useRef(draft);

  useEffect(() => {
    const fromUrl = selectionFromParams(searchParams);
    draftRef.current = fromUrl;
    setDraft(fromUrl);
  }, [searchKey, searchParams]);

  const applyToUrl = useCallback(
    (next: PropertyFilterSelection) => {
      const href = hrefForSelection(pathname, searchParams, next);
      const current = `${pathname}${searchKey ? `?${searchKey}` : ""}`;
      if (href !== current) navigateTo(href);
    },
    [pathname, searchParams, searchKey],
  );

  return (
    <PropertyFilterPillsBar
      regions={regions}
      categories={draft.categories}
      deals={draft.deals}
      selectedRegions={draft.regions}
      sort={draft.sort}
      onChange={(next) => {
        draftRef.current = next;
        setDraft(next);
        applyToUrl(next);
      }}
    />
  );
}
