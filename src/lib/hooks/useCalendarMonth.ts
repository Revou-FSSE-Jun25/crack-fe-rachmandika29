import { useMemo, useState } from "react";

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

export function useCalendarMonth(opts: { initialMonth?: Date; onMonthChange?: (monthStartIso: string) => void } = {}) {
  const [month, setMonth] = useState<Date>(monthStart(opts.initialMonth || new Date()));
  const firstDay = month.getDay();
  const count = daysInMonth(month);
  const monthLabel = `${month.toLocaleString(undefined, { month: "long" })} ${month.getFullYear()}`;
  const leading = useMemo(() => Array(firstDay).fill(null), [firstDay]);
  const days = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count]);

  const prev = () => {
    const next = new Date(month);
    next.setMonth(next.getMonth() - 1);
    const start = monthStart(next);
    setMonth(start);
    opts.onMonthChange && opts.onMonthChange(toIso(start));
  };

  const next = () => {
    const nextDate = new Date(month);
    nextDate.setMonth(nextDate.getMonth() + 1);
    const start = monthStart(nextDate);
    setMonth(start);
    opts.onMonthChange && opts.onMonthChange(toIso(start));
  };

  return { month, setMonth, firstDay, count, monthLabel, leading, days, prev, next };
}

