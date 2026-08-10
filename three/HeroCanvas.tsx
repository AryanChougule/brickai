"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { HeroScene } from "@/three/scenes/HeroScene";
import { SceneFallback } from "@/three/SceneFallback";
import { CAMERA, DPR_RANGE } from "@/three/config";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/** One-time capability probe. A failed context is a fallback, not an error. */
function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * The hero's WebGL surface.
 *
 * Three things keep this cheap:
 *  - the render loop stops entirely when the hero scrolls out of view
 *  - device pixel ratio steps down under sustained load and back up when it clears
 *  - reduced motion renders exactly one frame, on demand, and never loops
 */
export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [inView, setInView] = useState(true);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [dpr, setDpr] = useState<number>(DPR_RANGE[1]);

  useEffect(() => setSupported(detectWebGL()), []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { rootMargin: "120px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // `demand` renders a single frame and then waits — exactly what reduced
  // motion asks for. `never` parks the loop for an off-screen hero.
  const frameloop = reduced ? "demand" : inView ? "always" : "never";

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/*
        Always painted, always underneath. R3F only initialises once its
        ResizeObserver reports a size — which never happens in a tab that is
        hidden at load, and lands a frame or two late on slow devices. Keeping
        the flat composition behind the canvas means the hero is never empty,
        and it doubles as the no-WebGL and reduced-motion state.
      */}
      <SceneFallback />

      {supported ? (
        <Canvas
          frameloop={frameloop}
          dpr={dpr}
          camera={{
            position: [...CAMERA.position],
            fov: CAMERA.fov,
            near: CAMERA.near,
            far: CAMERA.far,
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          // The scene is decorative; its content is stated in the headline beside it.
          aria-hidden="true"
          style={{ position: "absolute", inset: 0 }}
        >
          <PerformanceMonitor
            onDecline={() => setDpr(DPR_RANGE[0])}
            onIncline={() => setDpr(DPR_RANGE[1])}
          />
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}
