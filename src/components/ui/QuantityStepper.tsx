"use client";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
  /** Accessible label for the control group. */
  label?: string;
}

/** Minimal +/- quantity control with razor-thin borders. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = Infinity,
  className,
  label = "Quantity",
}: QuantityStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div
      role="group"
      aria-label={label}
      className={[
        "inline-flex items-center border border-hairline-strong",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center text-base text-ink transition-colors hover:bg-ink hover:text-canvas disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        &minus;
      </button>
      <span className="w-10 select-none text-center text-base font-medium tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center text-base text-ink transition-colors hover:bg-ink hover:text-canvas disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        +
      </button>
    </div>
  );
}
