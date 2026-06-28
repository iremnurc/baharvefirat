"use server";

import { getCountryByIso } from "@/lib/country-codes";
import { appendRsvpToSheet } from "@/lib/sheets/append-rsvp";
import { verifyRecaptcha } from "@/lib/recaptcha/verify";
import { createAdminClient } from "@/lib/supabase/admin";

export type RsvpFormState = {
  success: boolean;
  message: string;
  captchaResetKey?: number;
  errors?: {
    attending?: string;
    name?: string;
    guestCount?: string;
    guestNames?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
    captcha?: string;
  };
};

const guestCountOptions = ["1", "2", "3", "4"] as const;

export async function submitRsvp(
  _prevState: RsvpFormState,
  formData: FormData,
): Promise<RsvpFormState> {
  const attending = formData.get("attending")?.toString() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const guestCount = formData.get("guestCount")?.toString() ?? "";
  const guestNames = formData
    .getAll("guestNames")
    .map((value) => value.toString().trim())
    .filter(Boolean);
  const phoneCountryIso = formData.get("phoneCountry")?.toString().trim() ?? "";
  const phoneNumber = formData.get("phoneNumber")?.toString().trim() ?? "";
  const captchaToken =
    formData.get("g-recaptcha-response")?.toString().trim() ?? "";

  const errors: RsvpFormState["errors"] = {};
  const isAttending = attending === "yes";

  if (process.env.RECAPTCHA_SECRET_KEY) {
    const captchaValid = await verifyRecaptcha(captchaToken);

    if (!captchaValid) {
      errors.captcha = "Lütfen robot olmadığınızı doğrulayın.";
    }
  }

  if (attending !== "yes" && attending !== "no") {
    errors.attending = "Lütfen katılım durumunuzu seçin.";
  }

  if (!name) {
    errors.name = "Ad soyad gereklidir.";
  }

  let guestCountNumber: number | null = null;
  const phoneCountry = getCountryByIso(phoneCountryIso);

  if (isAttending) {
    if (!phoneCountry) {
      errors.phoneCountryCode = "Lütfen geçerli bir ülke kodu seçin.";
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Telefon numarası gereklidir.";
    } else if (!/^\d{6,15}$/.test(phoneNumber.replace(/\s/g, ""))) {
      errors.phoneNumber = "Lütfen geçerli bir telefon numarası girin.";
    }

    if (!guestCountOptions.includes(guestCount as (typeof guestCountOptions)[number])) {
      errors.guestCount = "Lütfen kişi sayısını seçin.";
    } else {
      guestCountNumber = Number(guestCount);
      const expectedCompanionCount = guestCountNumber - 1;

      if (expectedCompanionCount > 0) {
        if (guestNames.length !== expectedCompanionCount) {
          errors.guestNames = "Lütfen birlikte katılacak misafirlerin tam adlarını girin.";
        } else if (guestNames.some((guestName) => !guestName)) {
          errors.guestNames = "Misafir adları boş bırakılamaz.";
        }
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "",
      errors,
      captchaResetKey: Date.now(),
    };
  }

  const normalizedPhoneNumber = isAttending
    ? phoneNumber.replace(/\s/g, "")
    : null;

  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from("rsvps").insert({
      attending: isAttending,
      name,
      guest_count: isAttending ? guestCountNumber : null,
      guest_names: isAttending && guestNames.length > 0 ? guestNames : null,
      phone_country_code: isAttending && phoneCountry ? phoneCountry.code : null,
      phone_number: normalizedPhoneNumber,
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
    await appendRsvpToSheet({
      attending: isAttending,
      name,
      guestCount: guestCountNumber,
      guestNames: isAttending ? guestNames : [],
      phoneCountryCode: isAttending && phoneCountry ? phoneCountry.code : null,
      phoneNumber: normalizedPhoneNumber,
    });
  } catch (error) {
    console.error("[RSVP sheet append failed]", error);
  }

  return {
    success: true,
    message: isAttending
      ? "Katılım bildiriminiz alındı. Teşekkür ederiz!"
      : "Yanıtınız alındı. Sizi aramızda göremeyeceğimiz için üzgünüz.",
  };
}
