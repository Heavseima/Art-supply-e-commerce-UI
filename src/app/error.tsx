"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";

/**
 * Segment error boundary. Catches errors thrown while rendering a page —
 * notably a backend that's down or returning errors (see the data engines in
 * `@/utils/products`, which throw on failure). Renders inside the global
 * chrome, so the navbar and footer stay put while this contained panel offers a
 * retry. Must be a Client Component (App Router requirement).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in the terminal/console for debugging during the demo.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-40 text-center">
      <span className="text-[11px] uppercase tracking-[0.36em] text-ink-muted">
        Something went wrong
      </span>
      <h1 className="font-display text-5xl font-bold leading-tight text-ink">
        The studio is briefly out of reach.
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
        We couldn&rsquo;t load this just now — the catalog service may be
        restarting. Give it a moment, then try again.
      </p>

      {error.message ? (
        <p className="max-w-md break-words border border-hairline bg-canvas-deep px-4 py-3 font-mono text-[12px] text-ink-muted">
          {error.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} variant="solid" size="md">
          Try again
        </Button>
        <Button href="/" variant="outline" size="md">
          Back home
        </Button>
      </div>
    </div>
  );
}
