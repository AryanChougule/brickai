import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

/**
 * Gate every /admin route on a valid session.
 *
 * Middleware runs before any page renders, so an unauthenticated request never
 * reaches code that reads the enquiry store. The page-level guard in
 * `lib/admin/guard.ts` still re-checks — middleware is the outer door, not the
 * only lock, and server actions are called directly rather than through it.
 *
 * Runs on the Edge runtime, which is why session verification uses Web Crypto.
 */
export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page must stay reachable, or there is no way in.
  if (pathname === "/admin/login") return NextResponse.next();

  const isDevelopment = process.env.NODE_ENV === "development";
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const configured = Boolean(hash && secret);

  // Production without credentials: the admin does not exist. Rewriting to a
  // 404 means an attacker cannot even confirm the route is there.
  if (!isDevelopment && (process.env.ADMIN_ENABLED !== "true" || !configured)) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  // Local development before any credentials are set up — allowed through, and
  // the admin page shows a banner saying so.
  if (isDevelopment && !configured) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token, secret!)) return NextResponse.next();

  const loginUrl = new URL("/admin/login", request.url);
  // Return the visitor where they were headed once they sign in.
  if (pathname !== "/admin") loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}
