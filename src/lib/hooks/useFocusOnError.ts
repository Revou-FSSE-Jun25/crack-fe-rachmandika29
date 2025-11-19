"use client";
import { useCallback } from "react";
import type { RefObject } from "react";

type FocusableRef =
  | RefObject<HTMLElement | null>
  | RefObject<HTMLInputElement | null>
  | RefObject<HTMLTextAreaElement | null>
  | RefObject<HTMLSelectElement | null>;

type RefsMap<T extends Record<string, any>> = { [K in keyof T]?: FocusableRef };

export function useFocusOnError<T extends Record<string, any>>(refs: RefsMap<T>) {
  const focusFirstInvalid = useCallback((errors: { [K in keyof T]?: string }) => {
    const entries = Object.entries(errors) as Array<[keyof T, string | undefined]>;
    const first = entries.find(([, message]) => Boolean(message));
    if (!first) return;
    const [key] = first;
    const ref = refs[key];
    const el = (ref as any)?.current as HTMLElement | null;
    el?.focus();
  }, [refs]);

  return { focusFirstInvalid };
}