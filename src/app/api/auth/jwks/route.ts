import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const jwks = await auth.api.getJWKS();
  return NextResponse.json(jwks);
}