interface Testimonial {
  readonly quote: string;
  readonly name: string;
  readonly role: string;
}

const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      "The cobalt is the truest I've found outside a tube milled in Paris. Everything arrives quickly, and packed like it matters.",
    name: "Amara Okafor",
    role: "Oil painter · Lagos",
  },
  {
    quote:
      "Their cotton paper takes a flooded wash without buckling once. It has quietly become the only block I keep on the bench.",
    name: "Léo Mercier",
    role: "Watercolourist · Lyon",
  },
  {
    quote:
      "A shop that clearly knows the difference between a tool and an instrument. The sable rounds are flawless, every single time.",
    name: "Hana Vasquez",
    role: "Illustrator · Mexico City",
  },
];

/** Two-letter monogram from a full name. */
function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Editorial testimonials band. Pure server component. Three quote columns,
 * each with a serif quotation mark and a monogram — social proof without the
 * SaaS card grid.
 */
export function Testimonials() {
  return (
    <section className="border-t border-hairline bg-canvas-deep">
      <div className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="reveal block-gap flex flex-col gap-4">
          <span className="text-[11px] uppercase tracking-[0.32em] text-ink-muted">
            Testimonials
          </span>
          <p className="max-w-2xl font-display text-2xl font-medium italic leading-[1.25] tracking-tight text-ink sm:text-3xl">
            Trusted by makers who notice the difference.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="reveal flex flex-col gap-6 bg-canvas-deep p-8 transition-colors duration-300 hover:bg-canvas lg:p-10"
            >
              <span
                aria-hidden
                className="font-display text-6xl leading-[0.6] text-accent"
              >
                &ldquo;
              </span>
              <blockquote className="font-display text-lg leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-4 border-t border-hairline pt-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline-strong font-display text-sm font-medium text-ink">
                  {initials(t.name)}
                </span>
                <span className="flex flex-col">
                  <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink">
                    {t.name}
                  </span>
                  <span className="text-[12px] text-ink-muted">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
