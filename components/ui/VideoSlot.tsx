import { cn } from "@/lib/utils";
import type { VideoSlot as VideoSlotData } from "@/lib/types";

interface VideoSlotProps {
  slot: VideoSlotData;
  className?: string;
  /** Stretches to fill a positioned parent instead of holding its own ratio. */
  fill?: boolean;
}

/**
 * A demo video, or the reserved location for one.
 *
 * Once the CMS adapter resolves `slot.src` this becomes a real `<video>` with
 * controls and `preload="none"` — no autoplay, so it never competes with the
 * page for attention or bandwidth, and nothing is fetched until a visitor asks
 * for it. Until then it is a labelled poster well carrying the runtime and
 * synopsis, so the page reads complete in review.
 */
export function VideoSlot({ slot, className, fill }: VideoSlotProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-ground-deep",
        fill ? "absolute inset-0" : "aspect-video w-full",
        className,
      )}
    >
      {slot.src ? (
        <video
          controls
          preload="none"
          poster={slot.poster}
          playsInline
          className="h-full w-full object-cover"
          aria-label={slot.title}
        >
          <source src={slot.src} type="video/mp4" />
          Your browser cannot play this video.
        </video>
      ) : (
        <>
          <div className="absolute inset-0 wire-grid grayscale-media" />
          <div className="absolute inset-x-8 bottom-8 flex flex-wrap items-center gap-[14px]">
            <PlayMark />
            <div className="bg-[rgba(23,21,21,0.85)] px-[14px] py-[10px]">
              <p className="text-[12px] font-extrabold text-ink">
                {slot.title}
              </p>
              <p className="text-[11px] text-ink-mute">
                {slot.duration} — video placeholder
              </p>
            </div>
          </div>
          <p className="absolute inset-x-8 top-8 max-w-[46ch] text-[13px] text-ink-ghost">
            {slot.synopsis}
          </p>
        </>
      )}
    </div>
  );
}

/** 56px accent square with a solid play triangle, per the design source. */
function PlayMark() {
  return (
    <span
      className="flex h-14 w-14 shrink-0 items-center justify-center bg-accent text-ground"
      aria-hidden="true"
    >
      <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor">
        <path d="M0 0 L18 10 L0 20 Z" />
      </svg>
    </span>
  );
}
