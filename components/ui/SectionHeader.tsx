import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/Kicker";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  num?: string;
  kicker: string;
  title: ReactNode;
  /** One or two sentences under the heading. */
  lede?: ReactNode;
  /** Right-aligned link, e.g. "Full capability index →". */
  action?: ReactNode;
  className?: string;
  /** Heading level, for pages where the section is not the h2 tier. */
  as?: "h1" | "h2";
}

/** Kicker, display heading, optional lede — the opener every section shares. */
export function SectionHeader({
  num,
  kicker,
  title,
  lede,
  action,
  className,
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <header className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap items-baseline gap-6">
        <Kicker num={num}>{kicker}</Kicker>
        {action ? <div className="ml-auto">{action}</div> : null}
      </div>
      <Heading
        className={cn(
          "mt-4 max-w-[1000px]",
          Heading === "h1" ? "text-poster" : "text-h2",
        )}
      >
        {title}
      </Heading>
      {lede ? (
        <p className="mt-3 max-w-[560px] text-base text-ink-mute">{lede}</p>
      ) : null}
    </header>
  );
}
