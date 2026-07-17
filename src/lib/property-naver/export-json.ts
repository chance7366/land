import { ALL_FIELD_SPECS } from "./field-spec";
import type { CategoryGroup } from "./types";

/** Dump field specs as plain JSON (for docs / external tools). */
export function exportFieldSpecsJson(group?: CategoryGroup): string {
  const fields = group
    ? ALL_FIELD_SPECS.filter((f) => f.category_groups.includes(group))
    : ALL_FIELD_SPECS;
  return JSON.stringify(fields, null, 2);
}
