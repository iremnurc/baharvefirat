"use client";

import { useActionState } from "react";
import { submitRsvp, type RsvpFormState } from "@/app/actions/rsvp";

const initialState: RsvpFormState = {
  success: false,
  message: "",
};

const inputClassName =
  "w-full rounded-md border border-sage-light bg-cream px-4 py-3 font-sans text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-sage-dark focus:ring-2 focus:ring-sage/30";

const labelClassName =
  "block text-left text-xs uppercase tracking-[0.2em] text-sage-dark";

export function RsvpForm() {
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);

  if (state.success) {
    return (
      <p className="font-sans text-lg leading-relaxed text-sage-dark">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="mx-auto max-w-md space-y-6 text-left">
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
          className={`${inputClassName} mt-2 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%228%22%20viewBox=%220%200%2012%208%22%3E%3Cpath%20fill=%22%23748661%22%20d=%22M1%201l5%205%205-5%22/%3E%3C/svg%3E')] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat pr-10`}
        >
          <option value="" disabled>
            Seçiniz
          </option>
          {[1, 2, 3, 4].map((count) => (
            <option key={count} value={count}>
              {count} kişi
            </option>
          ))}
        </select>
        {state.errors?.guestCount && (
          <p className="mt-2 text-sm text-blush">{state.errors.guestCount}</p>
        )}
      </div>

      <div>
        <label htmlFor="dietaryRestrictions" className={labelClassName}>
          Beslenme kısıtlamaları
        </label>
        <textarea
          id="dietaryRestrictions"
          name="dietaryRestrictions"
          rows={3}
          className={`${inputClassName} mt-2 resize-none`}
          placeholder="Vejetaryen, vegan, alerji vb. (opsiyonel)"
        />
      </div>

      {state.message && (
        <p className="text-sm text-blush">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-sage-dark px-6 py-3 font-sans text-sm uppercase tracking-[0.15em] text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Gönderiliyor..." : "Katılım Bildir"}
      </button>
    </form>
  );
}
