import type { ComponentPropsWithoutRef } from "react";

interface TextFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  /** Field name; also used as the input id. */
  name: string;
}

/** Rounded, bordered input matching the storefront's card aesthetic. */
export function TextField({ label, name, className, ...rest }: TextFieldProps) {
  return (
    <label
      htmlFor={name}
      className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}
    >
      <span className="text-[12px] font-semibold text-ink">{label}</span>
      <input
        id={name}
        name={name}
        className="border-b border-hairline-strong bg-transparent py-2.5 text-sm text-ink transition-colors placeholder:text-ink-muted/60 focus:border-ink focus:outline-none"
        {...rest}
      />
    </label>
  );
}
