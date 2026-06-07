import Link from "next/link";

import type { Category } from "@/types/api";

interface CategoryFilterProps {
  categories: readonly Category[];
  /** Currently active category slug, or `null` for "All". */
  active: string | null;
}

/**
 * Horizontal category filter rendered as editorial text links. Navigation is
 * URL-driven (`?category=slug`) so filtered views are shareable and the server
 * does the actual filtering. Pure server component — no client JS needed.
 */
export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  const item = (isActive: boolean) =>
    [
      "link-underline text-[11px] uppercase tracking-[0.24em] transition-colors duration-300",
      isActive ? "is-active text-ink" : "text-ink-muted hover:text-ink",
    ].join(" ");

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      <Link href="/products" className={item(active === null)}>
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className={item(active === category.slug)}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
