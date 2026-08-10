import Image from "next/image";
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
}: ImageSlotProps) {
  return (
    <figure
      className={cn(
        "relative w-full overflow-hidden bg-ground-deep",
        grayscale && "grayscale-media",
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
          className="object-cover"
        />
      ) : (
        <Placeholder caption={slot.caption} id={slot.id} />
      )}
    </figure>
  );
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
