import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: ReactNode;
  className?: string;
  /** `accent` outlines in accent-400 for emphasis rows. */
  tone?: "neutral" | "accent";
}

/** Uppercase micro-label in a 1px box. Used for project tags and tech chips. */
export function Tag({ children, className, tone = "neutral" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap border px-2 py-1 text-micro uppercase",
        tone === "neutral"
          ? "border-edge text-ink-soft"
          : "border-accent-hairline text-accent-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A row of tags with consistent wrapping. */
export function TagRow({
  items,
  tone,
  className,
}: {
  items: readonly string[];
  tone?: "neutral" | "accent";
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag tone={tone}>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
