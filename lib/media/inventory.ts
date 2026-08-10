import { capabilities } from "@/lib/content/capabilities";
import { capabilityDetails } from "@/lib/content/capability-details";
import { industries } from "@/lib/content/industries";
import { automationStages } from "@/lib/content/process";
import { projects } from "@/lib/content/projects";
import { assetFor, sourcePage, type RemoteAsset } from "@/lib/media/manifest";

/**
 * Every media slot on the site, collected by walking the content layer.
 *
 * Derived rather than hand-maintained: adding a screenshot to a capability adds
 * a row to the admin automatically, and a slot can never be forgotten because
 * someone edited content without updating a list.
 */

export type SlotKind = "photo" | "screenshot" | "video";

export interface InventoryEntry {
  id: string;
  kind: SlotKind;
  /** Human label for where this appears, e.g. "Capability · Computer Vision". */
  usedIn: string;
  /** Link to the page it appears on, for previewing a change. */
  href: string;
  caption: string;
  /** The vendored asset backing it, if any. */
  asset?: RemoteAsset;
  sourceUrl?: string;
}

/**
 * `photo` slots can legitimately hold licensed stock photography — they show
 * physical context. `screenshot` slots depict our own product, so stock imagery
 * cannot fill them honestly and they stay on placeholders until a real capture
 * exists. The admin surfaces that distinction rather than hiding it.
 */
function entry(
  id: string,
  kind: SlotKind,
  usedIn: string,
  href: string,
  caption: string,
): InventoryEntry {
  const asset = assetFor(id);
  return {
    id,
    kind,
    usedIn,
    href,
    caption,
    asset,
    sourceUrl: asset ? sourcePage(asset) : undefined,
  };
}

export function mediaInventory(): InventoryEntry[] {
  const rows: InventoryEntry[] = [];

  for (const stage of automationStages) {
    rows.push(
      entry(
        stage.slot.id,
        "photo",
        `Home · Automation — ${stage.name}`,
        "/#automation",
        stage.slot.caption,
      ),
    );
  }

  rows.push(
    entry(
      "auto-walkthrough",
      "video",
      "Home · Automation — plant walkthrough",
      "/#automation",
      "Watch the loop run",
    ),
  );

  for (const industry of industries) {
    rows.push(
      entry(
        `industry-${industry.slug}`,
        "photo",
        `Industry · ${industry.name}`,
        `/industries/${industry.slug}`,
        `${industry.name} — sector context`,
      ),
    );
  }

  for (const project of projects) {
    rows.push(
      entry(
        `work-${project.slug}`,
        "photo",
        `Case study · ${project.title}`,
        `/work/${project.slug}`,
        project.media,
      ),
    );

    for (const shot of project.gallery) {
      rows.push(
        entry(
          shot.id,
          "screenshot",
          `Case study · ${project.title}`,
          `/work/${project.slug}`,
          shot.caption,
        ),
      );
    }

    if (project.demo) {
      rows.push(
        entry(
          project.demo.id,
          "video",
          `Case study · ${project.title}`,
          `/work/${project.slug}`,
          project.demo.title,
        ),
      );
    }
  }

  for (const capability of capabilities) {
    const detail = capabilityDetails[capability.slug];
    if (!detail) continue;

    for (const shot of detail.screenshots) {
      rows.push(
        entry(
          shot.id,
          "screenshot",
          `Capability · ${capability.name}`,
          `/what-we-build/${capability.slug}`,
          shot.caption,
        ),
      );
    }

    rows.push(
      entry(
        detail.demo.id,
        "video",
        `Capability · ${capability.name}`,
        `/what-we-build/${capability.slug}`,
        detail.demo.title,
      ),
    );
  }

  return rows;
}

export interface InventorySummary {
  total: number;
  filled: number;
  awaiting: number;
  byKind: Record<SlotKind, { total: number; filled: number }>;
}

export function summarise(rows: InventoryEntry[]): InventorySummary {
  const byKind: InventorySummary["byKind"] = {
    photo: { total: 0, filled: 0 },
    screenshot: { total: 0, filled: 0 },
    video: { total: 0, filled: 0 },
  };

  for (const row of rows) {
    byKind[row.kind].total += 1;
    if (row.asset) byKind[row.kind].filled += 1;
  }

  const filled = rows.filter((row) => row.asset).length;
  return { total: rows.length, filled, awaiting: rows.length - filled, byKind };
}
