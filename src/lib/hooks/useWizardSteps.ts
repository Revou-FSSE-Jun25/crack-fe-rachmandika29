import { useMemo, useState } from "react";

type Guard = () => boolean;

export function useWizardSteps(opts: { total: number; initial?: number; guards?: Guard[] }) {
  const total = opts.total;
  const initial = opts.initial ?? 1;
  const guards = opts.guards ?? [];
  const [step, setStep] = useState<number>(initial);

  const canNext = useMemo(() => {
    const idx = step - 1;
    const guard = guards[idx];
    return typeof guard === "function" ? Boolean(guard()) : true;
  }, [guards, step]);

  const next = () => {
    if (canNext) setStep((s) => Math.min(total, s + 1));
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  return { step, setStep, canNext, next, back, total };
}

