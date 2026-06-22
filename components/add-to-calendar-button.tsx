"use client";

import { useEffect, useState } from "react";
import { SecondaryButton } from "@/components/secondary-button";

type AddToCalendarButtonProps = {
  googleUrl: string;
  icsUrl: string;
  children: React.ReactNode;
  className?: string;
};

function isAppleDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // iPhone/iPod, plus iPad/Mac (iPadOS 13+ reports as "Macintosh" but exposes
  // touch points).
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    /Macintosh/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function AddToCalendarButton({
  googleUrl,
  icsUrl,
  children,
  className = "",
}: AddToCalendarButtonProps) {
  // Default to Google Calendar so SSR/non-JS still works everywhere; swap to
  // the .ics download on Apple devices after hydration.
  const [useIcs, setUseIcs] = useState(false);

  useEffect(() => {
    setUseIcs(isAppleDevice());
  }, []);

  return (
    <SecondaryButton
      href={useIcs ? icsUrl : googleUrl}
      external={!useIcs}
      className={className}
    >
      {children}
    </SecondaryButton>
  );
}
