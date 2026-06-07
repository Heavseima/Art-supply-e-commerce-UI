import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** Small uppercase kicker above the title. */
  eyebrow?: string;
  title: ReactNode;
  /** Optional supporting editorial line. */
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Editorial section header: kicker + serif display title + lede. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start";
  return (
    <div
      className={["flex flex-col gap-4", alignment, className]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? (
        <span className="text-[11px] uppercase tracking-[0.32em] text-ink-muted">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl font-medium leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-xl text-base leading-relaxed text-ink-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
