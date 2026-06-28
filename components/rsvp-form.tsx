"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitRsvp, type RsvpFormState } from "@/app/actions/rsvp";
import {
  RecaptchaField,
  type RecaptchaHandle,
} from "@/components/recaptcha-field";
import { countryCodes, countryFlag, defaultCountryIso } from "@/lib/country-codes";

const initialState: RsvpFormState = {
  success: false,
  message: "",
};

const inputClassName =
  "w-full rounded-md border border-sage-light bg-cream px-4 py-4 font-sans text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-sage-dark focus:ring-2 focus:ring-sage/30";

const labelClassName =
  "block text-left text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark";

const selectClassName = `${inputClassName} appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%228%22%20viewBox=%220%200%2012%208%22%3E%3Cpath%20fill=%22%23748661%22%20d=%22M1%201l5%205%205-5%22/%3E%3C/svg%3E')] bg-size-[12px_8px] bg-position-[right_1rem_center] bg-no-repeat pr-10`;

type AttendingChoice = "" | "yes" | "no";

export function RsvpForm() {
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);
  const recaptchaRef = useRef<RecaptchaHandle>(null);
  const inFlightRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attending, setAttending] = useState<AttendingChoice>("");
  const [guestCount, setGuestCount] = useState("");
  const recaptchaEnabled = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
  const isBusy = pending || isSubmitting;
  const companionCount =
    attending === "yes" && guestCount ? Math.max(Number(guestCount) - 1, 0) : 0;

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
      className="flex w-full flex-col gap-6 text-left"
    >
      <fieldset className="flex flex-col gap-3">
        <legend className={labelClassName}>Katılacak mısınız?</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {[
            { value: "yes", label: "Evet" },
            { value: "no", label: "Hayır" },
          ].map(({ value, label }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center justify-center rounded-md border px-4 py-4 font-sans text-base transition-colors ${
                attending === value
                  ? "border-sage-dark bg-sage-dark text-cream"
                  : "border-sage-light bg-cream text-foreground hover:border-sage"
              }`}
            >
              <input
                type="radio"
                name="attending"
                value={value}
                checked={attending === value}
                onChange={() => setAttending(value as AttendingChoice)}
                required
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
        {state.errors?.attending && (
          <p className="text-sm text-blush">{state.errors.attending}</p>
        )}
      </fieldset>

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

      {attending === "yes" && (
        <>
          <div>
            <label htmlFor="guestCount" className={labelClassName}>
              Kaç kişi katılacak?
            </label>
            <select
              id="guestCount"
              name="guestCount"
              required
              value={guestCount}
              onChange={(event) => setGuestCount(event.target.value)}
              className={`${selectClassName} mt-2`}
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

          {companionCount > 0 && (
            <div className="flex flex-col gap-4">
              <p className={labelClassName}>
                Birlikte katılacak misafirlerin tam adları
              </p>
              {Array.from({ length: companionCount }, (_, index) => (
                <div key={index}>
                  <label htmlFor={`guestName-${index}`} className="sr-only">
                    Misafir {index + 1} Ad Soyad
                  </label>
                  <input
                    id={`guestName-${index}`}
                    name="guestNames"
                    type="text"
                    required
                    className={inputClassName}
                    placeholder={`Misafir ${index + 1} — Ad Soyad`}
                  />
                </div>
              ))}
              {state.errors?.guestNames && (
                <p className="text-sm text-blush">{state.errors.guestNames}</p>
              )}
            </div>
          )}

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

          <div>
            <label htmlFor="phoneNumber" className={labelClassName}>
              Telefon Numarası
            </label>
            <div className="mt-2 grid grid-cols-[9.5rem_1fr] gap-3">
              <div>
                <label htmlFor="phoneCountry" className="sr-only">
                  Ülke kodu
                </label>
                <select
                  id="phoneCountry"
                  name="phoneCountry"
                  required
                  defaultValue={defaultCountryIso}
                  className={selectClassName}
                >
                  {countryCodes.map(({ code, iso2, label }) => (
                    <option key={iso2} value={iso2} title={label}>
                      {countryFlag(iso2)} {code}
                    </option>
                  ))}
                </select>
                {state.errors?.phoneCountryCode && (
                  <p className="mt-2 text-sm text-blush">
                    {state.errors.phoneCountryCode}
                  </p>
                )}
              </div>
              <div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  autoComplete="tel-national"
                  inputMode="numeric"
                  className={inputClassName}
                  placeholder="5XX XXX XX XX"
                />
                {state.errors?.phoneNumber && (
                  <p className="mt-2 text-sm text-blush">{state.errors.phoneNumber}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {state.message && <p className="text-sm text-blush">{state.message}</p>}

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
        {isBusy ? "Gönderiliyor..." : "Gönder"}
      </button>

      {recaptchaEnabled && (
        <p className="text-left text-xs leading-relaxed text-foreground/50 md:text-center">
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
