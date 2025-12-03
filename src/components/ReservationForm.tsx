"use client";
import { useState } from "react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, notes });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 sm:space-y-4 rounded-md border border-white/10 bg-zinc-900/50 p-3 sm:p-4 ${className}`}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-md bg-black border border-white/20 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="+62 812XXXXXXX"
        />
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
