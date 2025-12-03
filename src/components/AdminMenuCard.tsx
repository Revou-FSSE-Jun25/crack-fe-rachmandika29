"use client";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import type { MenuItem } from "@/lib/types/menu";

type Props = {
  item: MenuItem;
  available: boolean;
  onToggle: (v: boolean) => void;
  className?: string;
};

export default function AdminMenuCard({ item, available, onToggle, className = "" }: Props) {
  return (
    <div className={`h-full flex flex-col rounded-md border border-white/10 bg-zinc-900/50 overflow-hidden ${className}`}>
      <div className="aspect-video bg-black/50" />
      <div className="p-4 space-y-2 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold line-clamp-1">{item.name}</h3>
          <span className="text-sm text-zinc-400">Rp {item.price.toLocaleString()}</span>
        </div>
        <p className="text-sm text-zinc-400 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <AvailabilityBadge variant={available ? "available" : "full"} label={available ? "Available" : "Unavailable"} />
        </div>
      </div>
      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <div className="text-xs text-zinc-400">{item.category}</div>
        <div className="inline-flex items-center gap-2">
          <label className="text-sm">Status</label>
          <select
            value={available ? "yes" : "no"}
            onChange={(e) => onToggle(e.target.value === "yes")}
            className="rounded-md bg-black border border-white/20 px-2 py-1 text-white"
          >
            <option value="yes">Available</option>
            <option value="no">Unavailable</option>
          </select>
        </div>
      </div>
    </div>
  );
}

