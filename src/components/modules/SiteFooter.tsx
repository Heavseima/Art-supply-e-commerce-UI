import Link from "next/link";

import type { Category } from "@/types/api";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

interface SiteFooterProps {
  categories: readonly Category[];
}

/** Editorial footer. Pure server component. */
export function SiteFooter({ categories }: SiteFooterProps) {
  return (
    <footer className="mt-32 border-t border-hairline">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
            A considered house of pigments, papers, and tools for the studio.
            Curated for those who take making seriously.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-[0.24em] text-ink">
            Collections
          </span>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="w-fit text-sm text-ink-muted transition-colors duration-300 hover:text-accent"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-[0.24em] text-ink">
            The House
          </span>
          {(
            [
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Studio Journal", "#"],
              ["Stockists", "#"],
            ] as const
          ).map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="w-fit text-sm text-ink-muted transition-colors duration-300 hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-[0.24em] text-ink">
            Atelier Letters
          </span>
          <p className="text-sm text-ink-muted">
            Quiet dispatches on material, craft, and new arrivals.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-6 py-6 text-[11px] uppercase tracking-[0.18em] text-ink-muted sm:flex-row lg:px-12">
          <span>&copy; 2026 Atelier Fine Art Supply</span>
          <span>Made with deliberate care</span>
        </div>
      </div>
    </footer>
  );
}
