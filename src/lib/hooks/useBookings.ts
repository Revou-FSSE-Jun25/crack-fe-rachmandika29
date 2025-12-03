"use client";
import { useEffect, useMemo, useState } from "react";
import type { Booking } from "@/lib/types/bookings";

export function useBookings(opts: { endpoint?: string; email?: string } = {}) {
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
          const url = opts.email ? `${opts.endpoint}?email=${encodeURIComponent(opts.email)}` : opts.endpoint;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`status ${res.status}`);
          const json = await res.json();
          const list: Booking[] = Array.isArray(json) ? json : Array.isArray(json?.bookings) ? json.bookings : [];
          if (!cancelled) setData(list);
        } else {
          const mock: Booking[] = [
            {
              id: "b-1001",
              email: opts.email || "user@example.com",
              dateIso: new Date().toISOString().slice(0, 10),
              time: "19:00",
              guests: 2,
              status: "upcoming",
              items: [
                { slug: "nasi-goreng", name: "Nasi Goreng", price: 35000, qty: 1 },
                { slug: "es-teh", name: "Es Teh", price: 8000, qty: 2 },
              ],
              notes: "Window seat",
            },
            {
              id: "b-1002",
              email: opts.email || "user@example.com",
              dateIso: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
              time: "20:00",
              guests: 4,
              status: "confirmed",
              items: [
                { slug: "sate-ayam", name: "Sate Ayam", price: 45000, qty: 3 },
                { slug: "jus-mangga", name: "Jus Mangga", price: 15000, qty: 2 },
              ],
            },
          ];
          if (!cancelled) setData(mock);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [opts.endpoint, opts.email, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const subtotal = useMemo(() => {
    return (b: Booking) => (typeof b.subtotal === "number" ? b.subtotal : b.items.reduce((sum, i) => sum + i.price * i.qty, 0));
  }, []);

  return { data, loading, error, refresh, subtotal };
}

