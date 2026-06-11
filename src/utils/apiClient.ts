/**
 * Single source of truth for the backend base URL and URL construction.
 *
 * Isolated here so every data engine and server action resolves the API origin
 * the same way, and a change of host/version only touches this file. The URL
 * comes from `NEXT_PUBLIC_API_URL` (see `.env`).
 *
 * The storefront runs in one of two states, decided here once:
 *
 *  - STATE A — Static (default right now): `NEXT_PUBLIC_API_URL` is unset,
 *    empty, or the literal `none`. No backend is contacted; the data engines
 *    serve the canned catalog from `@/utils/staticData`.
 *  - STATE B — Live: `NEXT_PUBLIC_API_URL` is a valid absolute URL. The engines
 *    use their real `fetch(...)` paths against that origin.
 *
 * Flipping back to live data is therefore a one-line env change — set
 * `NEXT_PUBLIC_API_URL` to your backend origin and restart the dev server.
 */

/** Raw env value, trimmed. `undefined`/empty/`none` all mean "no data source". */
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";

/**
 * Whether a live data source is configured (STATE B). `none` (any case) and the
 * empty string are explicit "use static data" signals; anything else must be a
 * well-formed absolute URL to count as live.
 */
export const isLiveDataConfigured: boolean = (() => {
  if (RAW_API_URL === "" || RAW_API_URL.toLowerCase() === "none") {
    return false;
  }
  try {
    new URL(RAW_API_URL);
    return true;
  } catch {
    return false;
  }
})();

/**
 * Backend API origin + version prefix when live (STATE B), e.g.
 * `http://localhost:8080/api/v1`. Empty string in the static state — never read
 * by the engines in that case, since they branch on {@link isLiveDataConfigured}
 * before constructing any URL.
 */
export const API_BASE = isLiveDataConfigured ? RAW_API_URL : "";

/**
 * Resolved-state log (dev only).
 *
 * `NEXT_PUBLIC_API_URL` is inlined at build time, so a stale `.next` cache (or a
 * `.env` edited after the dev server started) can leave an outdated value baked
 * into the bundle while the source/env look correct. This runs once at module
 * load to surface the *actually resolved* state, turning a silent
 * static/live mismatch into an obvious console signal.
 */
if (process.env.NODE_ENV !== "production") {
  if (isLiveDataConfigured) {
    console.info(`[apiClient] LIVE data — API_BASE = ${API_BASE}`);
  } else {
    console.info(
      "[apiClient] STATIC data — no NEXT_PUBLIC_API_URL configured " +
        "(serving @/utils/staticData). Set NEXT_PUBLIC_API_URL to go live.",
    );
  }
}

/** Build an absolute backend URL from a leading-slash path like `/products`. */
export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

/**
 * Per-request demo override: `?data=none` forces the empty-data state, as if a
 * live fetch returned nothing — the data engines then yield empty results and
 * the UI shows its "nothing here" states across the whole site.
 *
 * The flag arrives as the `x-data-mode` request header, set by `proxy.ts` from
 * the `?data` query param or a persisted `data-mode` cookie (query params
 * aren't visible to the layout or nested server components that also read data,
 * and the cookie makes the mode stick across navigation). `headers()` is
 * unavailable outside a request — e.g. during `generateStaticParams` at build
 * time — so any failure defaults to `false` (serve the normal dataset).
 */
export async function isEmptyDataRequested(): Promise<boolean> {
  try {
    const { headers } = await import("next/headers");
    const store = await headers();
    return store.get("x-data-mode")?.toLowerCase() === "none";
  } catch {
    return false;
  }
}
