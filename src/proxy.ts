import { NextResponse, type NextRequest } from "next/server";

/** Cookie that persists the `?data` mode across navigation. */
const DATA_MODE_COOKIE = "data-mode";

/**
 * Resolves the `?data` demo flag and surfaces it as a request header
 * (`x-data-mode`) so the server-side data engines can read it via `headers()`
 * — see `isEmptyDataRequested` in `@/utils/apiClient`.
 *
 * Why a header and not `searchParams`: the data engines run in places that are
 * never handed `searchParams` — the root layout (navbar + footer chrome) and
 * nested home-page server components. A request header is the one channel every
 * server component shares, so this makes the flag visible everywhere at once.
 *
 * Why a cookie too: the flag must **stick across navigation**. Without it,
 * opening `/?data=none` then clicking through to `/products` (a URL with no
 * `?data`) would silently fall back to the normal catalog. So an explicit
 * `?data=` in the URL is persisted to a cookie, and requests that carry no
 * `?data` inherit the last value from that cookie.
 *
 *   /?data=none     → empty-data state, and remembered for later pages
 *   /products       → inherits the remembered mode (still empty)
 *   /?data=default  → clears the mode (back to the normal static catalog)
 *   /?data=         → also clears the mode
 */
export function proxy(request: NextRequest) {
  // `null` when `?data` is absent; `""` when present but empty (e.g. `?data=`).
  const queryMode = request.nextUrl.searchParams.get("data");
  const cookieMode = request.cookies.get(DATA_MODE_COOKIE)?.value ?? "";

  // An explicit `?data=` in the URL wins; otherwise inherit the cookie.
  const effectiveMode = queryMode ?? cookieMode;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-data-mode", effectiveMode);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Persist or clear the cookie only when the URL explicitly carried `?data=`.
  if (queryMode !== null) {
    const reset = queryMode === "" || queryMode.toLowerCase() === "default";
    if (reset) {
      response.cookies.delete(DATA_MODE_COOKIE);
    } else {
      response.cookies.set(DATA_MODE_COOKIE, queryMode, {
        path: "/",
        sameSite: "lax",
      });
    }
  }

  return response;
}

export const config = {
  // Page routes only — skip Next internals, the image optimizer, and favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
