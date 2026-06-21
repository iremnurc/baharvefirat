"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export type RecaptchaHandle = {
  executeAsync: () => Promise<string | null>;
  reset: () => void;
};

type RecaptchaFieldProps = {
  error?: string;
};

export const RecaptchaField = forwardRef<RecaptchaHandle, RecaptchaFieldProps>(
  function RecaptchaField({ error }, ref) {
    const widgetRef = useRef<ReCAPTCHA>(null);
    const [mounted, setMounted] = useState(false);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    useEffect(() => {
      setMounted(true);
    }, []);

    useImperativeHandle(ref, () => ({
      executeAsync: async () =>
        (await widgetRef.current?.executeAsync()) ?? null,
      reset: () => widgetRef.current?.reset(),
    }));

    if (!siteKey || !mounted) {
      return error ? <p className="text-sm text-blush">{error}</p> : null;
    }

    return (
      <div>
        <ReCAPTCHA
          ref={widgetRef}
          sitekey={siteKey}
          size="invisible"
          badge="bottomright"
        />
        {error && <p className="mt-2 text-sm text-blush">{error}</p>}
      </div>
    );
  },
);
