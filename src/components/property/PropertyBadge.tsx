import type { PropertyCategory, PropertyType } from "@prisma/client";
import { getCategoryUi, getDealUi, TAG_BADGE } from "@/lib/property-ui";

type PropertyBadgeProps = {
  variant: "category" | "deal" | "tag";
  label: string;
  category?: PropertyCategory;
  deal?: PropertyType;
  size?: "sm" | "md";
  solid?: boolean;
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export function PropertyBadge({
  variant,
  label,
  category,
  deal,
  size = "sm",
  solid = false,
}: PropertyBadgeProps) {
  let style = TAG_BADGE;

  if (variant === "category" && category) {
    const ui = getCategoryUi(category);
    style = solid ? ui.badgeSolid : ui.badge;
  }

  if (variant === "deal" && deal) {
    style = getDealUi(deal).badge;
  }

  return (
    <span className={`inline-flex items-center rounded font-bold ${sizeClasses[size]} ${style}`}>
      {label}
    </span>
  );
}
