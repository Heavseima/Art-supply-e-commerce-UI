import Image from "next/image";
import type { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Atelier is a considered house of pigments, papers, and tools — curated for those who take making seriously.",
};

const VALUES: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "Single-pigment honesty",
    body: "We favour materials made of one true thing. No fillers, no shortcuts — colour you can trust to behave the same way twice.",
  },
  {
    title: "Chosen by makers",
    body: "Every item is vetted by working artists before it earns a place. If it doesn't survive the bench, it doesn't make the shelf.",
  },
  {
    title: "Quietly archival",
    body: "Lightfast pigments, acid-free papers, tools built to outlast a career. We sell things meant to be kept.",
  },
];

const STATS: ReadonlyArray<{ figure: string; label: string }> = [
  { figure: "2014", label: "Founded in Florence" },
  { figure: "200+", label: "Single-pigment colours" },
  { figure: "40", label: "Countries shipped to" },
  { figure: "12k", label: "Studios served" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-7">
            <span className="animate-rise text-[11px] uppercase tracking-[0.36em] text-ink-muted">
              Our story · Florence, est. 2014
            </span>
            <h1 className="animate-rise font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.02] tracking-tight text-ink">
              A house built for
              <br />
              <span className="italic text-accent">serious making.</span>
            </h1>
          </div>
          <p className="animate-rise max-w-md text-lg leading-relaxed text-ink-muted">
            Atelier began at a single workbench — a frustration with materials
            that promised much and delivered little. We set out to assemble a
            quiet catalogue of the genuine: pigments with depth, papers with
            spine, tools with intent.
          </p>
        </div>
      </section>

      {/* Wide image */}
      <section className="reveal relative h-[42vw] max-h-[640px] min-h-[20rem] w-full border-y border-hairline">
        <Image
          src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=2000&q=85"
          alt="An artist's studio table laid with paints, brushes, and paper"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>

      {/* Story */}
      <section className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="The premise"
            title="The tool should disappear."
            className="reveal"
          />
          <div className="reveal flex flex-col gap-5 text-base leading-relaxed text-ink-muted">
            <p>
              A great material is one you stop noticing — it carries the idea
              without arguing. That belief shapes every decision we make, from
              the mills we buy from to the way an order is wrapped.
            </p>
            <p>
              We work directly with small makers across Europe and Japan,
              choosing the colours, surfaces, and brushes we reach for in our
              own studio first. If it isn&rsquo;t good enough for the work, it
              isn&rsquo;t good enough to sell.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-hairline bg-canvas-deep">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={[
                "reveal flex flex-col gap-2 px-6 py-12 lg:px-10",
                i > 0 ? "border-l border-hairline" : "",
                i === 2 ? "border-t border-hairline lg:border-t-0" : "",
                i === 3 ? "border-t border-hairline lg:border-t-0" : "",
              ].join(" ")}
            >
              <span className="font-display text-4xl font-medium text-ink lg:text-5xl">
                {s.figure}
              </span>
              <span className="text-[12px] uppercase tracking-[0.18em] text-ink-muted">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="What we hold to"
          title="Three quiet principles"
          className="reveal block-gap"
        />
        <div className="grid gap-px overflow-hidden border border-hairline bg-hairline lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <div key={v.title} className="reveal flex flex-col gap-4 bg-canvas p-8 lg:p-10">
              <span className="font-display text-2xl font-medium text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl font-medium text-ink">
                {v.title}
              </h3>
              <p className="text-base leading-relaxed text-ink-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder's note */}
      <section className="border-t border-hairline bg-canvas-deep">
        <div className="section-y mx-auto grid max-w-[1600px] items-center gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-12">
          <div className="reveal relative aspect-[4/5] w-full overflow-hidden border border-hairline">
            <Image
              src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1200&q=85"
              alt="A hand-finished sable brush resting on a studio surface"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="reveal flex flex-col gap-6">
            <span className="text-[11px] uppercase tracking-[0.32em] text-ink-muted">
              From the founder
            </span>
            <p className="font-display text-2xl font-medium italic leading-[1.3] tracking-tight text-ink sm:text-3xl">
              &ldquo;We opened Atelier because we wanted somewhere we&rsquo;d be
              glad to shop ourselves — honest materials, chosen with care, sent
              without fuss.&rdquo;
            </p>
            <p className="max-w-md text-base leading-relaxed text-ink-muted">
              Every order still passes across our bench before it leaves. That
              hasn&rsquo;t changed since the first one, and it never will.
            </p>
            <div className="mt-2 flex flex-col">
              <span className="font-display text-2xl italic text-ink">
                Elena Russo
              </span>
              <span className="text-[12px] uppercase tracking-[0.18em] text-ink-muted">
                Founder &amp; curator
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-hairline bg-ink text-canvas">
        <div className="reveal section-y mx-auto flex max-w-[1600px] flex-col items-start gap-8 px-6 text-left lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <h2 className="max-w-xl font-display text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl">
            Build a kit that lasts a career.
          </h2>
          <Button href="/products" size="lg" variant="inverse">
            Explore the catalogue
          </Button>
        </div>
      </section>
    </div>
  );
}
