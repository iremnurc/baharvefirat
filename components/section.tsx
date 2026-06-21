type SectionProps = {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  revealGroup?: boolean;
};

export function Section({
  id,
  title,
  children,
  className = "",
  revealGroup = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-3xl px-6 py-32 ${className}`}
      {...(revealGroup ? { "data-reveal-group": "" } : {})}
    >
      {title && (
        <h2 className="font-serif text-2xl tracking-wide text-foreground/80 md:text-3xl">
          {title}
        </h2>
      )}
      <div className={title ? "mt-8" : ""}>{children}</div>
    </section>
  );
}
