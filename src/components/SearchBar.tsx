"use client";
import { useMemo } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  categories?: string[];
  selectedCategory?: string | null;
  onSelectCategory?: (c: string | null) => void;
};

export default function SearchBar({ value, onChange, onClear, categories = [], selectedCategory = null, onSelectCategory }: Props) {
  const hasQuery = value.length > 0;
  const chips = useMemo(() => categories, [categories]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search menu..."
          className="w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button
          type="button"
          disabled={!hasQuery}
          onClick={onClear}
          className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectCategory && onSelectCategory(null)}
            className={`rounded-full px-3 py-1 text-sm border ${selectedCategory === null ? "bg-white text-black" : "border-white/20 hover:bg-white/10"}`}
          >
            All
          </button>
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(c)}
              className={`rounded-full px-3 py-1 text-sm border ${selectedCategory === c ? "bg-white text-black" : "border-white/20 hover:bg-white/10"}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
