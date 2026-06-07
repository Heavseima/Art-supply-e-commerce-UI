import { Truck, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TrustItem {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly detail: string;
}

const ITEMS: readonly TrustItem[] = [
  { icon: Truck, title: "Complimentary shipping", detail: "On orders over $75" },
  { icon: RotateCcw, title: "Thirty-day returns", detail: "Unused & in studio order" },
  { icon: ShieldCheck, title: "Secure checkout", detail: "Encrypted at every step" },
  { icon: Sparkles, title: "Artist-selected", detail: "Vetted by working makers" },
];

/**
 * Benefits / reassurance strip. Pure server component. Minimal, monochrome,
 * divided by hairlines — reassurance without the SaaS feature-grid look.
 */
export function TrustBar() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-y-7 px-6 py-9 lg:grid-cols-4 lg:px-12">
        {ITEMS.map(({ icon: Icon, title, detail }) => (
          <div key={title} className="reveal flex items-center gap-4">
            <Icon
              className="h-5 w-5 shrink-0 text-ink"
              strokeWidth={1.25}
              aria-hidden={true}
            />
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink">
                {title}
              </span>
              <span className="text-[12px] text-ink-muted">{detail}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
