"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCart } from "@/hooks/useCart";

interface CartViewProps {
  catalog: readonly Product[];
}

/**
 * Full-page cart overview. Reads the shared LocalStorage cart and resolves it
 * against the server-supplied catalog. Handles its own empty / hydrating states.
 */
export function CartView({ catalog }: CartViewProps) {
  const { resolve, setQuantity, remove, clear, isReady } = useCart();
  const { items, total } = useMemo(() => resolve(catalog), [resolve, catalog]);

  if (!isReady) {
    return (
      <p className="py-24 text-center text-sm text-ink-muted">
        Loading your bag…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="font-display text-2xl font-bold text-ink">
          Your bag is empty.
        </p>
        <p className="max-w-sm text-sm text-ink-muted">
          Nothing here yet — the catalog is waiting.
        </p>
        <Button href="/products" variant="solid" size="md">
          Browse the catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-16 lg:grid-cols-[1fr_360px]">
      {/* Lines */}
      <ul className="divide-y divide-hairline border-y border-hairline">
        {items.map(({ product, quantity, subtotal }) => (
          <li key={product.id} className="flex gap-6 py-8">
            <Link
              href={`/products/${product.slug}`}
              className="relative h-32 w-28 shrink-0 overflow-hidden border border-hairline bg-canvas-deep"
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </Link>
            <div className="flex flex-1 flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-display text-lg font-semibold transition-colors hover:text-accent"
                  >
                    {product.name}
                  </Link>
                  <Price value={product.price} className="text-sm text-ink-muted" />
                </div>
                <Price value={subtotal} className="font-display text-lg" />
              </div>
              <div className="flex items-center justify-between">
                <QuantityStepper
                  value={quantity}
                  min={1}
                  max={product.stock}
                  onChange={(next) => setQuantity(product.id, next)}
                />
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  className="text-[11px] uppercase tracking-[0.18em] text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <aside className="h-fit border border-hairline bg-canvas p-8 lg:sticky lg:top-28">
        <SectionHeading eyebrow="Summary" title="Order total" className="mb-8" />
        <dl className="flex flex-col gap-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd>
              <Price value={total} />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Shipping</dt>
            <dd className="text-ink-muted">Calculated at checkout</dd>
          </div>
        </dl>
        <div className="my-6 h-px w-full bg-hairline" />
        <div className="mb-8 flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">
            Total
          </span>
          <Price value={total} className="font-display text-2xl" />
        </div>
        <Button href="/checkout" variant="solid" size="lg" className="w-full">
          Checkout
        </Button>
        <button
          type="button"
          onClick={clear}
          className="mt-5 w-full text-center text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-accent"
        >
          Empty bag
        </button>
      </aside>
    </div>
  );
}
