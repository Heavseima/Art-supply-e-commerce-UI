import type { Product } from "@/types/api";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProductsByCategorySlug, getCategories } from "@/utils/products";

interface RelatedProductsProps {
  categoryId: string;
  /** Slug to exclude (the product currently being viewed). */
  excludeSlug: string;
  limit?: number;
}

/**
 * Cached "more from this collection" rail. Reads are explicitly cached in the
 * data engines; rendered under Suspense on the detail page.
 */
export async function RelatedProducts({
  categoryId,
  excludeSlug,
  limit = 4,
}: RelatedProductsProps) {
  const categories = await getCategories();
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return null;

  const all = await getProductsByCategorySlug(category.slug);
  const related: readonly Product[] = all
    .filter((product) => product.slug !== excludeSlug)
    .slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-hairline">
      <div className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
        <SectionHeading
          eyebrow={`More ${category.name}`}
          title="From the same shelf"
          className="reveal block-gap"
        />
        <ProductGrid products={related} priorityCount={0} />
      </div>
    </section>
  );
}
