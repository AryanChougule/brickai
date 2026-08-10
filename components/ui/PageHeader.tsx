import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/Kicker";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Rendered under the lede — tag rows, stat strips, CTAs. */
  children?: ReactNode;
  className?: string;
}

/**
 * Opening block for every route below the home page. Sits under the fixed nav
 * with its own top padding, and closes with the 2px section rule.
 */
export function PageHeader({
  kicker,
  title,
  lede,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "px-page rule-b pb-16 pt-[calc(var(--nav-h)+var(--section-pt))]",
        className,
      )}
    >
      <Kicker>{kicker}</Kicker>
      <h1 className="mt-4 max-w-[1200px] text-poster">{title}</h1>
      {lede ? (
        <p className="mt-5 max-w-[600px] text-base text-ink-mute">{lede}</p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </header>
  );
}
