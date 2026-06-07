import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-6 py-40 text-center">
      <span className="text-[11px] uppercase tracking-[0.36em] text-ink-muted">
        404
      </span>
      <h1 className="font-display text-5xl font-bold leading-tight text-ink">
        This page has left the studio.
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
        The piece you were looking for isn&rsquo;t here. It may have been moved,
        renamed, or sold.
      </p>
      <Button href="/products" variant="solid" size="md">
        Return to the catalog
      </Button>
    </div>
  );
}
