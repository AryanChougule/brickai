import { assetFor } from "@/lib/media/manifest";
import type { MediaSlot, VideoSlot } from "@/lib/types";

/** Admin-supplied overrides, keyed by slot id. */
export interface MediaOverride {
  /** Public path or absolute URL. Empty string clears back to the placeholder. */
  src?: string;
  caption?: string;
  alt?: string;
  poster?: string;
}

export type MediaOverrides = Record<string, MediaOverride>;

/**
 * Fill a slot's `src` from, in order: an admin override, then the asset
 * manifest. A slot with neither keeps `src` undefined and renders its
 * placeholder — which is the correct outcome for every slot that is waiting on
 * a real product screenshot, since no stock photograph can honestly stand in
 * for our own interface.
 */
export function resolveMediaSlot(
  slot: MediaSlot,
  overrides: MediaOverrides = {},
): MediaSlot {
  const override = overrides[slot.id];
  const asset = assetFor(slot.id);

  // An override with an explicitly empty src is a deliberate "clear this".
  const src =
    override && "src" in override ? override.src || undefined : asset?.file;

  return {
    ...slot,
    src,
    caption: override?.caption ?? slot.caption,
    alt: override?.alt ?? asset?.description ?? slot.caption,
  };
}

export function resolveVideoSlot(
  slot: VideoSlot,
  overrides: MediaOverrides = {},
): VideoSlot {
  const override = overrides[slot.id];
  const asset = assetFor(slot.id);

  const src =
    override && "src" in override ? override.src || undefined : asset?.file;

  return { ...slot, src, poster: override?.poster };
}

export function resolveMediaSlots(
  slots: MediaSlot[],
  overrides: MediaOverrides = {},
): MediaSlot[] {
  return slots.map((slot) => resolveMediaSlot(slot, overrides));
}
