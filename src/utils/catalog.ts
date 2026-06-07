import type { Category, Product } from "@/types/api";

/**
 * Local seed catalog standing in for the backend.
 *
 * In production the engines in `@/utils/products` would `fetch` these from an
 * API; keeping the seed isolated here means swapping in a real endpoint only
 * touches that one file. Treated as read-only.
 */

export const CATEGORIES: readonly Category[] = [
  {
    id: "cat-paint",
    slug: "paint",
    name: "Paint",
    tagline: "Pigments with depth, body, and permanence.",
  },
  {
    id: "cat-brushes",
    slug: "brushes",
    name: "Brushes",
    tagline: "Hand-finished bristles for every gesture.",
  },
  {
    id: "cat-paper",
    slug: "paper",
    name: "Paper & Surfaces",
    tagline: "Cold-pressed grounds that hold their tone.",
  },
  {
    id: "cat-drawing",
    slug: "drawing",
    name: "Drawing",
    tagline: "Graphite, ink, and charcoal of rare clarity.",
  },
] as const;

export const PRODUCTS: readonly Product[] = [
  {
    id: "p-001",
    categoryId: "cat-paint",
    slug: "cobalt-oil-paint",
    name: "Cobalt Blue Oil Paint",
    description:
      "A single-pigment cobalt blue milled in cold-pressed linseed oil. Buttery, slow-drying, and luminous — it lays down with a satin sheen and holds crisp impasto edges. A studio cornerstone for skies, shadow, and quiet distance.",
    price: 38,
    stock: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-002",
    categoryId: "cat-paint",
    slug: "titanium-white-acrylic",
    name: "Titanium White Acrylic",
    description:
      "Maximum opacity, clean tinting strength, and a velvet matte finish. This heavy-body acrylic retains brushwork and knife texture, then dries to a flexible, archival film that resists yellowing for a lifetime.",
    price: 22,
    stock: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-003",
    categoryId: "cat-brushes",
    slug: "kolinsky-round-brush",
    name: "Kolinsky Sable Round, No. 6",
    description:
      "The benchmark watercolor round. A flawless point, a generous belly, and an instant snap-back that lets a single stroke move from a hairline to a flooded wash. Seamless nickel ferrule, lacquered birch handle.",
    price: 64,
    stock: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-004",
    categoryId: "cat-brushes",
    slug: "hog-bristle-filbert-set",
    name: "Hog Bristle Filbert Set",
    description:
      "Five interlocked hog-bristle filberts for oil and heavy acrylic. The natural flag holds more paint and feathers blends without hard edges. Sizes 2 through 12 in a roll-up canvas keep.",
    price: 49,
    stock: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1499892477393-f675706cbfac?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-005",
    categoryId: "cat-paper",
    slug: "cold-press-watercolor-block",
    name: "Cold-Press Watercolor Block",
    description:
      "Twenty sheets of 300gsm, 100% cotton, acid-free paper, gummed on four sides so it stays dead flat through the heaviest wash. A toothy cold-press surface that lifts cleanly and granulates beautifully.",
    price: 34,
    stock: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-006",
    categoryId: "cat-paper",
    slug: "toned-grey-sketchbook",
    name: "Toned Grey Sketchbook",
    description:
      "A mid-grey ground that does half the work for you — let the paper carry the midtones while you push light and shadow. 120gsm, lightly textured, lay-flat binding in a linen hardcover.",
    price: 19,
    stock: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-007",
    categoryId: "cat-drawing",
    slug: "graphite-pencil-set",
    name: "Graphite Pencil Set, 12 Grades",
    description:
      "From a whisper-soft 6B to a crisp 4H, twelve cedar-cased graphite pencils with a smooth, break-resistant core. Cleanly machined and pre-sharpened, ready for everything from gesture to rendering.",
    price: 28,
    stock: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-008",
    categoryId: "cat-drawing",
    slug: "india-ink-bottle",
    name: "Carbon India Ink",
    description:
      "A dense, lightfast carbon-black ink that flows without feathering and dries to a deep, waterproof matte. Equally at home in a dip pen, a brush, or a ruling line. 30ml in a weighted glass bottle.",
    price: 16,
    stock: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-009",
    categoryId: "cat-paint",
    slug: "gouache-primary-set",
    name: "Designer Gouache, Primary Set",
    description:
      "Six tubes of opaque, re-wettable gouache with a chalk-matte finish and astonishing flatness. Mixes a full spectrum from three primaries plus white and black. The illustrator's quiet workhorse.",
    price: 42,
    stock: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-010",
    categoryId: "cat-brushes",
    slug: "fan-blending-brush",
    name: "Synthetic Fan Blender",
    description:
      "A soft synthetic fan for feathering skies, foliage, and hair into silk-smooth transitions. Holds its splay, springs back clean, and rinses in seconds. The finishing brush that disappears into the work.",
    price: 21,
    stock: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-011",
    categoryId: "cat-paper",
    slug: "bristol-vellum-pad",
    name: "Bristol Vellum Pad",
    description:
      "Heavyweight, brilliant-white Bristol with a faint vellum tooth built for ink, marker, and detailed graphite. Two-ply stiffness takes repeated erasing without pilling. 25 sheets, tape-bound.",
    price: 24,
    stock: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1568871391149-d627c2bcef9b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "p-012",
    categoryId: "cat-drawing",
    slug: "vine-charcoal-bundle",
    name: "Soft Vine Charcoal Bundle",
    description:
      "Naturally carbonized willow that glides on with a velvet bite and lifts away with a single pass of a cloth. The fastest way to block masses, find the gesture, and stay loose. A dozen assorted sticks.",
    price: 12,
    stock: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1602738328654-51ab2ae6c4ff?auto=format&fit=crop&w=1200&q=80",
  },
] as const;
