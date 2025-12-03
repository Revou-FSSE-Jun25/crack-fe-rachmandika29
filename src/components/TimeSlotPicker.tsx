"use client";
import { useMemo } from "react";
import type { TimeSlotPickerProps } from "@/lib/types/reservation";

export default function TimeSlotPicker({ slots, selected = null, onSelect, className = "" }: TimeSlotPickerProps) {
  const list = useMemo(() => slots, [slots]);
  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 ${className}`}>
      <div className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium">Available Time Slots</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
        {list.map((s) => {
          const isSelected = selected === s.time;
          return (
            <button
              key={s.time}
              type="button"
              disabled={!s.available}
              onClick={() => s.available && onSelect(s.time)}
              aria-pressed={isSelected ? "true" : undefined}
              className={`h-9 sm:h-10 rounded-md border px-2 text-xs sm:text-sm flex items-center justify-between ${
                isSelected ? "bg-white text-black border-white" : "border-white/10 hover:bg-white/10"
              } ${s.available ? "" : "opacity-40 cursor-not-allowed"}`}
            >
              <span>{s.time}</span>
              {typeof s.capacity === "number" && (
                <span className="text-xs text-zinc-400">{s.capacity}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
