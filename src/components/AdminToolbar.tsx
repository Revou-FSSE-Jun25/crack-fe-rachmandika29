"use client";
import type { AdminToolbarProps } from "@/lib/types/ui";
import { z } from "zod";
import { useZodFormValidation } from "@/lib/hooks/useZodFormValidation";

export default function AdminToolbar({ startDate, endDate, onStartDateChange, onEndDateChange, onRefresh, className = "" }: AdminToolbarProps) {
  const schema = z
    .object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .superRefine((val, ctx) => {
      const s = val.startDate || "";
      const e = val.endDate || "";
      if (s && e && s > e) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Start must be before end", path: ["startDate"] });
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "End must be after start", path: ["endDate"] });
      }
    });

  const { values, setValue, errors, attempted, submit } = useZodFormValidation(schema, {
    startDate: startDate || "",
    endDate: endDate || "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(() => {
      if (onRefresh) onRefresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className={`rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex w-full flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm">From</label>
          <input
            type="date"
            value={values.startDate || ""}
            onChange={(e) => {
              setValue("startDate", e.target.value);
              if (onStartDateChange) onStartDateChange(e.target.value ? e.target.value : null);
            }}
            className="w-full sm:flex-1 sm:min-w-0 rounded-md bg-black border border-white/20 px-2 py-1 text-white"
            aria-invalid={errors.startDate ? "true" : undefined}
          />
          {attempted && errors.startDate && <span className="text-xs text-red-400">{errors.startDate}</span>}
        </div>
        <div className="flex w-full flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm">To</label>
          <input
            type="date"
            value={values.endDate || ""}
            onChange={(e) => {
              setValue("endDate", e.target.value);
              if (onEndDateChange) onEndDateChange(e.target.value ? e.target.value : null);
            }}
            className="w-full sm:flex-1 sm:min-w-0 rounded-md bg-black border border-white/20 px-2 py-1 text-white"
            aria-invalid={errors.endDate ? "true" : undefined}
          />
          {attempted && errors.endDate && <span className="text-xs text-red-400">{errors.endDate}</span>}
        </div>
        <div className="flex items-center justify-start sm:justify-end">
          <button
            type="submit"
            className="rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Refresh
          </button>
        </div>
      </div>
    </form>
  );
}
