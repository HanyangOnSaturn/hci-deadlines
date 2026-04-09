import { Venue } from "./types";
import { parseAoEDeadline } from "./deadlines";

/**
 * Generate an iCal (.ics) string for a venue's deadlines.
 */
export function generateICS(venue: Venue): string {
  const events: string[] = [];

  const addEvent = (
    summary: string,
    dateStr: string,
    description: string,
    isAllDay: boolean = false
  ) => {
    const date = parseAoEDeadline(dateStr);
    const uid = `${venue.id}-${summary.toLowerCase().replace(/\s+/g, "-")}@hci-deadlines`;

    if (isAllDay) {
      const dateFormatted = formatICSDate(date);
      events.push(
        [
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTART;VALUE=DATE:${dateFormatted}`,
          `SUMMARY:${summary}`,
          `DESCRIPTION:${escapeICS(description)}`,
          venue.official_url ? `URL:${venue.official_url}` : "",
          "END:VEVENT",
        ]
          .filter(Boolean)
          .join("\r\n")
      );
    } else {
      const dtStart = formatICSDateTime(date);
      // Create 1-hour reminder event
      const endDate = new Date(date.getTime() + 60 * 60 * 1000);
      const dtEnd = formatICSDateTime(endDate);
      events.push(
        [
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTART:${dtStart}`,
          `DTEND:${dtEnd}`,
          `SUMMARY:${summary}`,
          `DESCRIPTION:${escapeICS(description)}`,
          venue.official_url ? `URL:${venue.official_url}` : "",
          "BEGIN:VALARM",
          "TRIGGER:-P1D",
          "ACTION:DISPLAY",
          `DESCRIPTION:${summary} is tomorrow!`,
          "END:VALARM",
          "BEGIN:VALARM",
          "TRIGGER:-P7D",
          "ACTION:DISPLAY",
          `DESCRIPTION:${summary} is in 1 week!`,
          "END:VALARM",
          "END:VEVENT",
        ]
          .filter(Boolean)
          .join("\r\n")
      );
    }
  };

  if (venue.abstract_deadline) {
    addEvent(
      `${venue.abbreviation} ${venue.year} — Abstract Deadline`,
      venue.abstract_deadline,
      `Abstract submission deadline for ${venue.name}.\n${venue.official_url || ""}`
    );
  }

  if (venue.paper_deadline) {
    addEvent(
      `${venue.abbreviation} ${venue.year} — Paper Deadline`,
      venue.paper_deadline,
      `Paper submission deadline for ${venue.name}.\n${venue.official_url || ""}`
    );
  }

  if (venue.notification_date) {
    addEvent(
      `${venue.abbreviation} ${venue.year} — Notification`,
      venue.notification_date,
      `Author notification for ${venue.name}.`,
      true
    );
  }

  if (venue.camera_ready_date) {
    addEvent(
      `${venue.abbreviation} ${venue.year} — Camera-Ready`,
      venue.camera_ready_date,
      `Camera-ready deadline for ${venue.name}.`
    );
  }

  if (venue.conference_start) {
    const confDesc = venue.location
      ? `${venue.name} in ${venue.location}`
      : venue.name;
    addEvent(
      `${venue.abbreviation} ${venue.year} — Conference`,
      venue.conference_start,
      confDesc,
      true
    );
  }

  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HCI Deadline Tracker//EN",
    `X-WR-CALNAME:${venue.abbreviation} ${venue.year} Deadlines`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");

  return calendar;
}

function formatICSDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function formatICSDateTime(date: Date): string {
  const y = date.getUTCFullYear();
  const mo = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const h = String(date.getUTCHours()).padStart(2, "0");
  const mi = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  return `${y}${mo}${d}T${h}${mi}${s}Z`;
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}
