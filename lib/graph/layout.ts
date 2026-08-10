import { seededRandom } from "@/lib/utils";
import type { TechEdge, TechNode } from "@/lib/types";

/**
 * Spring force layout, matching the motion spec:
 *   node repulsion 2200/d², edge rest length 130px, centre gravity,
 *   cursor repulsion within 150px, velocity damping 0.9 per frame.
 *
 * Deliberately dependency-free and framework-free: it is pure state plus a
 * `step` function, so the canvas component just draws whatever it produces and
 * the whole thing is testable without a DOM.
 */

export const LAYOUT = {
  repulsion: 2200,
  restLength: 130,
  edgeStiffness: 0.002,
  gravityX: 0.0004,
  gravityY: 0.0006,
  damping: 0.9,
  pointerRadius: 150,
  pointerForce: 0.6,
  /** Hubs are pulled harder toward the centre so they read as hubs. */
  hubGravityBoost: 2.2,
  /** Keeps chips fully inside the frame. */
  padding: { x: 64, y: 30 },
} as const;

export interface LayoutNode {
  id: string;
  label: string;
  hub: boolean;
  group: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Measured chip width, filled in by the renderer once it has a font. */
  width: number;
}

export interface LayoutEdge {
  a: number;
  b: number;
}

export interface Layout {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
}

/**
 * Seeded initial placement. The same graph every load, and identical between
 * server and client — the layout then relaxes from there.
 */
export function createLayout(
  nodes: TechNode[],
  edges: TechEdge[],
  size: { width: number; height: number },
): Layout {
  const index = new Map(nodes.map((node, i) => [node.id, i]));

  return {
    nodes: nodes.map((node, i) => ({
      id: node.id,
      label: node.label,
      hub: Boolean(node.hub),
      group: node.group,
      // Spread on a ring rather than uniformly: the relaxation converges faster
      // and never starts with everything stacked in the middle.
      x:
        size.width / 2 +
        Math.cos((i / nodes.length) * Math.PI * 2) *
          size.width *
          (0.18 + seededRandom(i + 1) * 0.16),
      y:
        size.height / 2 +
        Math.sin((i / nodes.length) * Math.PI * 2) *
          size.height *
          (0.2 + seededRandom(i + 21) * 0.18),
      vx: 0,
      vy: 0,
      width: 60,
    })),
    edges: edges
      .map((edge) => ({
        a: index.get(edge.from) ?? -1,
        b: index.get(edge.to) ?? -1,
      }))
      // An edge referencing an unknown id is a content error; drop it rather
      // than indexing out of bounds every frame.
      .filter((edge) => edge.a >= 0 && edge.b >= 0),
  };
}

/** Advance the simulation one frame. Mutates `layout.nodes` in place. */
export function stepLayout(
  layout: Layout,
  size: { width: number; height: number },
  pointer: { x: number; y: number },
) {
  const { nodes, edges } = layout;

  // Pairwise repulsion — 24 nodes is 276 pairs, cheap enough to do exactly
  // rather than approximating with a quadtree.
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      const distanceSq = dx * dx + dy * dy || 1;
      const distance = Math.sqrt(distanceSq);
      const force = LAYOUT.repulsion / distanceSq;

      dx /= distance;
      dy /= distance;
      a.vx += dx * force;
      a.vy += dy * force;
      b.vx -= dx * force;
      b.vy -= dy * force;
    }
  }

  // Edges behave as springs toward the rest length.
  for (const edge of edges) {
    const a = nodes[edge.a];
    const b = nodes[edge.b];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = (distance - LAYOUT.restLength) * LAYOUT.edgeStiffness;

    a.vx += (dx / distance) * force;
    a.vy += (dy / distance) * force;
    b.vx -= (dx / distance) * force;
    b.vy -= (dy / distance) * force;
  }

  const centreX = size.width / 2;
  const centreY = size.height / 2;
  const pointerRadiusSq = LAYOUT.pointerRadius * LAYOUT.pointerRadius;

  for (const node of nodes) {
    const boost = node.hub ? LAYOUT.hubGravityBoost : 1;
    node.vx += (centreX - node.x) * LAYOUT.gravityX * boost;
    node.vy += (centreY - node.y) * LAYOUT.gravityY * boost;

    const dx = node.x - pointer.x;
    const dy = node.y - pointer.y;
    const distanceSq = dx * dx + dy * dy;
    if (distanceSq < pointerRadiusSq && distanceSq > 1) {
      const distance = Math.sqrt(distanceSq);
      node.vx += (dx / distance) * LAYOUT.pointerForce;
      node.vy += (dy / distance) * LAYOUT.pointerForce;
    }

    node.vx *= LAYOUT.damping;
    node.vy *= LAYOUT.damping;
    node.x += node.vx;
    node.y += node.vy;

    const padX = Math.max(LAYOUT.padding.x, node.width / 2 + 12);
    node.x = Math.min(size.width - padX, Math.max(padX, node.x));
    node.y = Math.min(
      size.height - LAYOUT.padding.y,
      Math.max(LAYOUT.padding.y, node.y),
    );
  }
}

/** Index of the node under a point, or -1. Uses the measured chip box. */
export function hitTest(layout: Layout, x: number, y: number) {
  for (let i = layout.nodes.length - 1; i >= 0; i--) {
    const node = layout.nodes[i];
    const halfWidth = node.width / 2 + 9;
    if (
      x >= node.x - halfWidth &&
      x <= node.x + halfWidth &&
      y >= node.y - 14 &&
      y <= node.y + 14
    ) {
      return i;
    }
  }
  return -1;
}
