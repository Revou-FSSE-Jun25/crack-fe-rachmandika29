"use client";
import { useEffect, useMemo, useState } from "react";
import type { Booking, BookingStatus } from "@/lib/types/bookings";
import menuData from "@/data/menu.json";
import type { MenuItem } from "@/lib/types/menu";

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
          if (!opts.email) {
            if (!cancelled) {
              setData([]);
              setLoading(false);
            }
            return;
          }
          const url = opts.email ? `${opts.endpoint}?email=${encodeURIComponent(opts.email)}` : opts.endpoint;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`status ${res.status}`);
          const json = await res.json();
          const rawList: any[] = Array.isArray(json) ? json : Array.isArray(json?.bookings) ? json.bookings : [];
          const list: Booking[] = rawList.map((raw) => {
            const statusRaw = String(raw.status ?? "").toLowerCase();
            const status: BookingStatus =
              statusRaw === "upcoming" ||
              statusRaw === "confirmed" ||
              statusRaw === "cancelled" ||
              statusRaw === "pending"
                ? statusRaw
                : "upcoming";
            const items = Array.isArray(raw.items)
              ? raw.items.map((it: any) => {
                  const name = String(it.name ?? "");
                  const baseSlug =
                    typeof it.slug === "string" && it.slug.trim() !== ""
                      ? it.slug
                      : name || `item-${typeof it.id === "number" && Number.isFinite(it.id) ? it.id : Date.now()}`;
                  const slug = baseSlug
                    .toString()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                  const price = Number(it.price ?? 0);
                  const qty = Number(it.qty ?? it.quantity ?? 0);
                  return { slug, name, price, qty };
                })
              : [];
            return {
              id: String(raw.id ?? ""),
              email: String(raw.email ?? opts.email ?? ""),
              dateIso: String(raw.dateIso ?? ""),
              time: String(raw.time ?? ""),
              guests: Number(raw.guests ?? 0),
              status,
              items,
              notes: raw.notes ? String(raw.notes) : undefined,
              subtotal: typeof raw.subtotal === "number" ? raw.subtotal : undefined,
            };
          });
          if (!cancelled) setData(list);
        } else {
          const menuItems = menuData as MenuItem[];
          const m1 = menuItems[0];
          const m2 = menuItems[1] || menuItems[0];
          const m3 = menuItems[2] || menuItems[0];
          const mock: Booking[] = [
            {
              id: "b-1001",
              email: opts.email || "user@example.com",
              dateIso: new Date().toISOString().slice(0, 10),
              time: "19:00",
              guests: 2,
              status: "upcoming",
              items: [
                { slug: m1.slug, name: m1.name, price: m1.price, qty: 1 },
                { slug: m2.slug, name: m2.name, price: m2.price, qty: 2 },
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
                { slug: m2.slug, name: m2.name, price: m2.price, qty: 3 },
                { slug: m3.slug, name: m3.name, price: m3.price, qty: 2 },
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

