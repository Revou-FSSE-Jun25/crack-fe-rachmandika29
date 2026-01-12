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
  return { id, slug, name, description, price, image, category, tags, popularity };
}

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/menu`, { method: "GET" });
    const json = await res.json().catch(() => null);
    const listSource = Array.isArray(json) ? json : Array.isArray(json?.items) ? json.items : [];
    const items = (listSource as RawMenuItem[]).map(mapMenuItem);
    return NextResponse.json(items, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 502 });
  }
}

