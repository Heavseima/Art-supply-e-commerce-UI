import { Suspense } from "react";
import type { Metadata } from "next";

import { GridSkeleton } from "@/components/ui/GridSkeleton";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryFilter } from "@/components/modules/CategoryFilter";
import {
  getCategories,
  getProducts,
  getProductsByCategorySlug,
} from "@/utils/products";

export const metadata: Metadata = {
  title: "The Catalog",
  description:
    "Browse the full Atelier catalog of paints, brushes, papers, and drawing media.",
};

/** Normalize the raw `?category=` value to a slug or null. */
function normalizeCategory(raw: string | string[] | undefined): string | null {
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

/**
 * Async island that reads the request-time `searchParams`, then renders the
 * matching (cached) product set and an editorial header for the active view.
 * Living entirely inside the page's Suspense boundary keeps the static shell
 * — nav, filter chrome — instant while this resolves at request time.
 */
async function CatalogResults({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ category: rawCategory, q: rawQuery }, categories] =
    await Promise.all([searchParams, getCategories()]);

  const category = normalizeCategory(rawCategory);
  const activeCategory = categories.find((c) => c.slug === category) ?? null;
  const query =
    typeof rawQuery === "string" ? rawQuery.trim().toLowerCase() : "";

  const base = category
    ? await getProductsByCategorySlug(category)
    : await getProducts();

  // Free-text search filters the (cached) set at request time.
  const products = query
    ? base.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      )
    : base;

  const heading = query
    ? {
        eyebrow: "Search",
        title: `Results for “${rawQuery}”`,
        description: `${products.length} ${products.length === 1 ? "piece" : "pieces"} matched your search.`,
      }
    : activeCategory
      ? {
          eyebrow: "Collection",
          title: activeCategory.name,
          description: activeCategory.tagline,
        }
      : {
          eyebrow: "The Catalog",
          title: "Everything in the house",
          description:
            "The complete catalog — pigments, brushes, surfaces, and drawing media, each chosen with intent.",
        };

  return (
    <>
      <SectionHeading
        eyebrow={heading.eyebrow}
        title={heading.title}
        description={heading.description}
        className="reveal block-gap"
      />

      {/* Editorial filter bar — categories + live count, framed by hairlines. */}
      <div className="reveal mb-12 flex flex-col gap-5 border-y border-hairline py-5 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter categories={categories} active={category} />
        <span className="text-[11px] uppercase tracking-[0.24em] text-ink-muted">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </span>
      </div>

      {products.length === 0 ? (
        <p className="py-24 text-center text-sm text-ink-muted">
          Nothing matched. Try another discipline or search term.
        </p>
      ) : (
        <ProductGrid products={products} priorityCount={4} />
      )}
    </>
  );
}

export default function ProductsPage(props: PageProps<"/products">) {
  return (
    <div className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
      <Suspense fallback={<CatalogFallback />}>
        <CatalogResults searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

/** Skeleton mirroring the catalog layout while the request-time view resolves. */
function CatalogFallback() {
  return (
    <>
      <SectionHeading
        eyebrow="The Catalog"
        title="Everything in the house"
        className="block-gap"
      />
      <div className="mb-12 h-[58px] w-full animate-pulse border-y border-hairline bg-canvas-deep/40" />
      <GridSkeleton count={8} />
    </>
  );
}
