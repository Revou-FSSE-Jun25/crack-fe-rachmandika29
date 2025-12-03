"use client";
import SubmissionFeedback from "@/components/SubmissionFeedback";
import type { AdminFeedbackProps } from "@/lib/types/ui";

export default function AdminFeedback({ open, kind, message, onClose, className = "" }: AdminFeedbackProps) {
  return (
    <SubmissionFeedback open={open} kind={kind} message={message} onClose={onClose} className={className} />
  );
}

