import { VenueData, Venue, DeadlineStatus } from "./types";

/**
 * Convert an AoE deadline string to a UTC Date.
 * AoE = UTC-12, so 23:59 AoE = next day 11:59 UTC.
 */
export function parseAoEDeadline(dateStr: string): Date {
  // If the string already has timezone info, parse directly
  if (dateStr.includes("T")) {
    // Treat as AoE (UTC-12): add 12 hours to get UTC
    const base = new Date(dateStr);
    // If no timezone offset in string, assume AoE
    if (!dateStr.includes("+") && !dateStr.includes("Z") && !dateStr.match(/-\d{2}:\d{2}$/)) {
      return new Date(base.getTime() + 12 * 60 * 60 * 1000);
    }
    return base;
  }
  // Date-only string: treat as end of day AoE
  const d = new Date(dateStr + "T23:59:00");
  return new Date(d.getTime() + 12 * 60 * 60 * 1000);
}

/**
 * Compute deadline status and days remaining.
 */
export function computeStatus(venue: VenueData): {
  status: DeadlineStatus;
  daysUntilDeadline: number | null;
  primaryDeadline: string | null;
  primaryDeadlineLabel: string;
} {
  const now = new Date();

  // Journals with no deadline are rolling
  if (venue.venue_type === "journal" && !venue.paper_deadline) {
    return {
      status: "rolling",
      daysUntilDeadline: null,
      primaryDeadline: null,
      primaryDeadlineLabel: "Rolling submissions",
    };
  }

  // If no paper deadline, status is TBD
  if (!venue.paper_deadline) {
    return {
      status: "tbd",
      daysUntilDeadline: null,
      primaryDeadline: null,
      primaryDeadlineLabel: "Deadline TBD",
    };
  }

  // Determine the primary deadline (abstract if it hasn't passed, otherwise paper)
  let primaryDeadline = venue.paper_deadline;
  let primaryDeadlineLabel = "Paper deadline";

  if (venue.abstract_deadline) {
    const abstractDate = parseAoEDeadline(venue.abstract_deadline);
    if (abstractDate > now) {
      primaryDeadline = venue.abstract_deadline;
      primaryDeadlineLabel = "Abstract deadline";
    }
  }

  const deadlineDate = parseAoEDeadline(primaryDeadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const daysUntilDeadline = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let status: DeadlineStatus;

  if (daysUntilDeadline < 0) {
    status = "passed";
  } else if (daysUntilDeadline <= 14) {
    status = "closing_soon";
  } else if (daysUntilDeadline <= 90) {
    status = "open";
  } else {
    status = "upcoming";
  }

  return {
    status,
    daysUntilDeadline,
    primaryDeadline,
    primaryDeadlineLabel,
  };
}

/**
 * Enrich raw venue data with computed fields.
 */
export function enrichVenue(raw: VenueData): Venue {
  const computed = computeStatus(raw);
  return { ...raw, ...computed };
}

/**
 * Sort venues: closing_soon first, then open, upcoming, tbd, rolling, passed last.
 * Within each group, sort by days until deadline (ascending).
 */
const STATUS_SORT_ORDER: Record<DeadlineStatus, number> = {
  closing_soon: 0,
  open: 1,
  upcoming: 2,
  tbd: 3,
  rolling: 4,
  passed: 5,
};

export function sortVenues(venues: Venue[]): Venue[] {
  return [...venues].sort((a, b) => {
    const aOrder = STATUS_SORT_ORDER[a.status];
    const bOrder = STATUS_SORT_ORDER[b.status];
    if (aOrder !== bOrder) return aOrder - bOrder;

    // Within same status, sort by days remaining
    if (a.daysUntilDeadline !== null && b.daysUntilDeadline !== null) {
      return a.daysUntilDeadline - b.daysUntilDeadline;
    }
    if (a.daysUntilDeadline !== null) return -1;
    if (b.daysUntilDeadline !== null) return 1;

    return a.abbreviation.localeCompare(b.abbreviation);
  });
}

/**
 * Format a deadline date for display.
 */
export function formatDeadlineDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format deadline with both AoE and local timezone.
 */
export function formatDeadlineWithTimezone(dateStr: string): {
  aoe: string;
  local: string;
  localTimezone: string;
} {
  const date = new Date(dateStr);

  const aoe = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Convert AoE to local: AoE is UTC-12
  const utcDate = parseAoEDeadline(dateStr);
  const local = utcDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return { aoe, local, localTimezone };
}

/**
 * Get a human-readable countdown string.
 */
export function getCountdownText(days: number | null): string {
  if (days === null) return "";
  if (days < 0) {
    const absDays = Math.abs(days);
    if (absDays === 1) return "1 day ago";
    return `${absDays} days ago`;
  }
  if (days === 0) return "Today!";
  if (days === 1) return "1 day left";
  if (days <= 7) return `${days} days left`;
  if (days <= 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} left`;
  }
  if (days <= 365) {
    const months = Math.floor(days / 30);
    const remainDays = days % 30;
    if (remainDays === 0) return `${months} month${months > 1 ? "s" : ""} left`;
    return `~${months} month${months > 1 ? "s" : ""} left`;
  }
  return `${Math.floor(days / 365)}+ years`;
}
