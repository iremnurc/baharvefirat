type RsvpSheetRow = {
  attending: boolean;
  name: string;
  guestCount: number | null;
  guestNames: string[];
  phoneCountryCode: string | null;
  phoneNumber: string | null;
};

const REQUEST_TIMEOUT_MS = 5000;

/**
 * Appends an RSVP as a row in the couple's Google Sheet via a Google Apps
 * Script Web App. Supabase stays the source of truth, so this is best-effort —
 * the caller swallows errors and never blocks a submission on it.
 */
export async function appendRsvpToSheet(rsvp: RsvpSheetRow): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!url) {
    console.warn(
      "[RSVP sheet] Skipped: GOOGLE_SHEETS_WEBHOOK_URL not configured",
    );
    return;
  }

  const phone =
    rsvp.phoneCountryCode && rsvp.phoneNumber
      ? `${rsvp.phoneCountryCode} ${rsvp.phoneNumber}`
      : "";

  const payload = {
    token: process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN ?? "",
    attending: rsvp.attending ? "Evet" : "Hayır",
    name: rsvp.name,
    guestCount: rsvp.attending ? rsvp.guestCount ?? "" : "",
    guestNames: rsvp.guestNames.join(", "),
    phone,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Google Sheets webhook responded ${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}
