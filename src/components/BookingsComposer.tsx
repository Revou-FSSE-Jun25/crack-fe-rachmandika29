"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import BookingsHeader from "@/components/BookingsHeader";
import BookingsFilterBar from "@/components/BookingsFilterBar";
import UpcomingBookingsList from "@/components/UpcomingBookingsList";
import BookingDetailModal from "@/components/BookingDetailModal";
import ClientRescheduleModal from "@/components/ClientRescheduleModal";
import EmptyState from "@/components/EmptyState";
import { useBookings } from "@/lib/hooks/useBookings";
import type { Booking } from "@/lib/types/bookings";
import { useAuthRequest } from "@/lib/hooks/useAuthRequest";

export default function BookingsComposer() {
  const router = useRouter();
  const [status, setStatus] = useState<"all" | "upcoming" | "confirmed" | "cancelled">("all");
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState<boolean>(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Booking | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/status", { cache: "no-store", credentials: "include" });
        const json = await res.json();
        if (active) setEmail(json?.email || null);
      } catch {
        if (active) setEmail(null);
      }
    })();
    return () => { active = false; };
  }, []);

  const { data, loading, error, refresh } = useBookings({ endpoint: "/api/bookings", email: email || undefined });
  const cancelReq = useAuthRequest("/api/bookings/cancel");
  const rescheduleReq = useAuthRequest("/api/bookings/reschedule");

  const filtered = useMemo(() => {
    return data.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (search && !`${b.dateIso} ${b.time} ${b.items.map((i) => i.name).join(" ")}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (startDate && b.dateIso < startDate) return false;
      if (endDate && b.dateIso > endDate) return false;
      return true;
    });
  }, [data, status, search, startDate, endDate]);

  const onViewDetails = (b: Booking) => {
    setSelected(b);
    setDetailOpen(true);
  };

  const onCancel = async (b: Booking) => {
    setCancellingId(b.id);
    const res = await cancelReq.submit({ id: b.id });
    if (res.ok) {
      refresh();
    }
    setCancellingId(null);
  };

  const onReschedule = (b: Booking) => {
    setRescheduleTarget(b);
    setRescheduleOpen(true);
  };

  const onConfirmReschedule = async (b: Booking, dateIso: string, time: string) => {
    setReschedulingId(b.id);
    const res = await rescheduleReq.submit({ id: b.id, dateIso, time });
    if (res.ok) {
      refresh();
    } else {
      router.push(`/dashboard/reservation?date=${encodeURIComponent(dateIso)}&time=${encodeURIComponent(time)}&guests=${b.guests}`);
    }
    setReschedulingId(null);
    setRescheduleOpen(false);
    setRescheduleTarget(null);
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl p-6 space-y-6">
        <BookingsHeader action={<button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium" onClick={() => router.push("/dashboard/reservation")}>New Reservation</button>} />
        <BookingsFilterBar
          status={status}
          onStatusChange={setStatus}
          search={search}
          onSearchChange={setSearch}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <UpcomingBookingsList
          bookings={filtered}
          loading={loading}
          error={error}
          onViewDetails={onViewDetails}
          onCancel={onCancel}
          onReschedule={onReschedule}
          cancellingId={cancellingId}
          reschedulingId={reschedulingId}
          empty={<EmptyState title="No upcoming bookings" description="Start by creating a reservation and ordering from the menu." action={<button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium" onClick={() => router.push("/dashboard/reservation")}>Create Reservation</button>} />}
        />
        <BookingDetailModal
          open={detailOpen}
          booking={selected}
          onClose={() => setDetailOpen(false)}
          onCancel={onCancel}
          onReschedule={onReschedule}
          cancelling={selected ? cancellingId === selected.id : false}
          rescheduling={selected ? reschedulingId === selected.id : false}
        />
        <ClientRescheduleModal
          key={rescheduleTarget?.id ?? "none"}
          open={rescheduleOpen}
          booking={rescheduleTarget}
          onConfirm={onConfirmReschedule}
          onClose={() => {
            setRescheduleOpen(false);
            setRescheduleTarget(null);
          }}
          submitting={rescheduleTarget ? reschedulingId === rescheduleTarget.id : false}
        />
      </main>
    </div>
  );
}

