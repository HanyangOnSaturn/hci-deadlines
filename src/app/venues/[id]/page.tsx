import { notFound } from "next/navigation";
import Link from "next/link";
import { loadVenues, getVenueById } from "@/lib/venues";
import { formatDeadlineDate } from "@/lib/deadlines";
import StatusBadge from "@/components/StatusBadge";
import CategoryBadge from "@/components/CategoryBadge";
import CountdownTimer from "@/components/CountdownTimer";

export function generateStaticParams() {
  const venues = loadVenues();
  return venues.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venue = getVenueById(id);
  if (!venue) return { title: "Venue Not Found" };
  return {
    title: `${venue.abbreviation} ${venue.year} — HCI Deadline Tracker`,
    description: `Submission deadlines for ${venue.name} (${venue.abbreviation} ${venue.year}).`,
  };
}

function DateRow({
  label,
  date,
  bold = false,
}: {
  label: string;
  date: string | null;
  bold?: boolean;
}) {
  if (!date) return null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={bold ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}>
        {formatDeadlineDate(date)}
      </span>
    </div>
  );
}

export default async function VenueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venue = getVenueById(id);
  if (!venue) notFound();

  const hasAnyDate = venue.abstract_deadline || venue.paper_deadline || venue.notification_date || venue.camera_ready_date;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        href="/venues"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to venues
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {venue.abbreviation} {venue.year}
          </h1>
          <StatusBadge status={venue.status} />
        </div>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{venue.name}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <CategoryBadge category={venue.category} />
          <span className="text-sm text-gray-500 dark:text-gray-500">{venue.publisher}</span>
          {venue.acceptance_rate && (
            <span className="text-sm text-gray-500 dark:text-gray-500">
              Acceptance rate: {venue.acceptance_rate}
            </span>
          )}
          {venue.format && venue.format !== "TBD" && (
            <span className="text-sm text-gray-500 dark:text-gray-500 capitalize">
              {venue.format}
            </span>
          )}
        </div>
        {venue.location && venue.conference_start && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {venue.location}
            {venue.conference_start && ` — ${formatDeadlineDate(venue.conference_start)}`}
            {venue.conference_end && ` to ${formatDeadlineDate(venue.conference_end)}`}
          </p>
        )}
      </div>

      {/* Countdown */}
      {venue.primaryDeadline && venue.status !== "passed" && venue.status !== "rolling" && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:bg-gray-900 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {venue.primaryDeadlineLabel}
          </p>
          <CountdownTimer deadline={venue.primaryDeadline} className="text-3xl" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {formatDeadlineDate(venue.primaryDeadline)} (AoE)
          </p>
        </div>
      )}

      {/* Key Dates */}
      {hasAnyDate && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Key Dates
          </h2>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <DateRow label="Abstract Deadline" date={venue.abstract_deadline} bold />
            <DateRow label="Paper Deadline" date={venue.paper_deadline} bold />
            <DateRow label="Notification" date={venue.notification_date} />
            <DateRow label="Camera-Ready" date={venue.camera_ready_date} />
            <DateRow label="Conference Start" date={venue.conference_start} />
            <DateRow label="Conference End" date={venue.conference_end} />
          </div>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            All deadlines are {venue.deadline_timezone} unless noted otherwise.
          </p>
        </div>
      )}

      {/* Notes */}
      {venue.notes && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Notes & Policies
          </h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {venue.notes.split("\n").filter(Boolean).map((line, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-400 my-1">
                {line.trim()}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        <a
          href={venue.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Official Website
        </a>
        {venue.submission_url && (
          <a
            href={venue.submission_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Submit Paper
          </a>
        )}
        {venue.cfp_url && (
          <a
            href={venue.cfp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Call for Papers
          </a>
        )}
        {venue.venue_type === "conference" && venue.paper_deadline && (
          <a
            href={`/api/calendar/${venue.id}`}
            download={`${venue.id}.ics`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Download .ics
          </a>
        )}
      </div>

      {/* Data source */}
      <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Data verified from{" "}
          <a
            href={venue.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            official source
          </a>{" "}
          on {venue.last_verified}. Always verify with the official website before submitting.
        </p>
      </div>
    </div>
  );
}
