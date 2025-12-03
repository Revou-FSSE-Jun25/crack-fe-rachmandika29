"use client";
import Modal from "@/components/Modal";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import type { BookingDetailModalProps } from "@/lib/types/bookings";

export default function BookingDetailModal({ open, booking, onClose, onCancel, onReschedule, className = "" }: BookingDetailModalProps) {
  if (!open || !booking) return null;
  const items = booking.items.map((i) => ({ slug: i.slug, name: i.name, price: i.price }));
  const quantities = booking.items.reduce<Record<string, number>>((acc, i) => { acc[i.slug] = i.qty; return acc; }, {});
  const title = `${booking.dateIso} • ${booking.time} • ${booking.guests} guests`;
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
        <OrderSummaryCard items={items} quantities={quantities} onIncrement={() => {}} onDecrement={() => {}} />
      </div>
    </Modal>
  );
}
