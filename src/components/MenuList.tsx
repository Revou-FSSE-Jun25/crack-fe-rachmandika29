"use client";
import { useMemo, useEffect, useState, useDeferredValue } from "react";
import SearchBar from "./SearchBar";
import MenuCard from "./MenuCard";
import MenuGrid from "./MenuGrid";
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

      <MenuGrid>
        {filtered.map((item) => {
          const qty = quantities[item.slug] ?? 0;
          return (
            <MenuCard
              key={item.slug}
              item={item}
              quantity={qty}
              onAdd={() => handleAdd(item.slug)}
              onIncrement={() => handleInc(item.slug)}
              onDecrement={() => handleDec(item.slug)}
            />
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-zinc-400">No menus match your search</div>
        )}
      </MenuGrid>
    </div>
  );
}
