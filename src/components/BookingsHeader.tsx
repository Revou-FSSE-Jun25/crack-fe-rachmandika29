"use client";

type Props = {
  title?: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
};

export default function BookingsHeader({ title = "Bookings", description = "Your upcoming reservations", className = "", action }: Props) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

