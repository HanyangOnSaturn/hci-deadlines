"use client";

import { VenueCategory, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";

interface CategoryBadgeProps {
  category: VenueCategory;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}
