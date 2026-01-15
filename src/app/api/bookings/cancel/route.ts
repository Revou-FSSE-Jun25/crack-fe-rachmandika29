import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : null;
    if (!id) return NextResponse.json({ ok: false, error: "Invalid booking id" }, { status: 400 });
    const cookieStore = await cookies();
    const bearer = cookieStore.get("upstream_bearer")?.value ?? null;
    const upstreamCookie = cookieStore.get("upstream_cookie")?.value ?? null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (upstreamCookie) {
      headers["Cookie"] = upstreamCookie;
    } else if (bearer) {
      headers["Authorization"] = `Bearer ${bearer}`;
    }
    const upstream = await fetch(`${API_BASE}/bookings/${encodeURIComponent(id)}/cancel`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const json = await upstream.json().catch(() => null);
    if (!upstream.ok || (json && json.ok === false)) {
      return NextResponse.json(json ?? { ok: false, error: "Cancel failed" }, { status: upstream.status || 400 });
    }
    return NextResponse.json(json ?? { ok: true }, { status: upstream.status });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
