import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldBlockProps {
  label: string;
  children: ReactNode;
  className?: string;
  /** Muted body is used for the supporting fields (industries, technologies). */
  tone?: "primary" | "muted";
}

/**
 * A micro-label above its content — the repeating unit inside capability cards
 * and detail panels ("PROBLEMS SOLVED", "TECHNOLOGIES", and so on).
 */
export function FieldBlock({
  label,
  children,
  className,
  tone = "primary",
}: FieldBlockProps) {
  return (
    <div className={className}>
      <p className="mb-2 text-micro uppercase text-accent-text">{label}</p>
      <div
        className={cn(
          "text-sm leading-relaxed",
          tone === "primary" ? "text-ink-dim" : "text-ink-mute",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Bulleted list styled with the accent arrow used throughout the site. */
export function ArrowList({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="font-extrabold text-accent">
            →
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** The outlined impact note: 1px accent-400 box, accent-300 text. */
export function ImpactNote({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "border border-accent-hairline px-[14px] py-3 text-sm text-accent-soft",
        className,
      )}
    >
      {children}
    </p>
  );
}
