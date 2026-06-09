import { getFeaturedProducts } from "@/utils/products";
import { ProductGrid } from "@/components/ui/ProductGrid";

interface FeaturedCollectionProps {
  limit?: number;
}

/**
 * Async server component that pulls the curated featured slice. The data read
 * is dynamic (fetched fresh each request in `getFeaturedProducts`); rendered
 * under a Suspense boundary on the landing page so it streams in as a dynamic
 * hole while the rest of the static shell renders instantly.
 */
export async function FeaturedCollection({ limit = 4 }: FeaturedCollectionProps) {
  const products = await getFeaturedProducts(limit);
  return <ProductGrid products={products} priorityCount={limit} />;
}
