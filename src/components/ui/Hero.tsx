import Image from "next/image";

import { Button } from "@/components/ui/Button";

/** Editorial boutique hero. The image supplies the color; the type carries the brand. Server component. */
export function Hero() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-stretch gap-0 lg:grid-cols-2">
        {/* Copy column — generous padding top and bottom so nothing drowns. */}
        <div className="flex flex-col justify-center gap-8 px-6 pb-20 pt-14 sm:px-10 lg:px-14 lg:pb-28 lg:pt-28">
          <span className="text-[11px] uppercase tracking-[0.36em] text-ink-muted">
            Established for the studio
          </span>
          <h1 className="animate-rise font-display text-[clamp(2.75rem,6vw,5.25rem)] font-medium leading-[1.02] tracking-tight text-ink">
            The material
            <br />
            of making,
            <br />
            <span className="italic text-accent">considered.</span>
          </h1>
          <p className="animate-rise max-w-md text-base leading-relaxed text-ink-muted">
            Single-pigment paints, hand-finished brushes, and cotton papers —
            chosen for the hand that knows the difference. A quiet catalogue for
            serious work.
          </p>
          <div className="animate-rise flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
            <Button href="/products" size="lg" variant="solid">
              Explore the catalogue
            </Button>
            <Button href="/products?category=paint" size="lg" variant="ghost">
              Shop paint
            </Button>
          </div>
        </div>

        {/* Image column — clean, un-bordered, lets the pigments carry the color. */}
        <div className="relative min-h-[60vw] border-t border-hairline sm:min-h-[28rem] lg:min-h-0 lg:border-l lg:border-t-0">
          <Image
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1500&q=85"
            alt="A spread of vivid artist paints and brushes on a studio table"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
