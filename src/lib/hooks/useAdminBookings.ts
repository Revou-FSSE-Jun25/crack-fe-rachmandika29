"use client";
import { useEffect, useState } from "react";
import type { Booking, BookingStatus } from "@/lib/types/bookings";

type StatusFilter = "upcoming" | "confirmed" | "cancelled" | "all";

export function useAdminBookings(opts: { endpoint?: string; from?: string | null; to?: string | null; status?: StatusFilter } = {}) {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        if (opts.endpoint) {
          const params: string[] = [];
          if (opts.from) params.push(`from=${encodeURIComponent(opts.from)}`);
          if (opts.to) params.push(`to=${encodeURIComponent(opts.to)}`);
          if (opts.status) {
            const s = opts.status === "all" ? "ALL" : opts.status.toUpperCase();
            params.push(`status=${encodeURIComponent(s)}`);
          }
          const qs = params.length ? `?${params.join("&")}` : "";
          const url = `${opts.endpoint}${qs}`;
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) throw new Error(`status ${res.status}`);
          const json = await res.json();
          const list: any[] = Array.isArray(json)
            ? json
            : Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json?.bookings)
            ? json.bookings
            : [];
          const mapped: Booking[] = list.map((raw) => {
            const statusRaw = String(raw.status ?? "").toLowerCase();
            const status: BookingStatus =
              statusRaw === "upcoming" || statusRaw === "confirmed" || statusRaw === "cancelled"
                ? statusRaw
                : "upcoming";
            return {
              id: String(raw.id ?? ""),
              email: String(raw.userEmail ?? raw.email ?? ""),
              dateIso: String(raw.dateIso ?? ""),
              time: String(raw.time ?? ""),
              guests: Number(raw.guests ?? 0),
              status,
              items: Array.isArray(raw.items)
                ? raw.items.map((it: any) => ({
                    slug: String(it.slug ?? ""),
                    name: String(it.name ?? ""),
                    price: Number(it.price ?? 0),
                    qty: Number(it.quantity ?? it.qty ?? 0),
                  }))
                : [],
              notes: raw.notes ? String(raw.notes) : undefined,
              subtotal: typeof raw.subtotal === "number" ? raw.subtotal : undefined,
            };
          });
          if (!cancelled) setData(mapped);
        } else {
          if (!cancelled) setData([]);
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
  }, [opts.endpoint, opts.from, opts.to, opts.status, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  return { bookings: data, loading, error, refresh };
}
