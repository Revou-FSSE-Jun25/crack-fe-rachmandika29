"use client";
import { useMemo, useEffect, useState, useDeferredValue } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
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

type Quantities = Record<string, number>;

export default function MenuList() {
  const items = data as MenuItem[];
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<"relevance" | "price_asc" | "price_desc" | "popular">("relevance");
  const deferredQuery = useDeferredValue(query);
  const [quantities, setQuantities] = useState<Quantities>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("menu_quantities") : null;
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });


  useEffect(() => {
    try {
      localStorage.setItem("menu_quantities", JSON.stringify(quantities));
    } catch {}
  }, [quantities]);

  const filtered = useMemo(() => {
    let list = items;
    if (category) list = list.filter((i) => i.category === category);
    if (deferredQuery) {
      const q = deferredQuery.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.tags.some((t) => t.toLowerCase().includes(q)) || i.description.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price_asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list = [...list].sort((a, b) => b.popularity - a.popularity);
        break;
      default:
        break;
    }
    return list;
  }, [items, category, deferredQuery, sort]);

  const handleAdd = (slug: string) => {
    setQuantities((q) => ({ ...q, [slug]: (q[slug] ?? 0) + 1 }));
  };
  const handleInc = (slug: string) => {
    setQuantities((q) => ({ ...q, [slug]: (q[slug] ?? 0) + 1 }));
  };
  const handleDec = (slug: string) => {
    setQuantities((q) => {
      const next = { ...q };
      const val = (next[slug] ?? 0) - 1;
      if (val <= 0) delete next[slug]; else next[slug] = val;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <SearchBar
        value={query}
        onChange={setQuery}
        onClear={() => setQuery("")}
        categories={categories}
        selectedCategory={category}
        onSelectCategory={(c) => setCategory(c)}
      />

      <div className="flex items-center gap-3">
        <label className="text-sm">Sort</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "relevance" | "price_asc" | "price_desc" | "popular")}
          className="rounded-md bg-black border border-white/20 px-2 py-1 text-white"
        >
          <option value="relevance">Relevance</option>
          <option value="popular">Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const qty = quantities[item.slug] ?? 0;
          return (
            <div key={item.slug} className="rounded-md border border-white/10 bg-zinc-900/50 overflow-hidden">
              <Link href={`/menu/${item.slug}`} className="block">
                <div className="aspect-video bg-black/50" />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className="text-sm text-zinc-400">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2">{item.description}</p>
                </div>
              </Link>
              <div className="p-4 border-t border-white/10 flex items-center justify-between">
                {qty === 0 ? (
                  <button
                    type="button"
                    className="rounded-md bg-white text-black px-3 py-1 text-sm font-medium hover:bg-zinc-200"
                    onClick={() => handleAdd(item.slug)}
                  >
                    Add
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-md border border-white/20 px-2 py-1 text-sm hover:bg-white/10"
                      onClick={() => handleDec(item.slug)}
                    >
                      -
                    </button>
                    <span className="text-sm">{qty}</span>
                    <button
                      type="button"
                      className="rounded-md border border-white/20 px-2 py-1 text-sm hover:bg-white/10"
                      onClick={() => handleInc(item.slug)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-zinc-400">No menus match your search</div>
        )}
      </div>
    </div>
  );
}
