"use client";
import Modal from "@/components/Modal";
import DatePickerCalendar from "@/components/DatePickerCalendar";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import { useAvailableDates } from "@/lib/hooks/useAvailableDates";
import { useTimeSlotsForDate } from "@/lib/hooks/useTimeSlotsForDate";
import { z } from "zod";
import { useZodFormValidation } from "@/lib/hooks/useZodFormValidation";
import type { RescheduleDecisionModalProps } from "@/lib/types/bookings";

export default function RescheduleDecisionModal({ open, request, onConfirm, onCancel, className = "" }: RescheduleDecisionModalProps) {
  if (!open || !request) return null;
  const { data: availableDates } = useAvailableDates({ days: 30 });
  const schema = z.object({ dateIso: z.string().min(1, "Select a date"), time: z.string().min(1, "Select a time"), note: z.string().optional() });
  const { values, setValue, errors, attempted, submit } = useZodFormValidation(schema, { dateIso: request.requestedDateIso, time: request.requestedTime, note: "" });
  const { data: slots } = useTimeSlotsForDate(values.dateIso || null);

  const handleConfirm = () => {
    submit(() => onConfirm(values.dateIso, values.time, values.note));
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Accept Reschedule"
      className={className}
      footer={(
        <div className="w-full flex items-center justify-end gap-2">
          <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={onCancel}>Cancel</button>
          <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium" onClick={handleConfirm}>Confirm</button>
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
        <div>
          <label className="block text-sm">Note to client (optional)</label>
          <textarea
            value={values.note || ""}
            onChange={(e) => setValue("note", e.target.value)}
            className="mt-1 w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
}

