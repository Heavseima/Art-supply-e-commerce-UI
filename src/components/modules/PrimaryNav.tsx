"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import type { Category } from "@/types/api";

const TOP =
  "link-underline text-[11px] uppercase tracking-[0.24em] transition-colors duration-300";

function topClass(active: boolean): string {
  return [TOP, active ? "is-active text-ink" : "text-ink-muted hover:text-ink"].join(
    " ",
  );
}

/**
 * Static fallback rendered inside the navbar's Suspense boundary while the
 * search-param-aware {@link PrimaryNav} hydrates. Real links so navigation
 * works before JS; the dropdown + active states enhance on hydration.
 */
export function NavFallback() {
  const items: ReadonlyArray<[string, string]> = [
    ["Home", "/"],
    ["Products", "/products"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];
  return (
    <nav className="hidden items-center gap-9 md:flex">
      {items.map(([label, href]) => (
        <Link key={href} href={href} className={topClass(false)}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Live primary nav: Home / Products (with a category mega-dropdown) / About /
 * Contact. Active state tracks the path and the active `?category=`. The
 * dropdown opens on hover and keyboard focus via pure CSS (group-hover /
 * group-focus-within) — no extra client state. Must render inside a Suspense
 * boundary (reads `useSearchParams`).
 */
export function PrimaryNav({ categories }: { categories: readonly Category[] }) {
  const pathname = usePathname();
  const activeCat = useSearchParams().get("category");
  const onProducts = pathname.startsWith("/products");
  const [open, setOpen] = useState(false);

  // Close the dropdown whenever the route or active category changes
  // (i.e. after a navigation completes).
  useEffect(() => {
    setOpen(false);
  }, [pathname, activeCat]);

  const close = () => setOpen(false);

  return (
    <nav className="hidden items-center gap-9 md:flex">
      <Link href="/" className={topClass(pathname === "/")}>
        Home
      </Link>

      {/* Products + category dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <Link
          href="/products"
          aria-haspopup="true"
          aria-expanded={open}
          onClick={close}
          onFocus={() => setOpen(true)}
          className={[topClass(onProducts), "inline-flex items-center gap-1.5"].join(
            " ",
          )}
        >
          Products
          <ChevronDown
            className={[
              "h-3 w-3 transition-transform duration-300",
              open ? "rotate-180" : "",
            ].join(" ")}
            strokeWidth={1.75}
            aria-hidden={true}
          />
        </Link>

        <div
          className={[
            "absolute left-1/2 top-full z-50 w-[360px] -translate-x-1/2 pt-4 transition-all duration-300 ease-out",
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible translate-y-1 opacity-0",
          ].join(" ")}
        >
          <div className="border border-hairline bg-canvas p-2 shadow-[0_24px_60px_-24px_rgba(28,26,24,0.45)]">
            <Link
              href="/products"
              onClick={close}
              className={[
                "flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-canvas-deep",
                onProducts && !activeCat ? "bg-canvas-deep" : "",
              ].join(" ")}
            >
              <span className="font-display text-base font-medium text-ink">
                All products
              </span>
              <span className="text-[12px] text-ink-muted">
                The complete catalogue
              </span>
            </Link>
            <div className="my-1 h-px bg-hairline" />
            {categories.map((category) => {
              const active = onProducts && activeCat === category.slug;
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  onClick={close}
                  className={[
                    "flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-canvas-deep",
                    active ? "bg-canvas-deep" : "",
                  ].join(" ")}
                >
                  <span className="font-display text-base font-medium text-ink">
                    {category.name}
                  </span>
                  <span className="text-[12px] leading-snug text-ink-muted">
                    {category.tagline}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Link href="/about" className={topClass(pathname === "/about")}>
        About
      </Link>
      <Link href="/contact" className={topClass(pathname === "/contact")}>
        Contact
      </Link>
    </nav>
  );
}
