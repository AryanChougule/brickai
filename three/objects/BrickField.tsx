"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { FIELD, SCENE_COLORS } from "@/three/config";
import { seededRandom } from "@/lib/utils";

/** Scratch objects, hoisted so the frame loop allocates nothing. */
const matrix = new THREE.Matrix4();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3();
const pointerWorld = new THREE.Vector3();
const pointerRay = new THREE.Vector3();
const linkColor = new THREE.Color(SCENE_COLORS.accent);

interface Node {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  spin: number;
  /** Per-node scale jitter, so the field does not read as a uniform lattice. */
  size: number;
  accent: boolean;
}

/**
 * The node field: `FIELD.count` drifting bricks in one instanced draw call, plus
 * the accent links between near neighbours in a second.
 *
 * Two draw calls total, no per-frame allocation, and the link buffer is
 * preallocated with `setDrawRange` rather than rebuilt — which is what keeps
 * this at 60fps while the rest of the page is also animating.
 */
export function BrickField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linksRef = useRef<THREE.LineSegments>(null);

  // Deterministic layout: the same field every load, and identical between
  // server and client if this ever renders during hydration.
  const nodes = useMemo<Node[]>(() => {
    return Array.from({ length: FIELD.count }, (_, i) => {
      const rx = seededRandom(i * 3 + 1);
      const ry = seededRandom(i * 3 + 2);
      const rz = seededRandom(i * 3 + 3);
      const vx = seededRandom(i * 7 + 11) - 0.5;
      const vy = seededRandom(i * 7 + 12) - 0.5;
      const vz = seededRandom(i * 7 + 13) - 0.5;

      return {
        position: new THREE.Vector3(
          (rx * 2 - 1) * FIELD.bounds.x,
          (ry * 2 - 1) * FIELD.bounds.y,
          (rz * 2 - 1) * FIELD.bounds.z,
        ),
        velocity: new THREE.Vector3(vx, vy, vz).multiplyScalar(FIELD.speed),
        spin: (seededRandom(i * 5 + 4) - 0.5) * 0.6,
        size: 0.7 + seededRandom(i * 5 + 5) * 0.9,
        accent: seededRandom(i * 5 + 6) < FIELD.accentRatio,
      };
    });
  }, []);

  const linkGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(FIELD.maxLinks * 6), 3),
    );
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(FIELD.maxLinks * 6), 3),
    );
    geometry.setDrawRange(0, 0);
    return geometry;
  }, []);

  // Instance colours never change, so they are written once on mount.
  const colorsApplied = useRef(false);

  useFrame(({ camera, pointer, clock }, delta) => {
    const mesh = meshRef.current;
    const links = linksRef.current;
    if (!mesh || !links) return;

    if (!colorsApplied.current) {
      const ink = new THREE.Color(SCENE_COLORS.ink);
      const accent = new THREE.Color(SCENE_COLORS.accent);
      nodes.forEach((node, i) => {
        mesh.setColorAt(i, node.accent ? accent : ink);
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      colorsApplied.current = true;
    }

    // Project the pointer onto the z = 0 plane so repulsion happens where the
    // visitor perceives the cursor to be, not at the near plane.
    pointerRay.set(pointer.x, pointer.y, 0.5).unproject(camera);
    pointerRay.sub(camera.position).normalize();
    const planeDistance = -camera.position.z / (pointerRay.z || -1);
    pointerWorld.copy(camera.position).addScaledVector(pointerRay, planeDistance);

    const step = Math.min(delta, 1 / 30);
    const time = clock.elapsedTime;
    const { bounds, pointerRadius, pointerForce } = FIELD;
    const radiusSq = pointerRadius * pointerRadius;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const p = node.position;

      p.addScaledVector(node.velocity, step);

      // Reflect at the volume boundary — the field stays dense rather than
      // dispersing, which a wrap-around would not achieve.
      if (p.x < -bounds.x || p.x > bounds.x) node.velocity.x *= -1;
      if (p.y < -bounds.y || p.y > bounds.y) node.velocity.y *= -1;
      if (p.z < -bounds.z || p.z > bounds.z) node.velocity.z *= -1;

      // Cursor repulsion, falling off with distance.
      const dx = p.x - pointerWorld.x;
      const dy = p.y - pointerWorld.y;
      const distanceSq = dx * dx + dy * dy;
      if (distanceSq < radiusSq && distanceSq > 0.0001) {
        const distance = Math.sqrt(distanceSq);
        const push = (1 - distance / pointerRadius) * pointerForce * step;
        p.x += (dx / distance) * push;
        p.y += (dy / distance) * push;
      }

      const s = FIELD.size * node.size;
      scale.set(s, s, s);
      quaternion.setFromAxisAngle(
        new THREE.Vector3(0.5, 1, 0.3).normalize(),
        time * node.spin,
      );
      matrix.compose(p, quaternion, scale);
      mesh.setMatrixAt(i, matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;

    // Rebuild the link buffer in place.
    const positions = links.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const colors = links.geometry.getAttribute("color") as THREE.BufferAttribute;
    const positionArray = positions.array as Float32Array;
    const colorArray = colors.array as Float32Array;

    let vertex = 0;
    const limit = FIELD.maxLinks * 2;

    for (let i = 0; i < nodes.length && vertex < limit; i++) {
      const a = nodes[i].position;
      for (let j = i + 1; j < nodes.length && vertex < limit; j++) {
        const b = nodes[j].position;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const distanceSq = dx * dx + dy * dy + dz * dz;
        if (distanceSq >= FIELD.linkDistanceSq) continue;

        // Additive blending on a dark ground means scaling the colour reproduces
        // the spec's distance-proportional alpha without a per-vertex alpha channel.
        const strength =
          (1 - distanceSq / FIELD.linkDistanceSq) * FIELD.linkStrength;

        const o = vertex * 3;
        positionArray[o] = a.x;
        positionArray[o + 1] = a.y;
        positionArray[o + 2] = a.z;
        positionArray[o + 3] = b.x;
        positionArray[o + 4] = b.y;
        positionArray[o + 5] = b.z;

        for (let v = 0; v < 2; v++) {
          const c = o + v * 3;
          colorArray[c] = linkColor.r * strength;
          colorArray[c + 1] = linkColor.g * strength;
          colorArray[c + 2] = linkColor.b * strength;
        }

        vertex += 2;
      }
    }

    positions.needsUpdate = true;
    colors.needsUpdate = true;
    links.geometry.setDrawRange(0, vertex);
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, FIELD.count]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <lineSegments ref={linksRef} geometry={linkGeometry} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}
