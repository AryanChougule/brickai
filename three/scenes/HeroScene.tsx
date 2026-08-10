"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { BrickField } from "@/three/objects/BrickField";
import { GridFloor } from "@/three/objects/GridFloor";
import { ModelSlot } from "@/three/objects/ModelSlot";
import { CAMERA, SCENE_COLORS } from "@/three/config";
import { modelSlotList } from "@/three/model-slots";

/**
 * Hero scene contents. Everything here is procedural: an instanced node field,
 * a shader grid plane, and edge-drawn stand-ins at the GLB slots.
 *
 * The camera drifts with the pointer within a deliberately small range. There is
 * no scroll-driven camera movement anywhere — the spec rules out scroll-jacking,
 * and a hero that moves under the scrollbar is the same mistake.
 */
export function HeroScene() {
  return (
    <>
      <color attach="background" args={[SCENE_COLORS.ground]} />
      {/* Fog hides the far edge of the grid plane so it reads as a horizon. */}
      <fog attach="fog" args={[SCENE_COLORS.ground, 16, 46]} />

      <ParallaxRig />

      <GridFloor />
      <BrickField />

      {modelSlotList.map((slot) => (
        <ModelSlot key={slot.id} slot={slot} />
      ))}
    </>
  );
}

/** Eases the camera toward a pointer-offset target. Never snaps. */
function ParallaxRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(...CAMERA.position));

  useFrame(({ pointer }, delta) => {
    target.current.set(
      CAMERA.position[0] + pointer.x * CAMERA.parallax,
      CAMERA.position[1] + pointer.y * CAMERA.parallax * 0.6,
      CAMERA.position[2],
    );

    // Frame-rate independent easing: the same feel at 60 and 144Hz.
    const lerp = 1 - Math.exp(-3 * delta);
    camera.position.lerp(target.current, lerp);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
