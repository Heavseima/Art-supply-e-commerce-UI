"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Lock } from "lucide-react";

import type { Product, ShippingDetails } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { TextField } from "@/components/ui/TextField";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/format";

interface CheckoutFormProps {
  catalog: readonly Product[];
}

const FREE_SHIPPING_THRESHOLD = 75;
const FLAT_SHIPPING = 8;

/** Read a typed shipping payload out of the submitted form data. */
function readShipping(form: HTMLFormElement): ShippingDetails {
  const data = new FormData(form);
  const field = (key: keyof ShippingDetails) => String(data.get(key) ?? "").trim();
  return {
    fullName: field("fullName"),
    email: field("email"),
    address: field("address"),
    city: field("city"),
    postalCode: field("postalCode"),
    country: field("country"),
  };
}

/**
 * Minimal shipping checkout. Resolves the LocalStorage cart against the
 * server-supplied catalog, captures a typed {@link ShippingDetails} payload,
 * and confirms the (mock) order, clearing the bag.
 */
export function CheckoutForm({ catalog }: CheckoutFormProps) {
  const { resolve, clear, isReady } = useCart();
  const { items, total } = useMemo(() => resolve(catalog), [resolve, catalog]);
  const [placed, setPlaced] = useState<ShippingDetails | null>(null);

  const shipping = total >= FREE_SHIPPING_THRESHOLD || total === 0 ? 0 : FLAT_SHIPPING;
  const payable = total + shipping;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const details = readShipping(event.currentTarget);
    setPlaced(details);
    clear();
  };

  if (placed) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-canvas">
          <Check className="h-7 w-7" strokeWidth={1.75} aria-hidden={true} />
        </span>
        <span className="text-[11px] uppercase tracking-[0.32em] text-ink-muted">
          Order confirmed
        </span>
        <h2 className="font-display text-4xl font-medium text-ink">
          Thank you, {placed.fullName.split(" ")[0] || "friend"}.
        </h2>
        <p className="max-w-md leading-relaxed text-ink-muted">
          Your order is on its way to {placed.city}. A confirmation has been sent
          to {placed.email}.
        </p>
        <Button href="/products" variant="outline" size="md">
          Continue browsing
        </Button>
      </div>
    );
  }

  if (isReady && items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <p className="font-display text-2xl font-medium text-ink">
          There is nothing to check out.
        </p>
        <Button href="/products" variant="solid" size="md">
          Browse the catalogue
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
      {/* Shipping form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-12">
        <fieldset className="flex flex-col gap-7">
          <legend className="mb-1 flex items-baseline gap-3 text-[11px] uppercase tracking-[0.24em] text-ink">
            <span className="font-display text-base not-italic text-accent">01</span>
            Contact
          </legend>
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@studio.com"
          />
        </fieldset>

        <fieldset className="flex flex-col gap-7">
          <legend className="mb-1 flex items-baseline gap-3 text-[11px] uppercase tracking-[0.24em] text-ink">
            <span className="font-display text-base not-italic text-accent">02</span>
            Shipping address
          </legend>
          <TextField
            label="Full name"
            name="fullName"
            required
            autoComplete="name"
            placeholder="Jane Painter"
          />
          <TextField
            label="Address"
            name="address"
            required
            autoComplete="street-address"
            placeholder="12 Atelier Lane"
          />
          <div className="grid gap-7 sm:grid-cols-2">
            <TextField
              label="City"
              name="city"
              required
              autoComplete="address-level2"
              placeholder="Florence"
            />
            <TextField
              label="Postal code"
              name="postalCode"
              required
              autoComplete="postal-code"
              placeholder="50123"
            />
          </div>
          <TextField
            label="Country"
            name="country"
            required
            autoComplete="country-name"
            placeholder="Italy"
          />
        </fieldset>

        <div className="flex flex-col gap-4">
          <Button type="submit" variant="solid" size="lg" className="w-full sm:w-auto">
            Place order · {formatPrice(payable)}
          </Button>
          <p className="flex items-center gap-2 text-[12px] text-ink-muted">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden={true} />
            Secure, encrypted checkout. Your details are never stored.
          </p>
        </div>
      </form>

      {/* Order summary */}
      <aside className="h-fit border border-hairline bg-canvas-deep p-7 lg:sticky lg:top-28">
        <span className="text-[11px] uppercase tracking-[0.24em] text-ink-muted">
          Your order
        </span>

        <ul className="mt-6 flex flex-col divide-y divide-hairline">
          {items.map(({ product, quantity, subtotal }) => (
            <li key={product.id} className="flex gap-4 py-4 first:pt-0">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-hairline bg-canvas">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] tabular-nums text-canvas">
                  {quantity}
                </span>
              </div>
              <div className="flex flex-1 items-center justify-between gap-3">
                <span className="font-display text-sm leading-snug text-ink">
                  {product.name}
                </span>
                <Price value={subtotal} className="shrink-0 text-sm text-ink" />
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-6 flex flex-col gap-3 border-t border-hairline pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd>
              <Price value={total} />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Shipping</dt>
            <dd className={shipping === 0 ? "text-accent" : ""}>
              {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-baseline justify-between border-t border-hairline pt-5">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">
            Total
          </span>
          <Price value={payable} className="font-display text-2xl text-ink" />
        </div>

        <Link
          href="/cart"
          className="mt-6 inline-block text-[11px] uppercase tracking-[0.18em] text-ink-muted transition-colors duration-300 hover:text-ink"
        >
          &larr; Back to bag
        </Link>
      </aside>
    </div>
  );
}
