"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { GRID, SCENE_COLORS } from "@/three/config";

/**
 * Procedural grid plane — the 3D counterpart of the 48px CSS underlay.
 *
 * Drawn in a fragment shader rather than as geometry, so it costs two triangles
 * regardless of how many cells are visible, and the lines stay one pixel wide at
 * any distance instead of aliasing into moiré.
 */
export function GridFloor() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uCell: { value: GRID.cell },
        uMajorEvery: { value: GRID.majorEvery },
        uFade: { value: GRID.fade },
        uLine: { value: new THREE.Color(SCENE_COLORS.ink) },
        uMajor: { value: new THREE.Color(SCENE_COLORS.accent) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorld;

        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorld = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uCell;
        uniform float uMajorEvery;
        uniform float uFade;
        uniform vec3 uLine;
        uniform vec3 uMajor;

        varying vec3 vWorld;

        // Screen-space derivative gives a constant-width line at any distance,
        // which is what keeps the far field from turning into moiré.
        float gridLine(vec2 coord, float width) {
          vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float line = min(grid.x, grid.y);
          return 1.0 - min(line / width, 1.0);
        }

        void main() {
          vec2 cell = vWorld.xz / uCell;

          float minor = gridLine(cell, 1.0);
          float major = gridLine(cell / uMajorEvery, 1.0);

          // Radial falloff so the plane reads as a horizon, not a hard edge.
          float distance = length(vWorld.xz);
          float fade = 1.0 - smoothstep(uFade * 0.25, uFade, distance);

          float alpha = (minor * 0.14 + major * 0.30) * fade;
          if (alpha < 0.002) discard;

          vec3 color = mix(uLine, uMajor, major * 0.55);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
  }, []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, GRID.y, 0]}
      material={material}
      frustumCulled={false}
    >
      <planeGeometry args={[GRID.size, GRID.size]} />
    </mesh>
  );
}
