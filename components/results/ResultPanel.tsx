import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared chrome for a rendered result view.
 *
 * These panels are the real interface — SVG and DOM built from the design
 * system — not a photograph standing in for one, and not a screenshot. They
 * show the *shape* of the output a system produces.
 *
 * The data in them is generated, and the badge says so on every panel. We have
 * no client's production numbers to publish, and inventing some while implying
 * they are measured would be a fabricated record. Marking them illustrative
 * costs nothing and keeps the claim honest wherever the panel is reused.
 */
export function ResultPanel({
  title,
  meta,
  children,
  className,
}: {
  title: string;
  /** Mono sub-line: the stack or the reading, not marketing copy. */
  meta?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col rule-all bg-ground-graph", className)}>
      <figcaption className="flex flex-wrap items-baseline gap-3 border-b border-hairline px-5 py-3">
        <span className="text-[13px] font-extrabold text-ink">{title}</span>
        {meta ? (
          <span className="font-mono text-[11px] text-ink-faint">{meta}</span>
        ) : null}
        <span className="ml-auto border border-accent-hairline px-2 py-0.5 text-micro uppercase text-accent-soft">
          Illustrative data
        </span>
      </figcaption>
      <div className="flex-1 p-5">{children}</div>
    </figure>
  );
}
