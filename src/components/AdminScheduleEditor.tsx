"use client";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import type { AdminScheduleEditorProps } from "@/lib/types/ui";
import { z } from "zod";
import { useZodFormValidation } from "@/lib/hooks/useZodFormValidation";

export default function AdminScheduleEditor({ dateIso, slots, onCreateSlot, onUpdateSlot, onDeleteSlot, onSave, pending = false, error = null, className = "" }: AdminScheduleEditorProps) {
  const addDefault = () => {
    const t = "18:00";
    onCreateSlot({ time: t, available: true, capacity: 6 });
  };

  const schema = z.object({
    slots: z.array(
      z.object({
        time: z.string().regex(/^\d{2}:\d{2}$/ , "Invalid time"),
        capacity: z.number().min(0, "Capacity must be at least 0").optional(),
      })
    ),
  });

  const { values, setValue, errors, attempted, submit } = useZodFormValidation(schema, { slots });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValue("slots", slots);
    submit(() => {
      if (onSave) onSave();
    });
  };

  return (
    <form onSubmit={onSubmit} className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{dateIso || "Select a date"}</div>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={addDefault}>Add Slot</button>
          <button type="submit" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60" disabled={pending}>Save Changes</button>
        </div>
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
      {attempted && errors.slots && <div className="text-sm text-red-400">{errors.slots}</div>}
      <div className="space-y-2">
        {slots.length === 0 && (
          <div className="text-sm text-zinc-400">No slots for this date</div>
        )}
        {slots.map((s, idx) => (
          <div key={`${s.time}-${idx}`} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AvailabilityBadge variant={Number(s.capacity) > 0 ? "available" : "full"} label={Number(s.capacity) > 0 ? "Available" : "Full"} capacity={s.capacity} />
              <input
                type="text"
                value={s.time}
                onChange={(e) => onUpdateSlot(idx, { time: e.target.value })}
                className="w-24 rounded-md bg-black border border-white/20 px-2 py-1 text-white"
              />
              <input
                type="number"
                value={typeof s.capacity === "number" ? s.capacity : 0}
                onChange={(e) => onUpdateSlot(idx, { capacity: Math.max(0, Number(e.target.value)) })}
                className="w-24 rounded-md bg-black border border-white/20 px-2 py-1 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-md border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10" onClick={() => onDeleteSlot(idx)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
