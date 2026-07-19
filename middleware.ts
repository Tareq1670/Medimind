import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/records"];

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("better-auth.session_token")?.value;
  const isProtected = protectedRoutes.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  );

  if (isProtected && !sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/records/:path*"],
};
