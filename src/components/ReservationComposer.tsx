"use client";
import { useMemo, useState } from "react";
import DatePickerCalendar from "@/components/DatePickerCalendar";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import PartySizeSelector from "@/components/PartySizeSelector";
import ReservationForm from "@/components/ReservationForm";
import ReservationSummaryCard from "@/components/ReservationSummaryCard";
import SubmissionFeedback from "@/components/SubmissionFeedback";
import StepIndicator from "@/components/StepIndicator";
import StepSection from "@/components/StepSection";

type Slot = { time: string; available: boolean; capacity?: number };

export default function ReservationComposer() {
  const [dateIso, setDateIso] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(2);
  const [pending, setPending] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ open: boolean; kind: "success" | "error" | "info"; message: string }>({ open: false, kind: "info", message: "" });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formValues, setFormValues] = useState<{ name: string; email: string; phone: string; notes?: string } | null>(null);

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

  const canNextFromStep = (step: number) => {
    if (step === 1) return Boolean(dateIso);
    if (step === 2) return Boolean(time);
    if (step === 3) return guests > 0;
    return true;
  };

  const next = () => {
    if (canNextFromStep(currentStep)) setCurrentStep((s) => Math.min(5, s + 1));
  };

  const back = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  return (
    <div className="space-y-4">
      <SubmissionFeedback open={feedback.open} kind={feedback.kind} message={feedback.message} onClose={() => setFeedback({ ...feedback, open: false })} />
      <StepIndicator steps={[{ label: "Choose Date" }, { label: "Choose Time" }, { label: "Party Size" }, { label: "Details" }, { label: "Review" }]} current={currentStep} />
      {currentStep === 1 && (
        <StepSection title="Choose Date" description="Select your reservation date." footer={
          <div className="w-full flex items-center justify-between">
            <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" disabled>
              Back
            </button>
            <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60" onClick={next} disabled={!canNextFromStep(1)}>
              Next
            </button>
          </div>
        }>
          <DatePickerCalendar availableDates={availableDates} selected={dateIso} onSelect={resetTimeOnDateChange} />
        </StepSection>
      )}
      {currentStep === 2 && (
        <StepSection title="Choose Time" description="Select an available time slot." footer={
          <div className="w-full flex items-center justify-between">
            <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg.white/10" onClick={back}>
              Back
            </button>
            <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60" onClick={next} disabled={!canNextFromStep(2)}>
              Next
            </button>
          </div>
        }>
          <TimeSlotPicker slots={slots} selected={time} onSelect={setTime} />
        </StepSection>
      )}
      {currentStep === 3 && (
        <StepSection title="Party Size" description="Choose the number of guests." footer={
          <div className="w-full flex items-center justify-between">
            <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={back}>
              Back
            </button>
            <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60" onClick={next} disabled={!canNextFromStep(3)}>
              Next
            </button>
          </div>
        }>
          <PartySizeSelector value={guests} onChange={setGuests} />
        </StepSection>
      )}
      {currentStep === 4 && (
        <StepSection title="Details" description="Enter your contact information." footer={
          <div className="w-full flex items-center justify-between">
            <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={back}>
              Back
            </button>
          </div>
        }>
          <ReservationForm
            onSubmit={(v) => {
              setFormValues(v);
              setCurrentStep(5);
            }}
            pending={pending}
          />
        </StepSection>
      )}
      {currentStep === 5 && (
        <StepSection title="Review" description="Review your reservation and submit." footer={
          <div className="w-full flex items-center justify-between">
            <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={back}>
              Back
            </button>
          </div>
        }>
          <ReservationSummaryCard
            dateIso={dateIso}
            time={time}
            guests={guests}
            onSubmit={() => handleSubmit(formValues || { name: "", email: "", phone: "" })}
            disabled={pending}
          />
        </StepSection>
      )}
    </div>
  );
}
