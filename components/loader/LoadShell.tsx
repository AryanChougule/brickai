"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { LoadProvider } from "@/animations/LoadProvider";
import { SmoothScrollProvider } from "@/animations/SmoothScrollProvider";
import { PRELOADER_SEEN_KEY } from "@/hooks/useLoadProgress";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

// The preloader is only ever needed on a first paint, so it should not sit in
// the initial bundle for repeat visitors.
const PreloaderGate = dynamic(
  () => import("@/components/loader/Preloader").then((m) => m.PreloaderGate),
  { ssr: false },
);

/**
 * Decides whether the loading sequence plays, then wires the two providers every
 * page depends on. Rendered once, from the root layout.
 *
 * The sequence is skipped when the visitor has asked for reduced motion, and
 * after the first load in a tab — nobody wants a progress counter on their
 * fourth page view.
 */
export function LoadShell({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);

  // Resolved in a layout effect, before the first paint: a passive effect would
  // paint one frame with the hero already animating in, then cover it.
  useIsomorphicLayoutEffect(() => {
    if (reduced) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(PRELOADER_SEEN_KEY) === "1";
    } catch {
      // Storage unavailable — treat as a first visit.
    }

    if (!seen) setActive(true);
  }, [reduced]);

  return (
    <LoadProvider active={active}>
      <SmoothScrollProvider>
        {active ? <PreloaderGate /> : null}
        {children}
      </SmoothScrollProvider>
    </LoadProvider>
  );
}
