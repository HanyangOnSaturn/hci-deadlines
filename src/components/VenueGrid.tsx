"use client";

import { useState, useMemo } from "react";
import { Venue, VenueCategory, DeadlineStatus } from "@/lib/types";
import DeadlineCard from "./DeadlineCard";
import FilterBar from "./FilterBar";

interface VenueGridProps {
  venues: Venue[];
  showFilters?: boolean;
}

export default function VenueGrid({ venues, showFilters = true }: VenueGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<VenueCategory | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<DeadlineStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVenues = useMemo(() => {
    let filtered = venues;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((v) => v.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((v) => v.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.abbreviation.toLowerCase().includes(query) ||
          v.publisher.toLowerCase().includes(query) ||
          v.topic_areas.some((t) => t.toLowerCase().includes(query)) ||
          (v.location && v.location.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [venues, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div>
      {showFilters && (
        <div className="mb-6">
          <FilterBar
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      )}

      {filteredVenues.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No venues match your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredVenues.map((venue) => (
            <DeadlineCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
        Showing {filteredVenues.length} of {venues.length} venues
      </p>
    </div>
  );
}
