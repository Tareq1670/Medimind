import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.session) {
    return NextResponse.json({ token: null }, { status: 401 });
  }

  // Return the session token as JWT
  const token = session.session.token;
  return NextResponse.json({ token });
}