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
    const upstreamJson: any = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(upstreamJson ?? { error: "Failed to fetch reschedule requests" }, { status: res.status || 400 });
    }
    const rawList: any[] = Array.isArray(upstreamJson?.data)
      ? upstreamJson.data
      : Array.isArray(upstreamJson)
      ? upstreamJson
      : [];
    const list = rawList.map((r) => {
      const booking = r?.booking;
      const slot = booking?.slot;
      const statusRaw = String(r?.status ?? "").toUpperCase();
      const status = statusRaw === "ACCEPTED" ? "accepted" : statusRaw === "REJECTED" ? "rejected" : "pending";
      const currentDateIso =
        slot?.date instanceof Date
          ? slot.date.toISOString().slice(0, 10)
          : typeof slot?.date === "string"
          ? new Date(slot.date).toISOString().slice(0, 10)
          : "";
      const requestedDateIso =
        r?.requestedDate instanceof Date
          ? r.requestedDate.toISOString().slice(0, 10)
          : typeof r?.requestedDate === "string"
          ? new Date(r.requestedDate).toISOString().slice(0, 10)
          : "";
      return {
        id: String(r?.id ?? ""),
        bookingId: String(r?.bookingId ?? booking?.id ?? ""),
        currentDateIso,
        currentTime: typeof slot?.time === "string" ? slot.time : "",
        requestedDateIso,
        requestedTime: typeof r?.requestedTime === "string" ? r.requestedTime : "",
        guests: typeof booking?.guests === "number" ? booking.guests : 0,
        status,
        reason: undefined,
        adminNote: typeof r?.adminNote === "string" ? r.adminNote : undefined,
      };
    });
    return NextResponse.json(list, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reschedule requests" }, { status: 502 });
  }
}

