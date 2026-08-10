import Link from "next/link";
import { CapabilityIcon } from "@/components/icons/CapabilityIcon";
import { FieldBlock, ImpactNote } from "@/components/ui/FieldBlock";
import type { Capability } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CapabilityCardProps {
  capability: Capability;
  open: boolean;
  onToggle: () => void;
}

/**
 * One catalogue cell. Collapsed it is a numbered card; open it reveals the
 * problem class, use cases, sector and stack under a 2px accent rule.
 *
 * The reveal is instant by design — the motion spec calls it "state-driven,
 * instant reveal", so there is no height transition to fight the grid reflow.
 */
export function CapabilityCard({
  capability,
  open,
  onToggle,
}: CapabilityCardProps) {
  const panelId = `capability-panel-${capability.slug}`;
  const buttonId = `capability-button-${capability.slug}`;

  return (
    <li
      className={cn(
        "flex flex-col bg-ground transition-colors duration-[--duration-hover]",
        !open && "hover:bg-ground-hover",
      )}
    >
      <button
        type="button"
        id={buttonId}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-[190px] flex-1 cursor-pointer flex-col p-6 text-left"
      >
        <span className="flex items-baseline justify-between gap-4">
          <span className="text-[11px] tracking-[0.12em] text-ink-faint">
            {capability.num}
          </span>
          <span className="flex items-center gap-3">
            <CapabilityIcon
              name={capability.icon}
              className={open ? "text-accent" : "text-ink-faint"}
            />
            <span
              aria-hidden="true"
              className={cn(
                "text-lg leading-none",
                open ? "text-accent" : "text-ink-faint",
              )}
            >
              {open ? "−" : "+"}
            </span>
          </span>
        </span>

        <h3 className="mb-2 mt-auto text-h4">{capability.name}</h3>
        <p className="text-[13px] text-ink-mute">{capability.tagline}</p>
      </button>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="flex flex-col gap-3 border-t-2 border-accent-rule px-6 pb-6 pt-4 text-[13px]"
        >
          <FieldBlock label="Problems solved">
            {capability.problems.join(" · ")}
          </FieldBlock>
          <FieldBlock label="Example use cases">
            {capability.useCases.join(" · ")}
          </FieldBlock>

          <div className="flex flex-wrap gap-6">
            <FieldBlock label="Industries" tone="muted" className="min-w-[120px] flex-1">
              {capability.industries.join(", ")}
            </FieldBlock>
            <FieldBlock
              label="Technologies"
              tone="muted"
              className="min-w-[120px] flex-1"
            >
              {capability.technologies.join(", ")}
            </FieldBlock>
          </div>

          <ImpactNote>Impact — {capability.impact}</ImpactNote>

          <Link
            href={`/what-we-build/${capability.slug}`}
            className="mt-1 inline-flex items-center gap-2 text-[13px] font-extrabold text-accent-text hover:text-accent-soft"
          >
            Architecture, ROI and demo
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : null}
    </li>
  );
}
