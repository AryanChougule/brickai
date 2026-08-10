"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { techGroups } from "@/lib/content/tech-graph";
import type { Capability, TechEdge, TechGroup, TechNode } from "@/lib/types";
import { cn } from "@/lib/utils";

// The graph runs its own RAF loop and is never needed for first paint.
const KnowledgeGraph = dynamic(
  () => import("@/components/stack/KnowledgeGraph").then((m) => m.KnowledgeGraph),
  { ssr: false },
);

interface TechStackExplorerProps {
  nodes: TechNode[];
  edges: TechEdge[];
  capabilities: Capability[];
  /** The dedicated /stack page shows the full group index; the home section does not. */
  showGroups?: boolean;
}

/**
 * The interactive technology stack: a force-directed graph paired with a
 * keyboard-operable index of the same nodes.
 *
 * The canvas is decorative and hidden from assistive tech — every node is also a
 * real button in the list, so the graph is an enhancement rather than the only
 * way in.
 */
export function TechStackExplorer({
  nodes,
  edges,
  capabilities,
  showGroups = true,
}: TechStackExplorerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  // A pinned selection wins over hover, so the panel does not flicker while the
  // pointer crosses the canvas on its way to a link.
  const activeId = selectedId ?? hoverId;
  const active = nodes.find((node) => node.id === activeId) ?? null;

  const grouped = useMemo(() => {
    return (Object.keys(techGroups) as TechGroup[]).map((group) => ({
      group,
      meta: techGroups[group],
      items: nodes.filter((node) => node.group === group),
    }));
  }, [nodes]);

  const activeCapabilities = useMemo(() => {
    if (!active) return [];
    return capabilities.filter((capability) =>
      active.capabilities.includes(capability.slug),
    );
  }, [active, capabilities]);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        {/* Graph */}
        <div className="relative h-[420px] overflow-hidden rule-all bg-ground-graph md:h-[520px]">
          <KnowledgeGraph
            nodes={nodes}
            edges={edges}
            activeId={activeId}
            onHover={setHoverId}
            onSelect={(id) =>
              setSelectedId((current) => (current === id ? null : id))
            }
          />
          <p className="pointer-events-none absolute bottom-4 left-4 text-micro uppercase text-ink-ghost">
            Move your cursor through the graph · click to pin
          </p>
        </div>

        {/* Detail */}
        <div className="flex min-h-[420px] flex-col rule-all p-7">
          {active ? (
            <>
              <p className="text-micro uppercase text-accent-text">
                {techGroups[active.group].label}
              </p>
              <h3 className="mt-2 text-h4">{active.label}</h3>
              <p className="mt-3 text-sm text-ink-dim">{active.blurb}</p>

              {activeCapabilities.length > 0 ? (
                <div className="mt-6">
                  <p className="mb-3 text-micro uppercase text-accent-text">
                    Used in
                  </p>
                  <ul className="flex flex-col gap-2 text-sm">
                    {activeCapabilities.map((capability) => (
                      <li key={capability.slug}>
                        <Link
                          href={`/what-we-build/${capability.slug}`}
                          className="flex gap-2 text-ink-dim hover:text-accent-soft"
                        >
                          <span aria-hidden="true" className="font-extrabold text-accent">
                            →
                          </span>
                          {capability.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {selectedId ? (
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="mt-auto cursor-pointer pt-8 text-left text-[13px] font-extrabold text-accent-text hover:text-accent-soft"
                >
                  Unpin selection
                </button>
              ) : null}
            </>
          ) : (
            <>
              <p className="text-micro uppercase text-accent-text">
                No selection
              </p>
              <h3 className="mt-2 text-h4">Every system draws on this stack.</h3>
              <p className="mt-3 max-w-[40ch] text-sm text-ink-mute">
                Four hubs — Python, LLMs, React and Kubernetes — carry most of
                the load. Hover a node in the graph, or pick one from the index
                below, to see what it does and where we use it.
              </p>
              <dl className="mt-auto grid grid-cols-2 grid-hairline-inner">
                <div className="bg-ground p-4">
                  <dt className="text-micro uppercase text-ink-faint">
                    Technologies
                  </dt>
                  <dd className="text-xl font-extrabold text-ink">
                    {nodes.length}
                  </dd>
                </div>
                <div className="bg-ground p-4">
                  <dt className="text-micro uppercase text-accent-text">
                    Connections
                  </dt>
                  <dd className="text-xl font-extrabold text-accent">
                    {edges.length}
                  </dd>
                </div>
              </dl>
            </>
          )}
        </div>
      </div>

      {/* Keyboard-operable index over the same nodes */}
      {showGroups ? (
        <div className="grid grid-hairline grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {grouped.map(({ group, meta, items }) => (
            <div key={group} className="flex flex-col bg-ground p-6">
              <h3 className="text-micro uppercase text-accent-text">
                {meta.label}
              </h3>
              <p className="mt-1 text-[13px] text-ink-faint">{meta.caption}</p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {items.map((node) => {
                  const isActive = node.id === activeId;
                  return (
                    <li key={node.id}>
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onClick={() =>
                          setSelectedId((current) =>
                            current === node.id ? null : node.id,
                          )
                        }
                        onFocus={() => setHoverId(node.id)}
                        onBlur={() => setHoverId(null)}
                        onMouseEnter={() => setHoverId(node.id)}
                        onMouseLeave={() => setHoverId(null)}
                        className={cn(
                          "cursor-pointer border px-3 py-2 text-[13px] transition-colors duration-[--duration-hover]",
                          isActive
                            ? "border-accent bg-accent text-ground"
                            : "border-hairline text-ink-dim hover:border-edge hover:text-ink",
                        )}
                      >
                        {node.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
