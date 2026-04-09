"use client";

import Link from "next/link";
import { Venue } from "@/lib/types";
import { formatDeadlineDate, getCountdownText } from "@/lib/deadlines";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";
import CountdownTimer from "./CountdownTimer";

interface DeadlineCardProps {
  venue: Venue;
}

export default function DeadlineCard({ venue }: DeadlineCardProps) {
  const hasDeadline = venue.primaryDeadline && venue.status !== "rolling";

  return (
    <Link
      href={`/venues/${venue.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:border-gray-600"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400 truncate">
              {venue.abbreviation} {venue.year}
            </h3>
            <StatusBadge status={venue.status} size="sm" />
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
            {venue.name}
          </p>
        </div>

        {hasDeadline && venue.status !== "passed" && venue.primaryDeadline && (
          <div className="text-right shrink-0">
            <CountdownTimer deadline={venue.primaryDeadline} className="text-lg" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <CategoryBadge category={venue.category} />
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {venue.publisher}
        </span>
        {venue.acceptance_rate && (
          <span className="text-xs text-gray-500 dark:text-gray-500">
            Acc. {venue.acceptance_rate}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1">
        {venue.abstract_deadline && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-500">Abstract</span>
            <span className="text-gray-700 dark:text-gray-300">
              {formatDeadlineDate(venue.abstract_deadline)}
            </span>
          </div>
        )}
        {venue.paper_deadline && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-500">Paper</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatDeadlineDate(venue.paper_deadline)}
            </span>
          </div>
        )}
        {!venue.paper_deadline && venue.venue_type === "journal" && (
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Rolling submissions
          </div>
        )}
        {venue.conference_start && venue.location && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-500">Conference</span>
            <span className="text-gray-700 dark:text-gray-300">
              {formatDeadlineDate(venue.conference_start)} · {venue.location}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
