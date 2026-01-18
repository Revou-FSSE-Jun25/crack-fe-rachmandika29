"use client";
import RescheduleRequestCard from "@/components/RescheduleRequestCard";
import type { RescheduleRequestsListProps } from "@/lib/types/bookings";
import Spinner from "@/components/Spinner";

export default function RescheduleRequestsList({ requests, loading = false, error = null, onAccept, onReject, onView, className = "", empty }: RescheduleRequestsListProps) {
  if (loading) {
    return (
      <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Spinner size="sm" className="border-white/30" />
          <span>Loading requests…</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
        <div className="text-sm text-red-400">{error}</div>
      </div>
    );
  }
  if (!requests || requests.length === 0) {
    return empty ? <>{empty}</> : (
      <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
        <div className="text-sm text-zinc-400">No reschedule requests</div>
      </div>
    );
  }
  return (
    <div className={`space-y-3 ${className}`}>
      {requests.map((r) => (
        <RescheduleRequestCard key={r.id} request={r} onAccept={onAccept} onReject={onReject} onView={onView} />
      ))}
    </div>
  );
}

