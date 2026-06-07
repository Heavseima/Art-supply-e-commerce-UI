"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import type { Product } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/format";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Catalog passed from the server so lines can be resolved to products. */
  catalog: readonly Product[];
}

const FREE_SHIPPING_THRESHOLD = 75;

/**
 * Slide-over cart overview. Reads the shared LocalStorage cart via `useCart`,
 * resolves lines against the catalog, supports quantity edits + removal, and
 * shows progress toward complimentary shipping. Traps focus while open.
 */
export function CartDrawer({ open, onClose, catalog }: CartDrawerProps) {
  const { resolve, setQuantity, remove, count } = useCart();
  const { items, total } = useMemo(() => resolve(catalog), [resolve, catalog]);
  const panelRef = useRef<HTMLElement>(null);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  // Lock scroll, Escape-to-close, and trap focus within the panel while open.
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusable()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const list = focusable();
      if (list.length === 0) {
        event.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={[
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-ink/40 transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={[
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-canvas shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <header className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <div className="flex items-baseline gap-2.5">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Your Bag
            </h2>
            {count > 0 ? (
              <span className="font-display text-2xl font-medium text-ink-muted">
                ({count})
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer text-3xl leading-none text-ink transition-colors hover:text-accent"
          >
            &times;
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-hairline">
              <ShoppingBag
                className="h-6 w-6 text-ink-muted"
                strokeWidth={1.25}
                aria-hidden={true}
              />
            </span>
            <div className="flex flex-col gap-1">
              <p className="font-display text-xl text-ink">Your bag is empty</p>
              <p className="text-sm text-ink-muted">
                The catalogue is waiting for you.
              </p>
            </div>
            <Button href="/products" variant="solid" size="md" onClick={onClose}>
              Browse the catalogue
            </Button>
          </div>
        ) : (
          <>
            {/* Free-shipping progress */}
            <div className="border-b border-hairline px-6 py-4">
              <p className="text-[12px] text-ink-muted">
                {remaining > 0 ? (
                  <>
                    You&rsquo;re{" "}
                    <span className="font-medium text-ink">
                      {formatPrice(remaining)}
                    </span>{" "}
                    from complimentary shipping.
                  </>
                ) : (
                  <span className="font-medium text-ink">
                    Complimentary shipping unlocked.
                  </span>
                )}
              </p>
              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-canvas-deep">
                <div
                  className="h-full rounded-full bg-ink transition-[width] duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-hairline overflow-y-auto px-6">
              {items.map(({ product, quantity, subtotal }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="relative h-28 w-24 shrink-0 overflow-hidden border border-hairline bg-canvas-deep"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="font-display text-base leading-snug transition-colors hover:text-accent"
                      >
                        {product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="cursor-pointer text-[11px] uppercase tracking-[0.16em] text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <QuantityStepper
                        value={quantity}
                        min={1}
                        max={product.stock}
                        onChange={(next) => setQuantity(product.id, next)}
                      />
                      <Price value={subtotal} className="text-sm text-ink" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-hairline px-6 py-6">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">
                  Subtotal
                </span>
                <Price value={total} className="font-display text-2xl text-ink" />
              </div>
              <p className="mb-5 text-[12px] text-ink-muted">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <Button
                href="/checkout"
                variant="solid"
                size="lg"
                className="w-full"
                onClick={onClose}
              >
                Proceed to checkout
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full cursor-pointer text-center text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ink"
              >
                Continue shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
