"use client";
import { useCallback, useState } from "react";
import type { KeyboardEvent } from "react";

export function useSearchField(initial: string = "") {
  const [value, setValue] = useState<string>(initial);
  const hasQuery = value.length > 0;
  const clear = useCallback(() => setValue(""), []);
  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") clear();
  }, [clear]);
  return { value, setValue, hasQuery, clear, onKeyDown };
}
