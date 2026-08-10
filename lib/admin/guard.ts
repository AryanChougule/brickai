import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

/**
 * Who may reach the admin.
 *
 * Two independent gates:
 *
 *  1. Does the admin exist at all? (`ADMIN_ENABLED`, or development.)
 *  2. Is this request authenticated? (a valid signed session cookie.)
 *
 * The whole module fails closed. In production the admin is unreachable unless
 * BOTH secrets are configured — a misconfigured deployment yields a 404, never
 * an unauthenticated content editor open to the internet.
 */

export function adminCredentialsConfigured() {
  return Boolean(
    process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET,
  );
}

const isDevelopment = () => process.env.NODE_ENV === "development";

/** Whether the admin route exists for this deployment. */
export function adminEnabled() {
  if (isDevelopment()) return true;

  // Production requires both the switch and working credentials. Without the
  // second condition, forgetting an env var would publish an open admin.
  return process.env.ADMIN_ENABLED === "true" && adminCredentialsConfigured();
}

/**
 * Whether a login is required. Only false on a developer's machine that has not
 * configured credentials yet — never in production, where `adminEnabled()`
 * already refuses to serve the route without them.
 */
export function adminRequiresAuth() {
  return !isDevelopment() || adminCredentialsConfigured();
}

/** True when the current request carries a valid admin session. */
export async function isAuthenticated() {
  if (!adminRequiresAuth()) return true;

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, secret);
}

/** Throws in a server action if the caller is not an authenticated admin. */
export async function assertAdminEnabled() {
  if (!adminEnabled()) {
    throw new Error("Admin is disabled.");
  }
  if (!(await isAuthenticated())) {
    throw new Error("Not signed in.");
  }
}
