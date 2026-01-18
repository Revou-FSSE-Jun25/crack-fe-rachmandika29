import Image from "next/image";
import { notFound } from "next/navigation";

type MenuItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  popularity: number;
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let items: MenuItem[] = [];
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://be.dahar.services";
    const res = await fetch(`${API_BASE}/menu`, { method: "GET", cache: "no-store" });
    const json = await res.json().catch(() => null);
    const listSource = Array.isArray(json)
      ? json
      : Array.isArray(json?.items)
      ? json.items
      : Array.isArray((json as any)?.data)
      ? (json as any).data
      : [];
    items = (listSource as any[]).map((raw) => {
      const id = typeof raw?.id === "number" ? raw.id : Number(raw?.id ?? 0);
      const name = String(raw?.name ?? "");
      const description = String(raw?.description ?? "");
      const price = typeof raw?.price === "number" ? raw.price : Number(raw?.price ?? 0);
      const image = String(raw?.image ?? "");
      const category = String(raw?.category ?? "Uncategorized");
      const tags = Array.isArray(raw?.tags) ? raw.tags.map((t: any) => String(t)) : [];
      const popularity = typeof raw?.popularity === "number" ? raw.popularity : 0;
      const slugSource = raw?.slug ?? (name || `item-${id || Date.now()}`);
      const s = String(slugSource);
      return { id, slug: s, name, description, price, image, category, tags, popularity };
    });
  } catch {}
  const key = decodeURIComponent(slug).trim().toLowerCase();
  const item = items.find((i) => i.slug.trim().toLowerCase() === key);
  if (!item) return notFound();

  return (
    <div className="montserrat flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl p-6 space-y-6">
        <div className="rounded-md border border-white/10 bg-zinc-900/50 overflow-hidden">
          <div className="aspect-video bg-black/50 relative overflow-hidden">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="100vw"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold">{item.name}</h1>
              <span className="text-lg">${item.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-zinc-400">{item.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
              <span className="rounded-full border border-white/20 px-2 py-0.5">{item.category}</span>
              {item.tags.map((t) => (
                <span key={t} className="rounded-full border border-white/20 px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
