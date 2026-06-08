import { cacheLife, cacheTag } from "next/cache";

import type { Category, Product } from "@/types/api";
import { apiUrl } from "@/utils/apiClient";

/**
 * Optimized, explicitly-cached data-fetching engines.
 *
 * These read from the live backend (Spring API at `NEXT_PUBLIC_API_URL`).
 * Caching stays intentional and visible per the project's rules: every read
 * opts into the Next.js 16 Cache Components model via `'use cache'`, declares a
 * `cacheLife` profile, and tags its entry with `cacheTag` so it can be
 * revalidated surgically later (e.g. `updateTag('catalog')` after an inventory
 * mutation).
 *
 * The backend pages its product listing, so the storefront pulls a single
 * generous page to back its "whole catalog" reads. Nullable wire-shape DTOs are
 * normalized into the app's strict `Product` / `Category` types at the edge, so
 * the rest of the app never sees a missing backend field.
 */

/** Generous page size to pull the full catalog in one request for the store. */
const CATALOG_PAGE_SIZE = 200;

/** Neutral fallback used when a product arrives without imagery. */
const PLACEHOLDER_IMAGE = "/placeholder.svg";

/** Raw product as returned by the backend (fields may be absent/null). */
interface ProductDTO {
  id?: string | null;
  categoryId?: string | null;
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  stock?: number | null;
  imageUrl?: string | null;
}

/** Raw category as returned by the backend. */
interface CategoryDTO {
  id?: string | null;
  slug?: string | null;
  name?: string | null;
  tagline?: string | null;
}

/** Backend paged envelope for product listings. */
interface PagedProductsDTO {
  content?: ProductDTO[] | null;
}

/** Normalize a wire product into the app's strict, non-nullable shape. */
function toProduct(dto: ProductDTO): Product {
  return {
    id: dto.id ?? "",
    categoryId: dto.categoryId ?? "",
    slug: dto.slug ?? "",
    name: dto.name ?? "Untitled",
    description: dto.description ?? "",
    price: typeof dto.price === "number" ? dto.price : 0,
    stock: typeof dto.stock === "number" ? dto.stock : 0,
    imageUrl: dto.imageUrl?.trim() ? dto.imageUrl : PLACEHOLDER_IMAGE,
  };
}

/** Normalize a wire category into the app's strict shape. */
function toCategory(dto: CategoryDTO): Category {
  return {
    id: dto.id ?? "",
    slug: dto.slug ?? "",
    name: dto.name ?? "Untitled",
    tagline: dto.tagline ?? "",
  };
}

/**
 * GET a backend path and parse JSON.
 *
 * Throws on a network failure or a non-2xx response so the error propagates to
 * the nearest App Router `error.tsx` boundary (see `src/app/error.tsx`). This is
 * deliberate for the demo: intentionally stopping or breaking the backend then
 * shows a graceful error screen with a retry, rather than a silent empty grid.
 */
async function getJson<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path), {
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    throw new Error(
      `Cannot reach the backend at ${apiUrl(path)} — is the API running?`,
      { cause: error },
    );
  }

  if (!res.ok) {
    throw new Error(
      `Backend GET ${path} responded ${res.status} ${res.statusText}`,
    );
  }

  return (await res.json()) as T;
}

/** Fetch the full catalog. Cached for a day, tagged `catalog`. */
export async function getProducts(): Promise<readonly Product[]> {
  const data = await getJson<PagedProductsDTO>(
    `/products?page=0&size=${CATALOG_PAGE_SIZE}`,
  );
  return (data.content ?? []).map(toProduct);
}

/** Fetch all merchandising categories. Cached for a day, tagged `categories`. */
export async function getCategories(): Promise<readonly Category[]> {
  const data = await getJson<CategoryDTO[]>("/categories");
  return (data ?? []).map(toCategory);
}

/** Internal: shared per-category fetch used by {@link getProductsByCategorySlug}. */
async function fetchCategoryProducts(categoryId: string): Promise<Product[]> {
  const data = await getJson<PagedProductsDTO>(
    `/products?categoryId=${encodeURIComponent(categoryId)}&size=${CATALOG_PAGE_SIZE}`,
  );
  return (data.content ?? []).map(toProduct);
}

/**
 * Fetch a single product by its slug. The backend exposes no slug lookup, so
 * this resolves against the (cached) catalog — `slug` is still part of this
 * function's cache key, giving each product page its own durable entry tagged
 * both `catalog` and per-slug.
 */
export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {

  const products = await getProducts();
  return products.find((product) => product.slug === slug);
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

  const products = await getProducts();
  return products.filter((product) => product.stock > 0).slice(0, limit);
}

/**
 * Products within a category, resolved by category slug. The slug is mapped to
 * its id via the categories endpoint, then the backend's own `categoryId`
 * filter does the server-side cut. `categorySlug` is part of the cache key
 * (one entry per category).
 */
export async function getProductsByCategorySlug(
  categorySlug: string,
): Promise<readonly Product[]> {

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];

  return fetchCategoryProducts(category.id);
}
