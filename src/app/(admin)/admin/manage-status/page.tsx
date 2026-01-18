"use client";
import { useMemo, useState } from "react";
import AdminFeedback from "@/components/AdminFeedback";
import ConfirmDialog from "@/components/ConfirmDialog";
import RescheduleRequestsList from "@/components/RescheduleRequestsList";
import RescheduleDecisionModal from "@/components/RescheduleDecisionModal";
import { useRescheduleRequests } from "@/lib/hooks/useRescheduleRequests";
import AdminToolbar from "@/components/AdminToolbar";
import { useAdminBookings } from "@/lib/hooks/useAdminBookings";

export default function Home() {
  const { requests, loading, error, refresh, accept, reject, pending } = useRescheduleRequests({ endpoint: "/api/reschedules" });
  const [feedback, setFeedback] = useState<{ open: boolean; kind: "success" | "error" | "info"; message: string }>({ open: false, kind: "info", message: "" });
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [decision, setDecision] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const { bookings, loading: bookingsLoading, error: bookingsError, refresh: refreshBookings } = useAdminBookings({
    endpoint: "/api/admin/bookings",
    from: startDate,
    to: endDate,
    status: "all",
  });

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const okStart = startDate ? r.requestedDateIso >= startDate : true;
      const okEnd = endDate ? r.requestedDateIso <= endDate : true;
      return okStart && okEnd && r.status === "pending";
    });
  }, [requests, startDate, endDate]);

  const currentDecision = useMemo(() => requests.find((r) => r.id === decision.id) || null, [requests, decision.id]);
  const currentReject = useMemo(() => requests.find((r) => r.id === rejectDialog.id) || null, [requests, rejectDialog.id]);

  const onAccept = (r: any) => setDecision({ open: true, id: r.id });
  const onReject = (r: any) => setRejectDialog({ open: true, id: r.id });

  const confirmRejectAction = async () => {
    if (!rejectDialog.id) return;
    const res = await reject(rejectDialog.id, "Rejected by admin");
    setRejectDialog({ open: false, id: null });
    setFeedback({ open: true, kind: res.ok ? "success" : "error", message: res.ok ? "Request rejected" : "Failed to reject" });
  };

  const onConfirmDecision = async (dateIso: string, time: string, note?: string) => {
    if (!decision.id) return;
    const res = await accept(decision.id, dateIso, time, note);
    setDecision({ open: false, id: null });
    setFeedback({ open: true, kind: res.ok ? "success" : "error", message: res.ok ? "Request accepted" : "Failed to accept" });
  };

  const refreshAll = () => {
    refresh();
    refreshBookings();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Manage Schedule</h1>
          <p className="text-sm text-zinc-400">Monitor upcoming bookings and handle client reschedules</p>
        </div>

        <AdminFeedback open={feedback.open} kind={feedback.kind} message={feedback.message} onClose={() => setFeedback({ ...feedback, open: false })} />
        <ConfirmDialog open={rejectDialog.open} title="Reject Request" description={`Reject request ${currentReject?.id || ""}?`} onConfirm={confirmRejectAction} onCancel={() => setRejectDialog({ open: false, id: null })} />
        <RescheduleDecisionModal open={decision.open} request={currentDecision} onConfirm={onConfirmDecision} onCancel={() => setDecision({ open: false, id: null })} />

        <AdminToolbar startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} onRefresh={refreshAll} />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Upcoming bookings</h2>
          {bookingsLoading ? (
            <div className="rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 text-sm text-zinc-400">Loading bookings…</div>
          ) : bookingsError ? (
            <div className="rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 text-sm text-red-400">{bookingsError}</div>
          ) : bookings.length === 0 ? (
            <div className="rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 text-sm text-zinc-400">No bookings for the selected range</div>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {b.dateIso} at {b.time}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {b.guests} guests • {b.email || "Unknown client"}
                    </div>
                    {b.notes && <div className="text-xs text-zinc-500">{b.notes}</div>}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={
                        b.status === "upcoming"
                          ? "inline-flex items-center rounded-full border px-2 py-0.5 bg-blue-500/20 text-blue-300 border-blue-400/40"
                          : b.status === "confirmed"
                          ? "inline-flex items-center rounded-full border px-2 py-0.5 bg-green-500/20 text-green-300 border-green-400/40"
                          : b.status === "pending"
                          ? "inline-flex items-center rounded-full border px-2 py-0.5 bg-yellow-500/20 text-yellow-300 border-yellow-400/40"
                          : "inline-flex items-center rounded-full border px-2 py-0.5 bg-red-500/20 text-red-300 border-red-400/40"
                      }
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <RescheduleRequestsList requests={filtered} loading={loading} error={error} onAccept={onAccept} onReject={onReject} className="" />
      </main>
    </div>
  );
}
