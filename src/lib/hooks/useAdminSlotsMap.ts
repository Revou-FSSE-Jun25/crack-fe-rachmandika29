import { useState } from "react";
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

  const save = async (dateIso: string, override?: Slot[]) => {
    setPending(true);
    setError(null);
    try {
      if (override) {
        setMap((prev) => ({ ...prev, [dateIso]: override }));
      }
      await new Promise((r) => setTimeout(r, 500));
    } catch (e: any) {
      setError(e?.message || "error");
      throw e;
    } finally {
      setPending(false);
    }
  };

  return { slots, create, update, remove, save, pending, error };
}

