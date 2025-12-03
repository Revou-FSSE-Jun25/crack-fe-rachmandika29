"use client";
import { useMemo } from "react";

type Slot = {
  time: string;
  available: boolean;
  capacity?: number;
};

type Props = {
  slots: Slot[];
  selected?: string | null;
  onSelect: (time: string) => void;
  className?: string;
};

export default function TimeSlotPicker({ slots, selected = null, onSelect, className = "" }: Props) {
  const list = useMemo(() => slots, [slots]);
  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 ${className}`}>
      <div className="px-4 py-3 text-sm font-medium">Available Time Slots</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-4 pb-4">
        {list.map((s) => {
          const isSelected = selected === s.time;
          return (
            <button
              key={s.time}
              type="button"
              disabled={!s.available}
              onClick={() => s.available && onSelect(s.time)}
              aria-pressed={isSelected ? "true" : undefined}
              className={`h-10 rounded-md border px-2 text-sm flex items-center justify-between ${
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

