import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  /** Accessible label for the section landmark, when it has no visible heading. */
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  /** Set false for sections that manage their own horizontal padding. */
  gutter?: boolean;
  /** Set false for full-bleed sections that pad their own children. */
  rhythm?: boolean;
  /** The 2px bottom rule. Off for the last section before the footer. */
  rule?: boolean;
}

/**
 * Full-bleed section with the standard rhythm: 40px page gutter, 96/80 vertical
 * padding, and a 2px bottom rule marking the boundary.
 */
export function Section({
  id,
  ariaLabel,
  children,
  className,
  gutter = true,
  rhythm = true,
  rule = true,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        gutter && "px-page",
        rhythm && "section-y",
        rule && "rule-b",
        className,
      )}
    >
      {children}
    </section>
  );
}
