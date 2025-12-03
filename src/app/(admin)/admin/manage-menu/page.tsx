"use client";
import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import MenuGrid from "@/components/MenuGrid";
import AdminMenuCard from "@/components/AdminMenuCard";
import AdminFeedback from "@/components/AdminFeedback";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useAdminMenuAvailability } from "@/lib/hooks/useAdminMenuAvailability";
import { useSearchField } from "@/lib/hooks/useSearchField";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { useCategoryFilter } from "@/lib/hooks/useCategoryFilter";

export default function Home() {
  const { items, availability, setAvailable, bulkSet, save, pending, error } = useAdminMenuAvailability();
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const search = useSearchField("");
  const { selectedCategory, setSelectedCategory, chips } = useCategoryFilter(categories, null);
  const debouncedQuery = useDebouncedValue(search.value, 250);
  const [feedback, setFeedback] = useState<{ open: boolean; kind: "success" | "error" | "info"; message: string }>({ open: false, kind: "info", message: "" });
  const [confirm, setConfirm] = useState<{ open: boolean; action: "disable_all" | null }>({ open: false, action: null });

  const filtered = useMemo(() => {
    let list = items;
    if (selectedCategory) list = list.filter((i) => i.category === selectedCategory);
    if (debouncedQuery) {
      const q = debouncedQuery.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.tags.some((t) => t.toLowerCase().includes(q)) || i.description.toLowerCase().includes(q));
    }
    return list;
  }, [items, selectedCategory, debouncedQuery]);

  const onSave = async () => {
    try {
      await save();
      setFeedback({ open: true, kind: "success", message: "Menu availability saved" });
    } catch {
      setFeedback({ open: true, kind: "error", message: "Failed to save menu availability" });
    }
  };

  const disableAll = () => {
    const slugs = filtered.map((i) => i.slug);
    bulkSet(slugs, false);
    setConfirm({ open: false, action: null });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Manage Menu Availability</h1>
          <p className="text-sm text-zinc-400">Control which items are shown to clients</p>
        </div>

        <AdminFeedback open={feedback.open} kind={feedback.kind} message={feedback.message} onClose={() => setFeedback({ ...feedback, open: false })} />
        <ConfirmDialog open={confirm.open} title="Disable All" description="Disable availability for all filtered items?" onConfirm={disableAll} onCancel={() => setConfirm({ open: false, action: null })} />

        <div className="space-y-4">
          <SearchBar
            value={search.value}
            onChange={search.setValue}
            onClear={search.clear}
            categories={chips}
            selectedCategory={selectedCategory}
            onSelectCategory={(c) => setSelectedCategory(c)}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400">{filtered.length} items</div>
            <div className="inline-flex items-center gap-2">
              <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={() => setConfirm({ open: true, action: "disable_all" })}>Disable All</button>
              <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60" disabled={pending} onClick={onSave}>Save Changes</button>
            </div>
          </div>
        </div>

        <MenuGrid>
          {filtered.map((item) => (
            <AdminMenuCard key={item.slug} item={item} available={availability[item.slug] !== false} onToggle={(v) => setAvailable(item.slug, v)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-sm text-zinc-400">No menus match your filters</div>
          )}
        </MenuGrid>

        {error && (
          <div className="text-sm text-red-400">{error}</div>
        )}
      </main>
    </div>
  );
}
