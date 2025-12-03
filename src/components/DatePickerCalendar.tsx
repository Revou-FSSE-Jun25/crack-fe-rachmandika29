"use client";
import { useMemo, useState } from "react";

type Props = {
  availableDates?: string[];
  selected?: string | null;
  onSelect: (dateIso: string) => void;
  initialMonth?: Date;
  onMonthChange?: (monthStartIso: string) => void;
  className?: string;
};

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  return new Date(y, m + 1, 0).getDate();
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DatePickerCalendar({ availableDates = [], selected = null, onSelect, initialMonth, onMonthChange, className = "" }: Props) {
  const [month, setMonth] = useState<Date>(monthStart(initialMonth || new Date()));
  const availableSet = useMemo(() => new Set(availableDates), [availableDates]);

  const firstDay = month.getDay();
  const count = daysInMonth(month);
  const monthLabel = `${month.toLocaleString(undefined, { month: "long" })} ${month.getFullYear()}`;

  const leading = Array(firstDay).fill(null);
  const days = Array.from({ length: count }, (_, i) => i + 1);

  const handlePrev = () => {
    const next = new Date(month);
    next.setMonth(next.getMonth() - 1);
    const start = monthStart(next);
    setMonth(start);
    onMonthChange && onMonthChange(toIso(start));
  };

  const handleNext = () => {
    const next = new Date(month);
    next.setMonth(next.getMonth() + 1);
    const start = monthStart(next);
    setMonth(start);
    onMonthChange && onMonthChange(toIso(start));
  };

  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
        <button type="button" className="rounded-md border border-white/20 px-2 py-1 text-sm hover:bg-white/10" onClick={handlePrev}>
          Prev
        </button>
        <div className="text-sm font-medium">{monthLabel}</div>
        <button type="button" className="rounded-md border border-white/20 px-2 py-1 text-sm hover:bg-white/10" onClick={handleNext}>
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 text-[11px] sm:text-xs text-zinc-400 px-3 sm:px-4">
        {weekdays.map((w) => (
          <div key={w} className="py-2">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 px-3 sm:px-4 pb-3 sm:pb-4">
        {leading.map((_, i) => (
          <div key={`l-${i}`} className="h-10" />
        ))}
        {days.map((d) => {
          const date = new Date(month.getFullYear(), month.getMonth(), d);
          const iso = toIso(date);
          const isSelected = selected === iso;
          const isAvailable = availableSet.size === 0 ? true : availableSet.has(iso);
          return (
            <button
              key={iso}
              type="button"
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelect(iso)}
              aria-pressed={isSelected ? "true" : undefined}
              className={`h-9 sm:h-10 rounded-md border px-0.5 text-xs sm:text-sm ${
                isSelected ? "bg-white text-black border-white" : "border-white/10 hover:bg-white/10"
              } ${isAvailable ? "" : "opacity-40 cursor-not-allowed"}`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

