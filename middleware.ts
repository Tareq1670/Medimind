import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RouteRoles {
  [prefix: string]: string[];
}

const protectedPrefixes: RouteRoles = {
  "/dashboard": ["user", "doctor", "admin"],
  "/profile": ["user", "doctor", "admin"],
  "/health-records": ["user"],
  "/ai-assistant": ["user", "doctor", "admin"],
  "/report-analysis": ["user", "doctor", "admin"],
  "/patients": ["doctor"],
  "/schedule": ["doctor"],
  "/users": ["admin"],
  "/reviews": ["admin"],
  "/analytics": ["admin"],
  "/admin": ["admin"],
  "/medicines/add": ["doctor"],
  "/medicines/manage": ["doctor", "admin"],
  "/blogs/create": ["doctor"],
  "/blogs/manage": ["admin"],
  "/doctors/manage": ["admin"],
  "/conditions/manage": ["admin"],
  "/messages": ["doctor"],
  "/recommendations": ["user"],
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decoded = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matchedPrefix = Object.keys(protectedPrefixes).find((p) =>
    pathname.startsWith(p)
  );
  if (!matchedPrefix) return NextResponse.next();

  // Try session_data cookie first (contains the JWT with user/session data)
  // then fall back to session_token cookie (for backwards compat)
  const sessionDataCookie =
    req.cookies.get("__Secure-better-auth.session_data")?.value ||
    req.cookies.get("better-auth.session_data")?.value;

  const sessionTokenCookie =
    req.cookies.get("__Secure-better-auth.session_token")?.value ||
    req.cookies.get("better-auth.session_token")?.value;

  // If neither cookie exists, redirect to login
  if (!sessionDataCookie && !sessionTokenCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let role: string | null = null;

  // session_data cookie is a JWT when cookieCache.strategy is "jwt"
  if (sessionDataCookie) {
    const payload = decodeJwtPayload(sessionDataCookie);
    if (payload) {
      // Better Auth JWT cache structure: { session, user, updatedAt, version }
      const user = payload.user as Record<string, unknown> | undefined;
      role = (user?.role as string) || (payload.role as string) || null;
    }
  }

  // Fallback: try session_token (might be a JWT if JWT plugin is used)
  if (!role && sessionTokenCookie) {
    const payload = decodeJwtPayload(sessionTokenCookie);
    if (payload) {
      const user = payload.user as Record<string, unknown> | undefined;
      role = (user?.role as string) || (payload.role as string) || null;
    }
  }

  if (!role) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    const res = NextResponse.redirect(loginUrl);
    return res;
  }

  const allowedRoles = protectedPrefixes[matchedPrefix];
  if (!allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
