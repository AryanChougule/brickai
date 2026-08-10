"use client";

import { useEffect, useRef } from "react";

export interface PointerState {
  /** Pixels, relative to the tracked element's top-left. */
  x: number;
  y: number;
  /** −1..1, origin at the element's centre. Convenient for shader uniforms. */
  nx: number;
  ny: number;
  inside: boolean;
}

/** Far off-canvas, so distance tests read "no pointer" before first move. */
const AWAY = -9000;

/**
 * Track the pointer against an element, in a ref rather than state — a render
 * per mouse move would defeat the point in an animation loop.
 *
 * Returns a stable ref that RAF callbacks can read every frame.
 */
export function usePointer<T extends HTMLElement>(
  target: React.RefObject<T | null>,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const pointer = useRef<PointerState>({
    x: AWAY,
    y: AWAY,
    nx: 0,
    ny: 0,
    inside: false,
  });

  useEffect(() => {
    const element = target.current;
    if (!element || !enabled) return;

    const onMove = (event: PointerEvent) => {
      // Touch drags scroll the page; treating them as hover fights the gesture.
      if (event.pointerType === "touch") return;

      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      pointer.current = {
        x,
        y,
        nx: rect.width ? (x / rect.width) * 2 - 1 : 0,
        ny: rect.height ? -((y / rect.height) * 2 - 1) : 0,
        inside:
          x >= 0 && y >= 0 && x <= rect.width && y <= rect.height,
      };
    };

    const onLeave = () => {
      pointer.current = { x: AWAY, y: AWAY, nx: 0, ny: 0, inside: false };
    };

    // Listen on the window so the pointer is still tracked while it travels
    // over children that stop propagation.
    window.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [target, enabled]);

  return pointer;
}
