import type { Architecture } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Procedural architecture diagram. Tiers are generated from the content layer
 * rather than drawn by hand, so adding a layer to a capability's data adds a
 * band to its diagram.
 *
 * Built from HTML rather than SVG deliberately: the node labels wrap, the tiers
 * reflow to one column on narrow screens, and a screen reader reads it as the
 * ordered list of tiers that it actually is.
 */
export function ArchitectureDiagram({
  architecture,
}: {
  architecture: Architecture;
}) {
  return (
    <figure className="flex flex-col">
      <figcaption className="sr-only">
        {architecture.title}. {architecture.layers.length} tiers, from{" "}
        {architecture.layers[0]?.title} to{" "}
        {architecture.layers[architecture.layers.length - 1]?.title}.
      </figcaption>

      <ol className="flex flex-col rule-all">
        {architecture.layers.map((layer, index) => (
          <li key={layer.title} className="flex flex-col">
            {index > 0 ? <Connector /> : null}

            <div
              className={cn(
                "grid gap-6 p-6 md:grid-cols-[minmax(180px,260px)_1fr]",
                layer.accent ? "bg-ground-raised" : "bg-ground",
              )}
            >
              <div className="flex gap-4">
                <span
                  className={cn(
                    "text-[11px] tracking-[0.12em]",
                    layer.accent ? "text-accent" : "text-ink-faint",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4
                    className={cn(
                      "text-base font-extrabold",
                      layer.accent ? "text-accent-soft" : "text-ink",
                    )}
                  >
                    {layer.title}
                  </h4>
                  <p className="mt-1 text-[13px] text-ink-faint">
                    {layer.caption}
                  </p>
                </div>
              </div>

              <ul className="flex flex-wrap content-start gap-2">
                {layer.nodes.map((node) => (
                  <li
                    key={node}
                    className={cn(
                      "border px-3 py-2 text-[13px]",
                      layer.accent
                        ? "border-accent-edge text-accent-soft"
                        : "border-hairline text-ink-dim",
                    )}
                  >
                    {node}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 max-w-[720px] text-sm text-ink-mute">
        {architecture.description}
      </p>
    </figure>
  );
}

/** The tier boundary: a full-width hairline with a centred accent tick. */
function Connector() {
  return (
    <div className="relative h-0 border-t border-hairline" aria-hidden="true">
      <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-accent" />
    </div>
  );
}
