"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, X } from "lucide-react";

import type { Category, Product } from "@/types/api";
import { Logo } from "@/components/ui/Logo";
import { PromoBar } from "@/components/ui/PromoBar";
import { CartDrawer } from "@/components/modules/CartDrawer";
import { NavFallback, PrimaryNav } from "@/components/modules/PrimaryNav";
import { useCart } from "@/hooks/useCart";

interface ElegantNavbarProps {
  categories: readonly Category[];
  catalog: readonly Product[];
}

/**
 * Editorial boutique navigation: logo / centered nav / icons. Search lives
 * behind an icon and reveals a clean full-width field with a smooth height
 * transition. This client shell owns the cart-drawer + search state and the
 * live item count.
 */
export function ElegantNavbar({ categories, catalog }: ElegantNavbarProps) {
  const router = useRouter();
  const { count, isReady } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Move focus into the field once it has revealed.
  useEffect(() => {
    if (searchOpen) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 180);
      return () => window.clearTimeout(id);
    }
  }, [searchOpen]);

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    setSearchOpen(false);
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
  };

  return (
    <>
      <PromoBar />

      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-5 lg:px-12">
          {/* Left — logo */}
          <div className="justify-self-start">
            <Logo />
          </div>

          {/* Center — primary nav (active item underlined). Suspense lets the
              static shell prerender the plain list while the active state
              hydrates from the URL on the client. */}
          <Suspense fallback={<NavFallback />}>
            <PrimaryNav categories={categories} />
          </Suspense>

          {/* Right — utilities */}
          <div className="flex items-center gap-6 justify-self-end">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
              className="relative h-5 w-5 cursor-pointer text-ink transition-colors duration-300 hover:text-accent"
            >
              <Search
                className={[
                  "absolute inset-0 transition-all duration-300 ease-in-out",
                  searchOpen ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100",
                ].join(" ")}
                strokeWidth={1.5}
                aria-hidden={true}
              />
              <X
                className={[
                  "absolute inset-0 transition-all duration-300 ease-in-out",
                  searchOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
                ].join(" ")}
                strokeWidth={1.5}
                aria-hidden={true}
              />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="group relative inline-flex cursor-pointer items-center text-ink transition-colors duration-300 hover:text-accent"
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <ShoppingBag
                className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
                aria-hidden={true}
              />
              {isReady && count > 0 ? (
                <span className="absolute -right-2.5 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-canvas tabular-nums">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {/* Search reveal — smooth grid-rows height transition (always mounted). */}
        <div
          className={[
            "grid overflow-hidden transition-all duration-300 ease-in-out",
            searchOpen
              ? "grid-rows-[1fr] border-t border-hairline opacity-100"
              : "grid-rows-[0fr] border-t border-transparent opacity-0",
          ].join(" ")}
        >
          <div className="min-h-0 overflow-hidden">
            <form
              onSubmit={onSearch}
              role="search"
              className="mx-auto flex max-w-[1600px] items-center gap-4 px-6 py-4 lg:px-12"
            >
              <Search
                className="h-4 w-4 shrink-0 text-ink-muted"
                strokeWidth={1.5}
                aria-hidden={true}
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the catalogue…"
                aria-label="Search the catalogue"
                tabIndex={searchOpen ? 0 : -1}
                className="w-full bg-transparent text-base font-light text-ink placeholder:text-ink-muted focus:outline-none"
              />
              <button
                type="submit"
                tabIndex={searchOpen ? 0 : -1}
                className="cursor-pointer text-[11px] uppercase tracking-[0.24em] text-ink-muted transition-colors duration-300 hover:text-ink"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        catalog={catalog}
      />
    </>
  );
}
