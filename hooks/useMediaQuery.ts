"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a media query without tearing during hydration.
 * Server snapshot is always `false`, so markup renders in the "no match" state
 * and corrects on mount — never the other way around.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onStoreChange);
      return () => list.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * True when the visitor has asked for reduced motion. Every canvas, WebGL scene
 * and scroll animation in the project reads this and degrades to a static
 * render rather than simply running faster.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Coarse pointer — used to skip hover-driven canvas interaction on touch. */
export function useIsTouch() {
  return useMediaQuery("(hover: none)");
}

/** Below the spec's 768px breakpoint. */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}
