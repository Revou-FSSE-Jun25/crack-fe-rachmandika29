import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || (json && json.ok === false)) {
      return NextResponse.json(json ?? { ok: false, error: "Booking creation failed" }, { status: res.status || 400 });
    }
    return NextResponse.json(json ?? { ok: true }, { status: res.status });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

