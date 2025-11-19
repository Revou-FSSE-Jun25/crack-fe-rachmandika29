"use client";
import { useCallback, useState } from "react";

type SubmitResult = { ok: boolean; status?: number };

export function useAuthRequest(endpoint: string) {
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const clearError = useCallback(() => setServerError(null), []);

  const submit = useCallback(async (payload: unknown): Promise<SubmitResult> => {
    setPending(true);
    setServerError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }
      if (!res.ok || (json && json.ok === false)) {
        setServerError(json?.error || "Request failed");
        return { ok: false, status: res.status };
      }
      return { ok: true, status: res.status };
    } catch (err) {
      setServerError("Network error");
      return { ok: false };
    } finally {
      setPending(false);
    }
  }, [endpoint]);

  return { submit, pending, serverError, clearError };
}