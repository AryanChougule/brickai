import "server-only";

import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import type { MediaOverrides } from "@/lib/media/resolve";
import type { Testimonial } from "@/lib/types";

/**
 * Editable content store.
 *
 * The admin writes here; the CMS adapter merges it over the defaults in
 * `lib/content`. A flat JSON file rather than a database, because the whole
 * point of the content layer is that swapping the backing store is one module
 * — and a file is the least ceremony that survives a restart.
 *
 * NOTE: this requires a writable filesystem, so it works in development and on
 * a self-hosted or containerised deployment. On a read-only serverless target
 * the admin is read-only too; that is the point at which to swap this module
 * for a real CMS or database.
 */

const STORE_PATH = join(process.cwd(), "content", "overrides.json");

export interface ContentOverrides {
  media: MediaOverrides;
  /** Replaces the default testimonial list wholesale when present. */
  testimonials?: Testimonial[];
  updatedAt?: string;
}

const EMPTY: ContentOverrides = { media: {} };

export async function readOverrides(): Promise<ContentOverrides> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<ContentOverrides>;
    return { ...EMPTY, ...parsed, media: parsed.media ?? {} };
  } catch (error) {
    // A missing store is the normal first-run state, not an error.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return EMPTY;

    // A malformed store must not take the whole site down: every page reads
    // this, so throwing here would turn one bad edit into a site-wide 500.
    // Fall back to the defaults and complain loudly instead.
    console.error(
      "[cms] content/overrides.json could not be parsed — falling back to " +
        "defaults. Fix or delete the file.",
      error,
    );
    return EMPTY;
  }
}

/**
 * Write atomically: serialise to a temporary file, then rename over the target.
 *
 * `writeFile` truncates before it writes, so a reader arriving mid-write sees
 * an empty or partial file — and with a page per media slot all revalidating at
 * once, that race is not theoretical. `rename` within the same directory is
 * atomic, so a reader sees either the old file or the new one.
 */
export async function writeOverrides(next: ContentOverrides): Promise<void> {
  const payload = `${JSON.stringify(
    { ...next, updatedAt: new Date().toISOString() },
    null,
    2,
  )}\n`;

  const temporary = `${STORE_PATH}.${process.pid}.tmp`;

  try {
    await mkdir(dirname(STORE_PATH), { recursive: true });
    await writeFile(temporary, payload, "utf8");
    await rename(temporary, STORE_PATH);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      // Expected on serverless. Translate the errno into something an admin
      // user can act on, rather than surfacing "EROFS" in the UI.
      throw new Error(
        "This deployment has a read-only filesystem, so content edits cannot " +
          "be saved. Run the admin locally, or add a database and swap " +
          "lib/cms/overrides.ts.",
      );
    }
    throw error;
  }
}

/**
 * Whether content edits can be saved here.
 *
 * Probes the directory's write permission rather than performing a real write:
 * the previous version round-tripped the whole store on every admin page load,
 * which bumped `updatedAt` just for asking the question.
 */
export async function storeIsWritable(): Promise<boolean> {
  try {
    await mkdir(dirname(STORE_PATH), { recursive: true });
    await access(dirname(STORE_PATH), constants.W_OK);
    return true;
  } catch {
    return false;
  }
}
