import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const qs = date ? `?date=${encodeURIComponent(date)}` : "";
    const res = await fetch(`${API_BASE}/availability/slots${qs}`, { method: "GET" });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 502 });
  }
}

