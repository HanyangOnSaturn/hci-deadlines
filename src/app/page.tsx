import { loadVenues } from "@/lib/venues";
import { Venue } from "@/lib/types";
import VenueGrid from "@/components/VenueGrid";

function StatsBar({ venues }: { venues: Venue[] }) {
  const counts: Record<string, number> = {
    closing_soon: 0,
    open: 0,
    upcoming: 0,
    rolling: 0,
    total: venues.length,
  };
  venues.forEach((v) => {
    if (v.status in counts) counts[v.status]++;
  });

  const stats = [
    { label: "Closing Soon", value: counts.closing_soon, color: "text-orange-600 dark:text-orange-400" },
    { label: "Open", value: counts.open, color: "text-green-600 dark:text-green-400" },
    { label: "Upcoming", value: counts.upcoming, color: "text-blue-600 dark:text-blue-400" },
    { label: "Rolling", value: counts.rolling, color: "text-violet-600 dark:text-violet-400" },
    { label: "Total Venues", value: counts.total, color: "text-gray-900 dark:text-gray-100" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-200 bg-white p-4 dark:bg-gray-900 dark:border-gray-700"
        >
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const venues = loadVenues();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          HCI Deadline Tracker
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Track submission deadlines for top HCI conferences and journals.
          All deadlines in AoE (Anywhere on Earth) with local timezone conversion.
        </p>
      </div>

      <StatsBar venues={venues} />

      <VenueGrid venues={venues} />
    </div>
  );
}
