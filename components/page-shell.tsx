"use client";

import { useCallback, useState } from "react";
import { WillemLoader } from "@/components/willem-loader/willem-loader";
import { useScrollReveal } from "@/components/use-scroll-reveal";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  const [isReady, setIsReady] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setIsReady(true);
  }, []);

  useScrollReveal(isReady);

  return (
    <>
      <WillemLoader onComplete={handleLoaderComplete} />
      <main className={isReady ? undefined : "h-dvh overflow-hidden"}>
        {children}
      </main>
    </>
  );
}
