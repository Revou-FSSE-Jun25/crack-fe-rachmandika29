import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Buffer } from "node:buffer";

function parseAuthToken(token?: string | null): { authenticated: boolean; role: "user" | "admin" | null; email: string | null } {
  if (!token) return { authenticated: false, role: null, email: null };
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [role, email] = decoded.split(":");
    if (role === "admin" || role === "user") {
      return { authenticated: true, role, email: email ?? null };
    }
    return { authenticated: false, role: null, email: null };
  } catch {
    return { authenticated: false, role: null, email: null };
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? null;
  const parsed = parseAuthToken(token);
  return NextResponse.json(parsed);
}