import { GridSkeleton } from "@/components/ui/GridSkeleton";

/**
 * Route-level loading fallback shown during navigation while a page's data
 * resolves. On-brand cream shimmer matching the catalog rhythm so transitions
 * never flash blank.
 */
export default function Loading() {
  return (
    <div className="section-y mx-auto max-w-[1600px] px-6 lg:px-12">
      <div
        aria-hidden
        className="block-gap flex flex-col items-center gap-4 text-center"
      >
        <span className="text-[11px] uppercase tracking-[0.36em] text-ink-muted">
          Loading
        </span>
        <div className="h-9 w-72 max-w-full animate-pulse bg-canvas-deep" />
      </div>
      <GridSkeleton count={8} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
