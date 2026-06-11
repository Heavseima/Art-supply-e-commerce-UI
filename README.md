# Premium Art Supplies — Storefront

A Next.js (App Router) boutique storefront for premium art supplies. It runs in
**two data states** controlled by a single environment variable, so you can demo
and develop the whole site with **no backend at all**, then flip to a **live API**
when one is available.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other commands:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

---

## The two data states

Everything is decided in one place — `src/utils/apiClient.ts` — from the
`NEXT_PUBLIC_API_URL` environment variable. The data engines
(`src/utils/products.ts`, `src/utils/orders.ts`) branch on it at runtime, so
switching states is **a one-line env change and a restart — no code edits**.

| | **State A — Static (mock data)** | **State B — Live (fetched data)** |
|---|---|---|
| **When** | `NEXT_PUBLIC_API_URL` is **unset**, empty, or `none` | `NEXT_PUBLIC_API_URL` is a valid absolute URL |
| **Data source** | Canned real-brand catalog in `src/utils/staticData.ts` | Real `fetch(...)` calls to your backend |
| **Network** | None — nothing is contacted | Server-to-server fetch to the API origin |
| **Use it for** | Demos, UI work, offline dev, when the backend is down/none | Connecting to the real API |

In **State A**, the live `fetch(...)` code is **not deleted** — it stays in the
files, fenced with `----- LIVE FETCH ... END LIVE FETCH -----` comments, and is
simply skipped at runtime. Setting the env var re-activates it automatically.

---

## Previewing the empty state — `?data=none`

Independently of the env var above, you can preview what the site looks like
**when there is no data** — as if a live fetch came back empty — just by adding a
query flag to the URL. No restart, no config. **The mode sticks as you navigate**
— set it once and every page you visit afterwards stays empty until you reset it.

| Open this | You get |
|---|---|
| [`localhost:3000`](http://localhost:3000) | Normal data — the full static catalog renders |
| [`localhost:3000/?data=none`](http://localhost:3000/?data=none) | Empty state — no products, no categories; every grid shows its "nothing here" message. **Remembered for the pages you open next.** |
| [`localhost:3000/?data=default`](http://localhost:3000/?data=default) | Resets — back to the normal static catalog (also `?data=`) |

So after opening `/?data=none`, clicking into a product, the catalog, the cart —
all stay empty. To come back, open any URL with `?data=default` (or `?data=`).

**How it works:** `src/proxy.ts` reads the `?data` query value, forwards it as a
request header, **and persists it to a `data-mode` cookie** so requests that
carry no `?data` (every link you click) inherit the last mode. The data engines
check it via `isEmptyDataRequested()` in `src/utils/apiClient.ts` and return
empty results — so the empty state flows through the whole site at once,
including the navbar and footer (which never receive `searchParams` directly).
Each data read is a dynamic hole inside its Suspense boundary, so the static
shell still renders instantly.

> This is a **demo toggle** — it does not change the env state. `?data=none`
> turns it on (and is remembered); `?data=default` turns it off.

---

### State A — Run with **no data / mock data** (default)

This is the default, and it needs **no configuration at all**. There's no `.env`
to create — when `NEXT_PUBLIC_API_URL` is not set, the storefront serves static
mock data. Use it when there is **no API**, when the **fetch would fail**, or
when you just want the site to work standalone.

1. Just start the app — that's it:

   ```bash
   npm run dev
   ```

2. Confirm the state. In dev you'll see this in the terminal/console on load:

   ```
   [apiClient] STATIC data — no NEXT_PUBLIC_API_URL configured (serving @/utils/staticData).
   ```

> The env var is **only** used to turn live mode *on* (State B). For static data
> there is nothing to set — unset, empty, and `none` all mean the same thing.
> (`.env.example` exists purely to document the live-mode toggle.)

The storefront now renders the full catalog (products, categories, featured
collection) from `src/utils/staticData.ts` — a realistic set of recognisable
art supplies (Prismacolor, Faber-Castell, Winsor & Newton, Copic, Strathmore,
Moleskine, and more) with prices, stock, and matched product photography. And
**checkout completes end-to-end** — orders are confirmed locally via
`buildStaticOrder(...)` with no backend.

**To change the mock data**, edit `src/utils/staticData.ts`
(`STATIC_PRODUCTS`, `STATIC_CATEGORIES`, and the `IMG` image map).

---

### State B — Run with a **live API (fetched data)**

Use this when a backend is available and you want the site to read real data.

1. Point `.env` at your backend origin (including any version prefix):

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   ```

2. Restart the dev server — **this is required**. `NEXT_PUBLIC_*` values are
   inlined at build time, so changing `.env` while the server is running has no
   effect until you restart (and clear `.next` if a stale value persists):

   ```bash
   npm run dev
   ```

3. Confirm the state. In dev you'll see:

   ```
   [apiClient] LIVE data — API_BASE = http://localhost:8080/api/v1
   ```

The data engines now fetch from your backend:

- `GET /products`, `GET /categories`, `GET /products?categoryId=...`
- `POST /orders` at checkout

**If a live fetch fails** (backend down, non-2xx, or unreachable during build),
the engines log a warning and fall back to safe empty/sample values rather than
crashing the build — see `getJson(...)` in `src/utils/products.ts`. A failed
order surfaces a clean error message to the shopper instead of throwing.

> Note: "fetch fails" is **not** the same as State A. State A means *no API is
> configured at all* (serve mock data). State B with a failing fetch means *an
> API is configured but unreachable* (warn + empty/sample fallback). To get the
> full mock catalog back, return to State A by setting `NEXT_PUBLIC_API_URL=none`.

---

## Switching between states (quick reference)

| Goal | Set in `.env` | Then |
|---|---|---|
| Mock data / no backend | *nothing* (leave `NEXT_PUBLIC_API_URL` unset) | just run `npm run dev` |
| Live backend | `NEXT_PUBLIC_API_URL=https://your-api/...` | restart dev server |

No source changes are needed either way — the runtime branch in
`src/utils/apiClient.ts` handles it.

---

## Project structure

```text
src/
├── app/            # App Router: layout, landing, products, cart, checkout
├── components/
│   ├── ui/         # Atomic reusable building blocks
│   └── modules/    # Structural UI (navbar, cart drawer, ...)
├── hooks/          # Client-side controllers (e.g. useCart)
├── types/          # TypeScript DTOs (api.ts)
└── utils/
    ├── apiClient.ts    # ← the two-state switch (NEXT_PUBLIC_API_URL)
    ├── products.ts     # Catalog engines (static OR live fetch)
    ├── orders.ts       # Order placement (static OR live POST)
    └── staticData.ts   # Real-brand art-supplies catalog used in State A
```
