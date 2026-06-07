# CLAUDE.md - Premium Art Supplies Front (VS Code)

## 🛠️ Build & Development Commands
- **Install Dependencies:** `npm install` (Always run auditing checks first)
- **Start Dev Server:** `npm run dev` (Local development environment on port 3000)
- **Production Compilation:** `npm run build`
- **Linting Check:** `npm run lint`

## 📁 Repository Directory Structure
```text
├── src/
│   ├── app/                    # Next.js App Router Core
│   │   ├── layout.tsx          # Breathtaking global canvas design wrapper
│   │   ├── page.tsx            # High-end boutique hero showcase landing
│   │   ├── products/           # /products/[slug] - Detail & Filter Grid
│   │   ├── cart/               # LocalStorage managed cart overview
│   │   └── checkout/           # Minimal shipping ingestion checkout desk
│   ├── components/
│   │   ├── ui/                 # Atomic, un-nested reusable visual building blocks
│   │   └── modules/            # Structural UI (e.g., ElegantNavbar, CartDrawer)
│   ├── hooks/                  # Client-side custom data controllers (e.g., useCart)
│   ├── types/                  # Strict TypeScript bindings matching Backend DTOs
│   └── utils/                  # Optimized data-fetching fetch engines
