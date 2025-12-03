import { useEffect, useMemo, useState } from "react";
import type { RescheduleRequest, RescheduleRequestStatus } from "@/lib/types/bookings";

export function useRescheduleRequests(opts: { endpoint?: string } = {}) {
  const [requests, setRequests] = useState<RescheduleRequest[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("admin_reschedule_requests") : null;
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) return parsed as RescheduleRequest[];
    } catch {}
    const today = new Date().toISOString().slice(0, 10);
    return [
      {
        id: "rr-1001",
        bookingId: "b-1001",
        currentDateIso: today,
        currentTime: "19:00",
        requestedDateIso: today,
        requestedTime: "20:00",
        guests: 2,
        status: "pending",
        reason: "Traffic delays",
      },
      {
        id: "rr-1002",
        bookingId: "b-1002",
        currentDateIso: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        currentTime: "20:00",
        requestedDateIso: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        requestedTime: "21:00",
        guests: 4,
        status: "pending",
        reason: "Meeting overrun",
      },
    ];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("admin_reschedule_requests", JSON.stringify(requests));
    } catch {}
  }, [requests]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        if (opts.endpoint) {
          const res = await fetch(opts.endpoint);
          if (!res.ok) throw new Error(`status ${res.status}`);
          const json = await res.json();
          const list: RescheduleRequest[] = Array.isArray(json) ? json : Array.isArray(json?.requests) ? json.requests : [];
          if (!cancelled) setRequests(list);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [opts.endpoint, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const updateStatus = (id: string, status: RescheduleRequestStatus, patch: Partial<RescheduleRequest> = {}) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status, ...patch } : r)));
  };

  const accept = async (id: string, dateIso: string, time: string, note?: string) => {
    setPending(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      updateStatus(id, "accepted", { requestedDateIso: dateIso, requestedTime: time, adminNote: note });
      return { ok: true };
    } catch {
      return { ok: false };
    } finally {
      setPending(false);
    }
  };

  const reject = async (id: string, reason: string) => {
    setPending(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      updateStatus(id, "rejected", { adminNote: reason });
      return { ok: true };
    } catch {
      return { ok: false };
    } finally {
      setPending(false);
    }
  };

  return { requests, loading, error, refresh, accept, reject, pending };
}

