export type VenueType = "conference" | "journal";

export type VenueCategory =
  | "flagship"
  | "design"
  | "intelligent"
  | "accessibility"
  | "mobile"
  | "visualization"
  | "journal";

export type DeadlineStatus =
  | "open"
  | "closing_soon"
  | "upcoming"
  | "passed"
  | "tbd"
  | "rolling";

export type ConferenceFormat = "in-person" | "hybrid" | "virtual" | "TBD";

export interface VenueData {
  id: string;
  name: string;
  abbreviation: string;
  year: number;
  venue_type: VenueType;
  publisher: string;
  category: VenueCategory;
  topic_areas: string[];
  official_url: string;
  submission_url: string | null;
  cfp_url: string | null;
  abstract_deadline: string | null;
  paper_deadline: string | null;
  notification_date: string | null;
  camera_ready_date: string | null;
  conference_start: string | null;
  conference_end: string | null;
  deadline_timezone: string;
  location: string | null;
  format: string | null;
  acceptance_rate: string | null;
  notes: string | null;
  source_url: string;
  last_verified: string;
}

export interface Venue extends VenueData {
  status: DeadlineStatus;
  daysUntilDeadline: number | null;
  primaryDeadline: string | null; // ISO string of the most relevant deadline
  primaryDeadlineLabel: string;
}

export const CATEGORY_LABELS: Record<VenueCategory, string> = {
  flagship: "Flagship",
  design: "Design & Creativity",
  intelligent: "Intelligent Interfaces",
  accessibility: "Accessibility & Children",
  mobile: "Mobile, Surfaces & Regional",
  visualization: "Visualization",
  journal: "Journals",
};

export const CATEGORY_COLORS: Record<VenueCategory, string> = {
  flagship: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  design: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  intelligent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  accessibility: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  mobile: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  visualization: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  journal: "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300",
};

export const STATUS_CONFIG: Record<
  DeadlineStatus,
  { label: string; color: string; dotColor: string }
> = {
  open: {
    label: "Open",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    dotColor: "bg-green-500",
  },
  closing_soon: {
    label: "Closing Soon",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    dotColor: "bg-orange-500",
  },
  upcoming: {
    label: "Upcoming",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    dotColor: "bg-blue-500",
  },
  passed: {
    label: "Passed",
    color: "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400",
    dotColor: "bg-gray-400",
  },
  tbd: {
    label: "TBD",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    dotColor: "bg-yellow-500",
  },
  rolling: {
    label: "Rolling",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    dotColor: "bg-violet-500",
  },
};
