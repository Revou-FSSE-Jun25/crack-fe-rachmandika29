import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const status = url.searchParams.get("status");
    const qs: string[] = [];
    if (from) qs.push(`from=${encodeURIComponent(from)}`);
    if (to) qs.push(`to=${encodeURIComponent(to)}`);
    if (status) qs.push(`status=${encodeURIComponent(status)}`);
    const suffix = qs.length ? `?${qs.join("&")}` : "";

    const cookieStore = await cookies();
    const bearer = cookieStore.get("upstream_bearer")?.value ?? null;
    const upstreamCookie = cookieStore.get("upstream_cookie")?.value ?? null;
    const headers: Record<string, string> = {};
    if (upstreamCookie) {
      headers["Cookie"] = upstreamCookie;
    } else if (bearer) {
      headers["Authorization"] = `Bearer ${bearer}`;
    }

    const res = await fetch(`${API_BASE}/bookings/admin/bookings${suffix}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    const upstreamJson: any = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        upstreamJson ?? { error: "Failed to fetch admin bookings" },
        { status: res.status || 400 }
      );
    }
    const list =
      Array.isArray((upstreamJson as any)?.data)
        ? (upstreamJson as any).data
        : Array.isArray((upstreamJson as any)?.bookings)
        ? (upstreamJson as any).bookings
        : Array.isArray(upstreamJson)
        ? upstreamJson
        : [];
    return NextResponse.json(list, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch admin bookings" }, { status: 502 });
  }
}

