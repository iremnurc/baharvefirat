import { siteConfig } from "./site-config";

function toGoogleDate(date: Date): string {
  // 2026-09-19T13:00:00.000Z -> 20260919T130000Z
  return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
}

// RFC 5545 text escaping for SUMMARY/LOCATION/DESCRIPTION values.
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

const EVENT_TITLE = `${siteConfig.couple.bride} & ${siteConfig.couple.groom} Düğünü`;
const EVENT_DETAILS =
  "Düğünümüzde sizleri aramızda görmekten mutluluk duyarız.";

/**
 * Builds an "Add to Google Calendar" URL for the wedding using the values in
 * site-config (start time + duration).
 */
export function getGoogleCalendarUrl(): string {
  const { targetDateTime, durationHours, venue, city } = siteConfig.wedding;
  const { bride, groom } = siteConfig.couple;

  const start = new Date(targetDateTime);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_TITLE,
    dates: `${toGoogleDate(start)}/${toGoogleDate(end)}`,
    location: `${venue}, ${city}`,
    details: EVENT_DETAILS,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Builds an RFC 5545 .ics payload for the wedding event. Used for Apple
 * Calendar (and any client that prefers a downloadable invite).
 */
export function getIcsContent(): string {
  const { targetDateTime, durationHours, venue, city } = siteConfig.wedding;

  const start = new Date(targetDateTime);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//baharvefirat//wedding//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@baharvefirat`,
    `DTSTAMP:${toGoogleDate(new Date())}`,
    `DTSTART:${toGoogleDate(start)}`,
    `DTEND:${toGoogleDate(end)}`,
    `SUMMARY:${escapeIcsText(EVENT_TITLE)}`,
    `LOCATION:${escapeIcsText(`${venue}, ${city}`)}`,
    `DESCRIPTION:${escapeIcsText(EVENT_DETAILS)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
