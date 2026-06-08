import { Suspense } from "react";
import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";

import "./globals.css";
import { ElegantNavbar } from "@/components/modules/ElegantNavbar";
import { SiteFooter } from "@/components/modules/SiteFooter";
import type { Category, Product } from "@/types/api";
import { getCategories, getProducts } from "@/utils/products";

// Sophisticated editorial serif for display + a razor-sharp geometric sans for UI.
const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Atelier — Fine Art Supply",
    template: "%s · Atelier",
  },
  description:
    "A considered house of pigments, papers, and tools for the studio. Curated art supplies for those who take making seriously.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The root layout stays synchronous so the static shell (and every page's
  // own content) streams instantly on navigation. The data-dependent chrome —
  // navbar + footer — fetches inside its own Suspense boundary below, rather
  // than blocking the whole app on a request-time read.
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink antialiased">
        {/* Fallback is the same navbar with empty data: fully interactive
            (logo, search, cart, base nav links) with zero layout shift while
            the categories/catalog stream in. */}
        <Suspense fallback={<ElegantNavbar categories={[]} catalog={[]} />}>
          <NavbarChrome />
        </Suspense>

        <main className="flex-1">{children}</main>

        <Suspense fallback={<SiteFooter categories={[]} />}>
          <FooterChrome />
        </Suspense>
      </body>
    </html>
  );
}

/**
 * Navbar with its data. Reads the cached catalog + categories (see
 * @/utils/products). Kept resilient: if the backend is unreachable the chrome
 * still renders (empty) and the failing page surfaces its own error boundary
 * (src/app/error.tsx), rather than the whole app white-screening.
 */
async function NavbarChrome() {
  let categories: readonly Category[] = [];
  let catalog: readonly Product[] = [];
  try {
    [categories, catalog] = await Promise.all([getCategories(), getProducts()]);
  } catch (error) {
    console.error("Failed to load navbar chrome data:", error);
  }
  return <ElegantNavbar categories={categories} catalog={catalog} />;
}

/** Footer with its data — only the category collection links need a read. */
async function FooterChrome() {
  let categories: readonly Category[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to load footer chrome data:", error);
  }
  return <SiteFooter categories={categories} />;
}
