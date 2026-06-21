import { siteConfig } from "@/lib/site-config";

export function Hero() {
  const { bride, groom } = siteConfig.couple;
  const { date } = siteConfig.wedding;

  return (
    <header className="flex min-h-[85vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-sans text-sm uppercase tracking-[0.35em] text-accent">
        Wedding Invitation
      </p>
      <h1 className="mt-6 font-serif text-5xl leading-tight text-foreground md:text-7xl">
        {bride}
        <span className="mx-4 font-light text-accent">&</span>
        {groom}
      </h1>
      <p className="mt-8 font-sans text-lg tracking-wide text-foreground/70 md:text-xl">
        {date}
      </p>
      <div className="mt-12 h-px w-24 bg-accent/40" aria-hidden="true" />
    </header>
  );
}
