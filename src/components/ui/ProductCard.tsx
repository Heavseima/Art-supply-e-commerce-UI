import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/api";
import { Price } from "@/components/ui/Price";
import { AddToCartButton } from "@/components/modules/AddToCartButton";

interface ProductCardProps {
  product: Product;
  /** Index in a grid; first row gets priority image loading. */
  priority?: boolean;
}

/**
 * Editorial product tile. Sharp, un-bordered imagery on a quiet cream ground
 * lets the product supply the colour; the serif name + ink price carry the
 * brand. The card body is a server component; only the add-to-cart leaf is a
 * client island, placed beside (never inside) the link.
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const soldOut = product.stock <= 0;
  const low = !soldOut && product.stock <= 5;

  return (
    <article className="reveal group flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-none"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-canvas-deep">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={[
              "object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform group-hover:scale-[1.05]",
              soldOut ? "opacity-70 grayscale" : "",
            ].join(" ")}
          />
          {/* Soft hover wash for depth (ink, not colour). */}
          <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/[0.04]" />
          {soldOut ? (
            <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Sold out
            </span>
          ) : low ? (
            <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.2em] text-accent">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 pt-5">
        <Link
          href={`/products/${product.slug}`}
          className="focus-visible:outline-none"
        >
          <h3 className="font-display text-xl font-medium leading-snug text-ink transition-colors group-hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <Price
          value={product.price}
          className="text-[15px] tracking-wide text-ink"
        />
        <AddToCartButton
          product={product}
          size="sm"
          fullWidth
          className="mt-1"
        />
      </div>
    </article>
  );
}
