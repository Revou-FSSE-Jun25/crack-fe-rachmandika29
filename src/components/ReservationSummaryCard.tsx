"use client";

type Props = {
  dateIso: string | null;
  time: string | null;
  guests: number;
  onSubmit: () => void;
  disabled?: boolean;
  className?: string;
};

export default function ReservationSummaryCard({ dateIso, time, guests, onSubmit, disabled = false, className = "" }: Props) {
  const ready = Boolean(dateIso && time && guests > 0) && !disabled;
  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
      <div className="space-y-2">
        <div className="text-sm font-medium">Reservation Summary</div>
        <div className="text-sm text-zinc-300">{dateIso || "Select a date"}</div>
        <div className="text-sm text-zinc-300">{time || "Select a time"}</div>
        <div className="text-sm text-zinc-300">{guests > 0 ? `${guests} guests` : "Select party size"}</div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          disabled={!ready}
          onClick={onSubmit}
          className="w-full inline-flex items-center justify-center rounded-md bg-white text-black px-5 py-2 font-medium hover:bg-zinc-200 transition-colors disabled:opacity-60"
        >
          Reserve
        </button>
      </div>
    </div>
  );
}

