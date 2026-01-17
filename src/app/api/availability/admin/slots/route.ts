import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

function toTime24h(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (/^\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  const v = trimmed.toUpperCase().replace(/\s+/g, " ");
  const m = v.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
  if (!m) return null;
  let hh = parseInt(m[1], 10);
  const mm = m[2];
  const suf = m[3];
  if (Number.isNaN(hh) || hh < 1 || hh > 12) return null;
  if (suf === "AM") {
    if (hh === 12) hh = 0;
  } else {
    if (hh !== 12) hh += 12;
  }
  const hhPad = String(hh).padStart(2, "0");
  return `${hhPad}:${mm}`;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const available = url.searchParams.get("available");
    const qs: string[] = [];
    if (date) qs.push(`date=${encodeURIComponent(date)}`);
    if (available) qs.push(`available=${encodeURIComponent(available)}`);
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
    const res = await fetch(`${API_BASE}/availability/admin/slots${suffix}`, { method: "GET", headers });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(json ?? { error: "Failed to fetch admin slots" }, { status: res.status || 400 });
    }
    return NextResponse.json(json ?? [], { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch admin slots" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const cookieStore = await cookies();
    const bearer = cookieStore.get("upstream_bearer")?.value ?? null;
    const upstreamCookie = cookieStore.get("upstream_cookie")?.value ?? null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (upstreamCookie) {
      headers["Cookie"] = upstreamCookie;
    } else if (bearer) {
      headers["Authorization"] = `Bearer ${bearer}`;
    }
    const upstream = await fetch(`${API_BASE}/availability/admin/slots`, {
      method: "POST",
      headers,
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
    const cookieStore = await cookies();
    const bearer = cookieStore.get("upstream_bearer")?.value ?? null;
    const upstreamCookie = cookieStore.get("upstream_cookie")?.value ?? null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (upstreamCookie) {
      headers["Cookie"] = upstreamCookie;
    } else if (bearer) {
      headers["Authorization"] = `Bearer ${bearer}`;
    }
    const currentRes = await fetch(
      `${API_BASE}/availability/admin/slots?date=${encodeURIComponent(date)}`,
      { method: "GET", headers },
    );
    const currentJson = await currentRes.json().catch(() => null);
    if (!currentRes.ok) {
      return NextResponse.json(
        currentJson ?? { error: "Failed to fetch current slots" },
        { status: currentRes.status || 400 },
      );
    }
    const currentSlots: any[] = Array.isArray(currentJson) ? currentJson : [];
    const currentById = new Map<number, any>();
    for (const s of currentSlots) {
      const idNum = typeof s?.id === "number" ? s.id : NaN;
      if (Number.isFinite(idNum)) currentById.set(idNum, s);
    }
    const desiredWithId: any[] = [];
    const desiredNew: any[] = [];
    for (const raw of slots) {
      const idNum = typeof raw?.id === "number" ? raw.id : NaN;
      if (Number.isFinite(idNum)) {
        desiredWithId.push({ ...raw, id: idNum });
      } else {
        desiredNew.push(raw);
      }
    }
    const desiredIdSet = new Set<number>();
    for (const s of desiredWithId) {
      desiredIdSet.add(s.id);
    }
    const deleteIds: number[] = [];
    for (const id of currentById.keys()) {
      if (!desiredIdSet.has(id)) deleteIds.push(id);
    }
    for (const s of desiredNew) {
      const time24 = toTime24h(s?.time);
      const capRaw = s?.capacity;
      const capacity =
        typeof capRaw === "number" && Number.isFinite(capRaw) && capRaw > 0
          ? Math.floor(capRaw)
          : 2;
      const available =
        typeof s?.available === "boolean" ? s.available : true;
      if (!time24) {
        return NextResponse.json(
          { error: "Invalid time" },
          { status: 400 },
        );
      }
      const res = await fetch(`${API_BASE}/availability/admin/slots`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          dateIso: date,
          time: time24,
          capacity,
          available,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        return NextResponse.json(
          json ?? { error: "Failed to create slot" },
          { status: res.status || 400 },
        );
      }
    }
    for (const s of desiredWithId) {
      const time24 = toTime24h(s?.time);
      const capRaw = s?.capacity;
      const capacity =
        typeof capRaw === "number" && Number.isFinite(capRaw) && capRaw > 0
          ? Math.floor(capRaw)
          : undefined;
      const available =
        typeof s?.available === "boolean" ? s.available : undefined;
      const patch: any = { dateIso: date };
      if (time24) patch.time = time24;
      if (typeof capacity === "number") patch.capacity = capacity;
      if (typeof available === "boolean") patch.available = available;
      const res = await fetch(
        `${API_BASE}/availability/admin/slots/${encodeURIComponent(
          String(s.id),
        )}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(patch),
        },
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        return NextResponse.json(
          json ?? { error: "Failed to update slot" },
          { status: res.status || 400 },
        );
      }
    }
    for (const id of deleteIds) {
      const res = await fetch(
        `${API_BASE}/availability/admin/slots/${encodeURIComponent(
          String(id),
        )}`,
        {
          method: "DELETE",
          headers,
        },
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        return NextResponse.json(
          json ?? { error: "Failed to delete slot" },
          { status: res.status || 400 },
        );
      }
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
