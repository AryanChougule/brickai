/**
 * Admin session tokens.
 *
 * Deliberately built on Web Crypto rather than `node:crypto`: this module is
 * imported by `middleware.ts`, which runs on the Edge runtime where Node's
 * crypto is unavailable. Password *hashing* lives in `password.ts`, which is
 * Node-only and never reaches the Edge.
 *
 * Token format: `<base64url(payload)>.<base64url(hmac)>` — a minimal signed
 * cookie. The payload is not secret (it holds only a subject and an expiry);
 * the signature is what makes it unforgeable.
 */

export const SESSION_COOKIE = "brickai_admin";

/** Eight hours. Long enough for a working session, short enough to matter. */
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

interface SessionPayload {
  sub: string;
  /** Unix seconds. */
  exp: number;
}

const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Mint a signed session token valid for `SESSION_MAX_AGE_SECONDS`. */
export async function createSessionToken(secret: string): Promise<string> {
  const payload: SessionPayload = {
    sub: "admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };

  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));

  return `${body}.${base64UrlEncode(new Uint8Array(signature))}`;
}

/**
 * Verify a token's signature and expiry.
 *
 * `crypto.subtle.verify` is constant-time, so this does not leak signature
 * bytes through timing the way a string comparison would.
 */
export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token || !secret) return false;

  const [body, signature] = token.split(".");
  if (!body || !signature) return false;

  try {
    const key = await hmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(signature),
      encoder.encode(body),
    );
    if (!valid) return false;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(body)),
    ) as SessionPayload;

    return payload.sub === "admin" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    // A malformed token is simply not a valid session.
    return false;
  }
}
