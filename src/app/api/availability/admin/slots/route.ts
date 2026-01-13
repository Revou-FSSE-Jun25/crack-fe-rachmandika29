import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const available = url.searchParams.get("available");
    const qs: string[] = [];
    if (date) qs.push(`date=${encodeURIComponent(date)}`);
    if (available) qs.push(`available=${encodeURIComponent(available)}`);
    const suffix = qs.length ? `?${qs.join("&")}` : "";
    const res = await fetch(`${API_BASE}/availability/admin/slots${suffix}`, { method: "GET" });
    const json = await res.json().catch(() => null);
    return NextResponse.json(json ?? [], { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch admin slots" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const upstream = await fetch(`${API_BASE}/availability/admin/slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return NextResponse.json(json ?? { error: "Failed to create slot" }, { status: upstream.status || 400 });
    }
    return NextResponse.json(json ?? { ok: true }, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const date = typeof body?.date === "string" ? body.date : (typeof body?.dateIso === "string" ? body.dateIso : null);
    const slots = Array.isArray(body?.slots) ? body.slots : [];
    if (!date) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }
    const upstream = await fetch(`${API_BASE}/availability/admin/slots`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, slots }),
    });
    const json = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return NextResponse.json(json ?? { error: "Failed to save slots" }, { status: upstream.status || 400 });
    }
    return NextResponse.json(json ?? { ok: true }, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
