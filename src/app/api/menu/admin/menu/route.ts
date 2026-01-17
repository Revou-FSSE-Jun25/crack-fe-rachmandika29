import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

type RawMenuItem = any;

function mapMenuItem(raw: RawMenuItem) {
  const id = typeof raw?.id === "number" ? raw.id : Number(raw?.id ?? 0);
  const name = String(raw?.name ?? "");
  const description = String(raw?.description ?? "");
  const price = typeof raw?.price === "number" ? raw.price : Number(raw?.price ?? 0);
  const image =
    typeof raw?.image === "string"
      ? raw.image
      : typeof raw?.image?.url === "string"
      ? raw.image.url
      : String(raw?.image ?? "");
  const category =
    typeof raw?.category === "string"
      ? raw.category
      : typeof raw?.category?.name === "string"
      ? raw.category.name
      : typeof raw?.category?.title === "string"
      ? raw.category.title
      : String(raw?.category ?? "Uncategorized");
  const tags = Array.isArray(raw?.tags)
    ? raw.tags.map((t: any) =>
        typeof t === "string"
          ? t
          : typeof t?.name === "string"
          ? t.name
          : typeof t?.tag?.name === "string"
          ? t.tag.name
          : typeof t?.label === "string"
          ? t.label
          : String(t)
      )
    : [];
  const popularity = typeof raw?.popularity === "number" ? raw.popularity : 0;
  const slugSource = raw?.slug ?? (name || `item-${id || Date.now()}`);
  const slug = String(slugSource);
  const available =
    typeof raw?.available === "boolean"
      ? raw.available
      : typeof raw?.available === "number"
      ? raw.available === 1
      : true;
  return { id, slug, name, description, price, image, category, tags, popularity, available };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const bearer = cookieStore.get("upstream_bearer")?.value ?? null;
    const upstreamCookie = cookieStore.get("upstream_cookie")?.value ?? null;
    const headers: Record<string, string> = {};
    if (upstreamCookie) {
      headers["Cookie"] = upstreamCookie;
    } else if (bearer) {
      headers["Authorization"] = `Bearer ${bearer}`;
    }
    const res = await fetch(`${API_BASE}/menu/admin/menu`, { method: "GET", headers, cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(json ?? { error: "Failed to fetch admin menu" }, { status: res.status || 400 });
    }
    const listSource = Array.isArray(json)
      ? json
      : Array.isArray((json as any)?.items)
      ? (json as any).items
      : Array.isArray((json as any)?.data)
      ? (json as any).data
      : [];
    const items = (listSource as RawMenuItem[]).map(mapMenuItem);
    return NextResponse.json(items, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch admin menu" }, { status: 502 });
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
    const upstream = await fetch(`${API_BASE}/menu/admin/menu`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const json = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return NextResponse.json(json ?? { error: "Failed to create menu item" }, { status: upstream.status || 400 });
    }
    return NextResponse.json(json ?? { ok: true }, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

