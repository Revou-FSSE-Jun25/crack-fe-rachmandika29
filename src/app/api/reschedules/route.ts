import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const qs: string[] = [];
    if (from) qs.push(`from=${encodeURIComponent(from)}`);
    if (to) qs.push(`to=${encodeURIComponent(to)}`);
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
    const res = await fetch(`${API_BASE}/reschedules/admin/reschedules${suffix}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    const json = await res.json().catch(() => null);
    return NextResponse.json(json ?? [], { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reschedule requests" }, { status: 502 });
  }
}

