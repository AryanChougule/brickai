"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins. Importing `gsap` from here
 * guarantees ScrollTrigger is registered exactly once, regardless of which
 * component loads first.
 */
let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger);
  registered = true;

  // No scroll-jacking anywhere on the site, so ScrollTrigger never takes over
  // the scroll position — it only reads it.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared easing, matching the tokens in theme.css. */
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
} as const;

export { gsap, ScrollTrigger };
