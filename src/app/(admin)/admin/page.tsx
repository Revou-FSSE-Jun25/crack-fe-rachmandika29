import MenuGrid from "@/components/MenuGrid";
import DashboardCard from "@/components/DashboardCard";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-4xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-zinc-400">Manage schedule, seating, menu availability, and reschedule requests</p>
        </div>
        <MenuGrid>
          <DashboardCard
            title="Schedule & Seating"
            description="Manage seating capacity and time slots"
            href="/admin/manage-availibility"
          />
          <DashboardCard
            title="Menu Availability"
            description="Set today and weekly menu availability"
            href="/admin/menu-availability"
          />
          <DashboardCard
            title="Reschedule Requests"
            description="Review and confirm client reschedules"
            href="/admin/reschedules"
          />
        </MenuGrid>
      </main>
    </div>
  );
}
