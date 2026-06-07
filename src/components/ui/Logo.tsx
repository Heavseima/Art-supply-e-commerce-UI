import Link from "next/link";

interface LogoProps {
  className?: string;
}

/** Wordmark for the boutique, links home. Editorial serif lockup. */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Atelier — home"
      className={["group inline-flex flex-col leading-none", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="font-display text-2xl font-medium tracking-tight text-ink transition-colors group-hover:text-accent">
        Atelier
      </span>
      <span className="mt-0.5 text-[9px] uppercase tracking-[0.42em] text-ink-muted">
        Fine Art Supply
      </span>
    </Link>
  );
}
