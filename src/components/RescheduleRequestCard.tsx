"use client";
import type { RescheduleRequestCardProps } from "@/lib/types/bookings";

export default function RescheduleRequestCard({ request, onAccept, onReject, onView, className = "" }: RescheduleRequestCardProps) {
  const s = request;
  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Reschedule Request</div>
        <div className={`text-xs ${s.status === "pending" ? "text-yellow-300" : s.status === "accepted" ? "text-green-300" : "text-red-300"}`}>{s.status}</div>
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-zinc-400">Current</div>
          <div>{s.currentDateIso} • {s.currentTime}</div>
        </div>
        <div>
          <div className="text-zinc-400">Requested</div>
          <div>{s.requestedDateIso} • {s.requestedTime}</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-zinc-400">Guests: {s.guests}</div>
      {s.reason && <div className="mt-2 text-xs text-zinc-300">"{s.reason}"</div>}
      <div className="mt-3 flex items-center justify-end gap-2">
        {onView && <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={() => onView(s)}>View</button>}
        <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={() => onReject(s)}>Reject</button>
        <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium" onClick={() => onAccept(s)}>Accept</button>
      </div>
    </div>
  );
}

