import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: readonly string[];
  /** Loop duration. The spec calls for 32s on the hero ticker. */
  seconds?: number;
  className?: string;
}

/**
 * Capability ticker. The list is duplicated so a -50% translate loops
 * seamlessly; the duplicate is hidden from assistive tech.
 *
 * Under `prefers-reduced-motion` the animation is removed by the global rule in
 * base.css and the strip renders as a static row.
 */
export function Marquee({ items, seconds = 32, className }: MarqueeProps) {
  return (
    <div
      className={cn("overflow-hidden rule-t bg-ground py-[14px]", className)}
      // The strip is decorative; its terms all appear elsewhere on the page.
      aria-hidden="true"
    >
      <div
        className="flex w-max gap-14 whitespace-nowrap text-kicker uppercase text-ink-faint"
        style={{ animation: `marquee ${seconds}s linear infinite` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-14">
            {items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
