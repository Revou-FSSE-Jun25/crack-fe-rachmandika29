"use client";
import { useRef, useState } from "react";
import { z } from "zod";

type Values = {
  name: string;
  email: string;
  phone: string;
  notes?: string;
};

type Props = {
  initial?: Partial<Values>;
  onSubmit: (values: Values) => void;
  pending?: boolean;
  className?: string;
};

export default function ReservationForm({ initial, onSubmit, pending = false, className = "" }: Props) {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [attempted, setAttempted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    notes: z.string().optional(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ name, email, phone, notes });
    if (!result.success) {
      setAttempted(true);
      const nextErrors: { name?: string; email?: string; phone?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof typeof nextErrors;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      if (nextErrors.name && nameRef.current) nameRef.current.focus();
      else if (nextErrors.email && emailRef.current) emailRef.current.focus();
      else if (nextErrors.phone && phoneRef.current) phoneRef.current.focus();
      return;
    }
    setErrors({});
    onSubmit({ name, email, phone, notes });
  };

  const validateField = (field: "name" | "email" | "phone", value: string) => {
    const single = schema.pick({ [field]: true });
    const r = single.safeParse({ [field]: value });
    setErrors((prev) => ({ ...prev, [field]: r.success ? undefined : r.error.issues[0]?.message || "Invalid" }));
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 sm:space-y-4 rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
      {attempted && (errors.name || errors.email || errors.phone) && (
        <div className="rounded-md border border-red-400 bg-red-600/20 text-red-200 px-3 py-2 text-sm" role="alert">Please fix the highlighted fields.</div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => validateField("name", name)}
          ref={nameRef}
          className={`mt-1 w-full rounded-md bg-black border px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30 ${errors.name ? "border-red-400" : "border-white/20"}`}
          aria-invalid={errors.name ? "true" : undefined}
          placeholder="Your name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateField("email", email)}
          ref={emailRef}
          className={`mt-1 w-full rounded-md bg-black border px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30 ${errors.email ? "border-red-400" : "border-white/20"}`}
          aria-invalid={errors.email ? "true" : undefined}
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => validateField("phone", phone)}
          ref={phoneRef}
          className={`mt-1 w-full rounded-md bg-black border px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30 ${errors.phone ? "border-red-400" : "border-white/20"}`}
          aria-invalid={errors.phone ? "true" : undefined}
          placeholder="+62 812XXXXXXX"
        />
        {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Special requests"
          rows={3}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center rounded-md bg-white text-black px-5 py-2 font-medium hover:bg-zinc-200 transition-colors disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Continue"}
      </button>
    </form>
  );
}
