import { assetFor } from "@/lib/media/manifest";
import versions from "@/lib/media/versions.json";
import type { MediaSlot, VideoSlot } from "@/lib/types";

const mediaVersions = versions as Record<string, string>;

/**
 * Append a content hash to a local media URL.
 *
 * Replacing `public/media/line.jpg` with new bytes changes no URL, and
 * `/_next/image` caches on `(url, width, quality)` without an ETag — so the
 * optimizer would keep serving the old picture after the new one deployed.
 * The hash comes from `versions.json`, regenerated from the committed files on
 * every build, so the URL changes exactly when the bytes do.
 *
 * Callers — including the admin's Source field — always deal in the clean path
 * (`/media/line.jpg`). The version is applied here and nowhere else.
 */
function withVersion(src: string | undefined): string | undefined {
  if (!src) return src;

  // Remote sources are someone else's cache to manage.
  if (!src.startsWith("/")) return src;

  // Respect a query the author wrote themselves rather than mangling it.
  if (src.includes("?")) return src;

  const hash = mediaVersions[src];
  return hash ? `${src}?v=${hash}` : src;
}

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
    src: withVersion(src),
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

  return {
    ...slot,
    src: withVersion(src),
    poster: withVersion(override?.poster),
  };
}

export function resolveMediaSlots(
  slots: MediaSlot[],
  overrides: MediaOverrides = {},
): MediaSlot[] {
  return slots.map((slot) => resolveMediaSlot(slot, overrides));
}
