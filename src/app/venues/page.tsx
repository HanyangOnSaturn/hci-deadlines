import { loadVenues } from "@/lib/venues";
import VenueGrid from "@/components/VenueGrid";

export const metadata = {
  title: "All Venues — HCI Deadline Tracker",
  description: "Browse all tracked HCI conferences and journals with submission deadlines.",
};

export default function VenuesPage() {
  const venues = loadVenues();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          All Venues
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {venues.length} HCI conferences and journals tracked.
        </p>
      </div>

      <VenueGrid venues={venues} />
    </div>
  );
}
