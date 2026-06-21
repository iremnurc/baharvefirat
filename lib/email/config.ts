import { siteConfig } from "@/lib/site-config";

/** Resend test sender — works without a custom domain (deliveries limited to your Resend account email). */
export const RESEND_FROM_EMAIL_PLACEHOLDER = "onboarding@resend.dev";

/** Switch to this in Vercel after baharvefirat.com is verified in Resend. */
export const RESEND_FROM_EMAIL_PRODUCTION = `Bahar & ${siteConfig.couple.groom} <noreply@baharvefirat.com>`;

export function getResendFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? RESEND_FROM_EMAIL_PLACEHOLDER;
}
