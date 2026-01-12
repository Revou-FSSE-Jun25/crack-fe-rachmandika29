import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/menu/tags`, { method: "GET" });
    const json = await res.json().catch(() => null);
    return NextResponse.json(json ?? [], { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu tags" }, { status: 502 });
  }
}

