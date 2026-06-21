import { Resend } from "resend";
import { getResendFromEmail } from "@/lib/email/config";
import { siteConfig } from "@/lib/site-config";

type RsvpNotification = {
  name: string;
  guestCount: number;
  dietaryRestrictions: string | null;
};

export async function sendRsvpNotification(
  rsvp: RsvpNotification,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmails = process.env.RSVP_NOTIFY_EMAILS;

  if (!apiKey || !notifyEmails) {
    console.warn(
      "[RSVP email] Skipped: RESEND_API_KEY or RSVP_NOTIFY_EMAILS not configured",
    );
    return;
  }

  const resend = new Resend(apiKey);
  const recipients = notifyEmails
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  const from = getResendFromEmail();

  const dietary = rsvp.dietaryRestrictions || "Belirtilmedi";

  const { data, error } = await resend.emails.send({
    from,
    to: recipients,
    subject: `Yeni katılım bildirimi — ${rsvp.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #373737;">
        <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: normal; color: #748661;">
          Yeni Katılım Bildirimi
        </h1>
        <p style="color: #666; margin-bottom: 24px;">
          ${siteConfig.couple.bride} & ${siteConfig.couple.groom} düğün davetiyesi
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #c3cab8; color: #748661; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Ad Soyad</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #c3cab8; text-align: right;">${escapeHtml(rsvp.name)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #c3cab8; color: #748661; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Kişi Sayısı</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #c3cab8; text-align: right;">${rsvp.guestCount} kişi</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #748661; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Beslenme</td>
            <td style="padding: 12px 0; text-align: right;">${escapeHtml(dietary)}</td>
          </tr>
        </table>
      </div>
    `,
  });

  if (error) {
    console.error("[RSVP email] Resend error:", {
      message: error.message,
      name: error.name,
      from,
      to: recipients,
    });
    throw new Error(error.message);
  }

  console.info("[RSVP email] Sent:", data?.id);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
