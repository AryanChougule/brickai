import { ImageSlot } from "@/components/ui/ImageSlot";
import type { MediaSlot } from "@/lib/types";

/**
 * Example screenshots. Every entry is an `ImageSlot`, so the layout is already
 * final — supplying the real captures is a `src` per slot and nothing more.
 */
export function ScreenshotGallery({
  screenshots,
  /** Portrait slots (mobile captures) need a narrower track. */
  min = 320,
}: {
  screenshots: MediaSlot[];
  min?: number;
}) {
  return (
    <ul
      className="grid grid-hairline"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))` }}
    >
      {screenshots.map((slot) => (
        <li key={slot.id} className="flex flex-col bg-ground p-4">
          <ImageSlot slot={slot} className="border border-hairline" />
          <p className="mt-3 text-[13px] text-ink-mute">{slot.caption}</p>
        </li>
      ))}
    </ul>
  );
}
