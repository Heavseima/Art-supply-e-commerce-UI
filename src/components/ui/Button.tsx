import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.18em] " +
  "transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 " +
  "focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas " +
  "disabled:cursor-not-allowed disabled:opacity-40";

const VARIANTS: Record<Variant, string> = {
  solid: "bg-ink text-canvas hover:bg-accent",
  outline: "border border-ink text-ink hover:bg-ink hover:text-canvas",
  ghost: "text-ink underline-offset-4 hover:text-accent hover:underline",
  // For dark/charcoal backgrounds — light outline that inverts on hover.
  inverse: "border border-canvas text-canvas hover:bg-canvas hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "text-[11px] px-5 py-2.5",
  md: "text-[12px] px-7 py-3.5",
  lg: "text-[13px] px-9 py-4",
};

function classes(variant: Variant, size: Size, className?: string): string {
  return [BASE, VARIANTS[variant], SIZES[size], className]
    .filter(Boolean)
    .join(" ");
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | keyof CommonProps>;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Editorial action primitive. Renders a real `<button>` or a Next `<Link>`
 * depending on whether `href` is provided — same styling either way.
 */
export function Button(props: ButtonProps) {
  const { variant = "solid", size = "md", className, children } = props;
  const styled = classes(variant, size, className);

  if (props.href !== undefined) {
    const { href, ...rest } = stripStyleProps(props);
    return (
      <Link href={href} className={styled} {...rest}>
        {children}
      </Link>
    );
  }

  const rest = stripStyleProps(props);
  return (
    <button className={styled} {...rest}>
      {children}
    </button>
  );
}

/** Drop the styling/content props so only valid DOM/Link props are spread. */
function stripStyleProps<T extends ButtonProps>(props: T) {
  const { variant, size, className, children, ...rest } = props;
  void variant;
  void size;
  void className;
  void children;
  return rest;
}
