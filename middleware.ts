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
  "/records": ["user", "doctor", "admin"],
  "/messages": ["doctor"],
};

function getTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
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

  const sessionCookie =
    req.cookies.get("better-auth.session_token")?.value ||
    req.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = getTokenPayload(sessionCookie);
  if (!payload) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("better-auth.session_token");
    return res;
  }

  const role = (payload.role as string) || (payload.data as Record<string, unknown>)?.role as string;
  if (!role) {
    return NextResponse.next();
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
