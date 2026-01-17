import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const cookieStore = await cookies();
    const bearer = cookieStore.get("upstream_bearer")?.value ?? null;
    const upstreamCookie = cookieStore.get("upstream_cookie")?.value ?? null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (upstreamCookie) {
      headers["Cookie"] = upstreamCookie;
    } else if (bearer) {
      headers["Authorization"] = `Bearer ${bearer}`;
    }
    const upstream = await fetch(`${API_BASE}/reschedules/admin/reschedules/${encodeURIComponent(id)}/reject`, {
      method: "POST",
      headers,
      body: JSON.stringify(
        typeof body?.reason === "string" && body.reason.trim().length > 0
          ? { adminNote: body.reason }
          : {},
      ),
    });
    const json = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return NextResponse.json(json ?? { error: "Failed to reject reschedule" }, { status: upstream.status || 400 });
    }
    return NextResponse.json(json ?? { ok: true }, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

