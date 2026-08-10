"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

export interface FrameInfo {
  width: number;
  height: number;
  /** Seconds since the loop started. */
  time: number;
  /** Seconds since the previous frame, clamped to avoid post-tab-switch jumps. */
  delta: number;
}

interface Canvas2DOptions {
  /** Called every frame with a transform already scaled to CSS pixels. */
  draw: (ctx: CanvasRenderingContext2D, frame: FrameInfo) => void;
  /** Called on mount and on every resize, before the next draw. */
  setup?: (size: { width: number; height: number }) => void;
  /** Device pixel ratio ceiling. The spec caps canvas effects at ×2. */
  maxDpr?: number;
  /**
   * Supply the canvas ref instead of receiving one. Needed when another hook —
   * `usePointer`, say — has to observe the same element and would otherwise
   * force the caller to reference this hook's return value before it exists.
   */
  ref?: React.RefObject<HTMLCanvasElement | null>;
}

/**
 * A 2D canvas render loop with the four things every canvas on this site needs:
 *
 *  - DPR-capped backing store, resized from a ResizeObserver
 *  - a RAF loop that pauses when the canvas scrolls out of view
 *  - a single static frame under `prefers-reduced-motion`, with no loop at all
 *  - deterministic teardown
 *
 * `draw` is read through a ref, so a caller may pass a fresh closure each
 * render without restarting the loop.
 */
export function useCanvas2D({
  draw,
  setup,
  maxDpr = 2,
  ref,
}: Canvas2DOptions) {
  const ownRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = ref ?? ownRef;
  const drawRef = useRef(draw);
  const setupRef = useRef(setup);
  const reduced = usePrefersReducedMotion();

  drawRef.current = draw;
  setupRef.current = setup;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d", {
      alpha: true,
    });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let start = 0;
    let last = 0;
    let visible = true;
    let running = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      setupRef.current?.({ width, height });
    };

    const renderOnce = (time: number, delta: number) => {
      if (!width || !height) return;
      drawRef.current(ctx, { width, height, time, delta });
    };

    const tick = (now: number) => {
      if (!running) return;
      if (!start) start = now;

      // Clamped so returning to a backgrounded tab does not integrate a
      // multi-second delta into the simulation.
      const delta = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;

      renderOnce((now - start) / 1000, delta);
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      // Reduced motion never animates, so a resize has to repaint explicitly.
      if (reduced) renderOnce(0, 0);
    });
    resizeObserver.observe(canvas);

    // Offscreen canvases cost nothing. This is the single biggest frame-rate
    // win on a page with more than one animated surface.
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !document.hidden) startLoop();
        else stopLoop();
      },
      { rootMargin: "200px" },
    );
    intersectionObserver.observe(canvas);

    const onVisibilityChange = () => {
      if (document.hidden) stopLoop();
      else if (visible) startLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    resize();
    if (reduced) renderOnce(0, 0);
    else startLoop();

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [canvasRef, maxDpr, reduced]);

  return canvasRef;
}
