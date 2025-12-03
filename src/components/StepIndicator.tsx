"use client";
import type { Step, StepIndicatorProps } from "@/lib/types/ui";

export default function StepIndicator({ steps, current, className = "" }: StepIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap overflow-x-auto ${className}`} aria-label="progress">
      {steps.map((s, i) => {
        const idx = i + 1;
        const isActive = idx === current;
        const isCompleted = idx < current;
        const state = isCompleted ? "bg-white text-black border-white" : isActive ? "border-white text-white" : "border-white/20 text-zinc-400";
        return (
          <div key={s.label} className="flex items-center gap-3">
            <div className="flex items-center gap-2" aria-current={isActive ? "step" : undefined}>
              <div className={`h-6 w-6 rounded-full border text-xs font-medium inline-flex items-center justify-center ${state}`}>{idx}</div>
              <div className={`text-xs sm:text-sm ${isCompleted ? "text-white" : isActive ? "text-white" : "text-zinc-400"}`}>{s.label}</div>
            </div>
            {idx !== steps.length && <div className={`h-px w-6 sm:w-8 ${isCompleted ? "bg-white/60" : "bg-white/10"}`} />}
          </div>
        );
      })}
    </div>
  );
}

