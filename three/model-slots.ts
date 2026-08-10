/**
 * Registry of reserved locations for future GLB assets.
 *
 * Each slot renders a procedural stand-in today. When a real model lands in
 * `/public/models`, set its `url` here and `<ModelSlot>` loads it into the same
 * transform — no scene surgery, no layout change.
 *
 * Keep `url` undefined rather than deleting a slot: the procedural form is part
 * of the composition, not scaffolding.
 */
export interface ModelSlotConfig {
  id: string;
  /** Path under /public, e.g. "/models/hero-monolith.glb". */
  url?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  /** Rotation speed of the procedural stand-in, radians/second. */
  spin: number;
  /** Documents what belongs here, for whoever supplies the asset. */
  intent: string;
}

export const MODEL_SLOTS: Record<string, ModelSlotConfig> = {
  heroMonolithLeft: {
    id: "hero-monolith-left",
    position: [-6.4, -1.2, -3.4],
    rotation: [0.2, 0.6, 0.05],
    scale: 1.55,
    spin: 0.045,
    intent:
      "Left foreground form. Intended for a stacked-brick or machine-housing GLB, silhouette-readable at 1/3 frame height.",
  },
  heroMonolithRight: {
    id: "hero-monolith-right",
    position: [7.1, 1.4, -5.2],
    rotation: [-0.1, -0.4, 0.08],
    scale: 2.1,
    spin: -0.03,
    intent:
      "Right background form. Intended for a larger structural GLB — gantry, frame or conveyor section — sitting behind the node field.",
  },
  heroCore: {
    id: "hero-core",
    position: [0, -2.6, -1.2],
    rotation: [0.35, 0.4, 0],
    scale: 0.95,
    spin: 0.09,
    intent:
      "Centre-low accent form. Intended for a detailed hero GLB (sensor head, edge device) once available.",
  },
};

export const modelSlotList = Object.values(MODEL_SLOTS);
