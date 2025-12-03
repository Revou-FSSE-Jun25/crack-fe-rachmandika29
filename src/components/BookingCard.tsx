"use client";
import type { Booking } from "@/lib/types/bookings";

type Props = {
  booking: Booking;
  onViewDetails: (b: Booking) => void;
  onCancel?: (b: Booking) => void;
  onReschedule?: (b: Booking) => void;
  className?: string;
};

function Badge({ status }: { status: Booking["status"] }) {
  const color = status === "upcoming" ? "bg-blue-500/20 text-blue-300 border-blue-400/40" : status === "confirmed" ? "bg-green-500/20 text-green-300 border-green-400/40" : "bg-red-500/20 text-red-300 border-red-400/40";
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${color}`}>{status}</span>;
}

export default function BookingCard({ booking, onViewDetails, onCancel, onReschedule, className = "" }: Props) {
  const subtotal = typeof booking.subtotal === "number" ? booking.subtotal : booking.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`} role="listitem" aria-label={`${booking.dateIso} ${booking.time}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge status={booking.status} />
          <div className="text-sm font-medium">{booking.dateIso}</div>
          <div className="text-sm text-zinc-300">{booking.time}</div>
          <div className="text-sm text-zinc-300">{booking.guests} guests</div>
        </div>
        <div className="text-sm">Rp {subtotal.toLocaleString()}</div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          {booking.items.slice(0, 3).map((i) => (
            <span key={i.slug}>{i.name} × {i.qty}</span>
          ))}
          {booking.items.length > 3 && <span>+{booking.items.length - 3} more</span>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10" onClick={() => onViewDetails(booking)}>View Details</button>
          {onReschedule && <button type="button" className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10" onClick={() => onReschedule(booking)}>Reschedule</button>}
          {onCancel && <button type="button" className="rounded-md bg-red-600 text-white px-3 py-1.5 text-sm" onClick={() => onCancel(booking)}>Cancel</button>}
        </div>
      </div>
    </div>
  );
}

