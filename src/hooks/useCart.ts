"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { CartLine, Product, ResolvedCartLine } from "@/types/api";
import {
  CART_EVENT,
  CART_STORAGE_KEY,
  readCart,
  writeCart,
} from "@/utils/cartStorage";

/** Public surface of the cart engine. */
export interface UseCartResult {
  /** Raw persisted lines (productId + quantity). */
  readonly lines: readonly CartLine[];
  /** Total number of units across all lines. */
  readonly count: number;
  /** `true` until the client has hydrated from LocalStorage (SSR-safe). */
  readonly isReady: boolean;
  /** Add `quantity` of a product, clamped to its available stock. */
  add: (product: Product, quantity?: number) => void;
  /** Set an exact quantity for a product; `0` removes the line. */
  setQuantity: (productId: string, quantity: number) => void;
  /** Remove a product entirely. */
  remove: (productId: string) => void;
  /** Empty the cart. */
  clear: () => void;
  /** Quantity currently in the cart for a given product id. */
  quantityOf: (productId: string) => number;
  /** Resolve lines against a catalog into display rows + line subtotals. */
  resolve: (catalog: readonly Product[]) => {
    readonly items: readonly ResolvedCartLine[];
    readonly total: number;
  };
}

/**
 * Stateless cart engine backed by LocalStorage.
 *
 * "Stateless" in the sense that the source of truth lives in storage, not in
 * any provider: every consumer reads the same persisted cart and stays in sync
 * via the {@link CART_EVENT} broadcast (same tab) and the native `storage`
 * event (across tabs). Safe to call from any client component.
 */
export function useCart(): UseCartResult {
  // `null` until the client hydrates from storage. Tracking readiness in a
  // single state value (rather than a separate boolean) lets us hydrate with
  // one setState inside the effect, avoiding cascading renders.
  const [hydrated, setHydrated] = useState<CartLine[] | null>(null);
  // Stable identity so derived callbacks/memos only change when data changes.
  const lines = useMemo<CartLine[]>(() => hydrated ?? [], [hydrated]);
  const isReady = hydrated !== null;

  // Hydrate from storage after mount and subscribe to changes.
  useEffect(() => {
    const sync = () => setHydrated(readCart());
    sync();

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === CART_STORAGE_KEY) sync();
    };

    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  /** Mutate the cart through the storage layer; state updates via the broadcast. */
  const commit = useCallback((next: CartLine[]) => {
    writeCart(next);
    setHydrated(next);
  }, []);

  const add = useCallback(
    (product: Product, quantity = 1) => {
      if (quantity <= 0 || product.stock <= 0) return;
      const current = readCart();
      const existing = current.find((line) => line.productId === product.id);
      const nextQty = Math.min(
        (existing?.quantity ?? 0) + quantity,
        product.stock,
      );
      const next = existing
        ? current.map((line) =>
            line.productId === product.id
              ? { ...line, quantity: nextQty }
              : line,
          )
        : [...current, { productId: product.id, quantity: nextQty }];
      commit(next);
    },
    [commit],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const current = readCart();
      const next =
        quantity <= 0
          ? current.filter((line) => line.productId !== productId)
          : current.map((line) =>
              line.productId === productId ? { ...line, quantity } : line,
            );
      commit(next);
    },
    [commit],
  );

  const remove = useCallback(
    (productId: string) => {
      commit(readCart().filter((line) => line.productId !== productId));
    },
    [commit],
  );

  const clear = useCallback(() => commit([]), [commit]);

  const quantityOf = useCallback(
    (productId: string) =>
      lines.find((line) => line.productId === productId)?.quantity ?? 0,
    [lines],
  );

  const count = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const resolve = useCallback(
    (catalog: readonly Product[]) => {
      const items: ResolvedCartLine[] = [];
      for (const line of lines) {
        const product = catalog.find((p) => p.id === line.productId);
        if (!product) continue;
        items.push({
          product,
          quantity: line.quantity,
          subtotal: product.price * line.quantity,
        });
      }
      const total = items.reduce((sum, item) => sum + item.subtotal, 0);
      return { items, total };
    },
    [lines],
  );

  return {
    lines,
    count,
    isReady,
    add,
    setQuantity,
    remove,
    clear,
    quantityOf,
    resolve,
  };
}
