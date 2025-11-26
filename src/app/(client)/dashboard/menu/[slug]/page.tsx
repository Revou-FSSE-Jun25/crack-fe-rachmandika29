import { notFound } from "next/navigation";
import data from "@/data/menu.json";

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

export default function Page({ params }: { params: { slug: string } }) {
  const items = data as MenuItem[];
  const item = items.find((i) => i.slug === params.slug);
  if (!item) return notFound();

  return (
    <div className="montserrat flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl p-6 space-y-6">
        <div className="rounded-md border border-white/10 bg-zinc-900/50 overflow-hidden">
          <div className="aspect-video bg-black/50" />
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
