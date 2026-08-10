"use client";

import { useEffect, useState } from "react";

/** Session key so the preloader plays once per tab, not on every reload. */
export const PRELOADER_SEEN_KEY = "brickai:preloaded";

interface Options {
  /** Floor on how long the sequence is visible, in ms. */
  minDuration?: number;
  /** Ceiling, so a stalled asset can never trap the visitor behind the overlay. */
  maxDuration?: number;
  onComplete: () => void;
}

/**
 * Drives the preloader's 0→100 counter from real signals — font loading and
 * document readiness — while guaranteeing the sequence neither flashes nor
 * outstays its welcome.
 *
 * The ramp is eased toward 90% and only completes once the real signals land,
 * so the number means something rather than being a fixed animation.
 */
export function useLoadProgress({
  minDuration = 1400,
  maxDuration = 5000,
  onComplete,
}: Options) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    let assetsReady = false;
    let finished = false;
    let raf = 0;
    let hardStop = 0;

    // Recorded up front rather than on completion: a load abandoned halfway
    // should not queue the sequence up to play again on the next navigation.
    try {
      sessionStorage.setItem(PRELOADER_SEEN_KEY, "1");
    } catch {
      // Private browsing can reject sessionStorage. The sequence simply plays
      // again next time, which is harmless.
    }

    const signals: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) =>
            window.addEventListener("load", resolve, { once: true }),
          ),
    ];

    void Promise.allSettled(signals).then(() => {
      assetsReady = true;
    });

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(hardStop);
      cancelAnimationFrame(raf);
      setProgress(100);
      setExiting(true);

      // Matches the overlay's exit transition in Preloader.
      window.setTimeout(onComplete, 620);
    };

    // Escape hatch on a timer rather than inside the animation loop.
    // requestAnimationFrame does not run in a hidden or non-compositing tab, so
    // a loop-based deadline is exactly the thing that cannot be relied on to
    // dismiss a full-screen overlay.
    hardStop = window.setTimeout(finish, maxDuration);

    const tick = () => {
      const elapsed = performance.now() - startedAt;

      setProgress((current) => {
        // Ease toward 90 and hold there until the real signals arrive.
        const ceiling = assetsReady && elapsed >= minDuration ? 100 : 90;
        const step = (ceiling - current) * 0.06 + 0.35;
        return Math.min(ceiling, current + step);
      });

      if ((assetsReady && elapsed >= minDuration) || elapsed >= maxDuration) {
        finish();
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hardStop);
      finished = true;
    };
  }, [minDuration, maxDuration, onComplete]);

  return { progress: Math.round(progress), exiting };
}
