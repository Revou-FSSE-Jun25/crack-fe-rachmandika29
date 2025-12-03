import ReservationComposer from "@/components/ReservationComposer";

export default function Home() {
  return (
    <div className="montserrat flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Reservation</h1>
          <p className="text-sm text-zinc-400">Choose date, time, and party size to reserve.</p>
        </div>
        <ReservationComposer />
      </main>
    </div>
  );
}
