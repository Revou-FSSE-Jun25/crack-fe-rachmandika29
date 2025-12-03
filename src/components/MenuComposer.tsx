"use client";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import MenuCard from "./MenuCard";
import MenuGrid from "./MenuGrid";
import StepIndicator from "@/components/StepIndicator";
import StepSection from "@/components/StepSection";
import Modal from "@/components/Modal";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import data from "@/data/menu.json";
import { useSearchField } from "@/lib/hooks/useSearchField";
import { useCategoryFilter } from "@/lib/hooks/useCategoryFilter";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { useWizardSteps } from "@/lib/hooks/useWizardSteps";
import type { MenuItem, Quantities } from "@/lib/types/menu";

export default function MenuComposer() {
  const router = useRouter();
  const items = data as MenuItem[];
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const search = useSearchField("");
  const { selectedCategory, setSelectedCategory, chips } = useCategoryFilter(categories, null);
  const [sort, setSort] = useState<"relevance" | "price_asc" | "price_desc" | "popular">("relevance");
  const debouncedQuery = useDebouncedValue(search.value, 250);
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
    if (selectedCategory) list = list.filter((i) => i.category === selectedCategory);
    if (debouncedQuery) {
      const q = debouncedQuery.trim().toLowerCase();
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
  }, [items, selectedCategory, debouncedQuery, sort]);

  const cartItems = useMemo(() => items.filter((i) => (quantities[i.slug] ?? 0) > 0), [items, quantities]);
  const hasItems = cartItems.length > 0;
  const subtotal = useMemo(() => cartItems.reduce((sum, i) => sum + i.price * (quantities[i.slug] ?? 0), 0), [cartItems, quantities]);

  const { step, next, back, canNext } = useWizardSteps({ total: 2, guards: [() => hasItems] });
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [pending, setPending] = useState(false);

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
      <Modal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        title="Order Confirmed"
        footer={
          <>
            <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={() => setOpenSuccessModal(false)}>
              Close
            </button>
            <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium" onClick={() => router.push("/dashboard/bookings")}>
              Go to Bookings
            </button>
          </>
        }
      >
        <div className="space-y-1">
          <div>{cartItems.length} items</div>
          <div>Rp {subtotal.toLocaleString()}</div>
        </div>
      </Modal>

      <StepIndicator steps={[{ label: "Choose Menu" }, { label: "Order Summary" }]} current={step} />

      {step === 1 && (
        <StepSection
          title="Choose Menu"
          description="Add items to your order."
          footer={
            <div className="w-full flex items-center justify-between">
              <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" disabled>
                Back
              </button>
              <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60" onClick={next} disabled={!canNext}>
                Continue
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            <SearchBar
              value={search.value}
              onChange={search.setValue}
              onClear={search.clear}
              categories={chips}
              selectedCategory={selectedCategory}
              onSelectCategory={(c) => setSelectedCategory(c)}
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
        </StepSection>
      )}

      {step === 2 && (
        <StepSection
          title="Order Summary"
          description="Review your order and confirm."
          footer={
            <div className="w-full flex items-center justify-between">
              <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={back}>
                Back
              </button>
              <button
                type="button"
                className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60"
                disabled={pending || cartItems.length === 0}
                onClick={async () => {
                  setPending(true);
                  try {
                    await new Promise((r) => setTimeout(r, 600));
                    setOpenSuccessModal(true);
                  } finally {
                    setPending(false);
                  }
                }}
              >
                {pending ? "Confirming..." : "Confirm Order"}
              </button>
            </div>
          }
        >
          <OrderSummaryCard items={items} quantities={quantities} onIncrement={handleInc} onDecrement={handleDec} />
        </StepSection>
      )}
    </div>
  );
}

