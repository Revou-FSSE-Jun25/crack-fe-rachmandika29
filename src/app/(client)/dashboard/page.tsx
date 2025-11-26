import MenuGrid from "@/components/MenuGrid";
import DashboardCard from "@/components/DashboardCard";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-zinc-400">Quick access to core sections</p>
        </div>
        <MenuGrid>
          <DashboardCard
            title="Bookings"
            description="View and manage your upcoming reservations"
            href="/dashboard/bookings"
          />
          <DashboardCard
            title="Menu"
            description="Explore dishes and start your order"
            href="/dashboard/menu"
          />
          <DashboardCard
            title="Reservation"
            description="Reserve a table for your visit"
            href="/dashboard/reservation"
          />
        </MenuGrid>
      </main>
    </div>
  );
}
