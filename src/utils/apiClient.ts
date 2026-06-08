/**
 * Single source of truth for the backend base URL and URL construction.
 *
 * Isolated here so every data engine and server action resolves the API origin
 * the same way, and a change of host/version only touches this file. The URL
 * comes from `NEXT_PUBLIC_API_URL` (see `.env`), with a localhost dev fallback.
 */

/** Backend API origin + version prefix, e.g. `http://localhost:8080/api/v1`. */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

/**
 * Resolved-origin guard.
 *
 * `NEXT_PUBLIC_API_URL` is inlined at build time, so a stale `.next` cache (or a
 * `.env` edited after the dev server started) can leave an outdated origin baked
 * into the bundle while the source/env look correct. This runs once at module
 * load to surface the *actually resolved* value, and throws early if it isn't a
 * valid absolute URL — turning a silent "wrong host" misfire into an obvious,
 * immediate signal in the console. Dev-only so it never adds prod log noise.
 */
if (process.env.NODE_ENV !== "production") {
  try {
    // Throws synchronously if API_BASE isn't a well-formed absolute URL.
    new URL(API_BASE);
    // eslint-disable-next-line no-console
    console.info(`[apiClient] Resolved API_BASE = ${API_BASE}`);
  } catch {
    throw new Error(
      `[apiClient] NEXT_PUBLIC_API_URL resolved to an invalid URL: "${API_BASE}". ` +
        `Check .env, then stop the dev server, delete .next, and restart ` +
        `(NEXT_PUBLIC_* values are inlined at build time).`,
    );
  }
}

/** Build an absolute backend URL from a leading-slash path like `/products`. */
export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
