"use client";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "user" | "admin";

export function useRedirectAfterAuth(role: Role) {
  const router = useRouter();
  const search = useSearchParams();

  const redirect = useCallback(() => {
    const cb = search.get("callbackUrl");
    if (cb) {
      router.replace(cb);
      return;
    }
    router.replace(role === "admin" ? "/admin" : "/dashboard");
  }, [router, search, role]);

  return { redirect };
}