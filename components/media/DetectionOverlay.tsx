import type { DetectionBox } from "@/lib/media/detections";

/**
 * Bounding-box annotations drawn over a photograph.
 *
 * Purely decorative and `aria-hidden`: the surrounding caption carries the
 * meaning, and a screen reader gains nothing from a list of coordinates. Built
 * from positioned divs rather than SVG so the labels use the same type ramp as
 * the rest of the site and wrap correctly at small sizes.
 *
 * Uses the system's square corners and 2px rules, so an annotated frame reads
 * as part of the design rather than a screenshot pasted on top.
 */
export function DetectionOverlay({ boxes }: { boxes: DetectionBox[] }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {boxes.map((box, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.w}%`,
            height: `${box.h}%`,
            border: `2px solid ${
              box.reject ? "var(--color-accent)" : "rgba(255,167,107,0.9)"
            }`,
          }}
        >
          {/* Label sits above the box, flush left, and tucks inside near the
              top edge so it never clips outside the frame. */}
          <span
            className="absolute left-0 whitespace-nowrap px-1.5 py-0.5 text-micro uppercase"
            style={{
              [box.y < 8 ? "top" : "bottom"]: "100%",
              background: box.reject
                ? "var(--color-accent)"
                : "rgba(255,167,107,0.9)",
              color: "var(--color-ground)",
            }}
          >
            {box.label} {box.score.toFixed(2)}
          </span>
        </div>
      ))}

      {/* Self-labelling. These boxes are hand-placed, not model output, and the
          badge travels with the overlay so the claim cannot drift from the
          picture if a caption is edited later. */}
      <span
        className="absolute bottom-2 right-2 px-1.5 py-0.5 text-micro uppercase"
        style={{
          background: "rgba(23,21,21,0.82)",
          color: "var(--color-accent-text)",
        }}
      >
        Illustration
      </span>
    </div>
  );
}
