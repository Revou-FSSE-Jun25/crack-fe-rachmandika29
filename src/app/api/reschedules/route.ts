import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const qs: string[] = [];
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
    const res = await fetch(`${API_BASE}/reschedules${suffix}`, { method: "GET", headers, cache: "no-store" });
    const json = await res.json().catch(() => null);
    return NextResponse.json(json ?? [], { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reschedule requests" }, { status: 502 });
  }
}

