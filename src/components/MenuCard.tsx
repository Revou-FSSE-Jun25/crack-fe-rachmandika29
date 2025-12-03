"use client";
import Link from "next/link";
import type { MenuCardProps } from "@/lib/types/menu";

export default function MenuCard({ item, quantity, onAdd, onIncrement, onDecrement }: MenuCardProps) {
  return (
    <div className="h-full flex flex-col rounded-md border border-white/10 bg-zinc-900/50 overflow-hidden">
      <Link href={`/dashboard/menu/${item.slug}`} className="block flex-1">
        <div className="aspect-video bg-black/50" />
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold line-clamp-1">{item.name}</h3>
            <span className="text-sm text-zinc-400">${item.price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-zinc-400 line-clamp-2">{item.description}</p>
        </div>
      </Link>
      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        {quantity === 0 ? (
          <button
            type="button"
            className="rounded-md bg-white text-black px-3 py-1 text-sm font-medium hover:bg-zinc-200"
            onClick={onAdd}
          >
            Add
          </button>
        ) : (
          <div className="inline-flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-white/20 px-2 py-1 text-sm hover:bg-white/10"
              onClick={onDecrement}
            >
              -
            </button>
            <span className="text-sm">{quantity}</span>
            <button
              type="button"
              className="rounded-md border border-white/20 px-2 py-1 text-sm hover:bg-white/10"
              onClick={onIncrement}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
