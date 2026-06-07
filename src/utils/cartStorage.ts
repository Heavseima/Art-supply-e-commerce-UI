import type { CartLine } from "@/types/api";

/**
 * LocalStorage persistence layer for the cart, isolated from React.
 *
 * Keeps all serialization / parsing / SSR-guarding in one place so the
 * `useCart` hook only deals with state, and so a future swap to a different
 * store (cookies, IndexedDB, server cart) touches only this file.
 */

export const CART_STORAGE_KEY = "art-supplies:cart";

/** Custom event used to broadcast cart changes within the same tab. */
export const CART_EVENT = "art-supplies:cart-change";

/** Narrow an unknown parsed value into a valid array of cart lines. */
function isCartLineArray(value: unknown): value is CartLine[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item): item is CartLine =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).productId === "string" &&
        typeof (item as Record<string, unknown>).quantity === "number",
    )
  );
}

/** Read and validate the persisted cart. Returns `[]` on the server or on error. */
export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return isCartLineArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Persist the cart and broadcast the change to listeners in this tab. */
export function writeCart(lines: CartLine[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    window.dispatchEvent(new Event(CART_EVENT));
  } catch {
    // Storage may be unavailable (private mode / quota) — fail silently.
  }
}
