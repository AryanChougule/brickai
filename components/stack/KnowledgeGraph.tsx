"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useCanvas2D } from "@/hooks/useCanvas2D";
import { usePointer } from "@/hooks/usePointer";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import {
  createLayout,
  hitTest,
  stepLayout,
  type Layout,
} from "@/lib/graph/layout";
import type { TechEdge, TechNode } from "@/lib/types";

/**
 * Canvas has no access to CSS variables, so these literals mirror the tokens in
 * `styles/theme.css`. Accent values track `--color-accent` (#f26511) and
 * `--color-accent-text` (#ffa76b); retune both together.
 */
const COLORS = {
  edge: "rgba(255,167,107,0.28)",
  edgeActive: "rgba(242,101,17,0.85)",
  edgeDim: "rgba(255,167,107,0.10)",
  chip: "#131111",
  chipBorder: "rgba(248,244,244,0.35)",
  chipBorderDim: "rgba(248,244,244,0.12)",
  chipText: "#bab6b6",
  chipTextDim: "#605d5d",
  accent: "#f26511",
  // Text sitting ON an accent-filled chip. Dark, not light: orange carries too
  // much luminance for light text to clear the contrast floor.
  onAccent: "#171515",
} as const;

/**
 * Canvas `font` cannot resolve a CSS variable, and next/font generates a hashed
 * family name — so read the variable's computed value once and cache it.
 */
let cachedFamily: string | null = null;

function graphFontFamily() {
  if (cachedFamily) return cachedFamily;

  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-archivo")
    .trim();

  cachedFamily = resolved ? `${resolved}, Archivo, sans-serif` : "Archivo, sans-serif";
  return cachedFamily;
}

function chipFont(hub: boolean, family: string) {
  return `${hub ? 800 : 600} ${hub ? 15 : 12}px ${family}`;
}

interface KnowledgeGraphProps {
  nodes: TechNode[];
  edges: TechEdge[];
  /** Currently inspected node, from hover here or from the list beside it. */
  activeId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/**
 * Force-directed graph on a 2D canvas.
 *
 * The canvas is decorative and unfocusable; the accompanying list is the
 * keyboard-operable path to the same information. Under reduced motion
 * `useCanvas2D` renders exactly one relaxed frame and never starts a loop.
 */
export function KnowledgeGraph({
  nodes,
  edges,
  activeId,
  onHover,
  onSelect,
}: KnowledgeGraphProps) {
  // The canvas ref is owned here rather than returned by useCanvas2D, so
  // usePointer can observe the same element without a forward reference.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = usePointer(canvasRef);
  const layoutRef = useRef<Layout | null>(null);
  const hoverIndexRef = useRef(-1);
  const reduced = usePrefersReducedMotion();

  /** Adjacency, so highlighting a node can dim everything unrelated to it. */
  const neighbours = useMemo(() => {
    const map = new Map<string, Set<string>>(
      nodes.map((node) => [node.id, new Set<string>()]),
    );
    for (const edge of edges) {
      map.get(edge.from)?.add(edge.to);
      map.get(edge.to)?.add(edge.from);
    }
    return map;
  }, [nodes, edges]);

  const setup = useCallback(
    (size: { width: number; height: number }) => {
      layoutRef.current = createLayout(nodes, edges, size);

      // Reduced motion gets a settled layout rather than the initial ring —
      // one static frame still has to read as a graph.
      if (reduced) {
        for (let i = 0; i < 240; i++) {
          stepLayout(layoutRef.current, size, { x: -9000, y: -9000 });
        }
      }
    },
    [nodes, edges, reduced],
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, frame: { width: number; height: number }) => {
      const layout = layoutRef.current;
      if (!layout) return;

      const size = { width: frame.width, height: frame.height };
      const pointerState = pointer.current;
      const pointerPosition = pointerState.inside
        ? { x: pointerState.x, y: pointerState.y }
        : { x: -9000, y: -9000 };

      // Chip widths depend on the font, which is only measurable here.
      const family = graphFontFamily();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const node of layout.nodes) {
        ctx.font = chipFont(node.hub, family);
        node.width = ctx.measureText(node.label).width;
      }

      if (!reduced) stepLayout(layout, size, pointerPosition);

      const hoverIndex = pointerState.inside
        ? hitTest(layout, pointerPosition.x, pointerPosition.y)
        : -1;

      if (hoverIndex !== hoverIndexRef.current) {
        hoverIndexRef.current = hoverIndex;
        onHover(hoverIndex >= 0 ? layout.nodes[hoverIndex].id : null);
      }

      const active = activeId;
      const related = active ? neighbours.get(active) : undefined;
      const isRelated = (id: string) =>
        !active || id === active || Boolean(related?.has(id));

      ctx.clearRect(0, 0, size.width, size.height);

      // Edges first, so chips always sit on top of their own connections.
      ctx.lineWidth = 1;
      for (const edge of layout.edges) {
        const a = layout.nodes[edge.a];
        const b = layout.nodes[edge.b];
        const touchesActive =
          Boolean(active) && (a.id === active || b.id === active);

        ctx.strokeStyle = touchesActive
          ? COLORS.edgeActive
          : active
            ? COLORS.edgeDim
            : COLORS.edge;
        ctx.lineWidth = touchesActive ? 1.6 : 1;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const node of layout.nodes) {
        const isActive = node.id === active;
        const dim = !isRelated(node.id);
        const halfWidth = node.width / 2;

        ctx.font = chipFont(node.hub, family);

        if (node.hub || isActive) {
          // Filled accent chip.
          ctx.globalAlpha = dim ? 0.35 : 1;
          ctx.fillStyle = COLORS.accent;
          ctx.fillRect(node.x - halfWidth - 9, node.y - 13, node.width + 18, 26);
          ctx.fillStyle = COLORS.onAccent;
        } else {
          // Outlined chip on the graph ground.
          ctx.globalAlpha = 1;
          ctx.fillStyle = COLORS.chip;
          ctx.fillRect(node.x - halfWidth - 8, node.y - 12, node.width + 16, 24);
          ctx.strokeStyle = dim ? COLORS.chipBorderDim : COLORS.chipBorder;
          ctx.lineWidth = 1;
          ctx.strokeRect(
            node.x - halfWidth - 8,
            node.y - 12,
            node.width + 16,
            24,
          );
          ctx.fillStyle = dim ? COLORS.chipTextDim : COLORS.chipText;
        }

        ctx.fillText(node.label, node.x, node.y);
        ctx.globalAlpha = 1;
      }
    },
    [activeId, neighbours, onHover, pointer, reduced],
  );

  useCanvas2D({ draw, setup, ref: canvasRef });

  // Clicking a chip pins it, which is what makes the detail panel usable with
  // a mouse as well as by keyboard from the list.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onClick = () => {
      const index = hoverIndexRef.current;
      const layout = layoutRef.current;
      if (index >= 0 && layout) onSelect(layout.nodes[index].id);
    };

    canvas.addEventListener("click", onClick);
    return () => canvas.removeEventListener("click", onClick);
  }, [canvasRef, onSelect]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ cursor: activeId ? "pointer" : "default" }}
    />
  );
}
