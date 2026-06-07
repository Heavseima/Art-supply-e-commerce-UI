import Image from "next/image";
import Link from "next/link";

import { getCategories, getProducts } from "@/utils/products";

/**
 * Image-backed "shop by discipline" tiles. Async server component: pulls the
 * (cached) categories and catalog, picks a representative image per category,
 * and lets the photography carry the colour under a quiet ink scrim. Reads
 * stay inside the cached engines, so this is part of the static shell.
 */
export async function CategoryShowcase() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const tiles = categories.map((category) => {
    const sample = products.find((p) => p.categoryId === category.id);
    const count = products.filter((p) => p.categoryId === category.id).length;
    return { category, image: sample?.imageUrl, count };
  });

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map(({ category, image, count }) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className="reveal group relative flex aspect-[3/4] flex-col justify-end overflow-hidden"
        >
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-canvas-deep" />
          )}
          {/* Quiet legibility scrim — ink, not colour. Deepens on hover. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent transition-opacity duration-500 group-hover:from-ink/80" />
          <div className="relative flex flex-col gap-2 p-6 text-canvas">
            <span className="text-[10px] uppercase tracking-[0.24em] text-canvas/70">
              {count} {count === 1 ? "piece" : "pieces"}
            </span>
            <span className="font-display text-2xl font-medium leading-tight">
              {category.name}
            </span>
            <span className="mt-1 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-canvas">
              Shop now
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
              >
                &rarr;
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
