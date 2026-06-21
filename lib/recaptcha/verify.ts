type RecaptchaVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn(
      "[reCAPTCHA] Skipped: RECAPTCHA_SECRET_KEY not configured",
    );
    return process.env.NODE_ENV !== "production";
  }

  if (!token) {
    return false;
  }

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    },
  );

  const data = (await response.json()) as RecaptchaVerifyResponse;

  if (!data.success) {
    console.error("[reCAPTCHA verification failed]", data["error-codes"]);
  }

  return data.success;
}
