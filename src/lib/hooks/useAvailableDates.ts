import { useEffect, useMemo, useState } from "react";

type Options = { days?: number; endpoint?: string; start?: Date };

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useAvailableDates(opts: Options = {}) {
  const days = opts.days ?? 21;
  const start = useMemo(() => opts.start ?? new Date(), [opts.start]);
  const endpoint = opts.endpoint;
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        if (endpoint) {
          const res = await fetch(endpoint);
          if (!res.ok) throw new Error(`status ${res.status}`);
          const json = await res.json();
          const list: string[] = Array.isArray(json) ? json : Array.isArray(json?.dates) ? json.dates : [];
          if (!cancelled) setData(list);
        } else {
          const list: string[] = [];
          for (let i = 0; i < days; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            list.push(toIso(d));
          }
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
  }, [days, start, endpoint, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  return { data, loading, error, refresh };
}

