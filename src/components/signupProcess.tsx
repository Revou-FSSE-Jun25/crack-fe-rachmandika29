"use client";
import { useRef, useCallback } from "react";
import { signUpSchema } from "@/lib/validation/authSchemas";
import { useZodFormValidation } from "@/lib/hooks/useZodFormValidation";
import { useAuthRequest } from "@/lib/hooks/useAuthRequest";
import { useRedirectAfterAuth } from "@/lib/hooks/useRedirectAfterAuth";
import { useFocusOnError } from "@/lib/hooks/useFocusOnError";

export default function SignUp() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const { values, setValue, errors, setErrors } = useZodFormValidation(signUpSchema, {
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = useCallback(() => {
    const result = signUpSchema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Record<string, string | undefined> = {};
    for (const issue of result.error.issues) {
      const k = (issue.path[0] as string) || "";
      if (!next[k]) next[k] = issue.message;
    }
    setErrors(next);
    return false;
  }, [values, setErrors]);

  const { submit, pending, serverError, clearError } = useAuthRequest("/api/auth/signup");
  const { focusFirstInvalid } = useFocusOnError({ email: emailRef, password: passwordRef, confirmPassword: confirmRef });
  const { redirect } = useRedirectAfterAuth("user");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    const ok = validate();
    if (!ok) {
      focusFirstInvalid(errors);
      return;
    }
    const res = await submit({ email: values.email, password: values.password });
    if (res.ok) {
      redirect();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-zinc-900/50 p-6 rounded-md border border-white/10">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Create your account</h2>
        <p className="mt-2 text-sm text-zinc-400">Join to manage reservations and dining experiences.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            ref={emailRef}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setValue("email", e.target.value)}
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="mt-1 w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            id="password"
            ref={passwordRef}
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => setValue("password", e.target.value)}
            aria-invalid={Boolean(errors.password) || undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="mt-1 w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="••••••••"
          />
          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-red-400">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
          <input
            id="confirmPassword"
            ref={confirmRef}
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(e) => setValue("confirmPassword", e.target.value)}
            aria-invalid={Boolean(errors.confirmPassword) || undefined}
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
            className="mt-1 w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p id="confirm-error" className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {serverError && (
        <div className="text-sm text-red-400">{serverError}</div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center rounded-md bg-white text-black px-5 py-2 font-medium hover:bg-zinc-200 transition-colors disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
