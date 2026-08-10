import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HairlineGridProps {
  children: ReactNode;
  className?: string;
  /** Minimum column width for the auto-fill track. */
  min?: number;
  /** Fixed column count instead of auto-fill. */
  cols?: 2 | 3 | 4;
  as?: "div" | "ul";
}

/**
 * Card grid where the 2px gap over a divider-coloured ground *is* the border.
 * Children must set their own `bg-ground` so the gap shows through.
 */
export function HairlineGrid({
  children,
  className,
  min = 300,
  cols,
  as: Tag = "div",
}: HairlineGridProps) {
  return (
    <Tag
      className={cn("grid grid-hairline", className)}
      style={
        cols
          ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
          : { gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))` }
      }
    >
      {children}
    </Tag>
  );
}

/** A cell inside a HairlineGrid. Opaque ground so the gap reads as a rule. */
export function HairlineCell({
  children,
  className,
  raised,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Uses the alternate panel ground from the spec. */
  raised?: boolean;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag
      className={cn(
        "flex flex-col",
        raised ? "bg-ground-raised" : "bg-ground",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
