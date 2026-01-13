import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : null;
    const dateIso = typeof body?.dateIso === "string" ? body.dateIso : null;
    const time = typeof body?.time === "string" ? body.time : null;
    if (!id || !dateIso || !time) return NextResponse.json({ ok: false, error: "Invalid data" }, { status: 400 });
    const payload = { bookingId: id, dateIso, time, note: typeof body?.note === "string" ? body.note : undefined };
    const cookieStore = await cookies();
    const bearer = cookieStore.get("upstream_bearer")?.value ?? null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (bearer) headers["Authorization"] = `Bearer ${bearer}`;
    const upstream = await fetch(`${API_BASE}/reschedules`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const json = await upstream.json().catch(() => null);
    if (!upstream.ok || (json && json.ok === false)) {
      return NextResponse.json(json ?? { ok: false, error: "Reschedule failed" }, { status: upstream.status || 400 });
    }
    return NextResponse.json(json ?? { ok: true }, { status: upstream.status });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

