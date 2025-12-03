"use client";
import { useMemo, useState } from "react";
import MenuGrid from "@/components/MenuGrid";
import DatePickerCalendar from "@/components/DatePickerCalendar";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import PartySizeSelector from "@/components/PartySizeSelector";
import ReservationForm from "@/components/ReservationForm";
import ReservationSummaryCard from "@/components/ReservationSummaryCard";
import SubmissionFeedback from "@/components/SubmissionFeedback";

type Slot = { time: string; available: boolean; capacity?: number };

export default function ReservationComposer() {
  const [dateIso, setDateIso] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(2);
  const [pending, setPending] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ open: boolean; kind: "success" | "error" | "info"; message: string }>({ open: false, kind: "info", message: "" });

  const availableDates: string[] = useMemo(() => {
    const today = new Date();
    const list: string[] = [];
    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      list.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    }
    return list;
  }, []);

  const slots: Slot[] = useMemo(() => {
    const base = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"]; 
    return base.map((t, i) => ({ time: t, available: i % 5 !== 0, capacity: 6 - (i % 3) }));
  }, [dateIso]);

  const handleSubmit = async (values: { name: string; email: string; phone: string; notes?: string }) => {
    if (!dateIso || !time || guests <= 0) {
      setFeedback({ open: true, kind: "error", message: "Please complete date, time, and party size." });
      return;
    }
    setPending(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setFeedback({ open: true, kind: "success", message: "Reservation submitted successfully." });
    } catch {
      setFeedback({ open: true, kind: "error", message: "Failed to submit reservation." });
    } finally {
      setPending(false);
    }
  };

  const resetTimeOnDateChange = (iso: string) => {
    setDateIso(iso);
    setTime(null);
  };

  return (
    <div className="space-y-4">
      <SubmissionFeedback open={feedback.open} kind={feedback.kind} message={feedback.message} onClose={() => setFeedback({ ...feedback, open: false })} />
      <MenuGrid>
        <DatePickerCalendar availableDates={availableDates} selected={dateIso} onSelect={resetTimeOnDateChange} />
        <TimeSlotPicker slots={slots} selected={time} onSelect={setTime} />
        <PartySizeSelector value={guests} onChange={setGuests} />
        <ReservationForm onSubmit={handleSubmit} pending={pending} />
        <ReservationSummaryCard dateIso={dateIso} time={time} guests={guests} onSubmit={() => handleSubmit({ name: "", email: "", phone: "" })} disabled={pending} />
      </MenuGrid>
    </div>
  );
}

