import Image from "next/image";
import { DetectionOverlay } from "@/components/media/DetectionOverlay";
import { detectionsFor } from "@/lib/media/detections";
import { cn } from "@/lib/utils";
import type { MediaSlot } from "@/lib/types";

interface ImageSlotProps {
  slot: MediaSlot;
  /** Applies the system's grayscale + contrast treatment to photography. */
  grayscale?: boolean;
  className?: string;
  /** Passed to next/image; set for above-the-fold slots only. */
  priority?: boolean;
  sizes?: string;
  /**
   * Draw the illustrative detection boxes registered for this slot, when it has
   * any. Off by default so the annotation only appears where a caption explains
   * it.
   */
  annotate?: boolean;
}

/**
 * A reserved location for a photograph or screenshot.
 *
 * Renders the real image once the CMS adapter has resolved `slot.src`, and
 * until then an explicitly-labelled placeholder holding the correct aspect
 * ratio, so layout never shifts on hand-off.
 *
 * Slots awaiting a product screenshot stay on the placeholder deliberately —
 * stock photography cannot stand in for our own interface without the page
 * claiming something untrue.
 */
export function ImageSlot({
  slot,
  grayscale,
  className,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  annotate = false,
}: ImageSlotProps) {
  const boxes = annotate ? detectionsFor(slot.id) : undefined;
  return (
    <figure
      className={cn(
        "relative w-full overflow-hidden bg-ground-deep",
        className,
      )}
      style={slot.aspect ? { aspectRatio: slot.aspect } : undefined}
    >
      {slot.src ? (
        <Image
          src={slot.src}
          alt={slot.alt ?? slot.caption}
          fill
          sizes={sizes}
          priority={priority}
          /*
           * Remote sources bypass the optimizer.
           *
           * `/_next/image` rejects any host not in `images.remotePatterns` with
           * a 400, and the admin deliberately accepts arbitrary https URLs as
           * an escape hatch. Allowlisting `**` would instead turn this site's
           * optimizer into an open image proxy for the whole internet. Serving
           * remote URLs unoptimized costs a little bandwidth on what is meant
           * to be a temporary source; vendored local files — the normal path —
           * are still fully optimized.
           */
          unoptimized={isRemote(slot.src)}
          /* The treatment sits on the photo, not the figure: a filter on the
             wrapper would desaturate the annotation overlay too. */
          className={cn("object-cover", grayscale && "grayscale-media")}
        />
      ) : (
        <div className={cn(grayscale && "grayscale-media")}>
          <Placeholder caption={slot.caption} id={slot.id} />
        </div>
      )}

      {/* Only over a real photograph — boxes on an empty placeholder would be
          annotating nothing. */}
      {slot.src && boxes ? <DetectionOverlay boxes={boxes} /> : null}
    </figure>
  );
}

/** Local public paths start with "/"; anything else is another origin. */
function isRemote(src: string) {
  return /^https?:\/\//i.test(src);
}

function Placeholder({ caption, id }: { caption: string; id: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center wire-grid">
      <figcaption className="mx-6 max-w-[80%] border border-dashed border-edge px-7 py-6 text-center">
        <span className="block text-kicker uppercase text-ink-ghost">
          {caption}
        </span>
        <span className="mt-2 block text-micro uppercase text-ink-vapor">
          image slot · {id}
        </span>
      </figcaption>
    </div>
  );
}
