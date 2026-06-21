"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitRsvp, type RsvpFormState } from "@/app/actions/rsvp";
import {
  RecaptchaField,
  type RecaptchaHandle,
} from "@/components/recaptcha-field";

const initialState: RsvpFormState = {
  success: false,
  message: "",
};

const inputClassName =
  "w-full rounded-md border border-sage-light bg-cream px-4 py-4 font-sans text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-sage-dark focus:ring-2 focus:ring-sage/30";

const labelClassName =
  "block text-left text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark";

export function RsvpForm() {
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);
  const recaptchaRef = useRef<RecaptchaHandle>(null);
  const inFlightRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaEnabled = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
  const isBusy = pending || isSubmitting;

  useEffect(() => {
    inFlightRef.current = false;
    // Reset submit lock after the server returns an error response.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with server action failure
    setIsSubmitting(false);
  }, [state.captchaResetKey]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (inFlightRef.current || pending) {
      return;
    }

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    inFlightRef.current = true;
    setIsSubmitting(true);
    const formData = new FormData(form);

    if (recaptchaEnabled) {
      try {
        const token = await recaptchaRef.current?.executeAsync();

        if (!token) {
          inFlightRef.current = false;
          setIsSubmitting(false);
          return;
        }

        formData.set("g-recaptcha-response", token);
        recaptchaRef.current?.reset();
      } catch {
        inFlightRef.current = false;
        setIsSubmitting(false);
        return;
      }
    }

    formAction(formData);
  }

  if (state.success) {
    return (
      <p className="font-sans text-lg leading-relaxed text-sage-dark">
        {state.message}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full w-full flex-col gap-6 text-left"
    >
      <div>
        <label htmlFor="name" className={labelClassName}>
          Ad Soyad
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={`${inputClassName} mt-2`}
          placeholder="Adınız ve soyadınız"
        />
        {state.errors?.name && (
          <p className="mt-2 text-sm text-blush">{state.errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="guestCount" className={labelClassName}>
          Kaç kişi katılacak?
        </label>
        <select
          id="guestCount"
          name="guestCount"
          required
          defaultValue=""
          className={`${inputClassName} mt-2 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%228%22%20viewBox=%220%200%2012%208%22%3E%3Cpath%20fill=%22%23748661%22%20d=%22M1%201l5%205%205-5%22/%3E%3C/svg%3E')] bg-size-[12px_8px] bg-position-[right_1rem_center] bg-no-repeat pr-10`}
        >
          <option value="" disabled>
            Seçiniz
          </option>
          {[1, 2, 3, 4].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
        {state.errors?.guestCount && (
          <p className="mt-2 text-sm text-blush">{state.errors.guestCount}</p>
        )}
      </div>

      <div>
        <label htmlFor="dietaryRestrictions" className={labelClassName}>
          Özel Diyet / Alerji Bilgisi
        </label>
        <textarea
          id="dietaryRestrictions"
          name="dietaryRestrictions"
          rows={3}
          className={`${inputClassName} mt-2 resize-none`}
          placeholder="Vejetaryen, vegan, gluten hassasiyeti, kuruyemiş alerjisi vb. bilgileri paylaşabilirsiniz."
        />
      </div>

      {state.message && (
        <p className="text-sm text-blush">{state.message}</p>
      )}

      {recaptchaEnabled && (
        <RecaptchaField
          key={state.captchaResetKey ?? "initial"}
          ref={recaptchaRef}
          error={state.errors?.captcha}
        />
      )}

      <button
        type="submit"
        disabled={isBusy}
        className="w-full cursor-pointer rounded-full bg-sage-dark px-6 py-4 font-sans text-base font-bold uppercase tracking-[0.15em] text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isBusy ? "Gönderiliyor..." : "Katılım Bildir"}
      </button>

      {recaptchaEnabled && (
        <p className="text-center text-xs leading-relaxed text-foreground/50">
          Bu site reCAPTCHA ile korunmaktadır.{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Gizlilik Politikası
          </a>{" "}
          ve{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Hizmet Şartları
          </a>{" "}
          geçerlidir.
        </p>
      )}
    </form>
  );
}
