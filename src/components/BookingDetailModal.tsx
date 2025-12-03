"use client";
import Modal from "@/components/Modal";
import type { BookingDetailModalProps } from "@/lib/types/bookings";

export default function BookingDetailModal({ open, booking, onClose, onCancel, onReschedule, className = "" }: BookingDetailModalProps) {
  if (!open || !booking) return null;
  const title = `${booking.dateIso} • ${booking.time} • ${booking.guests} guests`;
  const subtotal = booking.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={(
        <>
          <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={onClose}>Close</button>
          {onReschedule && <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={() => onReschedule(booking)}>Reschedule</button>}
          {onCancel && <button type="button" className="rounded-md bg-red-600 text-white px-3 py-2 text-sm" onClick={() => onCancel(booking)}>Cancel</button>}
        </>
      )}
      className={className}
    >
      <div className="space-y-4">
        <div className="text-sm text-zinc-300">{booking.notes || "No special notes"}</div>
        <div className="rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4">
          <div className="text-sm font-medium mb-2">Order Summary</div>
          <div className="space-y-3">
            {booking.items.map((i) => (
              <div key={i.slug} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm">{i.name}</div>
                  <div className="text-xs text-zinc-400">Rp {i.price.toLocaleString()}</div>
                </div>
                <div className="text-sm">× {i.qty}</div>
              </div>
            ))}
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between">
              <div className="text-sm">Subtotal</div>
              <div className="text-sm">Rp {subtotal.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
