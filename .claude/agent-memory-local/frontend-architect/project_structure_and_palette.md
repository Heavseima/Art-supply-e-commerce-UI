---
name: sample-demo-structure-palette
description: sample-demo art-supplies store directory conventions, color palette, and aesthetic rules
metadata:
  type: project
---

Art Supplies luxury e-commerce store. CLAUDE.md-mandated directory layout under `src/`:
- `app/` App Router: `layout.tsx` (global canvas wrapper), `page.tsx` (boutique hero landing), `products/` (`[slug]` detail + filter grid), `cart/` (LocalStorage cart), `checkout/` (minimal shipping).
- `components/ui/` — atomic, un-nested reusable visual building blocks.
- `components/modules/` — structural UI (ElegantNavbar, CartDrawer).
- `hooks/` — client-side custom data controllers (useCart).
- `types/` — strict TS bindings matching backend DTOs.
- `utils/` — optimized data-fetching fetch engines.

**Color palette:** Canvas Cream background `#FAF9F6`, Ink Charcoal typography `#1C1A1A`, razor-thin borders, wide layouts, editorial typography, luxury art boutique aesthetic.

**DTO shape (types/api.ts):** id, categoryId, slug, description, price, stock, imageUrl.

**Hard rule:** No explicit `any`. Atomic reusability separation enforced — isolate anything reusable into ui/ or modules/ immediately. Dependency install requires explicit user approval (Dependency Approval Loop). See [[nextjs-version-behaviors]].
