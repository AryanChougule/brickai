/** Small shared helpers. Nothing here should know about a specific component. */

/**
 * Join class names, dropping falsy entries. Deliberately not `clsx` — the
 * project has no need for object or nested-array syntax.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** "14 July 2026" — long form, used in post headers. */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "Jul 2026" — compact form for cards and lists. */
export function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

/** Two-digit catalogue numeral, e.g. 3 → "03". */
export function ordinal(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** Clamp a value into an inclusive range. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Deterministic pseudo-random in [0, 1) from an integer seed. Procedural
 * geometry uses this instead of Math.random so server and client agree and
 * layouts stay stable between reloads.
 */
export function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
