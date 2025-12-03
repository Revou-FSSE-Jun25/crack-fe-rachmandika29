"use client";
import { useMemo, useState } from "react";
import AdminFeedback from "@/components/AdminFeedback";
import ConfirmDialog from "@/components/ConfirmDialog";
import RescheduleRequestsList from "@/components/RescheduleRequestsList";
import RescheduleDecisionModal from "@/components/RescheduleDecisionModal";
import { useRescheduleRequests } from "@/lib/hooks/useRescheduleRequests";
import AdminToolbar from "@/components/AdminToolbar";

export default function Home() {
  const { requests, loading, error, refresh, accept, reject, pending } = useRescheduleRequests();
  const [feedback, setFeedback] = useState<{ open: boolean; kind: "success" | "error" | "info"; message: string }>({ open: false, kind: "info", message: "" });
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [decision, setDecision] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Manage Reschedule Requests</h1>
          <p className="text-sm text-zinc-400">Review and accept or reject client reschedules</p>
        </div>

        <AdminFeedback open={feedback.open} kind={feedback.kind} message={feedback.message} onClose={() => setFeedback({ ...feedback, open: false })} />
        <ConfirmDialog open={rejectDialog.open} title="Reject Request" description={`Reject request ${currentReject?.id || ""}?`} onConfirm={confirmRejectAction} onCancel={() => setRejectDialog({ open: false, id: null })} />
        <RescheduleDecisionModal open={decision.open} request={currentDecision} onConfirm={onConfirmDecision} onCancel={() => setDecision({ open: false, id: null })} />

        <AdminToolbar startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} onRefresh={refresh} />

        <RescheduleRequestsList requests={filtered} loading={loading} error={error} onAccept={onAccept} onReject={onReject} className="" />
      </main>
    </div>
  );
}
