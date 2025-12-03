"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DatePickerCalendar from "@/components/DatePickerCalendar";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import PartySizeSelector from "@/components/PartySizeSelector";
import ReservationForm from "@/components/ReservationForm";
import ReservationSummaryCard from "@/components/ReservationSummaryCard";
import SubmissionFeedback from "@/components/SubmissionFeedback";
import StepIndicator from "@/components/StepIndicator";
import StepSection from "@/components/StepSection";
import Modal from "@/components/Modal";
import { useWizardSteps } from "@/lib/hooks/useWizardSteps";
import { useAvailableDates } from "@/lib/hooks/useAvailableDates";
import { useTimeSlotsForDate } from "@/lib/hooks/useTimeSlotsForDate";
import type { Slot } from "@/lib/types/reservation";

export default function ReservationComposer() {
  const router = useRouter();
  const [dateIso, setDateIso] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(2);
  const [pending, setPending] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ open: boolean; kind: "success" | "error" | "info"; message: string }>({ open: false, kind: "info", message: "" });
  const { step: currentStep, setStep: setCurrentStep, canNext, next, back } = useWizardSteps({
    total: 5,
    guards: [
      () => Boolean(dateIso),
      () => Boolean(time),
      () => guests > 0,
    ],
  });
  const [formValues, setFormValues] = useState<{ name: string; email: string; phone: string; notes?: string } | null>(null);
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);

  const { data: availableDates } = useAvailableDates({ days: 21 });

  const { data: slots } = useTimeSlotsForDate(dateIso);

  const handleSubmit = async (values: { name: string; email: string; phone: string; notes?: string }) => {
    if (!dateIso || !time || guests <= 0) {
      setFeedback({ open: true, kind: "error", message: "Please complete date, time, and party size." });
      return;
    }
    setPending(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setOpenSuccessModal(true);
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
      <Modal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        title="Reservation Confirmed"
        footer={
          <>
            <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={() => setOpenSuccessModal(false)}>
              Close
            </button>
            <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium" onClick={() => router.push("/dashboard/menu")}> 
              Continue to Menu
            </button>
          </>
        }
      >
        <div className="space-y-1">
          <div>{dateIso}</div>
          <div>{time}</div>
          <div>{guests} guests</div>
        </div>
      </Modal>
      <StepIndicator steps={[{ label: "Choose Date" }, { label: "Choose Time" }, { label: "Party Size" }, { label: "Details" }, { label: "Review" }]} current={currentStep} className="flex-wrap sm:flex-nowrap overflow-x-auto" />
      {currentStep === 1 && (
        <StepSection title="Choose Date" description="Select your reservation date." footer={
          <div className="w-full flex items-center justify-between">
            <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" disabled>
              Back
            </button>
            <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60" onClick={next} disabled={!canNext}>
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
            <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={back}>
              Back
            </button>
            <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60" onClick={next} disabled={!canNext}>
              Next
            </button>
          </div>
        }>
          <TimeSlotPicker slots={slots as Slot[]} selected={time} onSelect={setTime} />
        </StepSection>
      )}
      {currentStep === 3 && (
        <StepSection title="Party Size" description="Choose the number of guests." footer={
          <div className="w-full flex items-center justify-between">
            <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10" onClick={back}>
              Back
            </button>
            <button type="button" className="rounded-md bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60" onClick={next} disabled={!canNext}>
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
