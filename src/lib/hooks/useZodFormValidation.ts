import { useMemo, useState } from "react";
import type { ZodSchema } from "zod";

type Errors = Record<string, string | undefined>;

export function useZodFormValidation<T extends Record<string, any>>(schema: ZodSchema<T>, initial: Partial<T> = {}) {
  const [values, setValues] = useState<T>({ ...(initial as T) });
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);

  const isValid = useMemo(() => schema.safeParse(values).success, [schema, values]);

  const setValue = <K extends keyof T>(key: K, val: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const validateField = (key: keyof T) => {
    const r = schema.safeParse(values);
    const issue = r.success ? undefined : r.error.issues.find((i) => i.path[0] === key);
    setErrors((prev) => ({ ...prev, [key as string]: issue ? issue.message : undefined }));
  };

  const submit = (onValid: (v: T) => void) => {
    const r = schema.safeParse(values);
    if (!r.success) {
      setAttempted(true);
      const next: Errors = {};
      let firstKey: string | undefined;
      for (const issue of r.error.issues) {
        const k = (issue.path[0] as string) || "";
        if (!next[k]) next[k] = issue.message;
        if (!firstKey) firstKey = k;
      }
      setErrors(next);
      return { ok: false, firstErrorKey: firstKey };
    }
    setErrors({});
    onValid(values);
    return { ok: true };
  };

  return { values, setValue, errors, setErrors, attempted, setAttempted, isValid, validateField, submit };
}

