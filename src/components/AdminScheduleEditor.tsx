"use client";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import type { AdminScheduleEditorProps } from "@/lib/types/ui";
import { z } from "zod";
import { useZodFormValidation } from "@/lib/hooks/useZodFormValidation";

export default function AdminScheduleEditor({ dateIso, slots, onCreateSlot, onUpdateSlot, onDeleteSlot, onSave, pending = false, error = null, className = "" }: AdminScheduleEditorProps) {
  const addDefault = () => {
    const t = "06:00 PM";
    onCreateSlot({ time: t, available: true, capacity: 6 });
  };

  const schema = z.object({
    slots: z.array(
      z.object({
        time: z.string().regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i , "Invalid time (hh:mm AM/PM)"),
        capacity: z.number().min(2, "Capacity must be at least 2").max(30, "Capacity must be at most 30").optional(),
      })
    ),
  });

  const { values, setValue, errors, attempted, submit } = useZodFormValidation(schema, { slots });

  const normalizeTime12h = (raw: string) => {
    const v = raw.toUpperCase().replace(/\s+/g, " ").trim();
    const m = v.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
    if (!m) return raw;
    const hh = parseInt(m[1], 10);
    if (hh < 1 || hh > 12) return raw;
    const mm = m[2];
    const suf = m[3];
    const hhPad = String(hh).padStart(2, "0");
    return `${hhPad}:${mm} ${suf}`;
  };

  const timeOptions12h = (() => {
    const out: string[] = [];
    for (let h = 18; h <= 22; h++) {
      for (const m of [0, 30]) {
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const hh = String(hour12).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        out.push(`${hh}:${mm} PM`);
      }
    }
    out.push("11:00 PM");
    return out;
  })();

  const capacityOptions = Array.from({ length: 29 }, (_, i) => i + 2);

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
              <select
                value={normalizeTime12h(s.time)}
                onChange={(e) => onUpdateSlot(idx, { time: e.target.value })}
                className="w-32 rounded-md bg-black border border-white/20 px-2 py-1 text-white"
              >
                {timeOptions12h.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                value={typeof s.capacity === "number" ? s.capacity : 0}
                onChange={(e) => onUpdateSlot(idx, { capacity: Number(e.target.value) })}
                className="w-24 rounded-md bg-black border border-white/20 px-2 py-1 text-white"
              >
                {capacityOptions.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
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
