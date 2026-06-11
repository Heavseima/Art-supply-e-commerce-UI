/**
 * Static catalog fallback for the "no data source configured" state.
 *
 * This is the default working dataset for the storefront when no backend is
 * wired up (see {@link isLiveDataConfigured} in `@/utils/apiClient`). It is a
 * realistic catalog of recognisable, real-world art supplies — Prismacolor,
 * Faber-Castell, Winsor & Newton, Strathmore, Copic, and friends — typed
 * strictly against the app's `Product` / `Category` DTOs, so every data engine
 * can fall back to it without the rest of the app knowing whether the data came
 * from the network or here.
 *
 * Kept in its own isolated module (one responsibility: the canned dataset) so
 * the live `@/utils/products` engines stay thin and the mock is trivial to
 * edit, extend, or delete when the real backend comes online.
 */

import type {
  Category,
  OrderConfirmation,
  PlaceOrderInput,
  Product,
} from "@/types/api";

/**
 * Product imagery. Each URL was checked to return a real, on-topic photo for
 * the product it backs (mix of Unsplash + Pexels editorial stock).
 * `next.config.ts` allows any https host, so these load through `next/image`
 * with no extra config. They're representative product photography matched to
 * each item's type — swap any for an exact manufacturer shot when you have one.
 */
const IMG = {
  /** Open sketchbook with a pencil on a clean desk. */
  sketchbook:
    "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?auto=format&fit=crop&w=900&q=80",
  /** A single sharpened pencil, minimal. */
  pencil:
    "https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=900",
  /** A row of sharpened coloured-pencil tips. */
  colouredPencils:
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=900&q=80",
  /** Soft pastel-toned coloured pencils fanned on paper. */
  pastelPencils:
    "https://images.unsplash.com/photo-1568205612837-017257d2310a?auto=format&fit=crop&w=900&q=80",
  /** Designer's desk with brush-tip markers and colour swatches. */
  markers:
    "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=900&q=80",
  /** Colourful brush/marker pens with a watercolour set. */
  brushPens:
    "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=80",
  /** Lined journal with a fountain pen — fine-line writing. */
  finelinePen:
    "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
  /** Brushes loading vivid wet colour over paper. */
  watercolour:
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
  /** A loaded paint palette with a brush. */
  acrylic:
    "https://images.unsplash.com/photo-1452802447250-470a88ac82bc?auto=format&fit=crop&w=900&q=80",
  /** Paint-laden artist brushes in colour. */
  brushes:
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80",
  /** A worked oil palette with a brush mixing colour. */
  oils:
    "https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=900",
  /** Stacked spiral pads / sketch paper on white. */
  paperPad:
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",
} as const;

/** Static merchandising categories. */
export const STATIC_CATEGORIES: readonly Category[] = [
  {
    id: "cat-drawing",
    slug: "drawing",
    name: "Drawing & Graphite",
    tagline: "Graphite, sketchbooks, and the quiet tools of the considered line.",
  },
  {
    id: "cat-colour",
    slug: "colour",
    name: "Coloured Pencils & Markers",
    tagline: "Lightfast pencils, alcohol markers, and brush pens with real punch.",
  },
  {
    id: "cat-paint",
    slug: "paint",
    name: "Paint & Brushes",
    tagline: "Watercolour, acrylic, and the brushes that carry the colour.",
  },
  {
    id: "cat-paper",
    slug: "paper",
    name: "Paper & Surfaces",
    tagline: "Bristol, mixed-media, and blocks milled to take a beating.",
  },
] as const;

/** Static catalog of real-world art supplies, mapped onto {@link STATIC_CATEGORIES}. */
export const STATIC_PRODUCTS: readonly Product[] = [
  // ── Drawing & Graphite ───────────────────────────────────────────────────
  {
    id: "prod-staedtler-lumograph-12",
    categoryId: "cat-drawing",
    slug: "staedtler-mars-lumograph-12",
    name: "Staedtler Mars Lumograph Graphite Pencils · Set of 12",
    description:
      "The studio standard. Twelve break-resistant degrees from 6H to 8B, with a bonded, super-smooth lead that holds a point and grades cleanly from silvery technical lines to velvet shadow. Tin set.",
    price: 13.5,
    stock: 64,
    imageUrl: IMG.pencil,
  },
  {
    id: "prod-moleskine-art-sketchbook-a4",
    categoryId: "cat-drawing",
    slug: "moleskine-art-sketchbook-a4",
    name: "Moleskine Art Sketchbook · A4, Plain",
    description:
      "Hard-bound in the classic black cover with 96 pages of heavyweight 165gsm acid-free paper that takes pencil, ink, and light wash without ghosting. Rounded corners, elastic closure, and a ribbon marker.",
    price: 24.95,
    stock: 28,
    imageUrl: IMG.sketchbook,
  },

  // ── Coloured Pencils & Markers ───────────────────────────────────────────
  {
    id: "prod-prismacolor-premier-72",
    categoryId: "cat-colour",
    slug: "prismacolor-premier-soft-core-72",
    name: "Prismacolor Premier Soft Core Coloured Pencils · Set of 72",
    description:
      "Thick, soft pigment cores that lay down rich, buttery colour and blend, burnish, and layer like no other. Seventy-two lightfast hues for portraits, illustration, and saturated studio work.",
    price: 52.0,
    stock: 37,
    imageUrl: IMG.colouredPencils,
  },
  {
    id: "prod-faber-polychromos-36",
    categoryId: "cat-colour",
    slug: "faber-castell-polychromos-36",
    name: "Faber-Castell Polychromos Artist Pencils · Set of 36",
    description:
      "Oil-based, break-resistant leads with exceptional lightfastness and a clean, smudge-proof finish. Thirty-six artist-grade colours that layer crisply and never go waxy. Tin set.",
    price: 89.99,
    stock: 19,
    imageUrl: IMG.pastelPencils,
  },
  {
    id: "prod-copic-sketch-12",
    categoryId: "cat-colour",
    slug: "copic-sketch-marker-set-12",
    name: "Copic Sketch Alcohol Markers · Set of 12",
    description:
      "The illustrator's favourite. Refillable, double-ended markers with a flexible Super Brush nib and a broad chisel, ground for flawless alcohol-ink blending and 358 swappable colours across the system.",
    price: 84.99,
    stock: 12,
    imageUrl: IMG.markers,
  },
  {
    id: "prod-tombow-dual-brush-10",
    categoryId: "cat-colour",
    slug: "tombow-dual-brush-pen-set-10",
    name: "Tombow Dual Brush Pens · Pastel Set of 10",
    description:
      "Water-based dual-tip pens — a flexible brush end for lettering and a fine bullet for detail. Blendable, odourless inks in ten soft pastel tones for hand-lettering, journaling, and illustration.",
    price: 22.99,
    stock: 45,
    imageUrl: IMG.brushPens,
  },
  {
    id: "prod-sakura-micron-6",
    categoryId: "cat-colour",
    slug: "sakura-pigma-micron-set-6",
    name: "Sakura Pigma Micron Fineliners · Set of 6",
    description:
      "Archival, waterproof, fade-proof pigment ink in six nib sizes from 005 to 08. The line-art and inking benchmark — feathers nothing, bleeds nothing, and won't smear under marker or wash.",
    price: 14.99,
    stock: 73,
    imageUrl: IMG.finelinePen,
  },

  // ── Paint & Brushes ──────────────────────────────────────────────────────
  {
    id: "prod-wn-cotman-12",
    categoryId: "cat-paint",
    slug: "winsor-newton-cotman-watercolour-12",
    name: "Winsor & Newton Cotman Watercolour · 12 Half-Pan Set",
    description:
      "A pocket tin of twelve dependable, re-wettable half-pans with good transparency and lift. The trusted student-to-studio watercolour for plein-air and sketchbook work, with a built-in mixing palette.",
    price: 29.99,
    stock: 33,
    imageUrl: IMG.watercolour,
  },
  {
    id: "prod-golden-heavy-body-10",
    categoryId: "cat-paint",
    slug: "golden-heavy-body-acrylic-set-10",
    name: "Golden Heavy Body Acrylics · Introductory Set of 10",
    description:
      "Thick, buttery, professional-grade acrylics that hold a crisp brush- or knife-stroke and dry to a flexible, archival film. Ten high-pigment 22ml tubes covering a full mixing wheel.",
    price: 54.99,
    stock: 16,
    imageUrl: IMG.acrylic,
  },
  {
    id: "prod-wn-series7-no6",
    categoryId: "cat-paint",
    slug: "winsor-newton-series-7-no-6",
    name: "Winsor & Newton Series 7 Kolinsky Sable Round · No. 6",
    description:
      "Hand-made from the finest Kolinsky sable, with a flawless point and a spring that snaps back wash after wash. Seamless nickel ferrule on a polished birch handle — the round brush by which others are judged.",
    price: 32.5,
    stock: 21,
    imageUrl: IMG.brushes,
  },
  {
    id: "prod-liquitex-basics-12",
    categoryId: "cat-paint",
    slug: "liquitex-basics-acrylic-set-12",
    name: "Liquitex BASICS Acrylic Paint · Set of 12",
    description:
      "Smooth, intermixable student acrylics with a satin finish and surprising pigment load for the price. Twelve 22ml tubes — a complete, dependable starter palette. Currently between shipments.",
    price: 26.99,
    stock: 0,
    imageUrl: IMG.oils,
  },

  // ── Paper & Surfaces ─────────────────────────────────────────────────────
  {
    id: "prod-strathmore-300-bristol",
    categoryId: "cat-paper",
    slug: "strathmore-300-bristol-pad-9x12",
    name: "Strathmore 300 Series Bristol Pad · Smooth, 9 × 12in",
    description:
      "Twenty sheets of heavyweight, two-ply smooth Bristol with a hard, plate-like surface built for ink, marker, and detailed pen work. Crisp lines, no feathering, clean erasing. Tape-bound pad.",
    price: 11.49,
    stock: 52,
    imageUrl: IMG.paperPad,
  },
  {
    id: "prod-canson-xl-mixed-media",
    categoryId: "cat-paper",
    slug: "canson-xl-mixed-media-pad-9x12",
    name: "Canson XL Mixed Media Pad · 9 × 12in, 60 Sheets",
    description:
      "Sixty sheets of 160gsm heavyweight paper with a fine texture that takes graphite, ink, marker, and light watercolour alike. Micro-perforated and fold-over bound — the everyday workhorse pad.",
    price: 10.99,
    stock: 60,
    imageUrl: IMG.paperPad,
  },
] as const;

/**
 * Build a confirmed order from a placed-order payload — the static-state
 * equivalent of the backend `POST /orders` response. Totals the catalog prices
 * for the submitted line items so the confirmation screen shows a real figure.
 */
export function buildStaticOrder(input: PlaceOrderInput): OrderConfirmation {
  const priceOf = (productId: string): number =>
    STATIC_PRODUCTS.find((p) => p.id === productId)?.price ?? 0;

  const total = input.items.reduce(
    (sum, item) => sum + priceOf(item.productId) * item.quantity,
    0,
  );

  // Short, human-readable pseudo-reference (e.g. "ATL-7F3C9A").
  const reference = `ATL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  return {
    orderReference: reference,
    total,
    placedAt: new Date().toISOString(),
    customerEmail: input.customerEmail,
  };
}
