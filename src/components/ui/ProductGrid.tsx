import type { Product } from "@/types/api";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductGridProps {
  products: readonly Product[];
  /** How many leading items get image priority (above-the-fold row). */
  priorityCount?: number;
  className?: string;
}

/** Responsive editorial grid of product tiles. Pure server component. */
export function ProductGrid({
  products,
  priorityCount = 4,
  className,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-24 text-center text-sm text-ink-muted">
        No pieces in this collection yet.
      </p>
    );
  }

  return (
    <div
      className={[
        "grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
