"use client";

import { useCallback, useState } from "react";
import { WillemLoader } from "@/components/willem-loader/willem-loader";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  const [isReady, setIsReady] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <>
      <WillemLoader onComplete={handleLoaderComplete} />
      <main className={isReady ? undefined : "h-dvh overflow-hidden"}>
        {children}
      </main>
    </>
  );
}
