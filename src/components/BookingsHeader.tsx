"use client";
import type { BookingsHeaderProps } from "@/lib/types/bookings";

export default function BookingsHeader({ title = "Bookings", description = "Your upcoming reservations", className = "", action }: BookingsHeaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        {action && <div className="flex-shrink-0 w-full sm:w-auto">{action}</div>}
      </div>
    </div>
  );
}

