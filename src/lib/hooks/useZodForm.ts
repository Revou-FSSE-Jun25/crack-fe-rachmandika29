"use client";
import { useCallback, useMemo, useState } from "react";
import type { ZodSchema } from "zod";

type Errors<T> = { [K in keyof T]?: string };

export function useZodForm<T extends Record<string, any>>(schema: ZodSchema<T>, initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const validate = useCallback(() => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Errors<T> = {};
    result.error.issues.forEach((issue) => {
      const k = issue.path[0] as keyof T;
      if (k !== undefined && !fieldErrors[k]) {
        fieldErrors[k] = issue.message;
      }
    });
    setErrors(fieldErrors);
    return false;
  }, [schema, values]);

  const reset = useCallback((next?: Partial<T>) => {
    setValues((prev) => ({ ...initialValues, ...(next || {}) }));
    setErrors({});
  }, [initialValues]);

  const isValid = useMemo(() => Object.values(errors).every((e) => !e), [errors]);

  return { values, errors, setValue, validate, reset, isValid, setValues, setErrors };
}