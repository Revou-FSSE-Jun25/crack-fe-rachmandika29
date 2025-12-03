"use client";
import { useMemo, useState } from "react";
import AdminToolbar from "@/components/AdminToolbar";
import AdminScheduleEditor from "@/components/AdminScheduleEditor";
import AdminFeedback from "@/components/AdminFeedback";
import ConfirmDialog from "@/components/ConfirmDialog";
import DatePickerCalendar from "@/components/DatePickerCalendar";
import { useAvailableDates } from "@/lib/hooks/useAvailableDates";
import type { Slot } from "@/lib/types/reservation";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ open: boolean; kind: "success" | "error" | "info"; message: string }>({ open: false, kind: "info", message: "" });
  const [confirm, setConfirm] = useState<{ open: boolean; idx: number }>({ open: false, idx: -1 });
  const [map, setMap] = useState<Record<string, Slot[]>>({});

  const { data: availableDates, refresh } = useAvailableDates({ days: 21 });

  const filteredDates = useMemo(() => {
    return availableDates.filter((iso) => {
      const okStart = startDate ? iso >= startDate : true;
      const okEnd = endDate ? iso <= endDate : true;
      return okStart && okEnd;
    });
  }, [availableDates, startDate, endDate]);

  const slots = map[selectedDate || ""] || [];
  const visibleSlots = useMemo(() => {
    if (!search) return slots;
    const q = search.trim().toLowerCase();
    return slots.filter((s) => s.time.toLowerCase().includes(q));
  }, [slots, search]);

  const onCreateSlot = (slot: Slot) => {
    if (!selectedDate) return;
    setMap((prev) => ({ ...prev, [selectedDate]: [...(prev[selectedDate] || []), slot] }));
  };
  const onUpdateSlot = (index: number, patch: Partial<Slot>) => {
    if (!selectedDate) return;
    setMap((prev) => {
      const list = [...(prev[selectedDate] || [])];
      list[index] = { ...list[index], ...patch };
      return { ...prev, [selectedDate]: list };
    });
  };
  const onDeleteSlot = (index: number) => {
    setConfirm({ open: true, idx: index });
  };
  const confirmDelete = () => {
    if (!selectedDate) return;
    setMap((prev) => {
      const list = [...(prev[selectedDate] || [])];
      list.splice(confirm.idx, 1);
      return { ...prev, [selectedDate]: list };
    });
    setConfirm({ open: false, idx: -1 });
  };
  const cancelDelete = () => setConfirm({ open: false, idx: -1 });

  const onSave = async () => {
    setPending(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setFeedback({ open: true, kind: "success", message: "Availability saved" });
    } catch {
      setFeedback({ open: true, kind: "error", message: "Failed to save availability" });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Manage Availability</h1>
          <p className="text-sm text-zinc-400">Create and update time slots and seating for each date</p>
        </div>

        <AdminFeedback open={feedback.open} kind={feedback.kind} message={feedback.message} onClose={() => setFeedback({ ...feedback, open: false })} />
        <ConfirmDialog open={confirm.open} title="Delete Slot" description="Are you sure you want to delete this slot?" onConfirm={confirmDelete} onCancel={cancelDelete} />

        <AdminToolbar
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          search={search}
          onSearchChange={setSearch}
          onRefresh={refresh}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DatePickerCalendar availableDates={filteredDates} selected={selectedDate} onSelect={setSelectedDate} />
          <AdminScheduleEditor
            dateIso={selectedDate}
            slots={visibleSlots}
            onCreateSlot={onCreateSlot}
            onUpdateSlot={onUpdateSlot}
            onDeleteSlot={onDeleteSlot}
            onSave={onSave}
            pending={pending}
          />
        </div>
      </main>
    </div>
  );
}
