import { stockLabel } from "@/utils/format";

interface StockBadgeProps {
  stock: number;
  className?: string;
}

/** Minimal uppercase availability indicator. Ink by default; sienna when low. */
export function StockBadge({ stock, className }: StockBadgeProps) {
  const soldOut = stock <= 0;
  const low = stock > 0 && stock <= 5;
  const tone = low ? "text-accent" : "text-ink-muted";
  const dot = soldOut ? "bg-ink-muted" : low ? "bg-accent" : "bg-ink";

  return (
    <span
      className={[
        "inline-flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.24em]",
        tone,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden className={["h-1 w-1 rounded-full", dot].join(" ")} />
      {stockLabel(stock)}
    </span>
  );
}
