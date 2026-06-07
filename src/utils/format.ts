/**
 * Pure, framework-free formatting helpers. Isolated so any component —
 * server or client — can reuse them without dragging in data-fetch deps.
 */

const PRICE_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Format a numeric price as a localized USD currency string. */
export function formatPrice(value: number): string {
  return PRICE_FORMATTER.format(value);
}

/** Human-readable stock status label for a given unit count. */
export function stockLabel(stock: number): string {
  if (stock <= 0) return "Sold out";
  if (stock <= 5) return `Only ${stock} left`;
  return "In stock";
}
