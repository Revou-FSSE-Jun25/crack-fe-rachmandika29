"use client";
import BookingCard from "@/components/BookingCard";
import type { Booking } from "@/lib/types/bookings";

type Props = {
  bookings: Booking[];
  loading?: boolean;
  error?: string | null;
  onViewDetails: (b: Booking) => void;
  onCancel?: (b: Booking) => void;
  onReschedule?: (b: Booking) => void;
  className?: string;
  empty?: React.ReactNode;
};

export default function UpcomingBookingsList({ bookings, loading = false, error = null, onViewDetails, onCancel, onReschedule, className = "", empty }: Props) {
  if (loading) {
    return (
      <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
        <div className="text-sm text-zinc-400">Loading bookings…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
        <div className="text-sm text-red-400">{error}</div>
      </div>
    );
  }
  if (!bookings || bookings.length === 0) {
    return empty ? <>{empty}</> : (
      <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
        <div className="text-sm text-zinc-400">No upcoming bookings</div>
      </div>
    );
  }
  return (
    <div role="list" className={`space-y-3 ${className}`}>
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} onViewDetails={onViewDetails} onCancel={onCancel} onReschedule={onReschedule} />
      ))}
    </div>
  );
}

