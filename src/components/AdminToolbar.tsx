"use client";
import type { AdminToolbarProps } from "@/lib/types/ui";

export default function AdminToolbar({ startDate, endDate, onStartDateChange, onEndDateChange, onRefresh, className = "" }: AdminToolbarProps) {
  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
        <div className="flex items-center justify-start sm:justify-end">
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
