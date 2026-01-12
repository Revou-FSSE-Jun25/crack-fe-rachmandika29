import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/types/menu";

export function useAdminMenuAvailability() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setPending(true);
      setError(null);
      try {
        const res = await fetch("/api/menu/admin/menu", { cache: "no-store" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = await res.json();
        const list: any[] = Array.isArray(json) ? json : Array.isArray(json?.items) ? json.items : [];
        const nextItems = list as MenuItem[];
        const nextAvailability: Record<string, boolean> = {};
        for (const it of nextItems) {
          const a = typeof (it as any).available === "boolean" ? (it as any).available : true;
          nextAvailability[it.slug] = a;
        }
        if (!cancelled) {
          setItems(nextItems);
          setAvailability(nextAvailability);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "error");
      } finally {
        if (!cancelled) setPending(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

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
      const updates = items.map((it) => {
        const available = availability[it.slug] !== false;
        return fetch(`/api/menu/admin/menu/${it.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ available }),
        });
      });
      await Promise.all(updates);
    } catch (e: any) {
      setError(e?.message || "error");
      throw e;
    } finally {
      setPending(false);
    }
  };

  const createItem = async (item: Omit<MenuItem, "id">) => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/menu/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const json = await res.json();
      const created = json as MenuItem;
      setItems((prev) => [...prev, created]);
      setAvailability((prev) => ({ ...prev, [created.slug]: true }));
    } catch (e: any) {
      setError(e?.message || "error");
      throw e;
    } finally {
      setPending(false);
    }
  };

  return { items, availability, setAvailable, bulkSet, save, pending, error, createItem };
}

