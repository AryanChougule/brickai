import "server-only";

import {
  randomBytes,
  scrypt,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";

/**
 * Password hashing for the single admin account.
 *
 * scrypt, from Node's standard library — memory-hard, so a leaked hash is
 * expensive to attack, and no dependency to audit. Node-only: this must never
 * be imported from `middleware.ts`, which runs on the Edge.
 *
 * Format: `scrypt:<N>:<saltHex>:<keyHex>`. The cost parameter is stored with
 * the hash so it can be raised later without invalidating existing hashes.
 *
 * The separator is `:` and not the conventional `$` for a concrete reason: this
 * value lives in a `.env` file, and Next's env loader runs dotenv-expand, which
 * would read `$16384` as a variable reference and silently truncate the hash to
 * "scrypt". A `$`-delimited hash parses fine everywhere except the one place
 * this one is actually stored.
 */

const COST = 16384; // 2^14 — OWASP's floor for scrypt N.
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/** Node's default maxmem is too small for N=16384 at this key length. */
const OPTIONS: ScryptOptions = { N: COST, maxmem: 64 * 1024 * 1024 };

/**
 * Promisified scrypt.
 *
 * Hand-wrapped rather than `promisify`d: TypeScript resolves promisify against
 * scrypt's three-argument overload, which leaves no way to pass the options
 * object that raises `maxmem`.
 */
function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions = OPTIONS,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (error, derived) =>
      error ? reject(error) : resolve(derived),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await scryptAsync(password, salt, KEY_LENGTH);

  return `scrypt:${COST}:${salt.toString("hex")}:${key.toString("hex")}`;
}

/**
 * Constant-time verification.
 *
 * Every failure path takes the same shape and returns false rather than
 * throwing, so a malformed hash cannot be distinguished from a wrong password.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  try {
    const [scheme, costRaw, saltHex, keyHex] = stored.split(":");
    if (scheme !== "scrypt" || !costRaw || !saltHex || !keyHex) return false;

    const cost = Number(costRaw);
    if (!Number.isFinite(cost) || cost < 1024) return false;

    const expected = Buffer.from(keyHex, "hex");
    // Use the cost stored with the hash, so raising COST later stays compatible.
    const actual = await scryptAsync(
      password,
      Buffer.from(saltHex, "hex"),
      expected.length,
      { N: cost, maxmem: 64 * 1024 * 1024 },
    );

    // Lengths must match before timingSafeEqual, which throws otherwise.
    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
