"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { Section } from "@/components/section";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getRemainingParts(targetIso: string): CountdownParts {
  const targetMs = new Date(targetIso).getTime();
  const nowMs = Date.now();
  const diffMs = Math.max(0, targetMs - nowMs);

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function CountdownItem({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-sage-dark/30 bg-cream/70 px-4 py-4 text-center">
      <p className="font-serif text-3xl leading-none text-foreground md:text-4xl">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-2 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-sage-dark">
        {label}
      </p>
    </div>
  );
}

export function CountdownSection() {
  const targetIso = siteConfig.wedding.targetDateTime;
  const [parts, setParts] = useState<CountdownParts>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setParts(getRemainingParts(targetIso));

    const timer = window.setInterval(() => {
      setParts(getRemainingParts(targetIso));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [targetIso]);

  return (
    <Section id="countdown" className="pt-20">
      <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-sage-dark">
        Geri Sayım
      </p>
      <h2 className="mt-4 font-serif text-3xl tracking-wide text-foreground/85 md:text-4xl">
        Büyük Güne Kalan Süre
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-4">
        <CountdownItem value={isMounted ? parts.days : 0} label="Gün" />
        <CountdownItem value={isMounted ? parts.hours : 0} label="Saat" />
        <CountdownItem value={isMounted ? parts.minutes : 0} label="Dakika" />
        <CountdownItem value={isMounted ? parts.seconds : 0} label="Saniye" />
      </div>
      <p className="mt-6 font-sans text-sm leading-relaxed text-foreground/70">
        Bu özel günü sizlerle paylaşacağımız anı sabırsızlıkla bekliyoruz.
      </p>
    </Section>
  );
}
