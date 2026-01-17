import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Buffer } from "node:buffer";
import { z } from "zod";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

const bookingPayloadSchema = z.object({
  dateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  guests: z.number().int().positive(),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(3),
  }),
  notes: z.string().optional(),
});

function decodeUserIdFromJwt(token: string | null): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
    const payload = JSON.parse(payloadJson) as { sub?: unknown };
    const sub = payload.sub;
    if (typeof sub === "number" && Number.isFinite(sub)) return sub;
    if (typeof sub === "string" && sub.trim() !== "" && !Number.isNaN(Number(sub))) {
      return Number(sub);
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => ({}));
    const parsed = bookingPayloadSchema.safeParse(raw);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const message = issue?.message || "Invalid booking payload";
      return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
    const payload = parsed.data;

    const cookieStore = await cookies();
    const upstreamBearer = cookieStore.get("upstream_bearer")?.value ?? null;
    const upstreamCookie = cookieStore.get("upstream_cookie")?.value ?? null;
    const userId = decodeUserIdFromJwt(upstreamBearer);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const slotsRes = await fetch(
      `${API_BASE}/availability/slots?date=${encodeURIComponent(payload.dateIso)}`,
      { method: "GET" }
    );
    const slotsJson: any = await slotsRes.json().catch(() => null);
    if (!slotsRes.ok) {
      return NextResponse.json(
        slotsJson ?? { ok: false, error: "Failed to resolve slot" },
        { status: slotsRes.status || 400 }
      );
    }
    const slots: any[] = Array.isArray(slotsJson)
      ? slotsJson
      : Array.isArray(slotsJson?.slots)
      ? slotsJson.slots
      : Array.isArray((slotsJson as any)?.data)
      ? (slotsJson as any).data
      : [];
    const target = slots.find(
      (s) => typeof s?.time === "string" && s.time === payload.time
    );
    const slotId = typeof target?.id === "number" && Number.isFinite(target.id) ? target.id : null;
    if (!slotId) {
      return NextResponse.json(
        { ok: false, error: "Selected time slot is not available" },
        { status: 400 }
      );
    }

    const bookingBody = {
      userId,
      slotId,
      guests: payload.guests,
      notes: payload.notes,
    };

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (upstreamCookie) {
      headers["Cookie"] = upstreamCookie;
    } else if (upstreamBearer) {
      headers["Authorization"] = `Bearer ${upstreamBearer}`;
    }

    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(bookingBody),
    });
    const json: any = await res.json().catch(() => null);
    if (!res.ok || (json && json.ok === false)) {
      return NextResponse.json(
        json ?? { ok: false, error: "Booking creation failed" },
        { status: res.status || 400 }
      );
    }
    return NextResponse.json(json ?? { ok: true }, { status: res.status });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const qs = email ? `?email=${encodeURIComponent(email)}` : "";
    const res = await fetch(`${API_BASE}/bookings${qs}`, { method: "GET" });
    const upstreamJson: any = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        upstreamJson ?? { error: "Failed to fetch bookings" },
        { status: res.status || 400 }
      );
    }
    const list =
      Array.isArray(upstreamJson) && !upstreamJson.data
        ? upstreamJson
        : Array.isArray(upstreamJson?.data)
        ? upstreamJson.data
        : [];
    return NextResponse.json(list, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
