import { useEffect, useMemo, useState } from "react";
import data from "@/data/menu.json";
import type { MenuItem } from "@/lib/types/menu";

export function useAdminMenuAvailability() {
  const items = useMemo(() => data as MenuItem[], []);
  const [availability, setAvailability] = useState<Record<string, boolean>>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("admin_menu_availability") : null;
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === "object") return parsed as Record<string, boolean>;
    } catch {}
    const initial: Record<string, boolean> = {};
    for (const i of items) initial[i.slug] = true;
    return initial;
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("admin_menu_availability", JSON.stringify(availability));
    } catch {}
  }, [availability]);

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

  return { items, availability, setAvailable, bulkSet, save, pending, error };
}

