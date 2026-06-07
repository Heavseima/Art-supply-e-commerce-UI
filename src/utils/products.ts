import { cacheLife, cacheTag } from "next/cache";

import { CATEGORIES, PRODUCTS } from "@/utils/catalog";
import type { Category, Product } from "@/types/api";

/**
 * Optimized, explicitly-cached data-fetching engines.
 *
 * Caching is intentional and visible here per the project's caching rules:
 * every read opts into the Next.js 16 Cache Components model via the
 * `'use cache'` directive, declares a `cacheLife` profile, and tags its
 * entry with `cacheTag` so it can be revalidated surgically later
 * (e.g. `updateTag('catalog')` after an inventory mutation).
 *
 * Today these resolve from the local seed in `@/utils/catalog`. Swapping in a
 * real backend means replacing the array reads with `await fetch(...)` inside
 * these same functions — callers never change.
 */

/** Fetch the full catalog. Cached for a day, tagged `catalog`. */
export async function getProducts(): Promise<readonly Product[]> {
  "use cache";
  cacheLife("days");
  cacheTag("catalog");

  return PRODUCTS;
}

/** Fetch all merchandising categories. Cached for a day, tagged `categories`. */
export async function getCategories(): Promise<readonly Category[]> {
  "use cache";
  cacheLife("days");
  cacheTag("categories");

  return CATEGORIES;
}

/**
 * Fetch a single product by its slug. `slug` is part of the cache key, so each
 * product page gets its own durable entry tagged both `catalog` and per-slug.
 */
export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  "use cache";
  cacheLife("days");
  cacheTag("catalog", `product:${slug}`);

  return PRODUCTS.find((product) => product.slug === slug);
}

/**
 * Featured collection for the landing hero — a curated, in-stock slice.
 * Cached for hours since merchandising rotates more often than the catalog.
 */
export async function getFeaturedProducts(
  limit = 4,
): Promise<readonly Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog", "featured");

  return PRODUCTS.filter((product) => product.stock > 0).slice(0, limit);
}

/**
 * Products within a category, resolved by category slug.
 * `categorySlug` is part of the cache key (one entry per category).
 */
export async function getProductsByCategorySlug(
  categorySlug: string,
): Promise<readonly Product[]> {
  "use cache";
  cacheLife("days");
  cacheTag("catalog", `category:${categorySlug}`);

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return PRODUCTS.filter((product) => product.categoryId === category.id);
}
