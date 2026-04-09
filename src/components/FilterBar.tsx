"use client";

import { VenueCategory, DeadlineStatus, CATEGORY_LABELS } from "@/lib/types";

interface FilterBarProps {
  selectedCategory: VenueCategory | "all";
  selectedStatus: DeadlineStatus | "all";
  onCategoryChange: (category: VenueCategory | "all") => void;
  onStatusChange: (status: DeadlineStatus | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const statusFilters: { value: DeadlineStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "closing_soon", label: "Closing Soon" },
  { value: "open", label: "Open" },
  { value: "upcoming", label: "Upcoming" },
  { value: "rolling", label: "Rolling" },
  { value: "tbd", label: "TBD" },
  { value: "passed", label: "Passed" },
];

const categoryFilters: { value: VenueCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value: value as VenueCategory,
    label,
  })),
];

export default function FilterBar({
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search venues..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedStatus === filter.value
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {categoryFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onCategoryChange(filter.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === filter.value
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
