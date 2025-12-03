"use client";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export default function Modal({ open, onClose, title, children, footer, className = "" }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full max-w-md rounded-md border border-white/10 bg-zinc-900/50 p-4 shadow-xl mx-3 sm:mx-0 ${className}`}
      >
        {title && <div className="text-sm font-medium mb-2">{title}</div>}
        <div className="text-sm">{children}</div>
        {footer && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row items-center justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

