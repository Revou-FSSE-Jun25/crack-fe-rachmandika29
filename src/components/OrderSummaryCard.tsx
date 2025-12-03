"use client";
import type { OrderSummaryProps } from "@/lib/types/menu";

export default function OrderSummaryCard({ items, quantities, onIncrement, onDecrement, className = "" }: OrderSummaryProps) {
  const selected = items.filter((i) => (quantities[i.slug] ?? 0) > 0);
  const subtotal = selected.reduce((sum, i) => sum + i.price * (quantities[i.slug] ?? 0), 0);

  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
      <div className="text-sm font-medium mb-2">Order Summary</div>
      {selected.length === 0 && (
        <div className="text-sm text-zinc-400">Your cart is empty</div>
      )}
      {selected.length > 0 && (
        <div className="space-y-3">
          {selected.map((i) => {
            const qty = quantities[i.slug] ?? 0;
            return (
              <div key={i.slug} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm">{i.name}</div>
                  <div className="text-xs text-zinc-400">Rp {i.price.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded-md border border-white/20 px-2 py-1 text-sm hover:bg-white/10" onClick={() => onDecrement(i.slug)}>-</button>
                  <div className="min-w-[2rem] text-center text-sm">{qty}</div>
                  <button type="button" className="rounded-md border border-white/20 px-2 py-1 text-sm hover:bg-white/10" onClick={() => onIncrement(i.slug)}>+</button>
                </div>
              </div>
            );
          })}
          <div className="h-px bg-white/10" />
          <div className="flex items-center justify-between">
            <div className="text-sm">Subtotal</div>
            <div className="text-sm">Rp {subtotal.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

