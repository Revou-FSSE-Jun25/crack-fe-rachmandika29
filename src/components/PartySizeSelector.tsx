"use client";

type Props = {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export default function PartySizeSelector({ value, onChange, min = 1, max = 20, className = "" }: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm font-medium">Party Size</div>
          <div className="text-xs text-zinc-400">Min {min}, Max {max}</div>
        </div>
        <div className="inline-flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="rounded-md border border-white/20 px-2 py-1 text-sm hover:bg-white/10 disabled:opacity-50"
            onClick={dec}
            disabled={value <= min}
          >
            -
          </button>
          <span className="text-sm">{value}</span>
          <button
            type="button"
            className="rounded-md border border-white/20 px-2 py-1 text-sm hover:bg-white/10 disabled:opacity-50"
            onClick={inc}
            disabled={value >= max}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

