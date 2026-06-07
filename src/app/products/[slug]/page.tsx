import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Price } from "@/components/ui/Price";
import { StockBadge } from "@/components/ui/StockBadge";
import { GridSkeleton } from "@/components/ui/GridSkeleton";
import { PurchasePanel } from "@/components/modules/PurchasePanel";
import { RelatedProducts } from "@/components/modules/RelatedProducts";
import { getProductBySlug, getProducts } from "@/utils/products";

/** Statically generate every catalog route at build time. */
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Not found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.imageUrl }],
    },
  };
}

export default async function ProductDetailPage(
  props: PageProps<"/products/[slug]">,
) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="mx-auto max-w-[1600px] px-6 pt-10 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted"
        >
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <span className="px-2 text-hairline-strong">/</span>
          <Link href="/products" className="transition-colors hover:text-accent">
            Shop
          </Link>
          <span className="px-2 text-hairline-strong">/</span>
          <span aria-current="page" className="text-ink">{product.name}</span>
        </nav>
      </div>

      <article className="mx-auto grid max-w-[1600px] gap-12 px-6 py-14 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-20">
        {/* Imagery — clean, un-bordered; the product supplies the colour. */}
        <div className="reveal relative aspect-[4/5] w-full overflow-hidden bg-canvas-deep">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Detail */}
        <div className="reveal flex flex-col justify-center gap-6">
          <StockBadge stock={product.stock} />
          <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink lg:text-5xl">
            {product.name}
          </h1>
          <Price
            value={product.price}
            className="font-display text-3xl text-ink"
          />

          <div className="h-px w-full bg-hairline" />

          <p className="max-w-prose text-base leading-relaxed text-ink-muted">
            {product.description}
          </p>

          <PurchasePanel product={product} />

          <dl className="mt-2 grid grid-cols-2 gap-y-3 border-t border-hairline pt-6 text-sm">
            <dt className="text-ink-muted">Availability</dt>
            <dd className="text-right text-ink">
              {product.stock > 0 ? `${product.stock} in stock` : "Restocking"}
            </dd>
            <dt className="text-ink-muted">Reference</dt>
            <dd className="text-right tabular-nums text-ink">{product.id}</dd>
          </dl>
        </div>
      </article>

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-12">
            <GridSkeleton count={4} />
          </div>
        }
      >
        <RelatedProducts
          categoryId={product.categoryId}
          excludeSlug={product.slug}
        />
      </Suspense>
    </div>
  );
}
