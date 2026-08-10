"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SCENE_COLORS } from "@/three/config";
import type { ModelSlotConfig } from "@/three/model-slots";
import { seededRandom } from "@/lib/utils";

/**
 * A reserved location in the scene. Renders the GLB when `slot.url` is set, and
 * a procedural stand-in otherwise — same transform either way, so supplying an
 * asset never shifts the composition.
 */
export function ModelSlot({ slot }: { slot: ModelSlotConfig }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += slot.spin * delta;
  });

  return (
    <group
      ref={group}
      position={slot.position}
      rotation={slot.rotation}
      scale={slot.scale}
      name={slot.id}
    >
      {slot.url ? <LoadedModel url={slot.url} /> : <BrickStack id={slot.id} />}
    </group>
  );
}

function LoadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // Cloned so the same GLB can occupy more than one slot without the two
  // sharing a transform.
  const model = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={model} />;
}

/**
 * Procedural stand-in: a stack of offset brick volumes drawn as edges only.
 * Unlit wireframe keeps it inside the modernist language — no gradients, no
 * soft shadows — and it costs one small geometry per course.
 */
function BrickStack({ id }: { id: string }) {
  const courses = useMemo(() => {
    // Seed from the slot id so each slot gets a distinct but stable form.
    const seed = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return Array.from({ length: 7 }, (_, i) => {
      const r1 = seededRandom(seed + i * 3);
      const r2 = seededRandom(seed + i * 3 + 1);
      const r3 = seededRandom(seed + i * 3 + 2);

      return {
        width: 0.9 + r1 * 0.7,
        height: 0.16,
        depth: 0.5 + r2 * 0.4,
        y: i * 0.2 - 0.6,
        offsetX: (r3 - 0.5) * 0.45,
        rotation: (r1 - 0.5) * 0.22,
        accent: i === 3,
      };
    });
  }, [id]);

  return (
    <group>
      {courses.map((course, i) => (
        <group
          key={i}
          position={[course.offsetX, course.y, 0]}
          rotation={[0, course.rotation, 0]}
        >
          <Edges
            args={[course.width, course.height, course.depth]}
            color={course.accent ? SCENE_COLORS.accent : SCENE_COLORS.wire}
            opacity={course.accent ? 0.85 : 0.5}
          />
        </group>
      ))}
    </group>
  );
}

/** Box drawn as its edges only — one LineSegments, no fill. */
function Edges({
  args,
  color,
  opacity,
}: {
  args: [number, number, number];
  color: number;
  opacity: number;
}) {
  const geometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(...args)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [args[0], args[1], args[2]],
  );

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </lineSegments>
  );
}
