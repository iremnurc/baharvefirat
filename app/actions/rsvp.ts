"use server";

import { sendRsvpNotification } from "@/lib/email/send-rsvp-notification";
import { verifyRecaptcha } from "@/lib/recaptcha/verify";
import { createAdminClient } from "@/lib/supabase/admin";

export type RsvpFormState = {
  success: boolean;
  message: string;
  captchaResetKey?: number;
  errors?: {
    name?: string;
    guestCount?: string;
    captcha?: string;
  };
};

const guestCountOptions = ["1", "2", "3", "4"] as const;

export async function submitRsvp(
  _prevState: RsvpFormState,
  formData: FormData,
): Promise<RsvpFormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const guestCount = formData.get("guestCount")?.toString() ?? "";
  const dietaryRestrictions =
    formData.get("dietaryRestrictions")?.toString().trim() ?? "";
  const captchaToken =
    formData.get("g-recaptcha-response")?.toString().trim() ?? "";

  const errors: RsvpFormState["errors"] = {};

  if (process.env.RECAPTCHA_SECRET_KEY) {
    const captchaValid = await verifyRecaptcha(captchaToken);

    if (!captchaValid) {
      errors.captcha = "Lütfen robot olmadığınızı doğrulayın.";
    }
  }

  if (!name) {
    errors.name = "Ad soyad gereklidir.";
  }

  if (!guestCountOptions.includes(guestCount as (typeof guestCountOptions)[number])) {
    errors.guestCount = "Lütfen kişi sayısını seçin.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "",
      errors,
      captchaResetKey: Date.now(),
    };
  }

  const guestCountNumber = Number(guestCount);

  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from("rsvps").insert({
      name,
      guest_count: guestCountNumber,
      dietary_restrictions: dietaryRestrictions || null,
    });

    if (error) {
      console.error("[RSVP submission failed]", error);
      return {
        success: false,
        message: "Gönderim başarısız oldu. Lütfen tekrar deneyin.",
        captchaResetKey: Date.now(),
      };
    }
  } catch (error) {
    console.error("[RSVP submission failed]", error);
    return {
      success: false,
      message: "Gönderim başarısız oldu. Lütfen tekrar deneyin.",
      captchaResetKey: Date.now(),
    };
  }

  try {
    await sendRsvpNotification({
      name,
      guestCount: guestCountNumber,
      dietaryRestrictions: dietaryRestrictions || null,
    });
  } catch (error) {
    console.error("[RSVP email failed]", error);
  }

  return {
    success: true,
    message: "Katılım bildiriminiz alındı. Teşekkür ederiz!",
  };
}
