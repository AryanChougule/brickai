#!/usr/bin/env node
/**
 * Downloads every asset in `lib/media/manifest.ts` into `public/media`.
 *
 *   npm run media          # fetch anything missing
 *   npm run media -- --force   # re-fetch everything
 *
 * Assets are vendored rather than hotlinked: the site then has no runtime
 * dependency on a third-party CDN, and a rotated remote URL cannot break
 * production. Re-runs are idempotent — an existing file is skipped unless
 * --force is passed.
 *
 * Writes `public/media/credits.json` recording source, licence and measured
 * dimensions for every file, so provenance survives independently of this
 * script and the admin page can display it.
 */
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "public");
const FORCE = process.argv.includes("--force");

/** Pexels serves a resized variant from query params; dpr=2 doubles `w`. */
const PHOTO_QUERY = "auto=compress&cs=tinysrgb&dpr=2&w=1600";

/**
 * The manifest is TypeScript, so rather than adding a build step just to read
 * it, parse the object literals out directly. The shape is fixed and this keeps
 * the script dependency-free.
 */
async function loadManifest() {
  const source = await readFile(
    join(ROOT, "lib", "media", "manifest.ts"),
    "utf8",
  );

  const entries = [];
  const blocks = source.matchAll(/\{\s*id:\s*"([^"]+)",([\s\S]*?)\n  \}/g);

  for (const [, id, body] of blocks) {
    const field = (name) => body.match(new RegExp(`${name}:\\s*"([^"]*)"`))?.[1];
    const url = field("url");
    const file = field("file");
    if (!url || !file) continue;

    entries.push({
      id,
      file,
      url,
      kind: field("kind"),
      photoId: field("photoId"),
      description: field("description"),
      licence: field("licence"),
    });
  }

  return entries;
}

/** Read JPEG/PNG/MP4 dimensions from the file header, without a dependency. */
function measure(buffer) {
  // PNG: IHDR is always the first chunk.
  if (buffer.length > 24 && buffer.readUInt32BE(0) === 0x89504e47) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  // JPEG: walk the segment chain to a start-of-frame marker.
  if (buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let i = 2;
    while (i < buffer.length - 9) {
      if (buffer[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buffer[i + 1];
      const isSof =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;
      if (isSof) {
        return {
          height: buffer.readUInt16BE(i + 5),
          width: buffer.readUInt16BE(i + 7),
        };
      }
      i += 2 + buffer.readUInt16BE(i + 2);
    }
  }

  // MP4: the visual sample entry carries width/height 24 bytes into the box.
  for (const codec of ["avc1", "hvc1", "hev1", "av01"]) {
    const marker = buffer.indexOf(codec, 0, "latin1");
    if (marker <= 0 || buffer.length < marker + 32) continue;

    const width = buffer.readUInt16BE(marker + 24);
    const height = buffer.readUInt16BE(marker + 26);
    if (width > 0 && height > 0) return { width, height };
  }

  return null;
}

/**
 * Pexels encodes the resolution in the video filename
 * (`…_2560_1440_60fps.mp4`). Used when the container walk above finds nothing,
 * so credits.json is never missing dimensions.
 */
function dimensionsFromName(url) {
  const match = url.match(/_(\d{3,4})_(\d{3,4})_/);
  return match
    ? { width: Number(match[1]), height: Number(match[2]) }
    : null;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function download(asset) {
  const target = join(PUBLIC_DIR, asset.file.replace(/^\//, ""));
  await mkdir(dirname(target), { recursive: true });

  if (!FORCE && (await exists(target))) {
    const buffer = await readFile(target);
    return {
      ...asset,
      skipped: true,
      bytes: buffer.length,
      ...(measure(buffer) ?? dimensionsFromName(asset.url) ?? {}),
    };
  }

  const url =
    asset.kind === "photo"
      ? `${asset.url}${asset.url.includes("?") ? "&" : "?"}${PHOTO_QUERY}`
      : asset.url;

  const response = await fetch(url, {
    headers: { "User-Agent": "brickai-media-fetch/1.0" },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`${asset.id}: HTTP ${response.status} for ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 1024) {
    throw new Error(`${asset.id}: suspiciously small response, aborting`);
  }

  await writeFile(target, buffer);
  return {
    ...asset,
    skipped: false,
    bytes: buffer.length,
    ...(measure(buffer) ?? dimensionsFromName(asset.url) ?? {}),
  };
}

async function main() {
  const manifest = await loadManifest();
  if (manifest.length === 0) {
    console.error("No assets parsed from the manifest — check its format.");
    process.exit(1);
  }

  console.log(
    `Fetching ${manifest.length} assets${FORCE ? " (forced)" : ""}…\n`,
  );

  const results = [];
  const failures = [];

  // Sequential on purpose: a polite, predictable request rate, and the log
  // stays readable when something fails.
  for (const asset of manifest) {
    try {
      const result = await download(asset);
      results.push(result);

      const size = `${(result.bytes / 1024).toFixed(0)}kB`;
      const dims = result.width ? `${result.width}×${result.height}` : "?";
      console.log(
        `  ${result.skipped ? "·" : "✓"} ${asset.id.padEnd(38)} ${dims.padEnd(11)} ${size}`,
      );
    } catch (error) {
      failures.push({ id: asset.id, message: error.message });
      console.error(`  ✗ ${asset.id.padEnd(38)} ${error.message}`);
    }
  }

  const credits = {
    generated: new Date().toISOString(),
    licence: {
      name: "Pexels License",
      url: "https://www.pexels.com/license/",
      commercialUse: true,
      attributionRequired: false,
      watermarked: false,
    },
    assets: results.map((r) => ({
      id: r.id,
      file: r.file,
      kind: r.kind,
      description: r.description,
      width: r.width ?? null,
      height: r.height ?? null,
      bytes: r.bytes,
      source:
        r.kind === "video"
          ? `https://www.pexels.com/video/${r.photoId}/`
          : `https://www.pexels.com/photo/${r.photoId}/`,
    })),
  };

  await mkdir(join(PUBLIC_DIR, "media"), { recursive: true });
  await writeFile(
    join(PUBLIC_DIR, "media", "credits.json"),
    `${JSON.stringify(credits, null, 2)}\n`,
  );

  const downloaded = results.filter((r) => !r.skipped).length;
  const total = results.reduce((sum, r) => sum + r.bytes, 0);
  console.log(
    `\n${downloaded} downloaded, ${results.length - downloaded} already present, ` +
      `${(total / 1024 / 1024).toFixed(1)}MB total.`,
  );

  if (failures.length > 0) {
    console.error(`\n${failures.length} failed.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
