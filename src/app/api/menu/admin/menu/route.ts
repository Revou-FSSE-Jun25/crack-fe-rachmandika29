import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://be.dahar.services";

type RawMenuItem = any;

function mapMenuItem(raw: RawMenuItem) {
  const id = typeof raw?.id === "number" ? raw.id : Number(raw?.id ?? 0);
  const name = String(raw?.name ?? "");
  const description = String(raw?.description ?? "");
  const price = typeof raw?.price === "number" ? raw.price : Number(raw?.price ?? 0);
  const image = String(raw?.image ?? "");
  const category = String(raw?.category ?? "Uncategorized");
  const tags = Array.isArray(raw?.tags) ? raw.tags.map((t: any) => String(t)) : [];
  const popularity = typeof raw?.popularity === "number" ? raw.popularity : 0;
  const slugSource = (raw?.slug ?? (name || `item-${id || Date.now()}`));
  const slug = String(slugSource);
  const availableProp = raw?.available ?? raw?.isAvailable ?? raw?.active;
  const available = typeof availableProp === "boolean" ? availableProp : true;
  return { id, slug, name, description, price, image, category, tags, popularity, available };
}

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/menu/admin/menu`, { method: "GET" });
    const json = await res.json().catch(() => null);
    const listSource = Array.isArray(json) ? json : Array.isArray(json?.items) ? json.items : [];
    const items = (listSource as RawMenuItem[]).map(mapMenuItem);
    return NextResponse.json(items, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch admin menu" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE}/menu/admin/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(json ?? { error: "Failed to create menu item" }, { status: res.status || 400 });
    }
    const mapped = mapMenuItem(json);
    return NextResponse.json(mapped, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

