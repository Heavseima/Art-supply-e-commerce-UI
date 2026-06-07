import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";

import "./globals.css";
import { ElegantNavbar } from "@/components/modules/ElegantNavbar";
import { SiteFooter } from "@/components/modules/SiteFooter";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cached reads (see @/utils/products) — categories and catalog for the
  // global chrome. These resolve from the static shell on most navigations.
  const [categories, catalog] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink antialiased">
        <ElegantNavbar categories={categories} catalog={catalog} />
        <main className="flex-1">{children}</main>
        <SiteFooter categories={categories} />
      </body>
    </html>
  );
}
