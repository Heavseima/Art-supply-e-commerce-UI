import { getFeaturedProducts } from "@/utils/products";
import { ProductGrid } from "@/components/ui/ProductGrid";

interface FeaturedCollectionProps {
  limit?: number;
}

/**
 * Async server component that pulls the curated featured slice. The data read
 * is explicitly cached in `getFeaturedProducts` (`'use cache'` + `cacheLife`),
 * so this is included in the static shell; rendered under a Suspense boundary
 * on the landing page so the rest of the page never blocks on it.
 */
export async function FeaturedCollection({ limit = 4 }: FeaturedCollectionProps) {
  const products = await getFeaturedProducts(limit);
  return <ProductGrid products={products} priorityCount={limit} />;
}
