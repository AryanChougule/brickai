"use client";

import { useLoadState } from "@/animations/LoadProvider";
import { useLoadProgress } from "@/hooks/useLoadProgress";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

/** Build stages, revealed as the counter passes each threshold. */
const STAGES = [
  { at: 0, label: "Initialising" },
  { at: 22, label: "Loading capability index" },
  { at: 46, label: "Compiling geometry" },
  { at: 68, label: "Linking knowledge graph" },
  { at: 88, label: "Ready" },
] as const;

/** Twelve bars — one per capability. They fill left to right with the counter. */
const BRICKS = 12;

/**
 * Renders the overlay until the load gate opens, then stops rendering it.
 *
 * Unmounting is driven purely by state, never by an animation finishing. An
 * exit animation cannot be trusted to remove a full-screen overlay: it needs
 * requestAnimationFrame, which does not run in a hidden or non-compositing tab,
 * and the failure mode is the whole site stuck behind a loading screen.
 */
export function PreloaderGate() {
  const { ready } = useLoadState();
  if (ready) return null;
  return <Preloader />;
}

function Preloader() {
  const { markReady } = useLoadState();
  const { progress, exiting } = useLoadProgress({ onComplete: markReady });

  const stage =
    [...STAGES].reverse().find((entry) => progress >= entry.at) ?? STAGES[0];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading, ${progress} percent`}
      className={cn(
        "fixed inset-0 z-[200] flex flex-col justify-between bg-ground px-page py-10",
        // The fade is a CSS transition, so it is purely cosmetic — the element
        // is removed by PreloaderGate whether or not this ever plays.
        "transition-opacity duration-500 ease-in-out",
        exiting && "pointer-events-none opacity-0",
      )}
    >
      {/* Top: brand and stage */}
      <div className="flex items-baseline justify-between gap-6">
        <Wordmark href={null} size="md" />
        <p className="text-kicker uppercase text-accent-text">{stage.label}</p>
      </div>

      {/* Middle: the counter, set at display scale */}
      <div className="flex items-end justify-between gap-8">
        <p className="text-display tabular-nums text-ink" aria-hidden="true">
          {String(progress).padStart(3, "0")}
          <span className="text-accent">%</span>
        </p>
        <p className="mb-4 hidden max-w-[280px] text-sm text-ink-mute md:block">
          Build AI. Automate business. Transform industries.
        </p>
      </div>

      {/* Bottom: brick row */}
      <div
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${BRICKS}, 1fr)` }}
        aria-hidden="true"
      >
        {Array.from({ length: BRICKS }, (_, index) => {
          const filled = progress >= ((index + 1) / BRICKS) * 100;
          return (
            <span
              key={index}
              className="h-2 transition-colors duration-200"
              style={{
                background: filled
                  ? "var(--color-accent)"
                  : "rgba(248,244,244,0.14)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
