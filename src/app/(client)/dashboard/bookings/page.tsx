"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import BookingsHeader from "@/components/BookingsHeader";
import BookingsFilterBar from "@/components/BookingsFilterBar";
import UpcomingBookingsList from "@/components/UpcomingBookingsList";
import BookingDetailModal from "@/components/BookingDetailModal";
import EmptyState from "@/components/EmptyState";
import { useBookings } from "@/lib/hooks/useBookings";
import type { Booking } from "@/lib/types/bookings";
import { useEffect, useState as useReactState } from "react";
import { useAuthRequest } from "@/lib/hooks/useAuthRequest";

export default function BookingsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"all" | "upcoming" | "confirmed" | "cancelled">("all");
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Booking | null>(null);

  const { data, loading, error, refresh } = useBookings();
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
    const res = await cancelReq.submit({ id: b.id });
    if (res.ok) {
      const idx = data.findIndex((x) => x.id === b.id);
      if (idx >= 0) {
        data[idx].status = "cancelled" as const;
      }
      refresh();
    }
  };

  const onReschedule = (b: Booking) => {
    router.push(`/dashboard/reservation?date=${encodeURIComponent(b.dateIso)}&time=${encodeURIComponent(b.time)}&guests=${b.guests}`);
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
          empty={<EmptyState title="No upcoming bookings" description="Start by creating a reservation and ordering from the menu." action={<button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium" onClick={() => router.push("/dashboard/reservation")}>Create Reservation</button>} />}
        />
        <BookingDetailModal open={detailOpen} booking={selected} onClose={() => setDetailOpen(false)} onCancel={onCancel} onReschedule={onReschedule} />
      </main>
    </div>
  );
}
