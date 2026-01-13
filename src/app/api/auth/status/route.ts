import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Buffer } from "node:buffer";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

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
  const bearer = cookieStore.get("upstream_bearer")?.value ?? null;
  const local = parseAuthToken(token);
  if (!local.authenticated) {
    return NextResponse.json(local);
  }
  try {
    const headers: Record<string, string> = {};
    if (bearer) headers["Authorization"] = `Bearer ${bearer}`;
    const res = await fetch(`${API_BASE}/auth/status`, { method: "GET", headers, cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (res.ok && json) {
      const email =
        typeof json.email === "string"
          ? json.email
          : json.user && typeof json.user.email === "string"
          ? json.user.email
          : local.email;
      return NextResponse.json({ authenticated: true, role: local.role, email });
    }
  } catch {}
  return NextResponse.json(local);
}
