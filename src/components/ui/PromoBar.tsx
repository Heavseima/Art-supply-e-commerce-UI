/**
 * Slim store-wide announcement bar. Pure server component. A single restrained
 * editorial line — no rigid pipe separators.
 */
export function PromoBar() {
  return (
    <div className="border-b border-hairline bg-ink text-canvas">
      <div className="mx-auto max-w-[1600px] px-6 py-2.5 text-center text-[10px] font-light uppercase tracking-[0.32em] lg:px-12">
        Complimentary shipping over $75 &nbsp;—&nbsp; Thirty-day studio returns
      </div>
    </div>
  );
}
