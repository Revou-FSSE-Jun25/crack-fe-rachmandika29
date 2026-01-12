import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/availability/available-dates`, { method: "GET" });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch available dates" }, { status: 502 });
  }
}

