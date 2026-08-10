"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminEnabled } from "@/lib/admin/guard";
import { verifyPassword } from "@/lib/admin/password";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
} from "@/lib/admin/session";
import type { LoginState } from "@/lib/actions/auth-state";

/**
 * Throttle repeated failures per client address.
 *
 * In-memory, so on a serverless platform it is per-instance rather than global
 * — a determined attacker spread across instances gets more attempts than the
 * number below suggests. It still removes the cheap case (one host hammering
 * one instance), and the real defence is scrypt making each guess expensive.
 * Move this to Redis if the admin ever faces sustained attack.
 */
const attempts = new Map<string, { count: number; firstAt: number }>();

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimit(key: string): { allowed: boolean; retryInMinutes: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return { allowed: true, retryInMinutes: 0 };
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryInMinutes: Math.ceil((WINDOW_MS - (now - entry.firstAt)) / 60000),
    };
  }

  return { allowed: true, retryInMinutes: 0 };
}

function clearAttempts(key: string) {
  attempts.delete(key);
}

export async function signIn(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!adminEnabled()) {
    return { status: "error", message: "Admin is disabled." };
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!hash || !secret) {
    return {
      status: "error",
      message:
        "Admin credentials are not configured. Run `npm run admin:password`.",
    };
  }

  const requestHeaders = await headers();
  const clientKey =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

  const limit = rateLimit(clientKey);
  if (!limit.allowed) {
    return {
      status: "error",
      message: `Too many attempts. Try again in ${limit.retryInMinutes} minutes.`,
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!(await verifyPassword(password, hash))) {
    // One message for every failure — never reveal which part was wrong.
    return { status: "error", message: "Incorrect password." };
  }

  clearAttempts(clientKey);

  (await cookies()).set(SESSION_COOKIE, await createSessionToken(secret), {
    httpOnly: true,
    // Not readable by JavaScript, not sent cross-site, HTTPS-only in production.
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/admin");
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
