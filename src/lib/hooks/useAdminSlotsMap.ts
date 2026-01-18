import { useCallback, useState } from "react";
import type { Slot } from "@/lib/types/reservation";

export function useAdminSlotsMap() {
  const [map, setMap] = useState<Record<string, Slot[]>>({});
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const slots = (dateIso: string | null): Slot[] => {
    if (!dateIso) return [];
    return map[dateIso] || [];
  };

  const create = (dateIso: string, slot: Slot) => {
    setMap((prev) => ({ ...prev, [dateIso]: [...(prev[dateIso] || []), slot] }));
  };

  const update = (dateIso: string, index: number, patch: Partial<Slot>) => {
    setMap((prev) => {
      const list = [...(prev[dateIso] || [])];
      list[index] = { ...list[index], ...patch };
      return { ...prev, [dateIso]: list };
    });
  };

  const remove = (dateIso: string, index: number) => {
    setMap((prev) => {
      const list = [...(prev[dateIso] || [])];
      list.splice(index, 1);
      return { ...prev, [dateIso]: list };
    });
  };

  const load = useCallback(
    async (dateIso: string) => {
      setPending(true);
      setError(null);
      try {
        const url = `/api/availability/admin/slots?date=${encodeURIComponent(dateIso)}`;
        const res = await fetch(url, { method: "GET" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = await res.json();
        const list: Slot[] =
          Array.isArray(json)
            ? json
            : Array.isArray(json?.slots)
            ? json.slots
            : Array.isArray((json as any)?.data)
            ? (json as any).data
            : [];
        setMap((prev) => ({ ...prev, [dateIso]: list }));
      } catch (e: any) {
        setError(e?.message || "error");
        throw e;
      } finally {
        setPending(false);
      }
    },
    []
  );

  const save = async (dateIso: string, override?: Slot[]) => {
    setPending(true);
    setError(null);
    try {
      const payload = { date: dateIso, slots: override ?? (map[dateIso] || []) };
      const res = await fetch("/api/availability/admin/slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      if (override) {
        setMap((prev) => ({ ...prev, [dateIso]: override }));
      }
    } catch (e: any) {
      setError(e?.message || "error");
      throw e;
    } finally {
      setPending(false);
    }
  };

  return { slots, create, update, remove, load, save, pending, error };
}
