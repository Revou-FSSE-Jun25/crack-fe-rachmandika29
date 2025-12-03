import { useEffect, useMemo, useState } from "react";
import data from "@/data/menu.json";
import type { MenuItem } from "@/lib/types/menu";

export function useAdminMenuAvailability() {
  const baseItems = useMemo(() => data as MenuItem[], []);
  const [customItems, setCustomItems] = useState<MenuItem[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("admin_menu_custom_items") : null;
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) return parsed as MenuItem[];
    } catch {}
    return [];
  });
  const items = useMemo(() => [...baseItems, ...customItems], [baseItems, customItems]);
  const [availability, setAvailability] = useState<Record<string, boolean>>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("admin_menu_availability") : null;
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === "object") return parsed as Record<string, boolean>;
    } catch {}
    const initial: Record<string, boolean> = {};
    for (const i of [...baseItems]) initial[i.slug] = true;
    return initial;
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("admin_menu_availability", JSON.stringify(availability));
    } catch {}
  }, [availability]);

  useEffect(() => {
    try {
      localStorage.setItem("admin_menu_custom_items", JSON.stringify(customItems));
    } catch {}
  }, [customItems]);

  const setAvailable = (slug: string, v: boolean) => {
    setAvailability((prev) => ({ ...prev, [slug]: v }));
  };

  const bulkSet = (slugs: string[], v: boolean) => {
    setAvailability((prev) => {
      const next = { ...prev };
      for (const s of slugs) next[s] = v;
      return next;
    });
  };

  const save = async () => {
    setPending(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
    } catch (e: any) {
      setError(e?.message || "error");
    } finally {
      setPending(false);
    }
  };

  const createItem = (item: Omit<MenuItem, "id">) => {
    const nextId = Math.max(0, ...items.map((i) => i.id)) + 1;
    const full: MenuItem = { id: nextId, ...item } as MenuItem;
    setCustomItems((prev) => [...prev, full]);
    setAvailability((prev) => ({ ...prev, [full.slug]: true }));
  };

  return { items, availability, setAvailable, bulkSet, save, pending, error, createItem };
}

