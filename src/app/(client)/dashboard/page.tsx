import MenuGrid from "@/components/MenuGrid";
import DashboardCard from "@/components/DashboardCard";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-zinc-400">Quick access to core sections</p>
          <p className="text-xs text-zinc-500">Reservation → Menu → Bookings</p>
        </div>
        <MenuGrid>
          <DashboardCard
            title="Reservation"
            description="Step 1: Choose date and details"
            href="/dashboard/reservation"
          />
          <DashboardCard
            title="Menu"
            description="Step 2: Select dishes (after reservation)"
            href="/dashboard/menu"
          />
          <DashboardCard
            title="Bookings"
            description="Step 3: Review confirmed bookings (after reservation + menu)"
            href="/dashboard/bookings"
          />
        </MenuGrid>
      </main>
    </div>
  );
}
