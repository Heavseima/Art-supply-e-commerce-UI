interface GridSkeletonProps {
  count?: number;
  className?: string;
}

/** Loading placeholder grid shown while product data streams in. */
export function GridSkeleton({ count = 4, className }: GridSkeletonProps) {
  return (
    <div
      aria-hidden
      className={[
        "grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="aspect-[4/5] w-full animate-pulse bg-canvas-deep" />
          <div className="mt-1 h-4 w-2/3 animate-pulse bg-canvas-deep" />
          <div className="h-3 w-1/4 animate-pulse bg-canvas-deep" />
        </div>
      ))}
    </div>
  );
}
