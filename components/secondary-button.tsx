type SecondaryButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

const secondaryButtonClassName =
  "group inline-flex cursor-pointer items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.15em] text-sage-dark transition-opacity hover:opacity-70";

export function SecondaryButton({
  href,
  children,
  className = "",
  external = false,
}: SecondaryButtonProps) {
  return (
    <a
      href={href}
      className={`${secondaryButtonClassName} ${className}`}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <span className="underline underline-offset-4">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 transition-transform group-hover:translate-x-1"
      >
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}
