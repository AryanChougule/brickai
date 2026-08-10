#!/usr/bin/env node
/**
 * Content-hash every file in `public/media` into `lib/media/versions.json`.
 *
 * Runs automatically before each build (`prebuild`), so on Vercel it executes
 * against the freshly-checked-out repository — which makes the committed files
 * the source of truth for production images.
 *
 * WHY THIS EXISTS
 * ---------------
 * Replacing `public/media/line.jpg` with new bytes at the same path does not
 * change any URL. The raw file revalidates fine (Vercel serves public assets
 * with an ETag and `max-age=0, must-revalidate`), but `/_next/image` is cached
 * on `(url, width, quality)` and returns no ETag — so the optimizer can keep
 * serving the previous image after the new one is deployed.
 *
 * Appending `?v=<contentHash>` at resolve time makes the optimizer cache key
 * change exactly when, and only when, the bytes change. Same filename, new
 * image, new URL, no manual purge — and unchanged files keep their long-lived
 * cache entries, so this costs nothing in steady state.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA_DIR = join(ROOT, "public", "media");
const OUTPUT = join(ROOT, "lib", "media", "versions.json");

/** Short hashes keep URLs readable; 10 hex chars is ample for cache busting. */
const HASH_LENGTH = 10;

/** Metadata, not media — no component ever renders it through a slot. */
const SKIP = new Set(["credits.json", ".gitkeep", ".DS_Store"]);

async function walk(dir) {
  const found = [];
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return found;
    throw error;
  }

  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await walk(full)));
    } else if (!SKIP.has(entry.name)) {
      found.push(full);
    }
  }

  return found;
}

async function main() {
  const files = (await walk(MEDIA_DIR)).sort();
  const versions = {};

  for (const file of files) {
    const bytes = await readFile(file);
    const hash = createHash("sha256")
      .update(bytes)
      .digest("hex")
      .slice(0, HASH_LENGTH);

    // Key by the public URL the site actually requests, e.g. "/media/line.jpg".
    const publicPath = `/${posix.join(
      "media",
      relative(MEDIA_DIR, file).split(/[\\/]/).join("/"),
    )}`;

    versions[publicPath] = hash;
  }

  // Stable key order so the file only changes when an asset actually changes —
  // otherwise every build would produce a spurious diff.
  const sorted = Object.fromEntries(
    Object.entries(versions).sort(([a], [b]) => a.localeCompare(b)),
  );

  const next = `${JSON.stringify(sorted, null, 2)}\n`;

  let previous = "";
  try {
    previous = await readFile(OUTPUT, "utf8");
  } catch {
    // First run — nothing to compare against.
  }

  if (previous === next) {
    console.log(`media versions unchanged (${files.length} files)`);
    return;
  }

  await writeFile(OUTPUT, next, "utf8");

  const changed = Object.entries(sorted).filter(([path, hash]) => {
    try {
      return JSON.parse(previous)[path] !== hash;
    } catch {
      return true;
    }
  });

  console.log(`media versions written: ${files.length} files`);
  for (const [path, hash] of changed.slice(0, 10)) {
    console.log(`  ${hash}  ${path}`);
  }
  if (changed.length > 10) console.log(`  …and ${changed.length - 10} more`);
}

// Never fail a build over cache-busting: a missing version simply means the
// URL is unversioned, which is exactly today's behaviour.
main().catch((error) => {
  console.error("hash-media failed:", error);
  process.exitCode = 0;
});
