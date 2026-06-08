"use client";

import "./globals.css";

/**
 * Last-resort error boundary for failures in the root layout itself (where the
 * segment `error.tsx` can't reach). It replaces the entire document, so it must
 * render its own <html>/<body>. Kept dependency-free and using safe font
 * fallbacks since the layout's font variables aren't available here.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-7 bg-canvas px-6 text-center text-ink antialiased">
        <span
          className="text-[11px] uppercase tracking-[0.36em] text-ink-muted"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          Something went wrong
        </span>
        <h1
          className="text-4xl font-bold leading-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          The storefront couldn&rsquo;t load.
        </h1>
        <p
          className="max-w-sm text-sm text-ink-muted"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          A core service is unavailable. Once the backend is back up, try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="bg-ink px-7 py-3.5 text-[12px] uppercase tracking-[0.18em] text-canvas transition-colors hover:bg-accent"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
