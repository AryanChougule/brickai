#!/usr/bin/env node
/**
 * Generate the two secrets the admin needs.
 *
 *   npm run admin:password -- "your-password-here"
 *
 * Prints an ADMIN_PASSWORD_HASH and a fresh ADMIN_SESSION_SECRET to paste into
 * .env.local (locally) or the Vercel dashboard (in production).
 *
 * The password itself is never written anywhere — only its scrypt hash, which
 * is what the app stores and compares against.
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const COST = 16384;
const KEY_LENGTH = 64;

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run admin:password -- \"your-password\"\n");
  console.error("Pick something long. This is the only credential guarding");
  console.error("the admin, the enquiry inbox and every content override.");
  process.exit(1);
}

if (password.length < 12) {
  console.error(
    `Password is ${password.length} characters. Use at least 12 — this is the\n` +
      "only thing standing between the internet and your enquiry inbox.",
  );
  process.exit(1);
}

const salt = randomBytes(16);
const key = await scryptAsync(password, salt, KEY_LENGTH, {
  N: COST,
  maxmem: 64 * 1024 * 1024,
});

// `:` rather than `$`: Next's env loader expands `$…` in .env files, which
// would truncate this hash to "scrypt" and make every login fail.
const hash = `scrypt:${COST}:${salt.toString("hex")}:${key.toString("hex")}`;
const sessionSecret = randomBytes(32).toString("hex");

console.log(`
Add these to .env.local for local use, and to your Vercel project's
Environment Variables for production:

ADMIN_ENABLED=true
ADMIN_PASSWORD_HASH=${hash}
ADMIN_SESSION_SECRET=${sessionSecret}

Notes
  · ADMIN_SESSION_SECRET signs session cookies. Changing it logs everyone out.
  · Use a DIFFERENT session secret in production than in development.
  · Never commit these. .env.local is already gitignored.
`);
