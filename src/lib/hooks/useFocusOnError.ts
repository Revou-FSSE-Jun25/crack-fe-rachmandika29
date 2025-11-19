"use client";
import { useCallback } from "react";
import type { RefObject } from "react";

type RefsMap<T extends Record<string, any>> = { [K in keyof T]?: RefObject<HTMLElement> };

export function useFocusOnError<T extends Record<string, any>>(refs: RefsMap<T>) {
  const focusFirstInvalid = useCallback((errors: { [K in keyof T]?: string }) => {
    const entries = Object.entries(errors) as Array<[keyof T, string | undefined]>;
    const first = entries.find(([, message]) => Boolean(message));
    if (!first) return;
    const [key] = first;
    const ref = refs[key];
    if (ref?.current) {
      (ref.current as HTMLElement).focus();
    }
  }, [refs]);

  return { focusFirstInvalid };
}