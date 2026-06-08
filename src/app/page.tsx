import { Suspense } from "react";

import { Button } from "@/components/ui/Button";
import { GridSkeleton } from "@/components/ui/GridSkeleton";
import { Hero } from "@/components/ui/Hero";
import { PromoBanner } from "@/components/ui/PromoBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Testimonials } from "@/components/ui/Testimonials";
import { TrustBar } from "@/components/ui/TrustBar";
import { CategoryShowcase } from "@/components/modules/CategoryShowcase";
import { FeaturedCollection } from "@/components/modules/FeaturedCollection";

export default function HomePage() {
  return (
    <div>
      <Hero />

      <TrustBar />

      {/* Best sellers — streamed under Suspense for explicit caching. */}
      <section className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="reveal block-gap flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Best sellers"
            title="What the studio reaches for"
            description="The pieces our makers restock most — proven, in stock, and ready to ship."
          />
          <Button href="/products" variant="outline" size="sm">
            Shop all
          </Button>
        </div>

        <Suspense fallback={<GridSkeleton count={4} />}>
          <FeaturedCollection limit={4} />
        </Suspense>
      </section>

      {/* Shop by category — image-backed tiles. Cached reads → static shell. */}
      <section className="bg-canvas-deep">
        <div className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
          <SectionHeading
            eyebrow="Shop by discipline"
            title="Find your medium"
            description="Four houses of materials, each chosen with intent. Tap in and start building your kit."
            className="reveal block-gap"
          />
          <Suspense fallback={<GridSkeleton count={4} />}>
            <CategoryShowcase />
          </Suspense>
        </div>
      </section>

      <PromoBanner />

      {/* Brand moment — a quiet editorial band. */}
      <section className="border-t border-hairline bg-canvas">
        <div className="reveal section-y mx-auto flex max-w-3xl flex-col items-center px-6 text-center lg:px-12">
          <p className="font-display text-3xl font-medium italic leading-[1.25] tracking-tight text-ink sm:text-4xl">
            &ldquo;The tool should never stand between the hand and the
            idea.&rdquo;
          </p>
          <span className="mt-8 text-[11px] uppercase tracking-[0.32em] text-ink-muted">
            The Atelier ethos
          </span>
        </div>
      </section>

      <Testimonials />
    </div>
  );
}
