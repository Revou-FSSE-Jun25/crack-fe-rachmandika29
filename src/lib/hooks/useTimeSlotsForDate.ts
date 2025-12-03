import { useEffect, useState } from "react";

export type Slot = { time: string; available: boolean; capacity?: number };

type Options = { endpoint?: string };

export function useTimeSlotsForDate(dateIso: string | null, opts: Options = {}) {
  const endpoint = opts.endpoint;
  const [data, setData] = useState<Slot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!dateIso) {
        setData([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        if (endpoint) {
          const url = `${endpoint}?date=${encodeURIComponent(dateIso)}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`status ${res.status}`);
          const json = await res.json();
          const list: Slot[] = Array.isArray(json) ? json : Array.isArray(json?.slots) ? json.slots : [];
          if (!cancelled) setData(list);
        } else {
          const base = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
          const list = base.map((t, i) => ({ time: t, available: i % 5 !== 0, capacity: 6 - (i % 3) }));
          if (!cancelled) setData(list);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [dateIso, endpoint, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  return { data, loading, error, refresh };
}

