"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type Build = (context: {
  timeline: gsap.core.Timeline;
  root: HTMLElement;
  /** Scope selector — resolves within `root` only. */
  q: (selector: string) => HTMLElement[];
}) => void;

interface Options {
  /** Passed straight to ScrollTrigger, minus `trigger` and `animation`. */
  scrollTrigger?: Omit<ScrollTrigger.Vars, "trigger" | "animation">;
  /** Re-create the timeline when any of these change. */
  deps?: unknown[];
}

/**
 * Build a scroll-linked GSAP timeline scoped to an element, with cleanup and
 * reduced-motion handling in one place.
 *
 * Under `prefers-reduced-motion` no timeline is created at all — content must
 * therefore be styled to be legible in its final state without JS, which is
 * how every scroll sequence on this site is authored.
 */
export function useGsapScroll<T extends HTMLElement>(
  build: Build,
  { scrollTrigger, deps = [] }: Options = {},
) {
  const rootRef = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    // gsap.context scopes every selector and collects everything for revert().
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          end: "bottom 25%",
          ...scrollTrigger,
        },
      });

      build({
        timeline,
        root,
        q: (selector) => gsap.utils.toArray<HTMLElement>(selector, root),
      });
    }, root);

    return () => ctx.revert();
    // `build` is intentionally not a dependency: callers pass an inline closure,
    // and re-running on every render would thrash ScrollTrigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return rootRef as RefObject<T | null>;
}
