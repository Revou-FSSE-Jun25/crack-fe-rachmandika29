"use client";

type Kind = "success" | "error" | "info";

type Props = {
  open: boolean;
  kind: Kind;
  message: string;
  onClose?: () => void;
  className?: string;
};

export default function SubmissionFeedback({ open, kind, message, onClose, className = "" }: Props) {
  if (!open) return null;
  const theme = kind === "success" ? "border-green-400 bg-green-600/20 text-green-200" : kind === "error" ? "border-red-400 bg-red-600/20 text-red-200" : "border-blue-400 bg-blue-600/20 text-blue-200";
  return (
    <div className={`rounded-md border px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between ${theme} ${className}`}>
      <div className="text-sm">{message}</div>
      {onClose && (
        <button type="button" onClick={onClose} className="text-sm rounded-md border border-white/20 px-2 py-1 hover:bg-white/10">
          Close
        </button>
      )}
    </div>
  );
}

