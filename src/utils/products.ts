import { unstable_rethrow } from "next/navigation";

import type { Category, Product } from "@/types/api";
import { apiUrl } from "@/utils/apiClient";

/**
 * Dynamic data-fetching engines.
 *
 * These read from the live backend (Spring API at `NEXT_PUBLIC_API_URL`).
 * Under the Next.js 16 Cache Components model (`cacheComponents: true`) data is
 * dynamic by default — none of these reads opt into `'use cache'`, so every
 * request hits the backend fresh. Callers render them inside `<Suspense>`
 * boundaries, which makes each read a streamed dynamic hole in an otherwise
 * static (PPR) shell. Refresh the page and you see the live backend state —
 * including its errors — immediately, with no cached copy in the way.
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

/** Development/build-time sample used when the backend is unavailable. */
const SAMPLE_PRODUCT: Product = {
  id: "sample-prod-1",
  categoryId: "sample-cat",
  slug: "sample-product",
  name: "Sample Product",
  description: "Placeholder product used when the backend is unreachable during build.",
  price: 0,
  stock: 0,
  imageUrl: PLACEHOLDER_IMAGE,
};

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
    // Re-throw Next.js control-flow signals first. Under Cache Components /
    // PPR, a fetch still in flight when a prerender completes rejects with the
    // internal `HANGING_PROMISE_REJECTION` signal; swallowing it interferes
    // with the prerender lifecycle. `unstable_rethrow` lets that (and
    // notFound/redirect) propagate while real network failures fall through.
    unstable_rethrow(error);
    // During builds the backend may be offline. Instead of throwing and
    // aborting the entire build, surface a warning and return an empty
    // value which callers normalize into safe defaults.
    console.warn(
      `getJson: cannot reach the backend at ${apiUrl(path)} — returning empty fallback.`,
      error,
    );
    return {} as T;
  }

  if (!res.ok) {
    // Non-2xx responses are treated as missing data during static builds;
    // log and return an empty fallback to allow generation to continue.
    console.warn(
      `getJson: backend GET ${path} responded ${res.status} ${res.statusText} — returning empty fallback.`,
    );
    return {} as T;
  }

  try {
    return (await res.json()) as T;
  } catch (error) {
    // If parsing fails, log and return an empty fallback.
    console.warn(`getJson: failed to parse JSON for ${path} — returning empty fallback.`, error);
    return {} as T;
  }
}

/** Fetch the full catalog fresh on every request. */
export async function getProducts(): Promise<readonly Product[]> {
  try {
    const data = await getJson<PagedProductsDTO>(
      `/products?page=0&size=${CATALOG_PAGE_SIZE}`,
    );
    const list = data.content ?? [];
    if (list.length === 0) {
      // If the backend returns an empty catalog, provide a sample product
      // so static generation has at least one route to validate.
      return [SAMPLE_PRODUCT];
    }
    return list.map(toProduct);
  } catch (error) {
    unstable_rethrow(error);
    // During local builds the backend may be down or unreachable. Rather
    // than failing the entire Next.js build, log a warning and return a
    // minimal in-repo sample product so pages can still be generated.
    console.warn("getProducts: failed to fetch product catalog:", error);
    return [SAMPLE_PRODUCT];
  }
}

/** Fetch all merchandising categories fresh on every request. */
export async function getCategories(): Promise<readonly Category[]> {
  try {
    const data = await getJson<CategoryDTO[]>("/categories");
    const list = Array.isArray(data) ? data : [];
    return list.map(toCategory);
  } catch (error) {
    unstable_rethrow(error);
    // If categories cannot be fetched at build time, return an empty list
    // instead of throwing so the site can still build.
    console.warn("getCategories: failed to fetch categories:", error);
    return [];
  }
}

/** Internal: shared per-category fetch used by {@link getProductsByCategorySlug}. */
async function fetchCategoryProducts(categoryId: string): Promise<Product[]> {
  try {
    const data = await getJson<PagedProductsDTO>(
      `/products?categoryId=${encodeURIComponent(categoryId)}&size=${CATALOG_PAGE_SIZE}`,
    );
    return (data.content ?? []).map(toProduct);
  } catch (error) {
    // If the backend call fails for a particular category, surface a
    // non-throwing fallback so category pages can still be built.
    console.warn(
      `fetchCategoryProducts: failed to fetch products for category ${categoryId}:`,
      error,
    );
    return [];
  }
}

/**
 * Fetch a single product by its slug. The backend exposes no slug lookup, so
 * this resolves against the live catalog read each request.
 */
export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {

  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

/**
 * Featured collection for the landing hero — a curated, in-stock slice.
 * Dynamic like the rest: re-read fresh each request from the live catalog.
 */
export async function getFeaturedProducts(
  limit = 4,
): Promise<readonly Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.stock > 0).slice(0, limit);
}

/**
 * Products within a category, resolved by category slug. The slug is mapped to
 * its id via the categories endpoint, then the backend's own `categoryId`
 * filter does the server-side cut — read fresh on every request.
 */
export async function getProductsByCategorySlug(
  categorySlug: string,
): Promise<readonly Product[]> {

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];

  return fetchCategoryProducts(category.id);
}
