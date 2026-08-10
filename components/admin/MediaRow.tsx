"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveMediaSlot } from "@/lib/actions/admin";
import { initialAdminResult, type AdminResult } from "@/lib/actions/admin-state";
import type { InventoryEntry } from "@/lib/media/inventory";
import { cn } from "@/lib/utils";

/**
 * One editable media slot.
 *
 * Each row is its own form so a save touches one slot only — a single page-wide
 * form over 60 slots would rewrite every override on every save and make
 * concurrent edits destructive.
 */
export function MediaRow({
  slot,
  currentSrc,
  overridden,
}: {
  slot: InventoryEntry;
  currentSrc?: string;
  overridden: boolean;
}) {
  const [state, action] = useActionState<AdminResult, FormData>(
    saveMediaSlot,
    initialAdminResult,
  );

  const failed = state.status === "error";
  const filled = Boolean(currentSrc);

  return (
    <li className="flex flex-col gap-4 bg-ground p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[12px] text-accent-text">{slot.id}</p>
          <p className="mt-1 text-sm font-extrabold text-ink">{slot.caption}</p>
          <p className="mt-1 text-[12px] text-ink-faint">
            {slot.usedIn} ·{" "}
            <a href={slot.href} className="text-accent-text hover:text-accent-soft">
              view page
            </a>
            {slot.sourceUrl ? (
              <>
                {" · "}
                <a
                  href={slot.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-accent-text hover:text-accent-soft"
                >
                  source (Pexels)
                </a>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge kind={slot.kind} />
          <span
            className={cn(
              "border px-2 py-1 text-micro uppercase",
              filled
                ? "border-accent-hairline text-accent-soft"
                : "border-hairline text-ink-faint",
            )}
          >
            {filled ? (overridden ? "overridden" : "filled") : "placeholder"}
          </span>
        </div>
      </div>

      {/* Preview */}
      {filled && slot.kind !== "video" ? (
        /* Deliberately a plain <img>: an admin may point a slot at an arbitrary
           remote URL, which next/image would reject unless the host is in the
           config allowlist. This preview is behind the admin gate and never
           ships to visitors, so optimisation is not worth the constraint. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt=""
          className="h-28 w-full max-w-[280px] border border-hairline object-cover grayscale-media"
        />
      ) : null}

      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={slot.id} />

        <label className="flex flex-col gap-1">
          <span className="text-micro uppercase text-ink-mute">
            Source — /public path or https URL (empty clears)
          </span>
          <input
            name="src"
            defaultValue={currentSrc ?? ""}
            placeholder="/media/example.jpg"
            className="min-h-[44px] w-full border border-divider bg-ground-raised px-3 py-2 font-mono text-[13px] text-ink"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-micro uppercase text-ink-mute">Caption</span>
            <input
              name="caption"
              defaultValue={slot.caption}
              className="min-h-[44px] w-full border border-divider bg-ground-raised px-3 py-2 text-[13px] text-ink"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-micro uppercase text-ink-mute">
              Alt text
            </span>
            <input
              name="alt"
              defaultValue={slot.asset?.description ?? ""}
              placeholder="What the image actually shows"
              className="min-h-[44px] w-full border border-divider bg-ground-raised px-3 py-2 text-[13px] text-ink"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SaveButton />
          {overridden ? (
            // Submits the same action; the button's own name/value selects
            // the reset branch server-side.
            <button
              type="submit"
              name="intent"
              value="reset"
              className="touch-target cursor-pointer border border-edge px-4 py-2 text-[13px] font-extrabold text-ink hover:bg-[rgba(248,244,244,0.08)]"
            >
              Reset to default
            </button>
          ) : null}

          {state.message ? (
            <p
              role="status"
              className={cn(
                "text-[12px]",
                failed ? "text-accent-soft" : "text-ink-mute",
              )}
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </li>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="touch-target cursor-pointer bg-accent px-4 py-2 text-[13px] font-extrabold text-ground hover:bg-accent-hover disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

function Badge({ kind }: { kind: InventoryEntry["kind"] }) {
  const label =
    kind === "screenshot" ? "product UI" : kind === "video" ? "video" : "photo";
  return (
    <span className="border border-hairline px-2 py-1 text-micro uppercase text-ink-soft">
      {label}
    </span>
  );
}
