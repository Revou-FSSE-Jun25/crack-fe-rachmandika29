"use client";
import Modal from "@/components/Modal";
import DatePickerCalendar from "@/components/DatePickerCalendar";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import { useAvailableDates } from "@/lib/hooks/useAvailableDates";
import { useTimeSlotsForDate } from "@/lib/hooks/useTimeSlotsForDate";
import { z } from "zod";
import { useZodFormValidation } from "@/lib/hooks/useZodFormValidation";
import type { Booking } from "@/lib/types/bookings";

type ClientRescheduleModalProps = {
  open: boolean;
  booking: Booking | null;
  onConfirm: (booking: Booking, dateIso: string, time: string) => void;
  onClose: () => void;
  submitting?: boolean;
  className?: string;
};

export default function ClientRescheduleModal({ open, booking, onConfirm, onClose, submitting = false, className = "" }: ClientRescheduleModalProps) {
  if (!open || !booking) return null;
  const { data: availableDates } = useAvailableDates({ days: 30, endpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://be.dahar.services"}/availability/available-dates` });
  const schema = z.object({ dateIso: z.string().min(1, "Select a date"), time: z.string().min(1, "Select a time") });
  const { values, setValue, errors, attempted, submit } = useZodFormValidation(schema, { dateIso: booking.dateIso, time: booking.time });
  const { data: slots } = useTimeSlotsForDate(values.dateIso || null, { endpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://be.dahar.services"}/availability/slots` });

  const handleConfirm = () => {
    submit(() => onConfirm(booking, values.dateIso, values.time));
  };

  const title = `Reschedule ${booking.dateIso} • ${booking.time}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      className={`sm:max-w-2xl ${className}`}
      footer={(
        <div className="w-full flex items-center justify-end gap-2">
          <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60" onClick={handleConfirm} disabled={submitting}>Confirm</button>
        </div>
      )}
    >
      <div className="space-y-3">
        {attempted && (errors.dateIso || errors.time) && (
          <div className="rounded-md border border-red-400 bg-red-600/20 text-red-200 px-3 py-2 text-sm">Please select date and time.</div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <DatePickerCalendar availableDates={availableDates} selected={values.dateIso} onSelect={(d) => setValue("dateIso", d)} />
          <TimeSlotPicker slots={slots} selected={values.time} onSelect={(t) => setValue("time", t)} />
        </div>
      </div>
    </Modal>
  );
}

