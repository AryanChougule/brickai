import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KickerProps {
  /** Two-digit section numeral. Rendered as "01 — Label" when present. */
  num?: string;
  children: ReactNode;
  className?: string;
  /** `micro` is the 10px variant used inside cards for field labels. */
  size?: "kicker" | "micro";
}

/** Uppercase accent label. The only place accent-400 is used for small text. */
export function Kicker({
  num,
  children,
  className,
  size = "kicker",
}: KickerProps) {
  return (
    <p
      className={cn(
        "uppercase text-accent-text",
        size === "kicker" ? "text-kicker" : "text-micro",
        className,
      )}
    >
      {num ? `${num} — ` : null}
      {children}
    </p>
  );
}
