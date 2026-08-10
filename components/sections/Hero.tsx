"use client";

import dynamic from "next/dynamic";
import { useLoadState } from "@/animations/LoadProvider";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { SceneFallback } from "@/three/SceneFallback";
import { marqueeTerms } from "@/lib/content/process";
import { site } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * three, R3F and drei are the largest dependencies in the project. Loading them
 * in a client-only chunk keeps them out of the initial JS payload, so the
 * headline paints without waiting on the renderer.
 */
const HeroCanvas = dynamic(
  () => import("@/three/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false, loading: () => <SceneFallback /> },
);

export function Hero() {
  const { ready } = useLoadState();
  const reduced = usePrefersReducedMotion();

  /**
   * The headline entrance is a CSS animation, not a JS one, and it is the whole
   * reason this component is otherwise unanimated.
   *
   * The most important text on the site must not depend on a JavaScript
   * animation frame to become visible. With `animation-fill-mode: both` the
   * element ends visible whether the animation plays, is cut to 0.01ms by the
   * reduced-motion rule, or never runs at all. Server-rendered HTML has
   * `ready === true`, so the no-JS render is visible too.
   */
  const entrance =
    reduced || !ready
      ? undefined
      : { animation: "fade-up 900ms var(--ease-out-expo) both" };

  return (
    <header
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden"
    >
      <HeroCanvas />

      <div
        className="relative px-page pt-[calc(var(--nav-h)+76px)]"
        // Hidden only while the preloader is actually covering the page.
        style={ready ? entrance : { opacity: 0 }}
      >
        <p className="mb-5 text-kicker uppercase text-accent-text">
          Software engineering · AI systems · Automation
        </p>
        <h1 className="max-w-[1400px] text-display">
          Engineering the future of intelligent software
          <Caret />
        </h1>
      </div>

      <div className="relative flex flex-wrap items-end gap-10 px-page pb-14 pt-12">
        <div className="flex flex-wrap gap-3">
          <Button href={site.cta.href} size="lg">
            {site.cta.label} →
          </Button>
          <Button href="/work" size="lg" variant="secondary">
            View case studies
          </Button>
        </div>
        <p className="ml-auto max-w-[420px] text-[15px] text-ink-mute">
          Build AI. Automate business. Transform industries. We solve complex
          business problems with software.
        </p>
      </div>

      <Marquee items={marqueeTerms} seconds={32} className="relative" />
    </header>
  );
}

/** Blinking terminal caret. Decorative — the global reduced-motion rule stops it. */
function Caret() {
  return (
    <span
      aria-hidden="true"
      className="text-accent"
      style={{ animation: "blink 1.2s step-end infinite" }}
    >
      _
    </span>
  );
}
