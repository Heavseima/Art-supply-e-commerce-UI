import { formatPrice } from "@/utils/format";

interface PriceProps {
  value: number;
  className?: string;
}

/** Renders a formatted USD price. Pure, reusable, server-renderable. */
export function Price({ value, className }: PriceProps) {
  return (
    <span className={["tabular-nums", className].filter(Boolean).join(" ")}>
      {formatPrice(value)}
    </span>
  );
}
