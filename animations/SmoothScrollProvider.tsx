"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Lenis smooth scroll, driven by GSAP's ticker so Lenis and ScrollTrigger share
 * one clock. Two loops reading and writing scroll position independently is the
 * usual cause of jitter in this pairing.
 *
 * Disabled entirely under `prefers-reduced-motion`: native scrolling is what
 * that preference asks for.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Slightly eased tail — enough to feel deliberate, short enough that
      // anchor jumps still land promptly.
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // Touch scrolling stays native; smoothing it fights the platform.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      // GSAP ticks in seconds, Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links go through Lenis so they respect the same easing.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [reduced]);

  return children;
}
