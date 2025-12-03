"use client";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { useEffect, useMemo, useState } from "react";
import type { BookingsFilterBarProps, BookingsFilterStatus } from "@/lib/types/bookings";

export default function BookingsFilterBar({ status, onStatusChange, search, onSearchChange, startDate, endDate, onStartDateChange, onEndDateChange, className = "" }: BookingsFilterBarProps) {
  const [localSearch, setLocalSearch] = useState<string>(search);
  const debounced = useDebouncedValue(localSearch, 200);

  useEffect(() => {
    onSearchChange(debounced);
  }, [debounced, onSearchChange]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const statuses = useMemo(() => ([
    { value: "all", label: "All" },
    { value: "upcoming", label: "Upcoming" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
  ] as const), []);

  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex w-full flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as BookingsFilterStatus)}
            className="w-full sm:flex-1 sm:min-w-0 rounded-md bg-black border border-white/20 px-2 py-1 text-white"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex w-full flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm">From</label>
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => onStartDateChange && onStartDateChange(e.target.value ? e.target.value : null)}
            className="w-full sm:flex-1 sm:min-w-0 rounded-md bg-black border border-white/20 px-2 py-1 text-white"
          />
        </div>
        <div className="flex w-full flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm">To</label>
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => onEndDateChange && onEndDateChange(e.target.value ? e.target.value : null)}
            className="w-full sm:flex-1 sm:min-w-0 rounded-md bg-black border border-white/20 px-2 py-1 text-white"
          />
        </div>
        <div className="flex w-full flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm">Search</label>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Find bookings"
            className="w-full sm:flex-1 sm:min-w-0 rounded-md bg-black border border-white/20 px-2 py-1 text-white"
          />
        </div>
      </div>
    </div>
  );
}
