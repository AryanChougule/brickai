/**
 * Scene tunables in one place. The values here restate the motion spec:
 * 90 drifting nodes, links under ~122px apart, cursor repulsion within 130px,
 * a 48px grid underlay, and a DPR ceiling of ×2.
 */

/**
 * Palette, as hex numbers for three. Mirrors the CSS tokens in
 * `styles/theme.css` exactly — WebGL cannot read CSS variables, so these are
 * the one place the accent is duplicated. Retune both together.
 */
export const SCENE_COLORS = {
  ground: 0x171515,
  ink: 0xf3f2f2,
  accent: 0xf26511,
  accentText: 0xffa76b,
  wire: 0x2a2626,
} as const;

export const FIELD = {
  /** Node count, from the motion spec. */
  count: 90,
  /** Half-extents of the drift volume, in world units. */
  bounds: { x: 9, y: 5, z: 5 },
  /** Cube edge length. Small enough to read as a node, large enough to catch light. */
  size: 0.085,
  /** Base drift speed, world units per second. */
  speed: 0.34,
  /** Proportion of nodes rendered in accent rather than ink. */
  accentRatio: 0.16,
  /** Squared world distance under which two nodes are linked. */
  linkDistanceSq: 3.1,
  /** Buffer ceiling for link segments. Beyond this, extra pairs are skipped. */
  maxLinks: 900,
  /** Peak link opacity, matching the 0.35 alpha in the spec. */
  linkStrength: 0.35,
  /** Pointer repulsion radius and force, in world units. */
  pointerRadius: 2.6,
  pointerForce: 2.4,
} as const;

export const GRID = {
  /** World size of the floor plane. */
  size: 90,
  /** Cell size — the 3D analogue of the 48px CSS underlay. */
  cell: 1.5,
  /** Every nth line is drawn brighter, giving the plane a readable structure. */
  majorEvery: 6,
  y: -5.2,
  /** Distance at which the grid has faded out entirely. */
  fade: 34,
} as const;

export const CAMERA = {
  position: [0, 0.6, 12] as const,
  fov: 34,
  near: 0.1,
  far: 120,
  /** Maximum pointer parallax, in world units. Deliberately small. */
  parallax: 0.85,
} as const;

/** Device pixel ratio range. The monitor steps within this under load. */
export const DPR_RANGE = [1, 2] as const;
