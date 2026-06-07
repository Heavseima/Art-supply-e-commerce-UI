import Image from "next/image";

import { Button } from "@/components/ui/Button";

/**
 * Full-width editorial promotional band. Pure server component. A charcoal
 * statement panel beside a photograph — the image carries the colour.
 */
export function PromoBanner() {
  return (
    <section className="border-y border-hairline">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-2">
        {/* Statement panel */}
        <div className="reveal flex flex-col items-start justify-center gap-6 bg-ink px-6 py-16 text-canvas sm:px-10 lg:px-14 lg:py-24">
          <span className="text-[11px] uppercase tracking-[0.32em] text-canvas/60">
            Restocked this week
          </span>
          <h2 className="max-w-md font-display text-3xl font-medium leading-[1.1] sm:text-4xl lg:text-5xl">
            Studio essentials, back on the shelf.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-canvas/70">
            Cotton papers, sable rounds, and single-pigment paints — replenished
            and ready to ship the same day.
          </p>
          <Button
            href="/products?category=paper"
            size="lg"
            variant="inverse"
            className="mt-2"
          >
            Shop the restock
          </Button>
        </div>

        {/* Image */}
        <div className="relative min-h-[60vw] border-t border-hairline sm:min-h-[24rem] lg:min-h-0 lg:border-l lg:border-t-0">
          <Image
            src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1400&q=85"
            alt="Stacked cotton papers and studio surfaces"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
